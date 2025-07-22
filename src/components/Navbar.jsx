// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #14b8a6, #f97316)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        CHATBOT SHOWCASE
      </div>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <a 
          href="#" 
          style={{ 
            color: '#374151', 
            textDecoration: 'none',
            padding: '0.5rem',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#14b8a6';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#374151';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Features
        </a>
        <a 
          href="#" 
          style={{ 
            color: '#374151', 
            textDecoration: 'none',
            padding: '0.5rem',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#14b8a6';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#374151';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Demo
        </a>
        <a 
          href="#" 
          style={{ 
            color: '#374151', 
            textDecoration: 'none',
            padding: '0.5rem',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#14b8a6';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#374151';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          About
        </a>
        <button 
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #f97316)',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #0f766e, #ea580c)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(20, 184, 166, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #14b8a6, #f97316)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.3)';
          }}
        >
          TRY DEMO
        </button>
      </div>
    </nav>
  );
};

export default Navbar;