import React from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  return (
    <>
      {/* Background Image Container */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/icelandic-lava-show.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content Container */}
      <div className="relative min-h-screen z-10">
        <div className="container mx-auto px-4 pt-32">
          {/* Main Title */}
          <div className="max-w-4xl">
            <h1 
              className="text-white text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
              style={{
                lineHeight: '1.2',
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
            <div className="mt-12 space-y-6">
              <h2 className="text-[#FF4B12] text-2xl md:text-3xl font-semibold">
                Welcome to Our Demo Environment
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                Experience our interactive chat assistant and explore what Lava Show has to offer.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </>
  );
};

export default LavaShowDemo;