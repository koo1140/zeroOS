import jwt from 'jsonwebtoken';

const PASSWORD = process.env.ZEROOS_PASSWORD || 'yourStrongPassword';
const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { password } = req.body;
  if (password === PASSWORD) {
    const token = jwt.sign({ auth: true }, JWT_SECRET, { expiresIn: '1d' });
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`);
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
}
