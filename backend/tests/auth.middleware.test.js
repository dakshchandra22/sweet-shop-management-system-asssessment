const request = require('supertest');
const { connectDB, disconnectDB, clearDatabase } = require('../src/config/database');
const app = require('../src/server');
const User = require('../src/models/User');

describe('Authentication Middleware', () => {
  let token;
  let user;

  beforeAll(async () => {
    await connectDB();
    await clearDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    // Create a test user and get token
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    token = registerResponse.body.token;
    user = registerResponse.body.user;
  });

  afterAll(async () => {
    await clearDatabase();
    await disconnectDB();
  });

  describe('Protected Routes', () => {
    test('should allow access with valid token', async () => {
      // This test assumes we have a protected route
      // We'll create a test protected route or use an existing one
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${token}`);

      // If route doesn't exist, we expect 404, but auth should pass
      // For now, we'll test the middleware logic
      expect(response.status).not.toBe(401);
    });

    test('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('token');
    });

    test('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', 'Bearer invalid-token-12345');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should deny access with malformed token', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should deny access with expired token', async () => {
      // Create an expired token
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Admin Routes', () => {
    test('should allow admin access to admin routes', async () => {
      // Create admin user
      const adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        });

      const adminToken = loginResponse.body.token;

      // Test admin route (we'll create this)
      const response = await request(app)
        .delete('/api/sweets/test-id')
        .set('Authorization', `Bearer ${adminToken}`);

      // If route doesn't exist, expect 404, but auth should pass
      expect(response.status).not.toBe(403);
      expect(response.status).not.toBe(401);
    });

    test('should deny regular user access to admin routes', async () => {
      const response = await request(app)
        .delete('/api/sweets/test-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Admin');
    });
  });
});