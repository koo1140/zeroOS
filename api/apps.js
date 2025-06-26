import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';
const KEY_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export default async function handler(req, res) {
  const basePath = path.resolve('./public/apps');

  const apps = [
    { name: 'Notes', htmlPath: 'Notes/index.html' },
    { name: 'Calculator', htmlPath: 'Calculator/index.html' },
    { name: 'Calendar', htmlPath: 'Calendar/index.html' },
  ];

  // Map to store keyId -> key for JWT
  const keyMap = {};

  const result = apps.map((app) => {
    const absPath = path.join(basePath, app.htmlPath);

    let html;
    try {
      html = fs.readFileSync(absPath, 'utf-8');
    } catch {
      return { ...app, error: 'Failed to load HTML' };
    }

    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(html, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const keyId = iv.toString('hex');
    keyMap[keyId] = key.toString('hex');

    return {
      ...app,
      keyId,
      encryptedHtml: `${keyId}:${encrypted}`,
    };
  });

  // Issue JWT with keyMap, expires in 10 minutes
  const token = jwt.sign({ keyMap }, JWT_SECRET, { expiresIn: '10m' });
  res.setHeader('Set-Cookie', `zeroos_keys=${token}; HttpOnly; Path=/; Max-Age=600; SameSite=Strict`);

  res.status(200).json({ apps: result });
}