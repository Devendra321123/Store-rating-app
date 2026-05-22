import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Show change password link for USER and STORE_OWNER
  const passwordPath = user?.role === "USER" ? "/user/password" : "/owner/password";
  const showPasswordLink = user?.role === "USER" || user?.role === "STORE_OWNER";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <span className="font-bold text-lg">Store Rating App</span>
      <div className="flex items-center gap-4">
        {showPasswordLink && (
          <Link to={passwordPath} className="text-sm hover:underline">
            Change Password
          </Link>
        )}
        <span className="text-sm">{user?.name} ({user?.role})</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
