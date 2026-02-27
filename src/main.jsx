import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Auth from './pages/Auth.jsx'; // Corrected path based on your explorer
import './index.css';

const hideSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 500);
  }
}; // This closing brace was missing, causing your build error!

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

hideSplashScreen();