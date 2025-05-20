const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDB() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL);
    
    // Try to connect
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log('Number of users in database:', userCount);
    
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@test.com`,
        full_name: 'Test User',
        age: 25,
        gender: 'female',
        username: `testuser${Date.now()}`,
        hashed_password: 'test123'
      }
    });
    console.log('Successfully created test user:', testUser.id);
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('Successfully deleted test user');
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

require('dotenv').config();
testDB();
