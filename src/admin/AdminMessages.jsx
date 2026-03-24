import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase"; 
// Added getDoc to the imports below
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import AdminNavbar from "./AdminNavbar.jsx";
import "./AdminMessages.css"; 

export default function AdminMessages() {
  const [chats, setChats] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch Chat List with Real Names from 'users' collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        const userId = chatDoc.id;

        // Fetch the specific user profile to get their name
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        return {
          id: userId,
          ...chatData,
          // Fallback to email if firstName is missing
          firstName: userData.firstName || "User",
          lastName: userData.lastName || "",
          userEmail: chatData.userEmail || userData.email
        };
      });

      const chatList = await Promise.all(chatPromises);
      // Sort by most recent message
      setChats(chatList.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0)));
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Messages & Mark as Read
  useEffect(() => {
    if (!activeChatUser) return;

    const q = query(collection(db, "chats", activeChatUser.id, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      msgs.forEach(async (m) => {
        if (m.senderId !== "admin" && m.status !== "read") {
          await updateDoc(doc(db, "chats", activeChatUser.id, "messages", m.id), {
            status: "read"
          });
        }
      });
    });
    return () => unsubscribe();
  }, [activeChatUser]);

  const handleReply = async () => {
    if (!reply.trim() || !activeChatUser) return;
    
    await addDoc(collection(db, "chats", activeChatUser.id, "messages"), {
      text: reply,
      senderId: "admin",
      timestamp: serverTimestamp(),
      status: "sent" 
    });

    await updateDoc(doc(db, "chats", activeChatUser.id), {
      lastMessage: `Admin: ${reply}`,
      updatedAt: serverTimestamp()
    });

    setReply("");
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">
          {activeChatUser 
            ? `${activeChatUser.firstName} ${activeChatUser.lastName}`.trim() || activeChatUser.userEmail
            : "Admin Messages"}
        </div>
      </div>

      <div className="content">
        {!activeChatUser ? (
          <div className="services-grid" style={{ width: '100%' }}>
            <h2 className="services-header" style={{ color: "#a31224", textAlign: "center" }}>Active Chats</h2>
            {chats.map(chat => (
              <div key={chat.id} className="service-box chat-list-item" onClick={() => setActiveChatUser(chat)}>
                <div className="service-text">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{`${chat.firstName} ${chat.lastName}`.trim() || chat.userEmail}</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>
                      {chat.updatedAt ? formatTime(chat.updatedAt) : ""}
                    </span>
                  </div>
                  <p className="message-preview">{chat.lastMessage || "No messages yet"}</p>
                </div>
                <div className="arrow-link">→</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-chat-container">
            <button className="back-btn" onClick={() => setActiveChatUser(null)}>
              ← Back to Conversations
            </button>
            
            <div className="messages-display">
              {messages.map((m, i) => (
                <div key={i} className={`chat-wrapper ${m.senderId === 'admin' ? 'sent' : 'received'}`}>
                  {m.senderId !== 'admin' && (
                    <span className="sender-label">
                      {activeChatUser.firstName} {activeChatUser.lastName}
                    </span>
                  )}
                  <div className="chat-bubble">
                    {m.text}
                    <div className="message-info">
                      <span className="message-time">{formatTime(m.timestamp)}</span>
                      {m.senderId === 'admin' && (
                         <span className={`message-status-text ${m.status}`}>
                           {m.status === "read" ? "Read" : "Sent"}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-row">
              <input 
                type="text" 
                placeholder="Type your reply..." 
                value={reply} 
                onChange={(e) => setReply(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              />
              <button onClick={handleReply}>➤</button>
            </div>
          </div>
        )}
      </div>
      <AdminNavbar />
    </div>
  );
}