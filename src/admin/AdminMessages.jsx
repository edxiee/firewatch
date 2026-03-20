import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Ensure this path is correct
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminMessages() {
  const [chats, setChats] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // 1. Get list of all users who messaged
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. Get messages for the selected user
  useEffect(() => {
    if (!activeChatUser) return;
    const q = query(collection(db, "chats", activeChatUser.id, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [activeChatUser]);

  const handleReply = async () => {
    if (!reply.trim() || !activeChatUser) return;
    await addDoc(collection(db, "chats", activeChatUser.id, "messages"), {
      text: reply,
      senderId: "admin",
      timestamp: serverTimestamp(),
    });
    setReply("");
  };

  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">Admin Messages</div>
      </div>

      <div className="content">
        {!activeChatUser ? (
          // LIST VIEW
          <div className="services-grid">
            <h2 className="services-header" style={{ color: "#a31224", textAlign: "center", width: "100%" }}>Active Chats</h2>
            {chats.length > 0 ? chats.map(chat => (
              <div key={chat.id} className="service-box" onClick={() => setActiveChatUser(chat)}>
                <div className="service-text">
                  <h3>{chat.userEmail || "User"}</h3>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            )) : (
              <div className="service-box">
                <div className="service-text">
                  <p style={{ textAlign: "center", color: "#666" }}>No messages from users yet.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // CHAT VIEW
          <div className="admin-chat-area">
            <button className="back-btn" onClick={() => setActiveChatUser(null)} style={{ margin: '10px', padding: '8px 15px', borderRadius: '5px', backgroundColor: '#333', color: '#fff', border: 'none' }}>
              Back to List
            </button>
            
            <div className="messages-display">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.senderId === 'admin' ? 'sent' : 'received'}`}>
                  {m.text}
                </div>
              ))}
            </div>

            {/* This is the fixed footer for Admin */}
            <footer className="chat-input-row">
              <input 
                type="text" 
                placeholder="Type Reply..." 
                value={reply} 
                onChange={(e) => setReply(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <button type="button" onClick={handleReply}>➤</button>
            </footer>
          </div>
        )}
      </div>
      <AdminNavbar />
    </div>
  );
}