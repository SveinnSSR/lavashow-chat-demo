import React from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Background Text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-10 select-none">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-wider whitespace-nowrap" style={{ 
              textShadow: '0 4px 8px rgba(255, 75, 18, 0.3)'
            }}>
              THE ONLY LIVE
              <br />
              LAVA SHOW
              <br />
              IN THE WORLD
            </h1>
          </div>
        </div>

        {/* Optional: Add additional content sections here */}
        <div className="relative z-10 text-center space-y-6 mt-24 mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#FF4B12]">
            Welcome to Our Demo Environment
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Experience our interactive chat assistant and explore what Lava Show has to offer.
          </p>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Optional: Background gradient overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 75, 18, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
        zIndex: 1
      }}></div>
    </div>
  );
};

export default LavaShowDemo;