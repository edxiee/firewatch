import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./UserNavBar.css";


/* =========================================
   USER BOTTOM NAVIGATION
   ========================================= */

export default function UserNavBar() {
  const navigate = useNavigate();
  const location = useLocation();


  const isActive = (path) =>
    location.pathname === path;


  const navItems = [
    {
      path: "/home",
      label: "Home",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
        </svg>
      ),
    },

    {
      path: "/emergency",
      label: "Emergency",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      ),
    },

    {
      path: "/message",
      label: "Messages",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },

    {
      path: "/notification",
      label: "Notifications",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" />
        </svg>
      ),
    },

    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="8"
            r="4"
          />

          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      ),
    },
  ];


  return (
    <nav
      className="user-bottom-nav"
      aria-label="User navigation"
    >
      <div className="user-bottom-nav-inner">

        {navItems.map((item) => {

          const active =
            isActive(item.path);

          return (
            <button
              key={item.path}
              type="button"
              className={`user-bottom-nav-button ${
                active ? "is-active" : ""
              }`}
              onClick={() =>
                navigate(item.path)
              }
              aria-label={item.label}
              aria-current={
                active ? "page" : undefined
              }
              title={item.label}
            >

              <span className="user-bottom-nav-icon">
                {item.icon}
              </span>

              <span className="user-bottom-nav-label">
                {item.label}
              </span>

            </button>
          );
        })}

      </div>
    </nav>
  );
}