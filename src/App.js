import React from 'react';
import './App.css';
import Layout from './components/Layout';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <Layout>
      <div className="app-container">
        <ChatWidget />
      </div>
    </Layout>
  );
}

export default App;