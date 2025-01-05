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
      <div className="relative min-h-screen flex flex-col justify-center">
        {/* Background Image with Parallax */}
        <img 
          src="/images/icelandic-lava-show.jpg" 
          alt="Lava Background"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: `translateY(${scroll * 0.3}px)`,
            opacity: 0.4 // Fixed opacity for better visibility
          }}
        />

        {/* Hero Content */}
        <div 
          className="relative px-8 pt-24 max-w-7xl mx-auto transition-opacity duration-300"
          style={{
            transform: `translateY(${scroll * 0.1}px)`,
            opacity: Math.max(1 - scroll * 0.0015, 0.3) // Slower fade-out, minimum opacity 0.3
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

      {/* Content Sections */}
      <div className="relative z-10 bg-black/80"> {/* Increased z-index and adjusted background opacity */}
        {/* Experience Section */}
        <section className="py-24 px-8">
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
        <section className="py-24 px-8 bg-black/90"> {/* Darker background for better contrast */}
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
    </div>
  );
};

export default LavaShowDemo;