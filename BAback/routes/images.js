const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

const router = express.Router();
const prisma = new PrismaClient();

// Upload a new image
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get file path relative to the uploads directory
    const relativePath = path.relative(
      path.join(__dirname, '../uploads'),
      req.file.path
    );
    
    // Save photo entry in database
    const photo = await prisma.photo.create({
      data: {
        photo_url: `/uploads/${relativePath.replace(/\\/g, '/')}`, // Convert to URL path format
        user_id: req.user.id
      }
    });

    res.status(201).json({ 
      message: 'Image uploaded successfully',
      photo
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Get all images for a user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({
      where: {
        user_id: req.user.id
      },
      orderBy: {
        uploaded_at: 'desc'
      }
    });

    res.status(200).json(photos);
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
});

// Get a specific image by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!photo) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (photo.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
});

// Delete an image
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!photo) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (photo.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from file system
    const fullPath = path.join(__dirname, '..', photo.photo_url);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete from database
    await prisma.photo.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

module.exports = router;