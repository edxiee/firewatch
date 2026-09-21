import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../services/firebase.js";
import UserNavBar from "../../components/navigation/UserNavBar.jsx";
import "./Message.css";


/* =========================================
   SVG ICONS
   ========================================= */

const MessageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);


const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);


const CheckDoubleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
    <polyline points="22 8 11 19" opacity="0.6" />
  </svg>
);


/* =========================================
   DATE / TIME HELPERS
   ========================================= */

const formatTime = (timestamp) => {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "";
  }

  try {
    return timestamp.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};


const formatDateDivider = (timestamp) => {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "";
  }

  try {
    const date = timestamp.toDate();

    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};


/* =========================================
   MESSAGE SCREEN
   ========================================= */

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messageError, setMessageError] = useState("");

  const messagesEndRef = useRef(null);


  /* =========================================
     AUTH STATE
     ========================================= */

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);

      if (!user) {
        setMessages([]);
        setIsLoadingMessages(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);


  /* =========================================
     AUTO SCROLL
     ========================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);


  /* =========================================
     REAL-TIME MESSAGES
     ========================================= */

  useEffect(() => {
    if (!currentUser) {
      return undefined;
    }

    setIsLoadingMessages(true);
    setMessageError("");

    const messagesQuery = query(
      collection(db, "chats", currentUser.uid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribeMessages = onSnapshot(
      messagesQuery,

      (snapshot) => {
        const nextMessages = snapshot.docs.map((messageDoc) => ({
          id: messageDoc.id,
          ...messageDoc.data(),
        }));

        setMessages(nextMessages);
        setMessageError("");
        setIsLoadingMessages(false);
      },

      (error) => {
        console.error("[FireWatch] Message listener error:", error);

        setMessageError(
          "We could not load the conversation. Please check your connection and try again."
        );

        setIsLoadingMessages(false);
      }
    );

    return () => {
      unsubscribeMessages();
    };
  }, [currentUser]);


  /* =========================================
     SEND MESSAGE
     ========================================= */

  const handleSendMessage = async () => {
    const trimmedMessage = inputText.trim();

    if (!trimmedMessage || !currentUser || isSending) {
      return;
    }

    const textToSend = trimmedMessage;

    setInputText("");
    setIsSending(true);
    setMessageError("");

    try {
      const userDoc = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      const userData = userDoc.exists()
        ? userDoc.data()
        : {};

      await setDoc(
        doc(db, "chats", currentUser.uid),
        {
          userEmail: currentUser.email,
          firstName: userData.firstName || "User",
          lastName: userData.lastName || "",
          lastMessage: textToSend,
          updatedAt: serverTimestamp(),
          unread: true,
        },
        {
          merge: true,
        }
      );

      await addDoc(
        collection(
          db,
          "chats",
          currentUser.uid,
          "messages"
        ),
        {
          text: textToSend,
          senderId: currentUser.uid,
          timestamp: serverTimestamp(),
          status: "sent",
        }
      );
    } catch (error) {
      console.error("[FireWatch] Error sending message:", error);

      setInputText(textToSend);

      setMessageError(
        "Your message could not be sent. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };


  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };


  /* =========================================
     MESSAGE LIST
     ========================================= */

  const renderMessages = () => {
    let lastDate = null;

    return messages.map((message, index) => {
      const messageDate =
        message.timestamp &&
        typeof message.timestamp.toDate === "function"
          ? message.timestamp.toDate().toDateString()
          : null;

      const showDateDivider =
        messageDate &&
        messageDate !== lastDate;

      if (messageDate) {
        lastDate = messageDate;
      }

      const isSentByUser =
        message.senderId === currentUser?.uid;

      return (
        <React.Fragment key={message.id || index}>

          {showDateDivider && (
            <div className="user-message-date-divider">
              <span>
                {formatDateDivider(message.timestamp)}
              </span>
            </div>
          )}


          <div
            className={`user-message-chat-wrapper ${
              isSentByUser
                ? "sent"
                : "received"
            }`}
          >
            <div className="user-message-chat-bubble">

              <span className="user-message-bubble-text">
                {message.text}
              </span>


              <div className="user-message-message-info">

                <span className="user-message-message-time">
                  {formatTime(message.timestamp)}
                </span>


                {isSentByUser && (
                  <span
                    className={`user-message-message-status ${
                      message.status === "read"
                        ? "read"
                        : ""
                    }`}
                    title={
                      message.status === "read"
                        ? "Read"
                        : "Sent"
                    }
                  >
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


  /* =========================================
     RENDER
     ========================================= */

  return (
    <div className="user-message-screen">

      <header className="user-message-top-bar">
        <img
          className="user-message-logo"
          src="/Logo.png"
          alt="FireWatch Logo"
        />

        <div className="user-message-title">
          Chat Support
        </div>
      </header>


      <main className="user-message-content">

        <div className="user-message-conversation-header">
          <MessageIcon />

          <div>
            <h1>FireWatch Support</h1>

            <p>
              Send a message to the FireWatch response team.
            </p>
          </div>
        </div>


        <section
          className="user-message-list"
          aria-label="FireWatch support conversation"
          aria-live="polite"
        >

          {isLoadingMessages && (
            <div className="user-message-empty-state">
              <MessageIcon />

              <p>Loading conversation</p>

              <span>
                Please wait while we retrieve your messages.
              </span>
            </div>
          )}


          {!isLoadingMessages &&
            !messageError &&
            messages.length === 0 && (
              <div className="user-message-empty-state">
                <MessageIcon />

                <p>No messages yet</p>

                <span>
                  Send a message below to start a conversation.
                </span>
              </div>
            )}


          {!isLoadingMessages && renderMessages()}


          <div ref={messagesEndRef} />

        </section>

      </main>


      <div className="user-message-footer">

        <div className="user-message-footer-inner">

          {messageError && (
            <div
              className="user-message-error"
              role="status"
            >
              {messageError}
            </div>
          )}


          <div className="user-message-input-row">

            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(event) =>
                setInputText(event.target.value)
              }
              onKeyDown={handleInputKeyDown}
              disabled={!currentUser || isSending}
              aria-label="Message"
            />


            <button
              type="button"
              onClick={handleSendMessage}
              className="user-message-send-btn"
              disabled={
                !currentUser ||
                isSending ||
                !inputText.trim()
              }
              aria-label={
                isSending
                  ? "Sending message"
                  : "Send message"
              }
            >
              {isSending ? (
                <span className="user-message-sending">
                  ...
                </span>
              ) : (
                <SendIcon />
              )}
            </button>

          </div>

        </div>

      </div>


      <UserNavBar />
    </div>
  );
}
