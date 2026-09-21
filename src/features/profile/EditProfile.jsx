import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase.js";

import AdminNavbar from "../../components/navigation/AdminNavBar.jsx";

import "./EditProfile.css";


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


const CameraIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      d="
        M14.5 4
        16 6
        H20
        A2 2 0 0 1 22 8
        V19
        A2 2 0 0 1 20 21
        H4
        A2 2 0 0 1 2 19
        V8
        A2 2 0 0 1 4 6
        H8
        L9.5 4
        Z
      "
    />

    <circle
      cx="12"
      cy="13"
      r="4"
    />
  </svg>
);


const UserCircleIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="8"
      r="4"
    />

    <path
      d="M4 21a8 8 0 0 1 16 0"
    />
  </svg>
);


/* =========================================
   EDIT PROFILE
   ========================================= */

export default function EditProfile() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);


  /* =========================================
     FETCH PROFILE
     ========================================= */

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return;
      }

      try {
        const userDoc = await getDoc(
          doc(db, "users", user.uid)
        );

        if (userDoc.exists()) {
          const data = userDoc.data();

          const fullName = data.lastName
            ? `${data.firstName || ""} ${data.lastName}`.trim()
            : data.firstName || "Admin";

          setName(fullName);

          setPhone(
            data.contactNumber || ""
          );

          setAddress(
            data.address || ""
          );

          setPreviewUrl(
            data.profileImage || ""
          );
        }
      } catch (error) {
        console.error(
          "[FireWatch] Failed to load profile:",
          error
        );
      }
    };

    fetchUserData();
  }, [user]);


  /* =========================================
     IMAGE SELECTION
     ========================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }

    /*
      Firestore documents have a 1MB limit.
      Existing implementation stores the
      image as Base64.
    */
    if (file.size > 800000) {
      alert(
        "Image is too large. Please select an image under 800KB."
      );

      e.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };


  /* =========================================
     OPEN FILE PICKER
     ========================================= */

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  /* =========================================
     UPDATE PROFILE
     ========================================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(
        "You must be logged in to update your profile."
      );

      return;
    }

    setLoading(true);

    try {
      await updateDoc(
        doc(db, "users", user.uid),
        {
          contactNumber: phone,
          address: address,
          profileImage: previewUrl,
        }
      );

      alert(
        "Profile updated successfully!"
      );

      navigate("/admin/profile");
    } catch (error) {
      console.error(
        "[FireWatch] Update profile error:",
        error
      );

      alert(
        "Error: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     RENDER
     ========================================= */

  return (
    <div className="admin-edit-profile">

      {/* =========================
          TOP BAR
          ========================= */}

      <header className="admin-edit-profile-top-bar">

        <button
          type="button"
          className="admin-edit-profile-back-btn"
          onClick={() =>
            navigate("/admin/profile")
          }
          aria-label="Back to Admin Profile"
          title="Back to Profile"
        >
          <BackIcon />
        </button>


        <img
          className="admin-edit-profile-logo"
          src="/Logo.png"
          alt="FireWatch Logo"
        />


        <div className="admin-edit-profile-title">
          Edit Profile
        </div>

      </header>


      {/* =========================
          MAIN CONTENT
          ========================= */}

      <main className="admin-edit-profile-content">


        {/* =========================
            PROFILE PHOTO
            ========================= */}

        <section className="admin-edit-profile-header-card">

          <div className="admin-edit-profile-avatar-container">


            <div className="admin-edit-profile-avatar-img">

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Admin profile"
                  className="admin-edit-profile-img-preview"
                />
              ) : (
                <UserCircleIcon />
              )}

            </div>


            {/* Hidden File Input */}

            <input
              ref={fileInputRef}
              className="admin-edit-profile-file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />


            {/* Camera Button */}

            <button
              type="button"
              className="admin-edit-profile-change-photo-btn"
              onClick={handleCameraClick}
              aria-label="Upload profile picture"
              title="Change profile picture"
            >
              <CameraIcon />
            </button>

          </div>


          <p className="admin-edit-profile-photo-hint">
            Click the camera icon to change your profile picture
          </p>

        </section>


        {/* =========================
            FORM CARD
            ========================= */}

        <section className="admin-edit-profile-form-card">

          <form
            onSubmit={handleUpdate}
            className="admin-edit-profile-form"
          >


            {/* FULL NAME */}

            <div className="admin-edit-profile-input-group">

              <label
                className="admin-edit-profile-label"
                htmlFor="admin-profile-name"
              >
                Full Name
              </label>

              <input
                id="admin-profile-name"
                type="text"
                className="admin-edit-profile-input disabled"
                value={name}
                disabled
              />

            </div>


            {/* EMAIL */}

            <div className="admin-edit-profile-input-group">

              <label
                className="admin-edit-profile-label"
                htmlFor="admin-profile-email"
              >
                Email Address
              </label>

              <input
                id="admin-profile-email"
                type="email"
                className="admin-edit-profile-input disabled"
                value={user?.email || ""}
                disabled
              />

            </div>


            {/* CONTACT */}

            <div className="admin-edit-profile-input-group">

              <label
                className="admin-edit-profile-label"
                htmlFor="admin-profile-phone"
              >
                Contact Number
              </label>

              <input
                id="admin-profile-phone"
                type="tel"
                className="admin-edit-profile-input"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="0912 345 6789"
              />

            </div>


            {/* ADDRESS */}

            <div className="admin-edit-profile-input-group">

              <label
                className="admin-edit-profile-label"
                htmlFor="admin-profile-address"
              >
                Home Address
              </label>

              <textarea
                id="admin-profile-address"
                className="
                  admin-edit-profile-input
                  admin-edit-profile-textarea
                "
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Enter complete home address"
                rows="3"
              />

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="admin-edit-profile-save-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Save Changes"}
            </button>

          </form>

        </section>

      </main>


      {/* =========================
          ADMIN NAVBAR
          ========================= */}

      <AdminNavbar />

    </div>
  );
}