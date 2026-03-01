import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/Logo.png" alt="FireWatch" className="auth-logo" />
      </div>

      <div className="auth-card">
        <div className="tab-container">
          <button
            type="button"
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <div className="input-row">
                <div className="input-group">
                  <label>First Name</label>
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
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p
            className="auth-footer-text"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Forgot Password?" : "Already Have an Account?"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
