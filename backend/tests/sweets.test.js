const request = require('supertest');
const { connectDB, disconnectDB, clearDatabase } = require('../src/config/database');
const app = require('../src/server');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

describe('Sweets API', () => {
  let token;
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDatabase();

    // Create regular user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    token = registerResponse.body.token;

    // Create admin user
    adminUser = await User.create({
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

    adminToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('POST /api/sweets', () => {
    test('should create a new sweet with valid data (authenticated user)', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
    });

    test('should not create sweet without authentication', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create sweet without name', async () => {
      const sweetData = {
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create sweet without category', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        price: 50,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create sweet without price', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create sweet without quantity', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create sweet with negative price', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: -10,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create sweet with negative quantity', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: -10
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should create sweet and save to database', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      const sweet = await Sweet.findOne({ name: 'Gulab Jamun' });
      expect(sweet).toBeDefined();
      expect(sweet.name).toBe(sweetData.name);
      expect(sweet.price).toBe(sweetData.price);
    });
  });

  describe('GET /api/sweets', () => {
    test('should get all sweets (authenticated user)', async () => {
      // Create some sweets
      await Sweet.create([
        { name: 'Sweet 1', category: 'Category 1', price: 10, quantity: 50 },
        { name: 'Sweet 2', category: 'Category 2', price: 20, quantity: 30 },
        { name: 'Sweet 3', category: 'Category 1', price: 15, quantity: 40 }
      ]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('quantity');
    });

    test('should not get sweets without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should return empty array when no sweets exist', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    test('should return sweets in correct format', async () => {
      await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      });

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('_id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('quantity');
      expect(response.body[0]).toHaveProperty('createdAt');
      expect(response.body[0]).toHaveProperty('updatedAt');
    });
  });
});

