import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

function getTokenFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  const token = getTokenFromCookie(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    jwt.verify(token, JWT_SECRET);
    const { name, file } = req.query;
    if (!name || !file) {
      res.status(400).json({ error: 'Missing app name or file' });
      return;
    }
    // Sanitize input
    const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, '');
    let safeFile = String(file).replace(/[^a-zA-Z0-9_.-]/g, '');

    // Sanitize input (already done)
    // const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, '');
    // let safeFile = String(file).replace(/[^a-zA-Z0-9_.-]/g, '');

    // Construct path to the built app library assets in 'dist/app-libs'
    // Expected structure: dist/app-libs/[AppName]/[AppName].es.js
    // Or for CSS: dist/app-libs/[AppName]/[AppName].css
    let appPath;

    // Check if requesting a CSS file for an app library
    // e.g. /api/protected-app?name=Calculator&file=Calculator.css
    if (safeFile.endsWith('.css')) {
      // The library build now produces 'style.css' in each app's folder.
      // We expect safeFile to be "style.css" and safeName to be the AppName.
      if (safeFile === `style.css`) {
        appPath = path.join(process.cwd(), 'dist', 'app-libs', safeName, 'style.css');
      } else {
        // If a generic assets file is requested (e.g. from main dist/assets)
        // This condition might need to be more specific if apps can request general assets too.
        if (safeName === 'assets') {
            appPath = path.join(process.cwd(), 'dist', 'assets', safeFile);
        } else {
            res.status(400).json({ error: 'Invalid CSS file request for app. Expected style.css with app name.' });
            return;
        }
      }
    }
    // Check if requesting a JS file for an app library
    // e.g. /api/protected-app?name=Calculator&file=Calculator.es.js
    else if (safeFile.endsWith('.es.js')) {
        // We expect safeFile to be like "Calculator.es.js"
        if (safeFile === `${safeName}.es.js`) {
            appPath = path.join(process.cwd(), 'dist', 'app-libs', safeName, safeFile);
        } else {
            res.status(400).json({ error: 'Invalid JS file request for app.' });
            return;
        }
    }
    // Handle generic asset requests (e.g. images from public, or main dist/assets)
    // This part might need more robust routing if assets are in many places.
    // For now, assume 'name' could be 'assets' for main build assets.
    else if (safeName === 'assets') {
        appPath = path.join(process.cwd(), 'dist', 'assets', safeFile);
    }
    // Fallback for other file types or if name is not 'assets' but not app lib files
    else {
        // This case might need to be refined or disallowed if not serving other types of files
        // For now, let's assume it might be trying to access something from the old /dist/apps path (which is now gone)
        // or some other unexpected file.
        // To be safe, let's restrict to known patterns or return 404.
        // For instance, if an app's JS tries to load its own assets relative to itself, this needs careful handling.
        // The library build places assets (like CSS) in the app's lib folder: dist/app-libs/AppName/AppName.css
        // If an app (e.g. Calculator.es.js) tries to import './image.png', where would that resolve?
        // Vite's library mode usually handles linked assets by copying them or inlining.
        // Let's assume for now that only .es.js and .css files for apps are served via this specific app logic.
        // Other assets should be handled by a static server for `public` or `dist/assets`.
        // For now, let's assume this endpoint is primarily for app JS and app CSS.
      res.status(400).json({ error: `Unsupported file type or structure for app: ${safeName}/${safeFile}` });
      return;
    }

    try {
      const content = await fs.readFile(appPath);
      // Set content type based on file extension
      if (safeFile.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (safeFile.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (safeFile.endsWith('.json')) { // Though not explicitly handled above for apps
        res.setHeader('Content-Type', 'application/json');
      } else {
        // For other assets like images, if ever served through here.
        // Mime type detection would be better.
        res.setHeader('Content-Type', 'application/octet-stream');
      }
      res.status(200).send(content);
    } catch (e) {
      // console.error("File not found or error reading:", appPath, e); // Optional server log
      res.status(404).json({ error: 'File not found for app resource.' });
    }
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
