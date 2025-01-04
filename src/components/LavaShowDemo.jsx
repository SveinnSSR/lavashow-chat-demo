import React from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Lava Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/icelandic-lava-show.jpg" 
          alt="Lava Background"
          className="w-full h-full object-cover opacity-30"
          style={{
            filter: 'brightness(0.7) contrast(1.2)'
          }}
        />
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-black bg-opacity-80">
        <img 
          src="/images/lava-show-logo.png" 
          alt="Lava Show" 
          className="h-8 md:h-12"
        />
        <div className="flex items-center gap-6">
          <a href="#" className="hidden md:block text-white hover:text-gray-300 transition-colors">Locations</a>
          <a href="#" className="hidden md:block text-white hover:text-gray-300 transition-colors">Giftcards</a>
          <a href="#" className="hidden md:block text-white hover:text-gray-300 transition-colors">About us</a>
          <button className="bg-[#FF4B12] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
            GET TICKETS NOW
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 z-10">
        {/* Background Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-wider" style={{ 
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
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default LavaShowDemo;