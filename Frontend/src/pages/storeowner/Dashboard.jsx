import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import SortableTable from "../../components/SortableTable";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/my-store").then((res) => setData(res.data));
  }, []);

  const columns = [
    { key: "userName", label: "User Name" },
    { key: "userEmail", label: "User Email" },
    { key: "value", label: "Rating" },
  ];

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-2">{data.store.name}</h1>
        <p className="text-gray-600 text-sm mb-1">{data.store.address}</p>
        <p className="text-lg font-semibold text-blue-600 mb-6">
          Average Rating: {data.averageRating} / 5 ({data.ratings.length} ratings)
        </p>

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Ratings Received</h2>
          <Link to="/owner/password" className="text-sm text-blue-600 hover:underline">Change Password</Link>
        </div>

        <div className="bg-white border rounded shadow-sm">
          <SortableTable columns={columns} data={data.ratings} />
        </div>
      </div>
    </div>
  );
}
