# Environment Setup Guide

## Required Environment Files

You need to create two environment files manually:

### 1. `.env` (Development Environment)

Create `backend/.env` with the following content:

```env
# Database - Development
MONGODB_URI=mongodb://localhost:27017/sweetshop

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 2. `.env.test` (Test Environment)

Create `backend/.env.test` with the following content:

```env
# Database - Test (Separate from development)
MONGODB_URI=mongodb://localhost:27017/sweetshop-test

# JWT Secret - Test
JWT_SECRET=test-jwt-secret-key-for-testing-only

# Server Port - Test
PORT=5001

# Environment
NODE_ENV=test
```

## Important Notes

- **Development database**: `sweetshop` (port 27017)
- **Test database**: `sweetshop-test` (port 27017)
- Tests automatically use the test database when `NODE_ENV=test`
- The test database is separate to avoid affecting development data
- Make sure MongoDB is running before starting the server or running tests

## Quick Setup Commands

```bash
# Create .env file (development)
cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
PORT=5000
NODE_ENV=development
EOF

# Create .env.test file (testing)
cat > backend/.env.test << EOF
MONGODB_URI=mongodb://localhost:27017/sweetshop-test
JWT_SECRET=test-jwt-secret-key-for-testing-only
PORT=5001
NODE_ENV=test
EOF
```

