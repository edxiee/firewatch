import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// hide your custom splash once React starts
const splash = document.getElementById("splash-screen");
if (splash) splash.style.display = "none";