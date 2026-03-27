import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import "./Auth.css";

// --- SVG ICONS ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

export default function Auth() {
  const navigate = useNavigate();
  
  // UI States
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  // Check if user clicked the link in their email
  const checkVerificationStatus = async () => {
    try {
      await reload(auth.currentUser); // Refresh user data from Firebase
      if (auth.currentUser.emailVerified) {
        alert("Email successfully verified!");
        setShowVerifyModal(false);
        setIsLogin(true); // Switch to login so they can sign in properly
      } else {
        alert("Still waiting for verification. Please click the link in your email.");
      }
    } catch (error) {
      alert("Error checking status: " + error.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verify Check
        if (!user.emailVerified) {
          alert("Please verify your email address first. Check your inbox.");
          await signOut(auth);
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          navigate("/admin");
          return; 
        }

        const hasSeenLanding = localStorage.getItem("hasSeenFireWatchIntro");
        navigate(!hasSeenLanding ? "/landing" : "/home");
      } else {
        if (password !== confirmPassword) {
          alert("Registration Error: Passwords do not match!");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 1. Send verification link
        await sendEmailVerification(user);

        // 2. Save data
        await setDoc(doc(db, "users", user.uid), {
          firstName, lastName, contact, address, email,
          role: "user", createdAt: new Date()
        });

        // 3. Show Modal
        setShowVerifyModal(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="/Logo.png" alt="FireWatch" className="auth-logo" />
      </div>

      <div className="auth-card">
        <div className="tab-container">
          <button type="button" className={`tab ${isLogin ? "active" : ""}`} onClick={() => { setIsLogin(true); setShowPassword(false); }}>Login</button>
          <button type="button" className={`tab ${!isLogin ? "active" : ""}`} onClick={() => { setIsLogin(false); setShowPassword(false); }}>Sign Up</button>
        </div>

        <form className="auth-form" onSubmit={handleAuth}>
          <div className="scrollable-fields">
            {!isLogin && (
              <>
                <div className="input-row">
                  <div className="input-group"><label>First Name</label><input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                  <div className="input-group"><label>Last Name</label><input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                </div>
                <div className="input-group"><label>Contact No.</label><input type="tel" placeholder="09123456789" required pattern="[0-9]{11}" maxLength={11} value={contact} onChange={(e) => setContact(e.target.value)} /></div>
                <div className="input-group"><label>Address</label><input type="text" placeholder="Home Address" required value={address} onChange={(e) => setAddress(e.target.value)} /></div>
              </>
            )}

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="Password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {isLogin && (
                <div className="forgot-password-container">
                  <span className="forgot-password-link" onClick={handleForgotPassword}>Forgot Password?</span>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>

        <p className="auth-footer-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </p>
      </div>

      {/* --- VERIFICATION MODAL --- */}
      {showVerifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">📩</div>
            <h2>Verify Your Email</h2>
            <p>We sent a verification link to:</p>
            <strong>{email}</strong>
            <p className="modal-instruction">Please open your email app and click the link to activate your account.</p>
            
            <button className="verify-check-btn" onClick={checkVerificationStatus}>
              I Have Clicked the Link
            </button>
            
            <button className="resend-link" onClick={() => sendEmailVerification(auth.currentUser)}>
              Resend verification email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}