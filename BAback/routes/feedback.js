const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Submit feedback for a recommendation
router.post('/:recommendationId', authenticateToken, async (req, res) => {
  try {
    const recommendationId = parseInt(req.params.recommendationId);
    const { feedback_text, rating } = req.body;
    
    // Check if the recommendation exists and belongs to the user
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    if (recommendation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if feedback already exists for this recommendation
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        recommendation_id: recommendationId,
        user_id: req.user.id
      }
    });

    if (existingFeedback) {
      // Update existing feedback
      const updatedFeedback = await prisma.feedback.update({
        where: { id: existingFeedback.id },
        data: {
          feedback_text,
          rating: parseInt(rating) || 3
        }
      });

      return res.status(200).json({
        message: 'Feedback updated successfully',
        feedback: updatedFeedback
      });
    }

    // Create new feedback
    const feedback = await prisma.feedback.create({
      data: {
        feedback_text,
        rating: parseInt(rating) || 3,
        user_id: req.user.id,
        recommendation_id: recommendationId
      }
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get all feedback for the current user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        user_id: req.user.id
      },
      include: {
        Recommendation: {
          include: {
            Photo: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Get feedback for a specific recommendation
router.get('/recommendation/:recommendationId', authenticateToken, async (req, res) => {
  try {
    const recommendationId = parseInt(req.params.recommendationId);
    
    // Check if the recommendation exists and belongs to the user
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    if (recommendation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const feedback = await prisma.feedback.findFirst({
      where: {
        recommendation_id: recommendationId,
        user_id: req.user.id
      }
    });

    if (!feedback) {
      return res.status(404).json({ message: 'No feedback found for this recommendation' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Get recommendation feedback error:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Delete feedback
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.feedback.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
});

module.exports = router;