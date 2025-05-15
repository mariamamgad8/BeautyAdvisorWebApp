import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Beauty Advisor</h1>
          <p>Your personal guide to beauty recommendations tailored just for you</p>
          <button className="primary-button">Get Started</button>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            {/* Hero image will be placed here */}
            <div className="placeholder-text">Beauty Image</div>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Upload Your Photo</h3>
            <p>Share your photos and let our AI analyze them</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Get Personalized Recommendations</h3>
            <p>Receive tailored beauty advice based on your unique features</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Share Feedback</h3>
            <p>Let us know how our recommendations worked for you</p>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Upload your photo</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <p>AI analyzes your features</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Get personalized recommendations</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;