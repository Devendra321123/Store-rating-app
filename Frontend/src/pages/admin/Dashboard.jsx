import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Total Stores" value={stats.totalStores} />
            <StatCard label="Total Ratings" value={stats.totalRatings} />
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <a href="/admin/users" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Manage Users</a>
          <a href="/admin/stores" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Manage Stores</a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded p-4 text-center shadow-sm">
      <p className="text-3xl font-bold text-blue-600">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
