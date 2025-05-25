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
    const { name } = req.query;
    if (!name) {
      res.status(400).json({ error: 'Missing icon name' });
      return;
    }
    // Ensure the path is correct and safe
    const safeName = String(name).replace(/[^a-zA-Z0-9_-]/g, '');
    const iconPath = path.join(process.cwd(), 'apps', safeName, 'icon.png');
    try {
      const icon = await fs.readFile(iconPath);
      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(icon);
    } catch (e) {
      res.status(404).json({ error: 'Icon not found', details: e.message });
    }
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
