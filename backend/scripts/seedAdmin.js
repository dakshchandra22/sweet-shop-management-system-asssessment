require('dotenv').config();
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');

async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Default admin credentials
    const adminData = {
      username: 'admin',
      email: 'admin@sweetshop.com',
      password: 'admin123',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { email: adminData.email },
        { username: adminData.username }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      console.log('\nYou can login with:');
      console.log('Email: admin@sweetshop.com');
      console.log('Password: admin123');
    } else {
      // Create admin user
      const admin = await User.create(adminData);
      console.log('✅ Admin user created successfully!');
      console.log('\nAdmin Credentials:');
      console.log('==================');
      console.log('Email: admin@sweetshop.com');
      console.log('Password: admin123');
      console.log('Username: admin');
      console.log('Role: admin');
      console.log('\n⚠️  Please change the password after first login!');
    }

    await disconnectDB();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    await disconnectDB();
    process.exit(1);
  }
}

seedAdmin();

