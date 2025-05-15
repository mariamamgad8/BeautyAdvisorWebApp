import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recommendationService, feedbackService } from '../services/api';
import '../styles/RecommendationDetail.css';

const RecommendationDetail = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchRecommendationDetail();
  }, [id]);

  const fetchRecommendationDetail = async () => {
    try {
      setLoading(true);
      const response = await recommendationService.getRecommendation(id);
      setRecommendation(response.data);
      
      // Try to fetch any existing feedback for this recommendation
      try {
        const feedbackResponse = await feedbackService.getRecommendationFeedback(id);
        setFeedback(feedbackResponse.data.length > 0 ? feedbackResponse.data[0] : null);
      } catch (feedbackErr) {
        console.log('No feedback found or error fetching feedback');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to load recommendation details. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="recommendation-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading recommendation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-detail-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={fetchRecommendationDetail}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="recommendation-detail-container">
        <div className="not-found-message">
          <h3>Recommendation Not Found</h3>
          <p>The recommendation you're looking for doesn't exist or has been removed.</p>
          <Link to="/recommendations" className="back-button">
            Back to Recommendations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-detail-container">
      <div className="detail-header">
        <Link to="/recommendations" className="back-link">
          ← Back to Recommendations
        </Link>
        <h1>Beauty Recommendation Details</h1>
      </div>

      <div className="recommendation-detail-content">
        <div className="detail-image-section">
          {recommendation.Photo?.photo_url ? (
            <div className="detail-image-container">
              <img 
                src={`http://localhost:3000/${recommendation.Photo.photo_url}`} 
                alt="Your uploaded photo" 
                className="detail-image"
              />
              <div className="image-meta">
                <span className="meta-date">Uploaded on {formatDate(recommendation.Photo.created_at)}</span>
              </div>
            </div>
          ) : (
            <div className="no-image-placeholder">
              <span>No image available</span>
            </div>
          )}

          <div className="recommendation-meta">
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">{formatDate(recommendation.created_at)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Event Type:</span>
              <span className="meta-value event-type-badge">{recommendation.event_type}</span>
            </div>
          </div>
        </div>

        <div className="detail-info-section">
          <div className="detail-card face-analysis">
            <h2>Face Analysis</h2>
            <div className="analysis-grid">
              <div className="analysis-item">
                <h3>Face Shape</h3>
                <div className="analysis-value">{recommendation.face_shape}</div>
                <p className="analysis-description">
                  {getFaceShapeDescription(recommendation.face_shape)}
                </p>
              </div>
              <div className="analysis-item">
                <h3>Skin Tone</h3>
                <div className="analysis-value">{recommendation.skin_tone}</div>
                <div 
                  className="skin-tone-sample" 
                  style={{ backgroundColor: getSkinToneColor(recommendation.skin_tone) }}
                ></div>
              </div>
              <div className="analysis-item">
                <h3>Hair Color</h3>
                <div className="analysis-value">{recommendation.hair_color}</div>
                <div 
                  className="hair-color-sample" 
                  style={{ backgroundColor: getHairColor(recommendation.hair_color) }}
                ></div>
              </div>
            </div>
          </div>

          <div className="detail-card makeup-recommendations">
            <h2>Makeup Recommendations</h2>
            <div className="recommendation-text">
              {recommendation.recommended_makeup}
            </div>
            <div className="product-suggestions">
              <h3>Suggested Products</h3>
              <ul className="product-list">
                {generateSuggestedProducts(recommendation).map((product, index) => (
                  <li key={index} className="product-item">
                    <div className="product-color" style={{ backgroundColor: product.color }}></div>
                    <div className="product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-type">{product.type}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detail-card hairstyle-recommendations">
            <h2>Hairstyle Recommendations</h2>
            <div className="recommendation-text">
              {recommendation.recommended_hairstyle}
            </div>
          </div>

          <div className="detail-card additional-tips">
            <h2>Additional Beauty Tips</h2>
            <div className="tips-content">
              <p>{generateAdditionalTips(recommendation)}</p>
            </div>
          </div>

          <div className="detail-actions">
            {feedback ? (
              <div className="feedback-provided">
                <h3>Your Feedback</h3>
                <div className="feedback-rating">
                  <span className="rating-label">Rating:</span>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${star <= feedback.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="feedback-comment">{feedback.comment}</p>
                <Link to={`/feedback/edit/${feedback.id}`} className="edit-feedback-button">
                  Edit Feedback
                </Link>
              </div>
            ) : (
              <Link to={`/feedback/new/${recommendation.id}`} className="leave-feedback-button">
                Leave Feedback
              </Link>
            )}
            <div className="action-buttons">
              <button className="share-button">Share This Recommendation</button>
              <button className="print-button" onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getFaceShapeDescription = (faceShape) => {
  const descriptions = {
    'oval': 'Oval faces are longer than they are wide with a jaw that is narrower than the cheekbones.',
    'round': 'Round faces have similar width and length with full cheeks and a rounded jawline.',
    'square': 'Square faces have a strong jaw and a wide forehead with similar face width and length.',
    'heart': 'Heart-shaped faces have a wider forehead and cheekbones with a narrow chin.',
    'oblong': 'Oblong faces are longer than they are wide with a long straight cheek line.',
    'diamond': 'Diamond faces have narrow foreheads and jawlines with wide cheekbones.'
  };
  return descriptions[faceShape?.toLowerCase()] || 'A unique face shape with specific beauty advantages.';
};

const getSkinToneColor = (skinTone) => {
  const colors = {
    'fair': '#FFE8D1',
    'light': '#FFD5B3',
    'medium': '#E5BD91',
    'olive': '#C19A6B',
    'tan': '#A67B5B',
    'deep': '#7C5A3C',
    'dark': '#5C4033'
  };
  return colors[skinTone?.toLowerCase()] || '#E5BD91';
};

const getHairColor = (hairColor) => {
  const colors = {
    'black': '#0A0A0A',
    'dark brown': '#3B2314',
    'brown': '#6A4E2E',
    'light brown': '#977654',
    'blonde': '#E6BE8A',
    'red': '#8C3415',
    'auburn': '#922724'
  };
  return colors[hairColor?.toLowerCase()] || '#6A4E2E';
};

const generateSuggestedProducts = (recommendation) => {
  // This would ideally come from the backend API
  // For now, we'll generate some example products based on the recommendation data
  const skinTone = recommendation.skin_tone?.toLowerCase();
  const products = [];

  if (skinTone === 'fair' || skinTone === 'light') {
    products.push(
      { name: 'Luminous Foundation', type: 'Foundation', color: '#FFE4C4' },
      { name: 'Rosy Blush', type: 'Blush', color: '#F7BEC0' },
      { name: 'Soft Pink Lipstick', type: 'Lipstick', color: '#E8A1A1' }
    );
  } else if (skinTone === 'medium' || skinTone === 'olive') {
    products.push(
      { name: 'Golden Foundation', type: 'Foundation', color: '#E5C29F' },
      { name: 'Warm Peach Blush', type: 'Blush', color: '#F8A978' },
      { name: 'Terracotta Lipstick', type: 'Lipstick', color: '#BF614B' }
    );
  } else {
    products.push(
      { name: 'Rich Earth Foundation', type: 'Foundation', color: '#9F7E5E' },
      { name: 'Deep Berry Blush', type: 'Blush', color: '#AD5D6D' },
      { name: 'Burgundy Lipstick', type: 'Lipstick', color: '#8C2B3C' }
    );
  }

  // Add some eye products based on the hair color
  const hairColor = recommendation.hair_color?.toLowerCase();
  
  if (hairColor === 'black' || hairColor === 'dark brown') {
    products.push({ name: 'Smoky Eye Palette', type: 'Eyeshadow', color: '#555555' });
  } else if (hairColor === 'blonde' || hairColor === 'light brown') {
    products.push({ name: 'Neutral Eye Palette', type: 'Eyeshadow', color: '#C9AA88' });
  } else {
    products.push({ name: 'Bronze Eye Palette', type: 'Eyeshadow', color: '#B5723C' });
  }

  return products;
};

const generateAdditionalTips = (recommendation) => {
  // This would ideally come from the backend API or be part of the recommendation data
  // For now, we'll generate some example tips based on the recommendation data
  const faceShape = recommendation.face_shape?.toLowerCase();
  const skinTone = recommendation.skin_tone?.toLowerCase();
  
  let tips = "For your specific features, we recommend focusing on enhancing your natural beauty. ";
  
  if (faceShape === 'round') {
    tips += "Try contouring along your cheekbones and temples to add definition. ";
  } else if (faceShape === 'square') {
    tips += "Softening your jawline with blush applied in circular motions can create a lovely effect. ";
  } else if (faceShape === 'heart') {
    tips += "Balance your face shape by adding volume to your chin area with bronzer. ";
  }
  
  if (skinTone === 'fair' || skinTone === 'light') {
    tips += "Don't forget to apply a good sunscreen daily to protect your skin. A light-reflecting primer can also give you a beautiful glow.";
  } else if (skinTone === 'medium' || skinTone === 'olive') {
    tips += "Your skin tone works beautifully with golden and bronze tones. Consider a luminous bronzer for a sun-kissed glow.";
  } else {
    tips += "Rich, vibrant colors will complement your beautiful skin tone. A good moisturizer will help maintain your skin's natural glow.";
  }
  
  return tips;
};

export default RecommendationDetail;