import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import AdminStores from "./pages/admin/Stores";
import UserStores from "./pages/user/Stores";
import UpdatePassword from "./pages/user/UpdatePassword";
import OwnerDashboard from "./pages/storeowner/Dashboard";

// Protects routes based on allowed roles
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<PrivateRoute roles={["ADMIN"]}><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute roles={["ADMIN"]}><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/users/:id" element={<PrivateRoute roles={["ADMIN"]}><UserDetail /></PrivateRoute>} />
      <Route path="/admin/stores" element={<PrivateRoute roles={["ADMIN"]}><AdminStores /></PrivateRoute>} />

      {/* Normal user routes */}
      <Route path="/user/stores" element={<PrivateRoute roles={["USER"]}><UserStores /></PrivateRoute>} />
      <Route path="/user/password" element={<PrivateRoute roles={["USER"]}><UpdatePassword /></PrivateRoute>} />

      {/* Store owner routes */}
      <Route path="/owner/dashboard" element={<PrivateRoute roles={["STORE_OWNER"]}><OwnerDashboard /></PrivateRoute>} />
      <Route path="/owner/password" element={<PrivateRoute roles={["STORE_OWNER"]}><UpdatePassword /></PrivateRoute>} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
