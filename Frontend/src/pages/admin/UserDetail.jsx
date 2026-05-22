import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm mb-4 block">
          Back
        </button>
        <div className="bg-white border rounded shadow-sm p-6">
          <h1 className="text-xl font-bold mb-4">User Details</h1>
          <Detail label="Name" value={user.name} />
          <Detail label="Email" value={user.email} />
          <Detail label="Address" value={user.address} />
          <Detail label="Role" value={user.role} />
          {user.role === "STORE_OWNER" && (
            <Detail
              label="Store Average Rating"
              value={user.storeRating !== null ? `${user.storeRating} / 5` : "No ratings yet"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="mb-3">
      <span className="text-sm text-gray-500">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
