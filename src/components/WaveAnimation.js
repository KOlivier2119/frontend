import React from 'react';
import './waveAnimation.css';

const WaveAnimation = ({ isActive }) => {
  return (
    <div className={`wave-animation ${isActive ? 'active' : ''}`}>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
};

export default WaveAnimation;
