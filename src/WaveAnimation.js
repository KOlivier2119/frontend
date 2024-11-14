// src/components/WaveAnimation.js
import React, { useState, useEffect } from 'react';
import './WaveAnimation.css';

const WaveAnimation = ({ isActive }) => {
  return (
    <div className={`wave-container ${isActive ? 'active' : ''}`}>
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
    </div>
  );
};

export default WaveAnimation;
