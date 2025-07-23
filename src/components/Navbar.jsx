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
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50
    }}>
      {/* Logo */}
      <img 
        src="/images/lava-show-logo.png" 
        alt="LAVA SHOW" 
        style={{
          height: '40px',
          width: 'auto'
        }}
      />

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <a 
          href="#" 
          style={{ 
            color: '#FFFFFF', 
            textDecoration: 'none',
            padding: '0.5rem',
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Locations
        </a>
        <a 
          href="#" 
          style={{ 
            color: '#FFFFFF', 
            textDecoration: 'none',
            padding: '0.5rem',
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Giftcards
        </a>
        <a 
          href="#" 
          style={{ 
            color: '#FFFFFF', 
            textDecoration: 'none',
            padding: '0.5rem',
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          About us
        </a>
        <button 
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          GET TICKETS NOW
        </button>
      </div>
    </nav>
  );
};

export default Navbar;