const { connectDB, disconnectDB, clearDatabase } = require('../src/config/database');
const Sweet = require('../src/models/Sweet');

describe('Sweet Model', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('Sweet Creation', () => {
    test('should create a new sweet with valid data', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      const sweet = await Sweet.create(sweetData);

      expect(sweet._id).toBeDefined();
      expect(sweet.name).toBe(sweetData.name);
      expect(sweet.category).toBe(sweetData.category);
      expect(sweet.price).toBe(sweetData.price);
      expect(sweet.quantity).toBe(sweetData.quantity);
      expect(sweet.createdAt).toBeDefined();
      expect(sweet.updatedAt).toBeDefined();
    });

    test('should not create sweet without name', async () => {
      const sweetData = {
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    test('should not create sweet without category', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        price: 50,
        quantity: 100
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    test('should not create sweet without price', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        quantity: 100
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    test('should not create sweet without quantity', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });
  });

  describe('Validation', () => {
    test('should not accept negative price', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: -10,
        quantity: 100
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    test('should not accept negative quantity', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: -10
      };

      await expect(Sweet.create(sweetData)).rejects.toThrow();
    });

    test('should accept zero quantity', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 0
      };

      const sweet = await Sweet.create(sweetData);
      expect(sweet.quantity).toBe(0);
    });

    test('should accept zero price', async () => {
      const sweetData = {
        name: 'Free Sweet',
        category: 'Indian',
        price: 0,
        quantity: 100
      };

      const sweet = await Sweet.create(sweetData);
      expect(sweet.price).toBe(0);
    });

    test('should trim whitespace from name and category', async () => {
      const sweetData = {
        name: '  Gulab Jamun  ',
        category: '  Indian  ',
        price: 50,
        quantity: 100
      };

      const sweet = await Sweet.create(sweetData);
      expect(sweet.name).toBe('Gulab Jamun');
      expect(sweet.category).toBe('Indian');
    });
  });

  describe('Data Types', () => {
    test('should store price as number', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.99,
        quantity: 100
      };

      const sweet = await Sweet.create(sweetData);
      expect(typeof sweet.price).toBe('number');
      expect(sweet.price).toBe(50.99);
    });

    test('should store quantity as number', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100
      };

      const sweet = await Sweet.create(sweetData);
      expect(typeof sweet.quantity).toBe('number');
      expect(sweet.quantity).toBe(100);
    });
  });
});

