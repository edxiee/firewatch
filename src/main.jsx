import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const splash = document.getElementById('splash-screen');

if (splash) {
  // Reduced from 10000 to 3000 for a better user experience
  setTimeout(() => {
    splash.classList.add('fade-out');
    
    setTimeout(() => {
      splash.remove();
    }, 500);
    
  }, 3000); 
}