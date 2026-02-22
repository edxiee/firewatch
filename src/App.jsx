import React from 'react';
import './App.css';

function App() {
  return (
    <div className="screen-container">
      {/* Top Section: Title */}
      <header className="header-section">
        <h1 className="main-title">Start with FireWatch</h1>
      </header>

      {/* Middle Section: Logo (The flexible part) */}
      <main className="image-section">
        <img src="/Logo.png" alt="FireWatch Logo" className="hero-logo" />
      </main>

      {/* Bottom Section: Text and Action */}
      <footer className="footer-section">
        <p className="description-text">
          Login page design is ready: here's a UI concept for a event booking 
          app that helps users to keep.
        </p>
        <p className="credits-text">By Group 5 - IT32S2</p>
        
        <button className="get-started-btn">
          Get Started <span className="arrow">→</span>
        </button>
      </footer>
    </div>
  );
}

export default App;