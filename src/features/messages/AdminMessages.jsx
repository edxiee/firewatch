import React, { useState, useEffect, useRef } from "react";
import { db } from "../../services/firebase.js";
import {
  collection, onSnapshot, query, orderBy, addDoc,
  serverTimestamp, doc, updateDoc, getDoc, getDocs
} from "firebase/firestore";
import AdminNavbar from "../../components/navigation/AdminNavBar.jsx";
import "./AdminMessages.css";

// --- SVG ICONS ---
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const CheckDoubleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
    <polyline points="22 8 11 19" style={{opacity: 0.6}}></polyline>
  </svg>
);

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

  // --- DATE & TIME HELPERS ---
  const formatTime = (ts) => {
    if (!ts) return "";
    return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDivider = (ts) => {
    if (!ts) return "";
    const date = ts.toDate();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderMessages = () => {
    let lastDate = null;
    return messages.map((m, i) => {
      const messageDate = m.timestamp?.toDate().toDateString();
      const showDivider = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <React.Fragment key={m.id || i}>
          {showDivider && m.timestamp && (
            <div className="admin-messages-date-divider">
              <span>{formatDateDivider(m.timestamp)}</span>
            </div>
          )}
          <div className={`admin-messages-chat-wrapper ${m.senderId === 'admin' ? 'sent' : 'received'}`}>
            <div className="admin-messages-chat-bubble">
              <span className="admin-messages-bubble-text">{m.text}</span>
              <div className="admin-messages-message-info">
                <span className="admin-messages-message-time">{formatTime(m.timestamp)}</span>
                {m.senderId === 'admin' && (
                  <span className={`admin-messages-message-status ${m.status}`}>
                    <CheckDoubleIcon />
                  </span>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="admin-messages">
      {/* TOP BAR - Matches Dashboard & Notifications */}
      <div className="admin-messages-top-bar">
        <img className="admin-messages-logo" src="/Logo.png" alt="FireWatch Logo" />
        <div className="admin-messages-title">
          {activeChatUser
            ? `${activeChatUser.firstName} ${activeChatUser.lastName}`.trim() || activeChatUser.userEmail
            : "Messages"
          }
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-messages-content">
        {!activeChatUser ? (
          <div className="admin-messages-chat-list">
            <div className="admin-messages-list-header">
              <MessageIcon />
              <h2>Active Chats</h2>
            </div>

            {chats.length === 0 ? (
              <div className="admin-messages-empty-state">
                <MessageIcon />
                <p>No active conversations</p>
                <span>Messages from users will appear here</span>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  className={`admin-messages-chat-item ${chat.unreadCount > 0 ? "is-unread" : ""}`}
                  onClick={() => setActiveChatUser(chat)}
                >
                  <div className="admin-messages-chat-info">
                    <div className="admin-messages-chat-header">
                      <h3 className={chat.unreadCount > 0 ? "admin-messages-unread-name" : ""}>
                        {`${chat.firstName} ${chat.lastName}`.trim() || chat.userEmail}
                      </h3>
                      <div className="admin-messages-chat-meta">
                        {chat.unreadCount > 0 && (
                          <span className="admin-messages-unread-badge">{chat.unreadCount}</span>
                        )}
                        <span className="admin-messages-time">{chat.updatedAt ? formatTime(chat.updatedAt) : ""}</span>
                      </div>
                    </div>
                    <p className={`admin-messages-preview ${chat.unreadCount > 0 ? "admin-messages-unread-preview" : ""}`}>
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  <div className="admin-messages-arrow">→</div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="admin-messages-conversation">
            <button className="admin-messages-back-btn" onClick={() => setActiveChatUser(null)}>
              <BackIcon />
              <span>Back</span>
            </button>

            <div className="admin-messages-list">
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER - Reply Input */}
      {activeChatUser && (
        <div className="admin-messages-footer">
          <div className="admin-messages-input-row">
            <input
              type="text"
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleReply()}
            />
            <button type="button" onClick={handleReply} className="admin-messages-send-btn">
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <AdminNavbar />
    </div>
  );
}