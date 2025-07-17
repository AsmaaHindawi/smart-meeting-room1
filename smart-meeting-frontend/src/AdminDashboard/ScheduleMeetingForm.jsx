import { useState } from "react";
import Select from "react-select";
import { FaRedo, FaVideo } from "react-icons/fa";

const rooms = ["Room A", "Room B", "Room C"];

const users = [
  { id: "u1", name: "Alice", email: "alice@example.com" },
  { id: "u2", name: "Bob", email: "bob@example.com" },
  { id: "u3", name: "Carol", email: "carol@example.com" },
  { id: "u4", name: "Dave", email: "dave@example.com" },
];


const userOptions = users.map((user) => ({
  value: user.email,
  label: `${user.name} (${user.email})`,
}));

export default function ScheduleMeetingForm({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    attendees: [],
    room: rooms[0],
    recurring: false,
    video: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAttendeesChange = (selectedOptions) => {
    const selectedEmails = selectedOptions.map((option) => option.value);
    setForm((prev) => ({
      ...prev,
      attendees: selectedEmails,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Meeting booked:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Schedule a Meeting</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Meeting Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-4">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Attendees</label>
            <Select
              isMulti
              name="attendees"
              options={userOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={handleAttendeesChange}
              placeholder="Search & select users..."
            />
          </div>

          <select
            name="room"
            value={form.room}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="recurring"
                checked={form.recurring}
                onChange={handleChange}
              />
              <FaRedo className="text-indigo-600" /> Recurring
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="video"
                checked={form.video}
                onChange={handleChange}
              />
              <FaVideo className="text-indigo-600" /> Video Conferencing
            </label>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium text-sm">Room Availability</label>
            <div className="flex gap-2">
              {rooms.map((room) => (
                <span
                  key={room}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room === form.room
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {room}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded  bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
