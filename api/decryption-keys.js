import jwt from 'jsonwebtoken';
import { getDecryptionKeys } from './apps.js'; // Assuming apps.js exports this

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

function getTokenFromCookie(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  if (!tokenCookie) return null;
  return tokenCookie.split('=')[1];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // 1. Authenticate the user using JWT from cookie
  const token = getTokenFromCookie(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    jwt.verify(token, JWT_SECRET); // Verify token
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }

  // 2. Get keyIds from request body
  const { keyIds } = req.body;

  if (!keyIds || !Array.isArray(keyIds) || keyIds.length === 0) {
    res.status(400).json({ error: 'Bad Request: keyIds array is required and must not be empty' });
    return;
  }

  // 3. Retrieve decryption keys
  try {
    const decryptionKeysMap = getDecryptionKeys(keyIds);
    if (Object.keys(decryptionKeysMap).length === 0) {
      // This could mean keys expired or invalid keyIds were sent
      console.warn(`No valid decryption keys found for keyIds: ${keyIds.join(', ')}`);
      // Decide if this is an error or just an empty valid response
      // For now, let's return success but with an empty map if no keys were found/valid
    }
    res.status(200).json({ decryptionKeys: decryptionKeysMap });
  } catch (error) {
    console.error('Error retrieving decryption keys:', error);
    res.status(500).json({ error: 'Internal Server Error while fetching keys' });
  }
}
