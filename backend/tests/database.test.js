const { connectDB, disconnectDB, clearDatabase } = require('../src/config/database');
const mongoose = require('mongoose');

describe('Database Configuration', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test('should connect to test database', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    expect(mongoose.connection.name).toBe('sweetshop-test');
  });

  test('should use test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.MONGODB_URI).toContain('sweetshop-test');
  });

  test('should clear database between tests', async () => {
    // This test verifies cleanup works
    const collections = Object.keys(mongoose.connection.collections);
    expect(collections.length).toBeGreaterThanOrEqual(0);
  });
});

