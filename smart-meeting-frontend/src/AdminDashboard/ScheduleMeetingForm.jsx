import { useEffect, useState } from "react";
import Select from "react-select";
import { FaRedo, FaVideo } from "react-icons/fa";

export default function ScheduleMeetingForm({ onClose, initialData, onSubmit }) {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorRooms, setErrorRooms] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    attendees: [],
    room_id: null,
    recurring: false,
    video: false,
  });

  // Fetch Rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:8000/api/rooms");
        if (!res.ok) throw new Error(`Error fetching rooms: ${res.statusText}`);
        const data = await res.json();
        setRooms(data);
        setErrorRooms(null);
      } catch (err) {
        setErrorRooms(err.message);
      } finally {
        setLoadingRooms(false);
      }
    }
    fetchRooms();
  }, []);

  // Fetch Users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:8000/api/users");
        if (!res.ok) throw new Error(`Error fetching users: ${res.statusText}`);
        const data = await res.json();
        setUsers(data);
        setErrorUsers(null);
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  // Populate form for editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        date: initialData.date || "",
        time: initialData.time || "",
        duration: initialData.duration || "",
        attendees: initialData.attendees?.map(a => a.id) || [],
        room_id: initialData.room_id || null,
        recurring: initialData.recurring || false,
        video: initialData.video || false,
      });
    } else if (!loadingRooms && rooms.length > 0) {
      setForm((f) => ({ ...f, room_id: rooms[0].id }));
    }
  }, [initialData, loadingRooms, rooms]);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.username} (${user.email})`,
  }));

  const roomOptions = rooms.map((room) => (
    <option key={room.id} value={room.id} style={{ color: "black" }}>
      {room.location}
    </option>
  ));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAttendeesChange = (selectedOptions) => {
    const selectedUserIds = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setForm((prev) => ({
      ...prev,
      attendees: selectedUserIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      date: form.date,
      time: form.time,
      duration: Number(form.duration),
      attendees: form.attendees,
      room_id: Number(form.room_id),
      recurring: form.recurring,
      video: form.video,
    };

    if (typeof onSubmit === "function") {
      try {
        await onSubmit(payload);
        setSuccessMessage(initialData ? "Meeting updated successfully!" : "Meeting booked successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    }
  };

  const selectedAttendees = userOptions.filter((opt) => form.attendees.includes(opt.value));

  if (loadingRooms || loadingUsers)
    return <div className="p-6 text-center">Loading...</div>;

  if (errorRooms || errorUsers)
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error loading data:</p>
        {errorRooms && <p>Rooms: {errorRooms}</p>}
        {errorUsers && <p>Users: {errorUsers}</p>}
      </div>
    );

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500"
          aria-label="Close form"
        >
          ✕
        </button>

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          {initialData ? "Edit Meeting" : "Schedule a Meeting"}
        </h2>

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
            placeholder="Duration (hours)"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            min={1}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Attendees
            </label>
            <Select
              isMulti
              name="attendees"
              options={userOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={handleAttendeesChange}
              value={selectedAttendees}
              placeholder="Search & select users..."
            />
          </div>

          <select
            name="room_id"
            value={form.room_id || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black bg-white"
            required
          >
            {roomOptions}
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

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {initialData ? "Save Changes" : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
