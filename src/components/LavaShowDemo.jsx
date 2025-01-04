import React from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image - Using inline style for direct background image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'url(/images/icelandic-lava-show.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          width: '100vw',
          height: '100vh',
          position: 'fixed'
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      {/* Main Content - Adjusted padding for navbar */}
      <div className="relative min-h-screen flex flex-col items-start justify-center px-8 md:px-16 z-10 pt-20">
        {/* Main Title - Adjusted positioning and line height */}
        <div className="w-full max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wide leading-tight" 
              style={{ 
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                lineHeight: '1.2'
              }}>
            THE ONLY LIVE
            <br />
            LAVA SHOW
            <br />
            IN THE WORLD
          </h1>

          {/* Welcome Text */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#FF4B12]">
              Welcome to Our Demo Environment
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Experience our interactive chat assistant and explore what Lava Show has to offer.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default LavaShowDemo;