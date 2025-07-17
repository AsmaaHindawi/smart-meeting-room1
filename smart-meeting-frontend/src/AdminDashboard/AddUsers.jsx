import { useState } from "react";

export default function AddUsers() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    status: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="  flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-30% bg-white p-8 rounded-xl shadow-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-indigo-700  border-b pb-4">
          Add User
        </h2>

        <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
            Name <span className="text-[#ff7954]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
            required
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
            Email <span className="text-[#ff7954]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
            required
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
            Password <span className="text-[#ff7954]">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
            required
          />
        </div>

        <div>
              <label className="block text-sm font-medium text-[#2c2e5f] mb-2">
            Role <span className="text-[#ff7954]">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#7d65fb] focus:outline-none"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
            <option value="User">User</option>
          </select>
        </div>

      

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-[#ff7954] px-6 py-3 rounded-lg border border-[#ff7954] text-white font-semibold hover:bg-[#7d65fb] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-[#7d65fb] text-white hover:bg-[#65c7e0] transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
