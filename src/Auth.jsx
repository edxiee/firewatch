import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  // 'isLogin' is true for the Login screen, false for Sign Up
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/Logo.png" alt="FireWatch" className="auth-logo" />
      </div>
      
      <div className="auth-card">
        <div className="tab-container">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {/* Sign Up needs more fields than Login */}
          {!isLogin && (
            <>
              <div className="input-row">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" placeholder="First Name" />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Last Name" />
                </div>
              </div>
              <div className="input-group">
                <label>Contact No.</label>
                <input type="text" placeholder="Contact Number" />
              </div>
              <div className="input-group">
                <label>Address</label>
                <input type="text" placeholder="Home Address" />
              </div>
            </>
          )}

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Email Address" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Password" />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          
          <p className="auth-footer-text">
            {isLogin ? "Forgot Password?" : "Already Have an Account?"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;