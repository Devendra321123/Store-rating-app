import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import InputField from "../components/InputField";
import { validateName, validateEmail, validatePassword, validateAddress } from "../utils/validate";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  function validate() {
    const e = {};
    e.name = validateName(form.name);
    e.email = validateEmail(form.email);
    e.password = validatePassword(form.password);
    e.address = validateAddress(form.address);
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <InputField
            label="Name (20-60 characters)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />
          <InputField
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={errors.address}
            required
          />
          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
