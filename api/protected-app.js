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
    const safeFile = String(file).replace(/[^a-zA-Z0-9_.-]/g, '');
    const appPath = path.join(process.cwd(), 'apps', safeName, safeFile);
    try {
      const content = await fs.readFile(appPath);
      // Set content type based on file extension
      if (safeFile.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (safeFile.endsWith('.jsx')) {
        res.setHeader('Content-Type', 'application/javascript'); // JSX is still JS for browser
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
