import React from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image */}
      <img 
        src="/images/icelandic-lava-show.jpg" 
        alt="Lava Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col justify-center px-8 pt-24">
        {/* Title Section */}
        <div className="max-w-4xl">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-12"
            style={{
              lineHeight: '1.1',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            THE ONLY LIVE
            <br />
            LAVA SHOW
            <br />
            IN THE WORLD
          </h1>

          {/* Welcome Text */}
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#FF4B12] mb-4">
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