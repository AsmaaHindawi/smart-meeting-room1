import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
const initialRooms = [
  { id: 1, name: "Room A", capacity: 10, equipment: ["Mic", "Projector"], status: "Available" },
  { id: 2, name: "Room B", capacity: 20, equipment: ["Projector"], status: "Booked" },
  { id: 3, name: "Room C", capacity: 15, equipment: ["Mic"], status: "Maintenance" },
];

export default function ManageRooms() {
  const [rooms, setRooms] = useState(initialRooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  const [form, setForm] = useState({
    name: "",
    capacity: "",
    equipmentMic: false,
    equipmentProjector: false,
    status: "Available",
  });

  const openAddModal = () => {
    setEditRoom(null);
    setForm({ name: "", capacity: "", equipmentMic: false, equipmentProjector: false, status: "Available" });
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditRoom(room);
    setForm({
      name: room.name,
      capacity: room.capacity,
      equipmentMic: room.equipment.includes("Mic"),
      equipmentProjector: room.equipment.includes("Projector"),
      status: room.status,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const equipment = [];
    if (form.equipmentMic) equipment.push("Mic");
    if (form.equipmentProjector) equipment.push("Projector");

    if (editRoom) {
      // update existing
      setRooms((r) =>
        r.map((room) =>
          room.id === editRoom.id ? { ...room, name: form.name, capacity: form.capacity, equipment, status: form.status } : room
        )
      );
    } else {
      // add new
      const newRoom = {
        id: rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1,
        name: form.name,
        capacity: form.capacity,
        equipment,
        status: form.status,
      };
      setRooms((r) => [...r, newRoom]);
    }
    setModalOpen(false);
  };

  const handleDelete = (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms((r) => r.filter((room) => room.id !== roomId));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Manage Rooms</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          <FaPlus />
          Add Room
        </button>
      </div>

      <table className="min-w-full bg-white rounded shadow-md">
        <thead>

          <tr className="bg-indigo-100 text-indigo-700">
            <th className="text-left px-4 py-2">Room Name</th>
            <th className="text-left px-4 py-2">Capacity</th>
            <th className="text-left px-4 py-2">Equipment</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b hover:bg-indigo-50">
              <td className="px-4 py-3">{room.name}</td>
              <td className="px-4 py-3">{room.capacity}</td>
              <td className="px-4 py-3">{room.equipment.join(", ") || "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === "Available"
                      ? "bg-green-200 text-green-800"
                      : room.status === "Booked"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {room.status}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-3">
                <button
                  onClick={() => openEditModal(room)}
                  className="text-indigo-600 hover:text-indigo-900"
                  title="Edit Room"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(room.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete Room"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              title="Close"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              {editRoom ? "Edit Room" : "Add Room"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Room Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />

              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={form.capacity}
                onChange={handleChange}
                required
                min={1}
                className="w-full p-2 border rounded"
              />

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="equipmentMic"
                    checked={form.equipmentMic}
                    onChange={handleChange}
                  />
                  Mic
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="equipmentProjector"
                    checked={form.equipmentProjector}
                    onChange={handleChange}
                  />
                  Projector
                </label>
              </div>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {editRoom ? "Save Changes" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
