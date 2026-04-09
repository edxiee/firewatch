import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase"; 
import { 
  collection, onSnapshot, query, orderBy, addDoc, 
  serverTimestamp, doc, updateDoc, getDoc, getDocs 
} from "firebase/firestore";
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chats"), async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        const userId = chatDoc.id;

        const msgsRef = collection(db, "chats", userId, "messages");
        const msgsSnap = await getDocs(msgsRef);
        const unreadCount = msgsSnap.docs.filter(d => {
          const m = d.data();
          return m.senderId !== "admin" && m.status !== "read";
        }).length;

        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        return {
          id: userId,
          ...chatData,
          unreadCount,
          firstName: userData.firstName || "User",
          lastName: userData.lastName || "",
          userEmail: chatData.userEmail || userData.email
        };
      });

      const chatList = await Promise.all(chatPromises);
      setChats(chatList.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0)));
    });

    return () => unsubscribe();
  }, []);

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
    <div className="chat-layout-wrapper">
      <header className="top-bar">
        <div className="top-title">
          {activeChatUser 
            ? `${activeChatUser.firstName} ${activeChatUser.lastName}`.trim() || activeChatUser.userEmail
            : "Messages"}
        </div>
      </header>

      <main className="chat-content-area">
        {!activeChatUser ? (
          <div className="services-grid" style={{ width: '100%' }}>
            <h2 className="services-header" style={{ color: "#a31224", textAlign: "center" }}>Active Chats</h2>
            {chats.map(chat => (
              <div 
                key={chat.id} 
                className={`service-box chat-list-item ${chat.unreadCount > 0 ? "is-unread" : ""}`} 
                onClick={() => setActiveChatUser(chat)}
              >
                <div className="service-text">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className={chat.unreadCount > 0 ? "bold-text" : ""}>
                      {`${chat.firstName} ${chat.lastName}`.trim() || chat.userEmail}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
                      <span className="time-label">{chat.updatedAt ? formatTime(chat.updatedAt) : ""}</span>
                    </div>
                  </div>
                  <p className={`message-preview ${chat.unreadCount > 0 ? "bold-preview" : ""}`}>
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
                <div className="arrow-link">→</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="messages-container">
            <button className="back-btn" onClick={() => setActiveChatUser(null)}>← Back</button>
            {messages.map((m, i) => (
              <div key={m.id || i} className={`chat-wrapper ${m.senderId === 'admin' ? 'sent' : 'received'}`}>
                <div className="chat-bubble">
                  {/* Wrap text in a span to keep it separate from metadata */}
                  <span className="bubble-text">{m.text}</span>
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
        )}
      </main>

      <footer className="chat-footer-sticky">
        {activeChatUser && (
          <div className="chat-input-row">
            <input 
              type="text" 
              placeholder="Type your reply..." 
              value={reply} 
              onChange={(e) => setReply(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
            />
            <button type="button" onClick={handleReply}>➤</button>
          </div>
        )}
        <AdminNavbar /> 
      </footer>
    </div>
  );
}