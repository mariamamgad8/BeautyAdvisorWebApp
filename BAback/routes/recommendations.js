const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

// Generate a recommendation using the ML model API
router.post('/generate/:photoId', authenticateToken, async (req, res) => {
  try {
    const photoId = parseInt(req.params.photoId);
    
    // Find the photo
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user owns the photo
    if (photo.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get the full path of the image file
    const imagePath = path.join(__dirname, '..', photo.photo_url);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image file not found' });
    }

    // Read the image as base64 for sending to ML API
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Send to ML model API
    // Note: Replace the URL with your actual ML model API endpoint
    const mlApiResponse = await axios.post(process.env.ML_API_URL || 'https://your-ml-api-endpoint.com/predict', {
      image: base64Image,
      // Any additional parameters required by your ML API
    });

    // Extract ML model results
    const {
      event_type,
      face_shape,
      skin_tone,
      hair_color,
      recommended_makeup,
      recommended_hairstyle
    } = mlApiResponse.data;

    // Store recommendation in database
    const recommendation = await prisma.recommendation.create({
      data: {
        event_type,
        face_shape,
        skin_tone,
        hair_color,
        recommended_makeup,
        recommended_hairstyle,
        user_id: req.user.id,
        photo_id: photoId
      }
    });

    res.status(201).json({
      message: 'Recommendation generated successfully',
      recommendation
    });

  } catch (error) {
    console.error('Recommendation generation error:', error);
    
    // Handle ML API errors separately for better diagnostics
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'ML API error',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Error generating recommendation', 
      error: error.message 
    });
  }
});

// Get all recommendations for a user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        user_id: req.user.id
      },
      include: {
        Photo: true,
        Feedback: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
});

// Get a specific recommendation by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        Photo: true,
        Feedback: true
      }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    // Check if user owns the recommendation
    if (recommendation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({ message: 'Error fetching recommendation', error: error.message });
  }
});

// Delete a recommendation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    // Check if user owns the recommendation
    if (recommendation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete associated feedback first (to handle foreign key constraints)
    await prisma.feedback.deleteMany({
      where: {
        recommendation_id: parseInt(req.params.id)
      }
    });

    // Then delete the recommendation
    await prisma.recommendation.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.status(200).json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({ message: 'Error deleting recommendation', error: error.message });
  }
});

module.exports = router;