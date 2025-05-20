import React, { useState } from 'react';
import { authService } from '../services/api';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    age: '',
    gender: 'female',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Age validation
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 120) {
      setError('Please enter a valid age (13-120)');
      return;
    }

    setLoading(true);    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Validate username
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }

      // Validate password strength
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      // Exclude confirmPassword from data sent to API
      const { confirmPassword, ...registrationData } = formData;
      
      // Convert age to number and ensure gender is lowercase
      const processedData = {
        ...registrationData,
        age: parseInt(registrationData.age),
        gender: registrationData.gender.toLowerCase()
      };
      
      const response = await authService.register(processedData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to profile after successful registration
        window.location.href = '/profile';
      } else {
        setError('Registration successful but no token received. Please try logging in.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message.includes('Network Error')) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join Beauty Advisor to get personalized beauty recommendations</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
                min="13"
                max="120"
                required
              />
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              minLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              minLength="6"
              required
            />
          </div>
          
          <div className="form-terms">
            <label className="terms-checkbox">
              <input type="checkbox" required /> 
              <span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>
            </label>
          </div>
          
          <div className="button-container">
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <p className="auth-redirect">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;