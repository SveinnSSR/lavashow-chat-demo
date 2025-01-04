// src/components/Navbar.jsx
import React from 'react';
import { theme } from '../styles/theme';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: theme.colors.background,
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <img 
        src="/lava-show-logo.png" 
        alt="LAVA SHOW" 
        style={{
          height: '40px'
        }}
      />
      <h1 style={{
        color: theme.colors.primary,
        fontSize: '1.5rem',
        margin: 0
      }}>
        Chat with Tinna
      </h1>
    </nav>
  );
};

export default Navbar;