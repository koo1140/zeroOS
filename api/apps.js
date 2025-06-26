import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

const appRegistry = [
  {
    name: 'Notes',
    icon: '/api/protected-icon?name=Notes',
    // Script path will now point to the ES module built by vite.lib.config.js
    // e.g., served from dist/app-libs/Notes/Notes.es.js
    script: '/api/protected-app?name=Notes&file=Notes.es.js',
    defaultWidth: 600,
    defaultHeight: 450,
    minWidth: 500,
    minHeight: 400,
  },
  {
    name: 'Calculator',
    icon: '/api/protected-icon?name=Calculator',
    script: '/api/protected-app?name=Calculator&file=Calculator.es.js',
    defaultWidth: 320, // Calculators are usually narrower
    defaultHeight: 480,
    minWidth: 280,
    minHeight: 400,
  },
  {
    name: 'Calendar',
    icon: '/api/protected-icon?name=Calendar',
    script: '/api/protected-app?name=Calendar&file=Calendar.es.js',
    defaultWidth: 380,
    defaultHeight: 350,
    minWidth: 300,
    minHeight: 300,
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
