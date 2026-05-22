import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import SortableTable from "../../components/SortableTable";
import InputField from "../../components/InputField";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [serverMsg, setServerMsg] = useState("");

  function fetchStores() {
    const params = new URLSearchParams(filters).toString();
    api.get(`/admin/stores?${params}`).then((res) => setStores(res.data));
  }

  useEffect(() => { fetchStores(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setServerMsg("");
    try {
      await api.post("/admin/stores", form);
      setShowForm(false);
      setForm({ name: "", email: "", address: "", ownerId: "" });
      fetchStores();
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Error creating store");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "averageRating", label: "Rating" },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Stores</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            {showForm ? "Cancel" : "Add Store"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border rounded p-4 mb-4 shadow-sm">
            <h2 className="font-semibold mb-3">Add New Store</h2>
            {serverMsg && <p className="text-red-500 text-sm mb-2">{serverMsg}</p>}
            <form onSubmit={handleCreate}>
              <InputField label="Store Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <InputField label="Store Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <InputField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              <InputField label="Owner ID (User ID of Store Owner)" value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} required />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Create Store</button>
            </form>
          </div>
        )}

        <div className="bg-white border rounded p-4 mb-4 shadow-sm">
          <p className="text-sm font-medium mb-2">Filter</p>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="border rounded px-2 py-1 text-sm" />
            <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} className="border rounded px-2 py-1 text-sm" />
            <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} className="border rounded px-2 py-1 text-sm" />
          </div>
          <button onClick={fetchStores} className="mt-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Apply</button>
        </div>

        <div className="bg-white border rounded shadow-sm">
          <SortableTable columns={columns} data={stores} />
        </div>
      </div>
    </div>
  );
}
