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

    // Use our local model runner instead of an external API
    const { runBeautyAdvisorModel } = require('../utils/modelRunner');
    
    // Run the model on the image
    const modelResult = await runBeautyAdvisorModel(imagePath);
    
    if (modelResult.error) {
      return res.status(400).json({ message: `Model error: ${modelResult.error}` });
    }

    // Extract ML model results - handle both result structures
    let face_shape, skin_tone, hair_color, recommended_makeup, recommended_hairstyle;
    const event_type = "general"; // Default event type
    
    if (modelResult.features) {
      // New structure with features and recommendations objects
      const { features, recommendations } = modelResult;
      face_shape = features.face_shape;
      skin_tone = features.skin_tone_rgb ? `RGB(${features.skin_tone_rgb.join(',')})` : null;
      hair_color = features.hair_color_rgb ? `RGB(${features.hair_color_rgb.join(',')})` : null;
      recommended_makeup = recommendations.makeup;
      recommended_hairstyle = recommendations.hair_style;
    } else {
      // Direct properties on the modelResult object
      face_shape = modelResult.face_shape;
      skin_tone = modelResult.skin_tone_rgb ? `RGB(${modelResult.skin_tone_rgb.join(',')})` : null;
      hair_color = modelResult.hair_color_rgb ? `RGB(${modelResult.hair_color_rgb.join(',')})` : null;
      
      if (modelResult.recommendations) {
        recommended_makeup = modelResult.recommendations.makeup;
        recommended_hairstyle = modelResult.recommendations.hair_style;
      } else {
        // Generate detailed recommendations based on detected features
        const skin_tone_rgb = modelResult.skin_tone_rgb || modelResult.features?.skin_tone_rgb || [150, 150, 150];
        const skinBrightness = (skin_tone_rgb[0] + skin_tone_rgb[1] + skin_tone_rgb[2]) / 3;
        const hair_texture = modelResult.hair_texture || modelResult.features?.hair_texture || "Unknown";
        
        if (face_shape === 'Round') {
          recommended_makeup = `Use contouring to define cheekbones and elongate face. ${skinBrightness < 150 ? 
            'Warm bronzers and coral blushes applied at an angle will add definition.' : 
            'Taupe contour and rose blushes applied at an angle will add definition.'} Choose angular shapes for eyes.`;
            
          recommended_hairstyle = `Long layers with volume at the crown to elongate the face. ${hair_texture.includes('Curly') ? 
            'Your natural curls with longer length will beautifully frame your face.' : 
            hair_texture.includes('Wavy') ? 'Your natural waves with long layers will add vertical dimension.' :
            'Consider adding texture spray for volume and movement at the crown.'}`;
            
        } else if (face_shape === 'Oval') {
          recommended_makeup = `Most makeup styles work well with your balanced face shape. ${skinBrightness < 150 ? 
            'Your skin tone pairs beautifully with warm earth tones, bronze, and copper eyeshadows.' : 
            'Your skin tone works wonderfully with cool mauves, taupes, and soft pinks.'}`;
            
          recommended_hairstyle = `You're lucky - most styles work well with your face shape! ${hair_texture.includes('Curly') ? 
            'Embrace your natural curls with a layered cut that adds volume and frames your face.' : 
            hair_texture.includes('Wavy') ? 'Your natural waves would look stunning with face-framing layers.' :
            'Consider trying curtain bangs or face-framing layers to accentuate your features.'}`;
            
        } else if (face_shape === 'Square') {
          recommended_makeup = `Soften angles with rounded contouring techniques. ${skinBrightness < 150 ? 
            'Use warm-toned blush applied in circular motions on the apples of your cheeks.' : 
            'Apply soft pink or peach blush in circular motions to soften angular features.'} Focus on soft brows and rounded eye looks.`;
            
          recommended_hairstyle = `Soft layers and waves to soften your strong jawline. ${hair_texture.includes('Curly') ? 
            'Your natural curls falling around your face will beautifully balance your features.' : 
            hair_texture.includes('Wavy') ? 'Your natural waves with side-swept styling will complement your face shape.' :
            'Consider adding soft waves around your face to balance your strong features.'}`;
            
        } else {
          recommended_makeup = `Customize makeup to enhance your natural features. ${skinBrightness < 150 ? 
            'Your skin tone works well with warm, rich colors that add dimension to your face.' : 
            'Your skin tone pairs beautifully with soft, neutral tones that enhance your natural features.'}`;
            
          recommended_hairstyle = `Try a versatile mid-length cut with layers for balance. ${hair_texture.includes('Curly') ? 
            'Your natural curls can be styled to highlight your best features.' : 
            hair_texture.includes('Wavy') ? 'Your natural texture provides great versatility for different styling options.' :
            'Adding light layers will give you versatility while maintaining your hair texture.'}`;
        }
      }
    }

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