import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

const appRegistry = [
  {
    name: 'Notes',
    icon: '/apps/Notes/icon.png',
    defaultWidth: 600,
    defaultHeight: 450,
    minWidth: 500,
    minHeight: 400,
  },
  // ...add more apps here
];

function getTokenFromCookie(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  // Extract JWT from cookie
  const token = getTokenFromCookie(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    // Verify JWT
    jwt.verify(token, JWT_SECRET);
    res.status(200).json(appRegistry);
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
