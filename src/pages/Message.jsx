import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc } from "firebase/firestore";
import UserNavBar from "./UserNavBar"; // Import your new component
import './Message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const user = auth.currentUser;

  // 1. Listen for messages
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chats", user.uid, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [user]);

  // 2. Send message function
  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return;

    await setDoc(doc(db, "chats", user.uid), {
      userEmail: user.email,
      lastMessage: inputText,
      updatedAt: serverTimestamp()
    }, { merge: true });

    await addDoc(collection(db, "chats", user.uid, "messages"), {
      text: inputText,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setInputText("");
  };

  return (
    <div className="homescreen">
      <div className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="top-title">Chat</div>
      </div>

      <main className="content">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.senderId === user.uid ? "sent" : "received"}`}>
            {msg.text}
          </div>
        ))}
        {messages.length === 0 && <div className="chat-bubble received">Unit QC-3 Dispatched...</div>}
      </main>

      {/* Fixed footer for input */}
      <footer className="chat-input-row">
        <input 
          type="text" 
          placeholder="Type Message..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button type="button" onClick={handleSendMessage}>➤</button>
      </footer>

      {/* Shared Uniform Navbar */}
      <UserNavBar />
    </div>
  );
};

export default Message;