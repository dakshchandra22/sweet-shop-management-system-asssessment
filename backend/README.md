# Sweet Shop Management System - Backend

Backend API for Sweet Shop Management System built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment files:
   - Copy `.env` for development (see `ENV_SETUP.md` for details)
   - Copy `.env.test` for testing

3. Start MongoDB (if running locally):
```bash
mongod
```

## Running the Application

### Development Mode
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production Mode
```bash
npm start
```

## Testing

Run tests with watch mode:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

**Note:** Tests use a separate database (`sweetshop-test`) to avoid affecting development data.

## Project Structure

```
backend/
├── src/
│   ├── config/       # Database configuration
│   ├── models/       # Mongoose models
│   ├── middleware/   # Express middleware
│   ├── routes/       # API routes
│   ├── controllers/  # Route controllers
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   └── server.js     # Express app entry point
├── tests/            # Test files
└── package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /` - API information

More endpoints coming soon...

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/test/production)

