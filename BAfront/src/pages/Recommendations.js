import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/api';
import '../styles/Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserRecommendations();
  }, []);

  const fetchUserRecommendations = async () => {
    try {
      const response = await recommendationService.getUserRecommendations();
      setRecommendations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={fetchUserRecommendations}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <div className="no-recommendations">
          <h2>No Recommendations Yet</h2>
          <p>Upload a photo to get personalized beauty recommendations</p>
          <a href="/upload" className="upload-photo-button">
            Upload Your Photo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h1 className="page-title">Your Beauty Recommendations</h1>
      
      <div className="recommendations-grid">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="recommendation-card">
            <div className="recommendation-image">
              {recommendation.Photo?.photo_url ? (
                <img 
                  src={`http://localhost:3000/${recommendation.Photo.photo_url}`} 
                  alt="User uploaded" 
                />
              ) : (
                <div className="no-image">No image available</div>
              )}
            </div>
            <div className="recommendation-details">
              <div className="recommendation-date">
                <span>{formatDate(recommendation.created_at)}</span>
                <span className="event-type">{recommendation.event_type}</span>
              </div>
              <h3>Face Analysis</h3>
              <div className="attributes">
                <div className="attribute">
                  <span className="attribute-label">Face Shape:</span>
                  <span className="attribute-value">{recommendation.face_shape}</span>
                </div>
                <div className="attribute">
                  <span className="attribute-label">Skin Tone:</span>
                  <span className="attribute-value">{recommendation.skin_tone}</span>
                </div>
                <div className="attribute">
                  <span className="attribute-label">Hair Color:</span>
                  <span className="attribute-value">{recommendation.hair_color}</span>
                </div>
              </div>
              <h3>Recommendations</h3>
              <div className="recommendations-text">
                <div className="recommendation-section">
                  <h4>Makeup</h4>
                  <p>{recommendation.recommended_makeup}</p>
                </div>
                <div className="recommendation-section">
                  <h4>Hairstyle</h4>
                  <p>{recommendation.recommended_hairstyle}</p>
                </div>
              </div>
              <div className="card-actions">
                <a 
                  href={`/recommendations/${recommendation.id}`} 
                  className="view-details-button"
                >
                  View Details
                </a>
                <a 
                  href={`/feedback/new/${recommendation.id}`} 
                  className="leave-feedback-button"
                >
                  Leave Feedback
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="get-more-recommendations">
        <h3>Want more recommendations?</h3>
        <p>Upload another photo for different occasions or styles</p>
        <a href="/upload" className="upload-new-photo-button">
          Upload New Photo
        </a>
      </div>
    </div>
  );
};

export default Recommendations;