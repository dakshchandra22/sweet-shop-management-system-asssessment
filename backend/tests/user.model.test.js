const { connectDB, disconnectDB, clearDatabase } = require('../src/config/database');
const User = require('../src/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await connectDB();
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await disconnectDB();
  });

  describe('User Creation', () => {
    test('should create a new user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.role).toBe('user'); // Default role
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    test('should not create user without username', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not create user without email', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not create user without password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not create user with duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not create user with duplicate username', async () => {
      const userData1 = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123'
      };

      const userData2 = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password123'
      };

      await User.create(userData1);
      await expect(User.create(userData2)).rejects.toThrow();
    });

    test('should create admin user with role admin', async () => {
      const userData = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      };

      const user = await User.create(userData);
      expect(user.role).toBe('admin');
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash length
    });

    test('should verify password correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const isValid = await user.comparePassword('password123');
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });
  });

  describe('Validation', () => {
    test('should not accept username shorter than 3 characters', async () => {
      const userData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not accept invalid email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not accept password shorter than 6 characters', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '12345'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should trim whitespace from username and email', async () => {
      const userData = {
        username: '  testuser  ',
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
    });
  });
});

