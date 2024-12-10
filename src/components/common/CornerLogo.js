import React from 'react';
import './CornerLogo.css';
import logoUPC from '../assets/images/upc-logo.png';

const CornerLogo = () => {
  return (
    <div className="corner-logo">
      <img src={logoUPC} alt="UPC Logo" className="upc-logo" />
    </div>
  );
};

export default CornerLogo;
