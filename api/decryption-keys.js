import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { keyIds } = req.body || {};
  if (!Array.isArray(keyIds)) {
    res.status(400).json({ error: 'keyIds must be an array' });
    return;
  }

  // Read JWT from cookie (set by /api/apps)
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/zeroos_keys=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) {
    res.status(401).json({ error: 'Missing decryption key token' });
    return;
  }

  let keyMap;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    keyMap = decoded.keyMap || {};
    // Debug: log decoded JWT and requested keyIds
    console.log('[decryption-keys.js] Decoded JWT keyMap:', keyMap);
    console.log('[decryption-keys.js] Requested keyIds:', keyIds);
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired decryption key token' });
    return;
  }

  // Return only requested keys
  const decryptionKeys = {};
  for (const keyId of keyIds) {
    if (keyMap[keyId]) {
      decryptionKeys[keyId] = keyMap[keyId];
    }
  }

  res.status(200).json({ decryptionKeys });
}

const handleLoginSuccess = async (loginData) => {
  setShowLogin(false);
  try {
    // Always re-fetch apps after login to get a fresh JWT for decryption keys
    const appsRes = await fetch('/api/apps', { credentials: 'include' });
    const appsData = await appsRes.json();
    setApps(appsData.apps);

    const keyIdsToFetch = appsData.apps.map(app => app.keyId).filter(Boolean);
    if (keyIdsToFetch.length > 0) {
      const keysRes = await fetch('/api/decryption-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyIds: keyIdsToFetch }),
        credentials: 'include',
      });
      const keysData = await keysRes.json();
      setDecryptionKeysMap(keysData.decryptionKeys || {});
    } else {
      setDecryptionKeysMap({});
    }
    setShowDesktop(true);
  } catch (e) {
    setError('Failed to load application data. Please try again.');
  }
};
