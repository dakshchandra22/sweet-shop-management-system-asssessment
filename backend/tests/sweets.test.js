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
    await clearDatabase();
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
    await clearDatabase();
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

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 100 },
        { name: 'Rasgulla', category: 'Indian', price: 40, quantity: 80 },
        { name: 'Chocolate Cake', category: 'Western', price: 200, quantity: 30 },
        { name: 'Brownie', category: 'Western', price: 150, quantity: 50 }
      ]);
    });

    test('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Gulab')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toContain('Gulab');
    });

    test('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Indian')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.every(s => s.category === 'Indian')).toBe(true);
    });

    test('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=100&maxPrice=200')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every(s => s.price >= 100 && s.price <= 200)).toBe(true);
    });

    test('should search with multiple filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Indian&minPrice=40&maxPrice=50')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every(s => 
        s.category === 'Indian' && s.price >= 40 && s.price <= 50
      )).toBe(true);
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Gulab');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      });
      sweetId = sweet._id.toString();
    });

    test('should update sweet with valid data (authenticated user)', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Gulab Jamun',
          price: 60,
          quantity: 120
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Gulab Jamun');
      expect(response.body.price).toBe(60);
      expect(response.body.quantity).toBe(120);
    });

    test('should not update sweet without authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });

    test('should not update with negative price', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: -10 });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      });
      sweetId = sweet._id.toString();
    });

    test('should delete sweet (admin only)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    test('should not delete sweet (regular user)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Admin');
    });

    test('should not delete sweet without authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      });
      sweetId = sweet._id.toString();
    });

    test('should purchase sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(95);
      
      const sweet = await Sweet.findById(sweetId);
      expect(sweet.quantity).toBe(95);
    });

    test('should not purchase when quantity is zero', async () => {
      await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('out of stock');
    });

    test('should not purchase more than available', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 150 });

      expect(response.status).toBe(400);
      expect(response.body.error.toLowerCase()).toContain('insufficient');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 5 });

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      });
      sweetId = sweet._id.toString();
    });

    test('should restock sweet (admin only)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(150);
      
      const sweet = await Sweet.findById(sweetId);
      expect(sweet.quantity).toBe(150);
    });

    test('should not restock sweet (regular user)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Admin');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 50 });

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent sweet', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .post(`/api/sweets/${fakeId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(response.status).toBe(404);
    });
  });
});

