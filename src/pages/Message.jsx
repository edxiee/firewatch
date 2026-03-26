import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from "../firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import UserNavBar from "./UserNavBar"; 
import './Message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const user = auth.currentUser;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chats", user.uid, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      await setDoc(doc(db, "chats", user.uid), {
        userEmail: user.email,
        firstName: userData.firstName || "User",
        lastMessage: inputText,
        updatedAt: serverTimestamp()
      }, { merge: true });
      await addDoc(collection(db, "chats", user.uid, "messages"), {
        text: inputText,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        status: "sent" 
      });
      setInputText("");
    } catch (error) { console.error(error); }
  };

  return (
    <div className="chat-layout-wrapper">
      <header className="top-bar">
        <img className="top-logo" src="/Logo.png" alt="Logo" />
        <span className="top-title">Chat</span>
      </header>

      <main className="chat-content-area">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-wrapper ${msg.senderId === user?.uid ? "sent" : "received"}`}>
              <div className="chat-bubble">
                {msg.text}
                <div className="message-info">
                  <span className="message-time">
                    {msg.timestamp ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer-group">
        <div className="chat-input-row">
          <input 
            type="text" 
            placeholder="Type Message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>➤</button>
        </div>
        <div className="navbar-fixed-container">
          <UserNavBar />
        </div>
      </footer>
    </div>
  );
};

export default Message;