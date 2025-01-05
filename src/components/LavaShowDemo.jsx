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
            opacity: 0.7 // Increased from 0.4 to 0.7
          }}
        />

        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"
          style={{
            transform: `translateY(${scroll * 0.3}px)`
          }}
        />

        {/* Hero Content */}
        <div 
          className="relative px-8 pt-24 max-w-7xl mx-auto"
          style={{
            transform: `translateY(${scroll * 0.1}px)`
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

      {/* Content Sections with better spacing and contrast */}
      <div className="relative z-10">
        {/* Experience Section */}
        <section className="py-32 px-8 bg-black/95"> {/* Increased padding and darker background */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-16 text-[#FF4B12]">
              Experience Real Molten Lava
            </h2>
            <div className="grid md:grid-cols-2 gap-16"> {/* Increased gap */}
              <div className="bg-black/50 p-8 rounded-lg"> {/* Added container */}
                <h3 className="text-3xl font-semibold mb-6 text-white">Unique Demonstrations</h3>
                <p className="text-xl text-gray-300">
                  Watch as our experts manipulate real molten lava, heated to over 1,000°C, 
                  creating a spectacular display of nature's raw power.
                </p>
              </div>
              <div className="bg-black/50 p-8 rounded-lg"> {/* Added container */}
                <h3 className="text-3xl font-semibold mb-6 text-white">Interactive Learning</h3>
                <p className="text-xl text-gray-300">
                  Discover the science behind volcanoes and learn about Iceland's unique 
                  geological features through our engaging presentations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-32 px-8 bg-gradient-to-b from-black/90 to-black"> {/* Added gradient */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
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