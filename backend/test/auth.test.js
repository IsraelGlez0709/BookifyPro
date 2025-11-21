// test/auth.e2e.test.js
import request from 'supertest';
import { app } from '../src/index.js';
import { db } from '../src/db.js';

const testEmail = 'e2e.user@example.com';
const testPass  = 'Secret123!';

describe('Auth (caja negra)', () => {
  afterAll(async () => {
    await db.query('DELETE FROM users WHERE email = ?', [testEmail]);
    await db.end();
  });

  test('POST /api/users/register → 200/201 y crea usuario', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        full_name: 'E2E User',
        email: testEmail,
        phone: '5551234567',
        password: testPass
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('message');

    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [testEmail]);
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveProperty('id');
  });

  test('POST /api/users/login → 200 y devuelve JWT', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testEmail, password: testPass });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    const header = JSON.parse(
      Buffer.from(res.body.token.split('.')[0], 'base64').toString()
    );
    expect(header.typ).toBe('JWT');
  });
});
