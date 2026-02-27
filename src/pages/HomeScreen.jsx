import React from 'react';
import './HomeScreen.css';

function HomeScreen() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">FireWatch Dashboard</h1>
      </header>
      
      <main className="home-content">
        <p className="home-description">
          Welcome, Ranger. You are now connected to the monitoring system. 
          Stay alert and report any suspicious activity immediately.
        </p>
        
        <button className="report-btn">
          Report Incident
        </button>
      </main>
    </div>
  );
}

export default HomeScreen;