import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../../services/firebase.js";
import AdminNavbar from "../../../components/navigation/AdminNavBar.jsx";

import "./UserList.css";


/* =========================================
   ICONS
   ========================================= */

const BackIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line
      x1="19"
      y1="12"
      x2="5"
      y2="12"
    />

    <polyline
      points="12 19 5 12 12 5"
    />
  </svg>
);


const SearchIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle
      cx="11"
      cy="11"
      r="8"
    />

    <line
      x1="21"
      y1="21"
      x2="16.65"
      y2="16.65"
    />
  </svg>
);


const TrashIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline
      points="3 6 5 6 21 6"
    />

    <path
      d="
        M19 6
        v14
        a2 2 0 0 1-2 2
        H7
        a2 2 0 0 1-2-2
        V6
        m3 0
        V4
        a2 2 0 0 1 2-2
        h4
        a2 2 0 0 1 2 2
        v2
      "
    />

    <line
      x1="10"
      y1="11"
      x2="10"
      y2="17"
    />

    <line
      x1="14"
      y1="11"
      x2="14"
      y2="17"
    />
  </svg>
);


const UserIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      d="
        M20 21
        v-2
        a4 4 0 0 0-4-4
        H8
        a4 4 0 0 0-4 4
        v2
      "
    />

    <circle
      cx="12"
      cy="7"
      r="4"
    />
  </svg>
);


/* =========================================
   USER LIST
   ========================================= */

export default function UserList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");


  /* =========================================
     LOAD USERS
     ========================================= */

  useEffect(() => {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("firstName", "asc")
    );

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const userList = snapshot.docs.map(
          (userDoc) => ({
            id: userDoc.id,
            ...userDoc.data(),
          })
        );

        setUsers(userList);
      },
      (error) => {
        console.error(
          "[FireWatch] User list listener error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);


  /* =========================================
     DELETE USER
     ========================================= */

  const deleteUser = async (id, name) => {
    const displayName = name || "this user";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${displayName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "users", id)
      );

      alert(
        "User deleted successfully."
      );
    } catch (error) {
      console.error(
        "[FireWatch] Delete user error:",
        error
      );

      alert(
        "Error deleting user: " + error.message
      );
    }
  };


  /* =========================================
     FILTER USERS
     ========================================= */

  const normalizedSearch =
    searchTerm.toLowerCase().trim();

  const filteredUsers = users.filter(
    (user) => {
      const firstName =
        user.firstName?.toLowerCase() || "";

      const lastName =
        user.lastName?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const role =
        user.role || "user";

      const matchesSearch =
        firstName.includes(normalizedSearch) ||
        lastName.includes(normalizedSearch) ||
        email.includes(normalizedSearch);

      const matchesRole =
        filter === "all"
          ? true
          : role === filter;

      return matchesSearch && matchesRole;
    }
  );


  /* =========================================
     RENDER
     ========================================= */

  return (
    <div className="admin-user-list">

      {/* =========================
          TOP BAR
          ========================= */}

      <header className="admin-user-list-top-bar">

        <button
          type="button"
          className="admin-user-list-back-btn"
          onClick={() => navigate("/admin")}
          aria-label="Back to Admin Dashboard"
          title="Back to Dashboard"
        >
          <BackIcon />
        </button>


        <img
          className="admin-user-list-logo"
          src="/Logo.png"
          alt="FireWatch Logo"
        />


        <div className="admin-user-list-title">
          User Management
        </div>

      </header>


      {/* =========================
          CONTENT
          ========================= */}

      <main className="admin-user-list-content">


        {/* =========================
            SEARCH + FILTERS
            ========================= */}

        <section className="admin-user-list-controls">

          <div className="admin-user-list-search-wrapper">

            <SearchIcon />

            <input
              type="search"
              className="admin-user-list-search-input"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              aria-label="Search users"
            />

          </div>


          <div
            className="admin-user-list-filter-chips"
            aria-label="Filter users by role"
          >

            <button
              type="button"
              className={`admin-user-list-chip ${
                filter === "all"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </button>


            <button
              type="button"
              className={`admin-user-list-chip ${
                filter === "admin"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("admin")
              }
            >
              Admins
            </button>


            <button
              type="button"
              className={`admin-user-list-chip ${
                filter === "user"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFilter("user")
              }
            >
              Users
            </button>

          </div>

        </section>


        {/* =========================
            USER CARDS
            ========================= */}

        <section className="admin-user-list-container">

          {filteredUsers.length > 0 ? (

            filteredUsers.map((user) => {

              const role =
                user.role || "user";

              const displayName =
                `${user.firstName || ""} ${
                  user.lastName || ""
                }`.trim() ||
                "Unnamed User";

              const avatarLetter =
                (
                  user.firstName?.[0] ||
                  user.email?.[0] ||
                  "U"
                ).toUpperCase();


              return (
                <article
                  key={user.id}
                  className="admin-user-list-card"
                >

                  <div className="admin-user-list-card-info">

                    <div
                      className="admin-user-list-avatar"
                      aria-hidden="true"
                    >
                      {avatarLetter}
                    </div>


                    <div className="admin-user-list-details">

                      <p className="admin-user-list-name">
                        {displayName}
                      </p>


                      <p className="admin-user-list-email">
                        {user.email ||
                          "No email available"}
                      </p>


                      <span
                        className={`admin-user-list-role-tag ${role}`}
                      >
                        {role}
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="admin-user-list-delete-btn"
                    onClick={() =>
                      deleteUser(
                        user.id,
                        displayName
                      )
                    }
                    aria-label={`Delete ${displayName}`}
                    title="Delete User"
                  >
                    <TrashIcon />
                  </button>

                </article>
              );
            })

          ) : (

            <div className="admin-user-list-empty">

              <UserIcon />

              <p>
                No users found
              </p>

              <span>
                Try adjusting your search or filter.
              </span>

            </div>

          )}

        </section>

      </main>


      {/* =========================
          ADMIN NAVIGATION
          ========================= */}

      <AdminNavbar />

    </div>
  );
}