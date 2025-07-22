import React from 'react';
import ChatWidget from './ChatWidget';

const ShowcaseDemo = () => {
  return (
    <div className="relative bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center">
        {/* Hero Content */}
        <div className="relative px-8 pt-24 max-w-7xl mx-auto">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-12 tracking-tight text-gray-900"
            style={{
              lineHeight: '1.1'
            }}
          >
            CREATIVE
            <br />
            <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-orange-400 bg-clip-text text-transparent">
              CHATBOT
            </span>
            <br />
            SHOWCASE
          </h1>

          <div className="mt-12 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent mb-6">
              Interactive Demo Environment
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Experience our beautiful chat interface with smooth animations, 
              responsive design, and elegant user interactions.
            </p>
          </div>
        </div>
      </div>

      {/* Features Sections */}
      <div className="relative bg-gray-50">
        {/* Technology Section */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Modern Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">React & Modern JS</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Built with cutting-edge React components, featuring hooks, 
                  state management, and smooth real-time interactions.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Responsive Design</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Fully responsive interface that adapts beautifully across 
                  desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Design Section */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Beautiful Interface
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Smooth Animations</h3>
                <p className="text-gray-600">Delightful micro-interactions and smooth transitions</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Modern Aesthetics</h3>
                <p className="text-gray-600">Clean, contemporary design with beautiful gradients</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Fast Performance</h3>
                <p className="text-gray-600">Optimized for speed and smooth user experience</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default ShowcaseDemo;