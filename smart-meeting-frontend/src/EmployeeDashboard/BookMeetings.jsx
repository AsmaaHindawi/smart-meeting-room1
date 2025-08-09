import { useEffect, useState } from "react";
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import ScheduleMeetingForm from "./ScheduleMeetingForm";

export default function BookMeeting() {
  const [modalOpen, setModalOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [editMeeting, setEditMeeting] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  const fetchMeetings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/meetings");
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      let url = "http://localhost:8000/api/meetings";
      let method = "POST";

      if (editMeeting) {
        url = `http://localhost:8000/api/meetings/${editMeeting.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save meeting");
      }

      alert(editMeeting ? "Meeting updated successfully!" : "Meeting scheduled successfully!");
      setModalOpen(false);
      setEditMeeting(null);
      fetchMeetings();
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
    }
  };

  const confirmDelete = (meeting) => {
    setMeetingToDelete(meeting);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!meetingToDelete) return;
    try {
      const res = await fetch(`http://localhost:8000/api/meetings/${meetingToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete meeting");

      alert("Meeting deleted.");
      setDeleteModalOpen(false);
      setMeetingToDelete(null);
      fetchMeetings();
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Error: " + err.message);
    }
  };

  const handleEditClick = (meeting) => {
    setEditMeeting(meeting);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Book a Meeting</h1>
        <button
          onClick={() => {
            setEditMeeting(null);
            setModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaCalendarAlt /> Schedule Meeting
        </button>
      </div>

      {/* Meeting Form Modal */}
      {modalOpen && (
        <ScheduleMeetingForm
          onClose={() => {
            setModalOpen(false);
            setEditMeeting(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editMeeting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this meeting?
            </h2>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meetings Table */}
      <h2 className="text-lg font-semibold mt-6 mb-3 text-gray-700">Scheduled Meetings</h2>
      <div className="bg-white shadow-lg overflow-hidden">
      <table className="w-full border-collapse border border-gray-300">

          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border">Room</th>
              <th className="p-3 border">Attendees</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting, index) => (
              <tr
                key={meeting.id}
                className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-3 border font-medium">{meeting.title}</td>
                <td className="p-3 border">{meeting.date || "-"}</td>
                <td className="p-3 border">{meeting.time || "-"}</td>
                <td className="p-3 border">
                  {meeting.duration ? `${meeting.duration} hour` : "-"}
                </td>
                <td className="p-3 border">{meeting.room?.location || "-"}</td>
                <td className="p-3 border">
                  <ul className="list-disc list-inside">
                    {meeting.attendees?.map((attendee) => (
                      <li key={attendee.id}>
                        {attendee.user
                          ? attendee.user.username || attendee.user.email || "No name/email"
                          : "No user assigned"}
                      </li>
                    ))}
                  </ul>
                </td>
              <td className="p-3 border text-center gap-3">
  <button
    onClick={() => handleEditClick(meeting)}
    className="text-blue-700 hover:text-blue-800"
  >
    <FaEdit />
  </button>
  <button
    onClick={() => confirmDelete(meeting)}
   className="text-red-700 m-4 hover:text-red-800"

  >
    <FaTrash />
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
