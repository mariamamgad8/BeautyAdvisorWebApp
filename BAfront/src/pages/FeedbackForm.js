import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { feedbackService, recommendationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/FeedbackForm.css';

const FeedbackForm = () => {
  const { recommendationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    effectiveness: 'good',
    would_recommend: true
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchRecommendation();
  }, [recommendationId, currentUser, navigate]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const response = await recommendationService.getRecommendation(recommendationId);
      setRecommendation(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to load recommendation. Please try again later.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to submit feedback');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await feedbackService.submitFeedback({
        ...formData,
        recommendation_id: recommendationId
      });
      
      setSuccess('Thank you for your feedback! Your response has been recorded.');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/recommendations/${recommendationId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading recommendation details...</p>
        </div>
      </div>
    );
  }

  if (error && !recommendation) {
    return (
      <div className="feedback-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={fetchRecommendation}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <Link to={`/recommendations/${recommendationId}`} className="back-link">
          ← Back to Recommendation
        </Link>
        <h1>Share Your Feedback</h1>
        <p className="feedback-subtitle">
          Your feedback helps us improve our recommendations for you and others
        </p>
      </div>

      {error && <div className="feedback-error">{error}</div>}
      {success && <div className="feedback-success">{success}</div>}

      <div className="feedback-content">
        <div className="recommendation-preview">
          <h3>Your Recommendation</h3>
          {recommendation?.Photo?.photo_url ? (
            <img 
              src={`http://localhost:3000/${recommendation.Photo.photo_url}`} 
              alt="Your uploaded photo" 
              className="preview-image"
            />
          ) : (
            <div className="no-image">No image available</div>
          )}
          <div className="preview-type">
            <span className="preview-label">Event Type: </span>
            <span className="preview-value">{recommendation?.event_type}</span>
          </div>
          <div className="preview-date">
            <span className="preview-label">Created on: </span>
            <span className="preview-value">
              {new Date(recommendation?.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group rating-group">
            <label>How would you rate this recommendation?</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-text">
              {getRatingText(formData.rating)}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="effectiveness">How effective was this recommendation for your needs?</label>
            <select
              id="effectiveness"
              name="effectiveness"
              value={formData.effectiveness}
              onChange={handleChange}
            >
              <option value="excellent">Excellent - Perfect for me</option>
              <option value="good">Good - Worked well but could be better</option>
              <option value="average">Average - Somewhat helpful</option>
              <option value="poor">Poor - Not very useful</option>
              <option value="not_effective">Not Effective - Didn't work for me</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comments (optional)</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Please share your experience with this recommendation"
              rows={5}
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="would_recommend"
                checked={formData.would_recommend}
                onChange={handleChange}
              />
              <span>I would recommend Beauty Advisor to others</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

const getRatingText = (rating) => {
  switch (rating) {
    case 1:
      return "Very Dissatisfied";
    case 2:
      return "Dissatisfied";
    case 3:
      return "Neutral";
    case 4:
      return "Satisfied";
    case 5:
      return "Very Satisfied";
    default:
      return "";
  }
};

export default FeedbackForm;