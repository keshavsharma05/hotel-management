import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div className={`premium-loading-wrapper ${fullScreen ? 'full-screen' : ''}`}>
      <div className="premium-loading-spinner"></div>
      <p className="premium-loading-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
