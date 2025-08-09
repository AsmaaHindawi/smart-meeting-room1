import { useEffect, useState } from "react";
import axios from "axios";

const apiBase = "http://localhost:8000/api/users";

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    roles: "employee",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null); // For modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(apiBase);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      username: "",
      email: "",
      password: "",
      roles: "employee",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      password: "",
      roles: user.roles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await axios.put(`${apiBase}/${formData.id}`, payload);
      } else {
        await axios.post(apiBase, formData);
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error("Failed to save user:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // NEW: Confirm delete inside modal
  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiBase}/${deleteUserId}`);
      setUsers((prev) => prev.filter((user) => user.id !== deleteUserId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeleteUserId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow space-y-8 relative">
      <h2 className="text-2xl font-bold text-indigo-700 border-b pb-3">
        {isEditing ? "Edit User" : "Add User"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Username *</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-indigo-500"
            placeholder="Username"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-indigo-500"
            placeholder="Email"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Password {isEditing ? "(leave blank to keep)" : "*"}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            {...(!isEditing && { required: true })}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-indigo-500"
            placeholder="Password"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Role *</label>
          <select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-indigo-500"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="flex space-x-4 justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {isEditing ? "Update User" : "Add User"}
          </button>
        </div>
      </form>

      <hr />

      <h3 className="text-xl font-semibold text-indigo-700 mb-4">Users List</h3>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-indigo-100 text-indigo-700">
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-indigo-50">
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2 capitalize">{user.roles}</td>
              <td className="border border-gray-300 px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteUserId(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
    {/* Delete Modal (React) */}
{deleteUserId !== null && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete User</h3>
      <p className="text-gray-700 mb-6">Are you sure you want to delete this user?</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setDeleteUserId(null)}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
