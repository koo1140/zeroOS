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

// In-memory cache for temporary decryption keys
// In a production environment, consider using a more robust cache like Redis
const tempKeyCache = new Map(); // Stores keyId -> { secretKey, timestamp }

// Exported function to retrieve decryption keys
export function getDecryptionKeys(keyIds) {
  const keys = {};
  const now = Date.now();
  for (const keyId of keyIds) {
    const cached = tempKeyCache.get(keyId);
    if (cached && (now - cached.timestamp <= KEY_EXPIRY_MS)) {
      keys[keyId] = cached.secretKey;
    } else if (cached) {
      // Key found but expired
      tempKeyCache.delete(keyId);
      console.log(`Attempted to fetch expired keyId: ${keyId}. Key was deleted.`);
    }
  }
  return keys;
}

// Server-side AES encryption function
function encryptAES(text, secretKey) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('hex') + ':' + encrypted; // Prepend IV for decryption
}

// Function to generate a secure secret key (e.g., 256-bit)
function generateSecretKey() {
  return crypto.randomBytes(32).toString('hex'); // 32 bytes = 256 bits
}

const baseAppConfig = [
  {
    name: 'Notes',
    icon: '/api/protected-icon?name=Notes',
    htmlPath: 'apps/Notes/index.html', // Path relative to project root
    defaultWidth: 600,
    defaultHeight: 450,
    minWidth: 500,
    minHeight: 400,
  },
  {
    name: 'Calculator',
    icon: '/api/protected-icon?name=Calculator',
    htmlPath: 'apps/Calculator/index.html',
    defaultWidth: 320, // Calculators are usually narrower
    defaultHeight: 480,
    minWidth: 280,
    minHeight: 400,
  },
  {
    name: 'Calendar',
    icon: '/api/protected-icon?name=Calendar',
    htmlPath: 'apps/Calendar/index.html',
    defaultWidth: 380,
    defaultHeight: 350,
    minWidth: 300,
    minHeight: 300,
  },
];

function getTokenFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

// Simple cleanup for expired keys (can be improved with a background job)
function cleanupExpiredKeys() {
  const now = Date.now();
  for (const [keyId, { timestamp }] of tempKeyCache.entries()) {
    if (now - timestamp > KEY_EXPIRY_MS) {
      tempKeyCache.delete(keyId);
      console.log(`Expired and deleted keyId: ${keyId}`);
    }
  }
}

// Periodically cleanup, e.g. every minute. For a stateless server, this won't work well.
// A proper cron job or cache with TTL is better.
setInterval(cleanupExpiredKeys, 60 * 1000);

export default async function handler(req, res) {
  // No JWT check here for fetching app list with encrypted content.
  // Auth will be checked when keys are requested via login.
  try {
    const processedAppRegistry = baseAppConfig.map(appConfig => {
      const keyId = crypto.randomBytes(16).toString('hex');
      const uniqueSecretKey = generateSecretKey(); // This is the key for AES
      let htmlContent;
      try {
        // Construct absolute path to HTML file
        // Resolve path relative to the current file's directory (__dirname)
        const filePath = path.resolve(__dirname, '..', appConfig.htmlPath);
        htmlContent = fs.readFileSync(filePath, 'utf-8');
      } catch (err) {
        console.error(`Failed to read HTML file for ${appConfig.name}: ${appConfig.htmlPath}`, err);
        // Return a placeholder or skip this app if HTML is missing
        return {
          ...appConfig,
          error: `Failed to load app content for ${appConfig.name}.`
        };
      }
      // Add AES-encrypted HTML to response (optional: encrypt htmlContent)
      const encryptedHtml = encryptAES(htmlContent, uniqueSecretKey);
      // Cache the key temporarily for decryption purposes
      tempKeyCache.set(keyId, { secretKey: uniqueSecretKey, timestamp: Date.now() });
      return {
        ...appConfig,
        keyId,
        encryptedHtml,
      };
    });
    res.status(200).json({ apps: processedAppRegistry });
  } catch (error) {
    console.error('Failed to process app registry:', error);
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
}