// WelcomePopup.jsx
import React from 'react';
import './WelcomePopup.css';

function WelcomePopup({ onClose }) {
  return (
    <div className="popup">
      <h2>Welcome!</h2>
      <p>Hope :)</p>
      <button onClick={onClose}>ok</button>
    </div>
  );
}

export default WelcomePopup;