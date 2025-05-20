import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalRecommendations: 0
  });
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {      const response = await authService.getProfile();
      const userData = response.data;
      console.log('Profile data received:', userData);
      setUser(userData);
      setLoading(false);
        // Get actual counts from the user data
      console.log('Calculating stats from:', {
        _count: userData._count,
        photos: userData._count?.Photo,
        recommendations: userData._count?.Recommendation
      });
      setStats({
        totalPhotos: userData._count?.Photo || 0,
        totalRecommendations: userData._count?.Recommendation || 0
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile information. Please try again later.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home page
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={fetchUserProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="no-user">
          <h2>Not Logged In</h2>
          <p>Please login to view your profile</p>
          <a href="/login" className="login-button">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.full_name}</h1>
          <p className="username">@{user.username}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalPhotos}</div>
          <div className="stat-label">Photos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalRecommendations}</div>
          <div className="stat-label">Recommendations</div>
        </div>
      </div>

      <div className="profile-details">
        <h2>Account Information</h2>
        <div className="detail-card">
          <div className="detail-group">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          
          <div className="detail-row">
            <div className="detail-group half">
              <label>Age</label>
              <p>{user.age}</p>
            </div>
            
            <div className="detail-group half">
              <label>Gender</label>
              <p>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}</p>
            </div>
          </div>
          
          <div className="detail-group">
            <label>Member Since</label>
            <p>{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <a href="/account/edit" className="edit-profile-button">
          Edit Profile
        </a>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="profile-sections">
        <div className="section-card">
          <h3>Recent Recommendations</h3>
          {stats.totalRecommendations > 0 ? (
            <div className="section-content">
              <p>You have {stats.totalRecommendations} beauty recommendations</p>
              <a href="/recommendations" className="section-link">
                View All Recommendations
              </a>
            </div>
          ) : (
            <div className="section-empty">
              <p>You don't have any beauty recommendations yet</p>
              <a href="/upload" className="section-link">
                Upload a Photo to Get Recommendations
              </a>
            </div>
          )}
        </div>

        <div className="section-card">
          <h3>Account Settings</h3>
          <div className="section-content settings-links">
            <a href="/account/password" className="settings-link">
              Change Password
            </a>
            <a href="/account/notifications" className="settings-link">
              Notification Preferences
            </a>
            <a href="/account/privacy" className="settings-link">
              Privacy Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;