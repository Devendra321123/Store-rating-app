import React, { useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import InputField from "../../components/InputField";
import { validatePassword } from "../../utils/validate";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    const err = validatePassword(newPassword);
    if (err) { setError(err); return; }
    try {
      await api.put("/users/password", { newPassword });
      setMessage("Password updated successfully");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-sm mx-auto">
        <div className="bg-white border rounded shadow-sm p-6">
          <h1 className="text-xl font-bold mb-4">Update Password</h1>
          {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
          <form onSubmit={handleSubmit}>
            <InputField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={error}
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
