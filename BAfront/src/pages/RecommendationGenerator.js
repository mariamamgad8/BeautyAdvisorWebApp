import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imageService, recommendationService } from '../services/api';
import '../styles/RecommendationGen.css';

const RecommendationGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);
  const { photoId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await imageService.getImage(photoId);
        setPhoto(response.data);
      } catch (error) {
        console.error('Error fetching photo:', error);
        setError('Failed to load photo. Please try again.');
      }
    };

    fetchPhoto();
  }, [photoId]);

  const handleGenerateRecommendation = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await recommendationService.generateRecommendation(photoId);
      
      // Navigate to the recommendation detail page
      navigate(`/recommendations/${response.data.recommendation.id}`);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError(error.response?.data?.message || 'Failed to generate recommendation. Please try again.');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-card error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            className="recommendation-button" 
            onClick={() => navigate('/photos/upload')}
          >
            Upload New Photo
          </button>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-card loading-card">
          <h2>Loading photo...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-container">
      <div className="recommendation-card">
        <h2>Generate Beauty Recommendations</h2>
        
        <div className="photo-preview">
          <img 
            src={`${process.env.REACT_APP_API_URL || ''}${photo.photo_url}`} 
            alt="Your photo" 
            className="recommendation-photo"
          />
        </div>
        
        <div className="recommendation-info">
          <p className="recommendation-description">
            Our AI beauty advisor will analyze your facial features and provide personalized
            makeup and hairstyle recommendations tailored just for you.
          </p>
          
          <p className="recommendation-notice">
            This process may take a few seconds.
          </p>
        </div>
        
        <button 
          className="recommendation-button" 
          onClick={handleGenerateRecommendation}
          disabled={loading}
        >
          {loading ? 'Analyzing photo...' : 'Generate Recommendations'}
        </button>
      </div>
    </div>
  );
};

export default RecommendationGenerator;
