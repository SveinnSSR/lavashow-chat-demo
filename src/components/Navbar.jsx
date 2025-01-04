// src/components/Navbar.jsx
import React from 'react';
import { theme } from '../styles/theme';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: theme.colors.background,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <img 
        src="/lava-show-logo.png" 
        alt="LAVA SHOW" 
        style={{
          height: '40px'
        }}
      />
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}>Locations</a>
        <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}>Giftcards</a>
        <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}>About us</a>
        <button style={{
          backgroundColor: theme.colors.primary,
          color: '#FFFFFF',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          GET TICKETS NOW
        </button>
      </div>
    </nav>
  );
};

export default Navbar;