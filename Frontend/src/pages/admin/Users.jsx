import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import SortableTable from "../../components/SortableTable";
import InputField from "../../components/InputField";
import { validateName, validateEmail, validatePassword, validateAddress } from "../../utils/validate";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");

  function fetchUsers() {
    const params = new URLSearchParams(filters).toString();
    api.get(`/admin/users?${params}`).then((res) => setUsers(res.data));
  }

  useEffect(() => { fetchUsers(); }, []);

  function validate() {
    const e = {};
    e.name = validateName(form.name);
    e.email = validateEmail(form.email);
    e.password = validatePassword(form.password);
    e.address = validateAddress(form.address);
    return e;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setServerMsg("");
    const errs = validate();
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    try {
      await api.post("/admin/users", form);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", address: "", role: "USER" });
      fetchUsers();
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Error creating user");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "role", label: "Role" },
    {
      key: "actions", label: "Actions", sortable: false,
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/users/${row.id}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Users</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add User"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border rounded p-4 mb-4 shadow-sm">
            <h2 className="font-semibold mb-3">Add New User</h2>
            {serverMsg && <p className="text-red-500 text-sm mb-2">{serverMsg}</p>}
            <form onSubmit={handleCreate}>
              <InputField label="Name (20-60 chars)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <InputField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
              <InputField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} />
              <InputField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                Create User
              </button>
            </form>
          </div>
        )}

        <div className="bg-white border rounded p-4 mb-4 shadow-sm">
          <p className="text-sm font-medium mb-2">Filter</p>
          <div className="grid grid-cols-4 gap-2">
            <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} className="border rounded px-2 py-1 text-sm" />
            <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} className="border rounded px-2 py-1 text-sm" />
            <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} className="border rounded px-2 py-1 text-sm" />
            <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className="border rounded px-2 py-1 text-sm">
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <button onClick={fetchUsers} className="mt-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Apply</button>
        </div>

        <div className="bg-white border rounded shadow-sm">
          <SortableTable columns={columns} data={users} />
        </div>
      </div>
    </div>
  );
}
