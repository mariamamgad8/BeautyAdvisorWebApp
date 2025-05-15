import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PhotoUpload from './pages/PhotoUpload';
import Recommendations from './pages/Recommendations';
import RecommendationDetail from './pages/RecommendationDetail';
import Profile from './pages/Profile';
import FeedbackForm from './pages/FeedbackForm';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload" element={<PhotoUpload />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/recommendations/:id" element={<RecommendationDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feedback/new/:recommendationId" element={<FeedbackForm />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-content">
              <p>&copy; {new Date().getFullYear()} Beauty Advisor. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
