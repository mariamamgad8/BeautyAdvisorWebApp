import React, { useState, useRef } from 'react';
import { imageService } from '../services/api';
import '../styles/PhotoUpload.css';

const PhotoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // File validation
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // File validation
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setError('');
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await imageService.uploadImage(formData);
      
      setSuccess('Image uploaded successfully! You can now generate recommendations.');
      
      // Redirect to recommendations generator with the new photo ID
      setTimeout(() => {
        window.location.href = `/recommendations/generate/${response.data.photo.id}`;
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Your Photo</h2>
        <p className="upload-subtitle">
          Upload a clear selfie for the most accurate beauty recommendations
        </p>

        {error && <div className="upload-error">{error}</div>}
        {success && <div className="upload-success">{success}</div>}

        <div 
          className="upload-area"
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="image-preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <button className="change-image-button" onClick={triggerFileInput}>
                Change Image
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="#e91e63">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                </svg>
              </div>
              <p className="upload-text">
                Drag and drop your photo here, or click to select
              </p>
              <p className="upload-hint">
                JPEG, PNG or GIF • Max 5MB
              </p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="upload-guidelines">
          <h3>For best results:</h3>
          <ul>
            <li>Use a well-lit photo with a neutral background</li>
            <li>Face the camera directly with a neutral expression</li>
            <li>Remove glasses and pull back hair from your face</li>
            <li>Use a recent photo without filters or heavy edits</li>
          </ul>
        </div>

        <button 
          className="upload-button" 
          onClick={handleUpload} 
          disabled={!selectedFile || loading}
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;