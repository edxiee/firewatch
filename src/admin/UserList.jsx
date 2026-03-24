import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import AdminNavbar from "./AdminNavbar.jsx";
import "./UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Real-time listener for the users collection
    const q = query(collection(db, "users"), orderBy("firstName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  const deleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "users", id));
        alert("User deleted successfully.");
      } catch (error) {
        alert("Error deleting user: " + error.message);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homescreen">
      <div className="top-bar">
        <div className="top-title">User Management</div>
      </div>

      <div className="content">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-list">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <p className="user-name">{user.firstName} {user.lastName}</p>
                <p className="user-email">{user.email}</p>
                <span className={`role-tag ${user.role}`}>{user.role || "user"}</span>
              </div>
              <button 
                className="delete-btn" 
                onClick={() => deleteUser(user.id, user.firstName)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
      <AdminNavbar />
    </div>
  );
}