import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const InitialPopup = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Html center>
      <div style={overlayStyle}>
        <h1 style={headerStyle}>STAGECRAFT</h1>
        <div style={dividerStyle}></div>
        <p style={copyrightStyle}>Copyright © All rights reserved</p>
      </div>
    </Html>
  );
};

const overlayStyle = {
  backgroundColor: 'rgba(20, 20, 40, 0.95)',
  padding: '40px 60px',
  borderRadius: '16px',
  width: '400px',
  textAlign: 'center',
  color: 'white',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  animation: 'fadeIn 1s ease-out',
  zindex: '1000000'
};

const headerStyle = {
  fontSize: '28px',
  fontWeight: '900',
  letterSpacing: '2px',
  color: '#00BFFF',
  marginBottom: '10px',
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#CCCCCC',
  marginBottom: '20px',
};

const dividerStyle = {
  height: '2px',
  background: 'linear-gradient(90deg, rgba(0,191,255,1) 0%, rgba(0,128,255,0.7) 100%)',
  margin: '16px 0',
};

const copyrightStyle = {
  fontSize: '14px',
  color: '#AAAAAA',

};

export default InitialPopup;
