import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import api from "../api"; // <-- use the centralized, tokened client

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  // State to handle delete confirmation modal
  const [deleteConfirmRoomId, setDeleteConfirmRoomId] = useState(null);

  const [form, setForm] = useState({
    location: "",
    capacity: "",
    equipmentMic: false,
    equipmentProjector: false,
    is_active: true,
  });

  useEffect(() => {
    api
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, []);

  const openAddModal = () => {
    setEditRoom(null);
    setForm({
      location: "",
      capacity: "",
      equipmentMic: false,
      equipmentProjector: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    const features = Array.isArray(room.features)
      ? room.features
      : room.features?.split(",").map((f) => f.trim()) || [];

    setEditRoom(room);
    setForm({
      location: room.location,
      capacity: room.capacity,
      equipmentMic: features.includes("Mic"),
      equipmentProjector: features.includes("Projector"),
      is_active: room.is_active,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const features = [];
    if (form.equipmentMic) features.push("Mic");
    if (form.equipmentProjector) features.push("Projector");

    const payload = {
      location: form.location,
      capacity: parseInt(form.capacity, 10),
      features,                 // send as array (your Room model casts to array)
      is_active: form.is_active,
    };

    try {
      if (editRoom) {
        const res = await api.put(`/rooms/${editRoom.id}`, payload);
        setRooms((prev) => prev.map((r) => (r.id === editRoom.id ? res.data : r)));
      } else {
        const res = await api.post("/rooms", payload);
        setRooms((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving room:", err.response?.data || err.message);
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (roomId) => {
    setDeleteConfirmRoomId(roomId);
  };

  // Cancel delete modal
  const cancelDelete = () => {
    setDeleteConfirmRoomId(null);
  };

  // Proceed with deletion
  const proceedDelete = async () => {
    try {
      await api.delete(`/rooms/${deleteConfirmRoomId}`);
      setRooms((prev) => prev.filter((r) => r.id !== deleteConfirmRoomId));
    } catch (err) {
      console.error("Failed to delete room:", err);
    } finally {
      setDeleteConfirmRoomId(null);
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
            <th className="text-left px-4 py-2">Location</th>
            <th className="text-left px-4 py-2">Capacity</th>
            <th className="text-left px-4 py-2">Equipment</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b hover:bg-indigo-50">
              <td className="px-4 py-3">{room.location}</td>
              <td className="px-4 py-3">{room.capacity}</td>
              <td className="px-4 py-3">
                {Array.isArray(room.features)
                  ? room.features.join(", ")
                  : room.features || "-"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    room.is_active
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {room.is_active ? "Active" : "Inactive"}
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
                  onClick={() => confirmDelete(room.id)}
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

      {/* Add/Edit Modal */}
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
                name="location"
                placeholder="Room Name"
                value={form.location}
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

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

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

      {/* Delete Confirmation Modal */}
      {deleteConfirmRoomId !== null && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this room?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={proceedDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
