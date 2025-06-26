import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from './db.js'; // Import users from db.js

const JWT_SECRET = process.env.ZEROOS_JWT_SECRET || 'change_this_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Expect `username` and `password` as separate fields in the JSON body
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const user = users[username];

  if (user) {
    const match = await bcrypt.compare(password, user.hashedPassword);
    if (match) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' }); // Token valid for 2 hours
      // Make it a session cookie by not setting Max-Age or Expires
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Lax`);
      res.status(200).json({ ok: true, username }); // Send username back
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
}
