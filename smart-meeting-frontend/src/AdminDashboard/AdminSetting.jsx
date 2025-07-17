import React, { useState } from "react";

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-top justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-10 space-y-10"
      >
        <h1 className="text-2xl font-bold text-indigo-700 border-b pb-4">
          Admin Settings
        </h1>

    
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-[#2c2e5f]">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-[#2c2e5f]">
            Change Password
          </h2>

     
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
                Current Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
                New Password
              </label>
              <input
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
                Confirm New Password
              </label>
              <input
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className=" bg-[#ff7954] px-6 py-3 rounded-lg border border-[#ff7954] text-white font-semibold hover:bg-[#7d65fb] hover:text-white transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#7d65fb] text-white font-semibold hover:bg-[#65c7e0] transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
