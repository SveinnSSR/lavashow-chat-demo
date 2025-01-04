import React from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'url(/images/icelandic-lava-show.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 z-10">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider leading-tight" style={{ 
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
          }}>
            THE ONLY LIVE
            <br />
            LAVA SHOW
            <br />
            IN THE WORLD
          </h1>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-6 mt-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#FF4B12]">
            Welcome to Our Demo Environment
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Experience our interactive chat assistant and explore what Lava Show has to offer.
          </p>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default LavaShowDemo;