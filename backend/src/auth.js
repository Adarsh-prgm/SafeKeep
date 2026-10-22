import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
export const hashPassword = password => bcrypt.hash(password, 12);
export const checkPassword = (password, hash) => bcrypt.compare(password, hash);
export const issueToken = user => jwt.sign({ sub: user.id, role: user.role }, config.JWT_ACCESS_SECRET, { expiresIn: config.ACCESS_TOKEN_TTL, issuer: 'safekeep' });
export function verifyToken(req,res,next) {
  const token = req.get('authorization')?.match(/^Bearer ([^\s]+)$/)?.[1];
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Sign in to continue.' } });
  try { const claims=jwt.verify(token,config.JWT_ACCESS_SECRET,{issuer:'safekeep'}); if(!claims.sub) throw new Error(); req.user={id:claims.sub,role:claims.role}; next(); }
  catch { return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Your session is invalid or has expired.' } }); }
}
