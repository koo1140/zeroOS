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

    // If a .jsx file is requested, change it to .js as Vite compiles JSX to JS
    if (safeFile.endsWith('.jsx')) {
      safeFile = safeFile.replace('.jsx', '.js');
    }

    // Construct path to the built assets in the 'dist' directory
    // Apps are expected to be in dist/apps/[AppName]/[FileName]
    // CSS files are in dist/assets/[AppName]-[hash].css - this will need adjustment
    // For now, direct JS/CSS requests will assume simple naming.
    let appPath;
    if (safeFile.endsWith('.css')) {
      // This is a simplified assumption. Vite produces hashed CSS file names in dist/assets.
      // A more robust solution would involve a manifest file from Vite to map original names to hashed names.
      // For now, let's try to find a file that starts with App and ends with .css in the app's asset folder.
      // This is NOT a robust solution.
      // Example: dist/assets/App-D6bR3a_T.css for Calculator
      // We need to list files or use a manifest. For now, we'll assume a simplified name or defer proper CSS handling.
      // Let's assume the client will request the exact hashed filename for CSS if needed,
      // or the JS bundle will load it.
      // The current 'file' parameter might be 'App.css'. The actual file is e.g. 'App-D6bR3a_T.css'.
      // This part is tricky without a manifest file or a more predictable naming scheme for app-specific CSS.
      // For this step, we will primarily focus on JS.
      // A simplified approach for CSS: assume it's named App.css in the app's dist folder (if Vite puts it there)
      // Looking at the build output:
      // dist/assets/App-D6bR3a_T.css
      // dist/assets/App-DvAMSrX6.css
      // dist/assets/App-BiOncaBC.css
      // These are not directly in dist/apps/[AppName]/
      // This endpoint might not be the right way to serve these hashed CSS assets.
      // The HTML that loads the JS should ideally also load the correct hashed CSS.
      // Let's assume for now `file` will be the *exact* filename like `App-D6bR3a_T.css` and `name` would be `assets`.
      if (safeName === 'assets') { // A convention: if 'name' is 'assets', 'file' is the direct filename in dist/assets
        appPath = path.join(process.cwd(), 'dist', 'assets', safeFile);
      } else {
        // If specific app CSS is requested like 'apps/Notes/App.css', it's not directly available.
        // The JS bundle (e.g. dist/apps/Notes/App.js) will import its CSS.
        // For now, if a .css file is requested for an app, we'll return 404 as it's not directly there.
        res.status(404).json({ error: `CSS files are bundled. Request specific asset from /assets/ or ensure JS handles CSS import.` });
        return;
      }
    } else {
      appPath = path.join(process.cwd(), 'dist', 'apps', safeName, safeFile);
    }

    try {
      const content = await fs.readFile(appPath);
      // Set content type based on file extension
      if (safeFile.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (safeFile.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (safeFile.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      } else {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
      res.status(200).send(content);
    } catch {
      res.status(404).json({ error: 'File not found' });
    }
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
