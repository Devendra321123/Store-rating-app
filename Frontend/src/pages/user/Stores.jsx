import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import SortableTable from "../../components/SortableTable";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [ratingInput, setRatingInput] = useState({});
  const [message, setMessage] = useState("");

  function fetchStores() {
    const params = new URLSearchParams(search).toString();
    api.get(`/stores?${params}`).then((res) => setStores(res.data));
  }

  useEffect(() => { fetchStores(); }, []);

  async function handleRating(storeId) {
    const value = parseInt(ratingInput[storeId]);
    if (!value || value < 1 || value > 5) {
      setMessage("Rating must be between 1 and 5");
      return;
    }
    try {
      await api.post("/ratings", { storeId, value });
      setMessage("Rating submitted successfully");
      fetchStores();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting rating");
    }
  }

  const columns = [
    { key: "name", label: "Store Name" },
    { key: "address", label: "Address" },
    { key: "averageRating", label: "Overall Rating" },
    { key: "userRating", label: "Your Rating", render: (row) => row.userRating ?? "Not rated" },
    {
      key: "rate", label: "Submit Rating", sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={5}
            value={ratingInput[row.id] ?? ""}
            onChange={(e) => setRatingInput({ ...ratingInput, [row.id]: e.target.value })}
            className="border rounded px-2 py-1 text-sm w-16"
            placeholder="1-5"
          />
          <button
            onClick={() => handleRating(row.id)}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
          >
            {row.userRating ? "Update" : "Submit"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Stores</h1>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

        <div className="bg-white border rounded p-4 mb-4 shadow-sm flex gap-2 items-end">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} className="block border rounded px-2 py-1 text-sm mt-1" placeholder="Search by name" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Address</label>
            <input value={search.address} onChange={(e) => setSearch({ ...search, address: e.target.value })} className="block border rounded px-2 py-1 text-sm mt-1" placeholder="Search by address" />
          </div>
          <button onClick={fetchStores} className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Search</button>
        </div>

        <div className="bg-white border rounded shadow-sm">
          <SortableTable columns={columns} data={stores} />
        </div>
      </div>
    </div>
  );
}
