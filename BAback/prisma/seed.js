const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Delete all existing data
  console.log('Cleaning up existing data...');
  await prisma.feedback.deleteMany({});
  await prisma.recommendation.deleteMany({});
  await prisma.photo.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Adding test users...');
  // Create test users
  const salt = await bcrypt.genSalt(10);
  const userPassword = await bcrypt.hash('password123', salt);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      full_name: 'Sarah Johnson',
      age: 28,
      gender: 'female',
      username: 'sarahj',
      hashed_password: userPassword
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      full_name: 'Mike Chen',
      age: 32,
      gender: 'male',
      username: 'mikec',
      hashed_password: userPassword
    }
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'amira@example.com',
      full_name: 'Amira Khan',
      age: 24,
      gender: 'female',
      username: 'amirak',
      hashed_password: userPassword
    }
  });

  console.log('Created users:', [user1.username, user2.username, user3.username].join(', '));

  // Create sample photos
  console.log('Adding sample photos...');
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create placeholder photos (in real app, these would be actual images)
  const samplePhotoUrls = [
    '/uploads/sample_photo_1.jpeg',
    '/uploads/sample_photo_1.jpeg',
    '/uploads/sample_photo_1.jpeg',
    '/uploads/sample_photo_1.jpeg',
    '/uploads/sample_photo_1.jpeg',
    '/uploads/sample_photo_1.jpeg'
  ];

  // Create empty placeholder files
  samplePhotoUrls.forEach(url => {
    const filePath = path.join(__dirname, '..', url);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, ''); // Create empty file
    }
  });

  // Add photos to database
  const photo1 = await prisma.photo.create({
    data: {
      photo_url: samplePhotoUrls[0],
      user_id: user1.id
    }
  });

  const photo2 = await prisma.photo.create({
    data: {
      photo_url: samplePhotoUrls[1],
      user_id: user1.id
    }
  });

  const photo3 = await prisma.photo.create({
    data: {
      photo_url: samplePhotoUrls[2],
      user_id: user2.id
    }
  });

  const photo4 = await prisma.photo.create({
    data: {
      photo_url: samplePhotoUrls[3],
      user_id: user2.id
    }
  });

  const photo5 = await prisma.photo.create({
    data: {
      photo_url: samplePhotoUrls[4],
      user_id: user3.id
    }
  });

  const photo6 = await prisma.photo.create({
    data: {
      photo_url: samplePhotoUrls[5],
      user_id: user3.id
    }
  });

  console.log('Added sample photos to database');

  // Create recommendations
  console.log('Adding sample recommendations...');
  
  const recommendation1 = await prisma.recommendation.create({
    data: {
      event_type: 'formal',
      face_shape: 'oval',
      skin_tone: 'medium',
      hair_color: 'brown',
      recommended_makeup: 'Natural foundation with dewy finish, soft brown eyeshadow, wine-colored lipstick.',
      recommended_hairstyle: 'Elegant updo with side-swept bangs to complement oval face shape.',
      user_id: user1.id,
      photo_id: photo1.id
    }
  });

  const recommendation2 = await prisma.recommendation.create({
    data: {
      event_type: 'casual',
      face_shape: 'oval',
      skin_tone: 'medium',
      hair_color: 'brown',
      recommended_makeup: 'Light BB cream, mascara, and tinted lip balm for a fresh day look.',
      recommended_hairstyle: 'Loose waves with middle part, adding volume to frame the face.',
      user_id: user1.id,
      photo_id: photo2.id
    }
  });

  const recommendation3 = await prisma.recommendation.create({
    data: {
      event_type: 'business',
      face_shape: 'square',
      skin_tone: 'fair',
      hair_color: 'black',
      recommended_makeup: 'Matte foundation, subtle contour, neutral eyeshadow, and dusty rose lipstick.',
      recommended_hairstyle: 'Layered cut with side-swept bangs to soften square face angles.',
      user_id: user2.id,
      photo_id: photo3.id
    }
  });

  const recommendation4 = await prisma.recommendation.create({
    data: {
      event_type: 'party',
      face_shape: 'square',
      skin_tone: 'fair',
      hair_color: 'black',
      recommended_makeup: 'Full coverage foundation, smokey eye makeup, bold red lips for evening glamour.',
      recommended_hairstyle: 'Sleek straight style with volume at the crown to elongate face shape.',
      user_id: user2.id,
      photo_id: photo4.id
    }
  });

  const recommendation5 = await prisma.recommendation.create({
    data: {
      event_type: 'wedding',
      face_shape: 'heart',
      skin_tone: 'deep',
      hair_color: 'black',
      recommended_makeup: 'Radiant foundation, golden eyeshadow with winged liner, berry lips for celebration.',
      recommended_hairstyle: 'Half-up style with curls to balance heart-shaped face proportions.',
      user_id: user3.id,
      photo_id: photo5.id
    }
  });

  const recommendation6 = await prisma.recommendation.create({
    data: {
      event_type: 'beach',
      face_shape: 'heart',
      skin_tone: 'deep',
      hair_color: 'black',
      recommended_makeup: 'Waterproof tinted moisturizer with SPF, waterproof mascara, coral lip tint.',
      recommended_hairstyle: 'Braided crown style to keep hair off face in humid beach conditions.',
      user_id: user3.id,
      photo_id: photo6.id
    }
  });

  console.log('Added sample recommendations');

  // Create feedback
  console.log('Adding sample feedback...');
  
  await prisma.feedback.create({
    data: {
      feedback_text: "Loved the makeup suggestion! The lipstick shade was perfect for me.",
      rating: 5,
      user_id: user1.id,
      recommendation_id: recommendation1.id
    }
  });

  await prisma.feedback.create({
    data: {
      feedback_text: "The hairstyle suggestion was okay but didn't really work with my hair texture.",
      rating: 3,
      user_id: user1.id,
      recommendation_id: recommendation2.id
    }
  });

  await prisma.feedback.create({
    data: {
      feedback_text: "Great business look recommendation, very professional yet stylish!",
      rating: 4,
      user_id: user2.id,
      recommendation_id: recommendation3.id
    }
  });

  await prisma.feedback.create({
    data: {
      feedback_text: "Perfect party look, got many compliments!",
      rating: 5,
      user_id: user2.id,
      recommendation_id: recommendation4.id
    }
  });

  await prisma.feedback.create({
    data: {
      feedback_text: "The makeup recommendation was perfect for my wedding guest outfit!",
      rating: 5,
      user_id: user3.id,
      recommendation_id: recommendation5.id
    }
  });

  console.log('Added sample feedback');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });