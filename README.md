# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop, built with the MERN stack (MongoDB, Express.js, React, Node.js). This project demonstrates modern web development practices including Test-Driven Development (TDD), RESTful API design, JWT authentication, and responsive UI design.

![Sweet Shop](https://img.shields.io/badge/Sweet-Shop-pink?style=for-the-badge)
![MERN](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![TDD](https://img.shields.io/badge/TDD-Approach-blue?style=for-the-badge)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [My Assistant Usage](#-my-assistant-usage)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### User Features
- 🔐 **User Authentication**: Secure registration and login with JWT tokens
- 🍭 **Browse Sweets**: View all available sweets with beautiful card layouts
- 🔍 **Search & Filter**: Search by name, category, and price range
- 🛒 **Purchase Sweets**: One-click purchase functionality
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- ➕ **Add Sweets**: Create new sweet items with name, category, price, and quantity
- ✏️ **Edit Sweets**: Update existing sweet details
- 🗑️ **Delete Sweets**: Remove sweets from inventory
- 📦 **Restock Inventory**: Add more quantity to existing sweets
- 👑 **Admin Dashboard**: Special admin interface with enhanced controls

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Vite** - Build tool and dev server
- **React Testing Library** - Component testing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dakshchandra22/sweet-shop-management-system-asssessment.git
cd sweet-shop-management-system-asssessment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env  # Or create .env manually
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database - Development
MONGODB_URI=mongodb://localhost:27017/sweetshop

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345

# Server Port
PORT=8000

# Environment
NODE_ENV=development
```

### Frontend Environment Variables (Optional)

Create a `.env` file in the `frontend` directory (if not using proxy):

```env
VITE_API_URL=http://localhost:8000/api
```

## 🏃 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:8000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3001`

### Access the Application

Open your browser and navigate to: `http://localhost:3001`

## 👤 Default Admin Credentials

After running the seed script, you can login with:

- **Email**: `admin@sweetshop.com`
- **Password**: `admin123`

To create the admin user, run:

```bash
cd backend
npm run seed:admin
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test
```

**Note**: Backend tests use a separate test database (`sweetshop-test`) to avoid affecting development data.

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sweets Endpoints (Protected)

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=Western&minPrice=10&maxPrice=100
Authorization: Bearer <token>
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Chocolate Cake",
  "category": "Western",
  "price": 250,
  "quantity": 50
}
```

#### Update Sweet
```http
PUT /api/sweets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 300,
  "quantity": 60
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <admin_token>
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 1
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantity": 20
}
```

## 📁 Project Structure

```
sweet-shop-management-system-asssessment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth route handlers
│   │   │   └── sweetController.js   # Sweet route handlers
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Sweet.js             # Sweet schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth routes
│   │   │   └── sweets.js            # Sweet routes
│   │   ├── services/
│   │   │   ├── authService.js       # Auth business logic
│   │   │   └── sweetService.js      # Sweet business logic
│   │   ├── utils/
│   │   │   └── jwt.js               # JWT utilities
│   │   └── server.js                # Express app
│   ├── tests/                       # Test files
│   ├── scripts/
│   │   └── seedAdmin.js             # Admin user seed script
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── Login.js             # Login component
│   │   │   ├── Register.js          # Register component
│   │   │   ├── Navbar.js            # Navigation bar
│   │   │   ├── SweetCard.js         # Sweet card component
│   │   │   ├── SweetForm.js         # Add/Edit form
│   │   │   ├── SearchBar.js         # Search component
│   │   │   └── ErrorBoundary.js     # Error boundary
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── utils/
│   │   │   └── auth.js              # Auth utilities
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
└── README.md                        # This file
```

## 📸 Screenshots

### Dashboard View
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+View)

### Login Page
![Login](https://via.placeholder.com/800x400/764ba2/ffffff?text=Login+Page)

### Add Sweet Form
![Add Sweet](https://via.placeholder.com/800x400/f093fb/ffffff?text=Add+Sweet+Form)

*Note: Replace placeholder images with actual screenshots of your application*

## 🤖 My Assistant Usage

### Tool Used

I used **Cursor** (powered by Claude Sonnet) as my coding assistant throughout this project. Cursor is a code editor that helps write code, fix bugs, and suggest improvements.

### How I Used It

#### 1. **Project Setup**
- Asked Cursor to help design the API endpoints (like `/api/auth/register`, `/api/sweets/:id/purchase`)
- Used it to create the folder structure for backend and frontend

#### 2. **Writing Code**
- **Backend**: Asked Cursor to write test cases, controllers, and database models. For example, I asked it to "create a User model with password hashing" and it generated the code which I then customized.
- **Frontend**: Used Cursor to create React components like Login, Register, and Dashboard. I asked it to create the basic structure, then I styled and customized it.

#### 3. **Fixing Problems**
- **CORS Error**: When the frontend couldn't connect to the backend, I asked Cursor how to fix it. It suggested configuring CORS settings.
- **Infinite Loop**: When React kept re-rendering, Cursor helped identify the problem and suggested using `useMemo` to fix it.
- **Database Setup**: Asked Cursor how to set up separate databases for testing and development.

#### 4. **Styling**
- Asked Cursor to create modern CSS with gradients and responsive design
- Used its suggestions to improve the look of buttons, cards, and forms

#### 5. **Documentation**
- Asked Cursor to help write this README file
- Used it to add comments explaining complex code

### What I Learned

**Good Things:**
- **Saved Time**: Writing tests and boilerplate code that would take hours was done in minutes
- **Learned New Patterns**: Cursor showed me modern coding patterns I didn't know before
- **Caught Bugs Early**: It spotted potential problems before they became real bugs
- **Better Documentation**: Helped me write better documentation

**Challenges:**
- Sometimes Cursor didn't understand what I needed on the first try, so I had to ask again
- I had to make sure I understood the code it generated, not just copy it
- The code it generated needed customization to fit my project

### How I Used It Responsibly

1. **Always Reviewed Code**: I never used code from Cursor without checking it first
2. **Tested Everything**: Ran tests after using Cursor's suggestions
3. **Understood Before Using**: Made sure I knew what the code was doing
4. **Customized Everything**: Used Cursor's code as a starting point, then made it my own
5. **Kept Learning**: Used Cursor to learn, not just to get answers

### Summary

Cursor helped me work faster and learn new things. It didn't replace my coding skills - it made them better. I used it as a helper, but I made all the final decisions about the code.

### Transparency

- All commits where I used Cursor include: `Co-authored-by: Cursor <AI@users.noreply.github.com>`
- I made all the final decisions about the code and architecture
- I used Cursor to learn and be more productive, not to avoid understanding the code

## 🧪 Test Coverage

The project follows Test-Driven Development (TDD) principles:

- ✅ Backend API endpoints tested
- ✅ Authentication middleware tested
- ✅ Database models tested
- ✅ Service layer tested
- ✅ Frontend components tested

Run `npm run test:coverage` in the backend directory to see detailed coverage reports.

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy to platforms like:
   - Heroku
   - Railway
   - Render
   - AWS EC2

### Frontend Deployment

1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Daksh Chandra**

- GitHub: [@dakshchandra22](https://github.com/dakshchandra22)

## AI Usage

# Tool Used: Cursor (AI-powered code editor)

- Debugging: Used AI assistance to understand error messages, stack traces, and failing Jest test cases.

- Error Solving: Helped identify possible fixes during development, which were reviewed and implemented manually.

- Designing: Assisted with suggestions on project structure, separation of concerns, and naming conventions.

- Testing Support: Supported writing clearer test cases and understanding edge cases while following TDD (Red → Green → Refactor).

- Optimization: Suggested minor refactoring and optimization to improve code readability and maintainability.

- Responsibility: AI was used strictly as a support tool. All core logic, implementation decisions, testing flow, and commits were done by me.