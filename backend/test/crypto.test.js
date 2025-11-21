import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Crypto/JWT', () => {
  test('bcrypt hash & compare', async () => {
    const pwd = 'Test@123';
    const hash = await bcrypt.hash(pwd, 10);
    expect(hash).toMatch(/^\$2[aby]\$.{56}$/);
    const ok = await bcrypt.compare(pwd, hash);
    expect(ok).toBe(true);
  });

  test('JWT firma y decodifica con JWT_SECRET', () => {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const token = jwt.sign({ id: 'user-1' }, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe('user-1');
  });
});
