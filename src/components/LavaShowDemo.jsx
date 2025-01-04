import React, { useEffect, useState } from 'react';
import ChatWidget from './ChatWidget';

const LavaShowDemo = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-black text-white">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex flex-col justify-center">
        {/* Background Image with Parallax */}
        <img 
          src="/images/icelandic-lava-show.jpg" 
          alt="Lava Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-300"
          style={{
            transform: `translateY(${scroll * 0.5}px)`,
            opacity: Math.max(0.3 - scroll * 0.001, 0)
          }}
        />

        {/* Hero Content */}
        <div 
          className="relative px-8 pt-24 max-w-7xl mx-auto"
          style={{
            transform: `translateY(${scroll * 0.2}px)`,
            opacity: Math.max(1 - scroll * 0.002, 0)
          }}
        >
          <h1 
            className="text-7xl md:text-8xl lg:text-9xl font-bold mb-12 tracking-tight"
            style={{
              lineHeight: '1.1',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
            }}
          >
            THE ONLY LIVE
            <br />
            LAVA SHOW
            <br />
            IN THE WORLD
          </h1>

          <div className="mt-12 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#FF4B12] mb-4">
              Welcome to Our Demo Environment
            </h2>
            <p className="text-xl md:text-2xl text-gray-300">
              Experience our interactive chat assistant and explore what Lava Show has to offer.
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections with Fade In */}
      <div className="relative bg-black/90">
        {/* Experience Section */}
        <section className="py-24 px-8 opacity-0 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-[#FF4B12]">
              Experience Real Molten Lava
            </h2>
            <div className="space-y-16">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Unique Demonstrations</h3>
                <p className="text-gray-300 text-lg">
                  Watch as our experts manipulate real molten lava, heated to over 1,000°C, 
                  creating a spectacular display of nature's raw power.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Interactive Learning</h3>
                <p className="text-gray-300 text-lg">
                  Discover the science behind volcanoes and learn about Iceland's unique 
                  geological features through our engaging presentations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-24 px-8 bg-black/50 opacity-0 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
              Safety First
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl">
              Our facility is designed with state-of-the-art safety measures, ensuring 
              you can enjoy the raw power of molten lava in complete security.
            </p>
          </div>
        </section>
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Add these styles to your CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          animation-play-state: paused;
          animation-delay: calc(var(--scroll) * -1s);
        }

        section {
          --scroll: 0;
        }
      `}</style>
    </div>
  );
};

export default LavaShowDemo;