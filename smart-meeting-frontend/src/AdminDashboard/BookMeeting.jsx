import { useEffect, useState } from "react";
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import ScheduleMeetingForm from "./ScheduleMeetingForm";

export default function BookMeeting() {
  const [modalOpen, setModalOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);

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
      const res = await fetch("http://localhost:8000/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create meeting");
      }

      alert("Meeting scheduled successfully!");
      setModalOpen(false);
      fetchMeetings();
    } catch (err) {
      console.error("Error:", err);
      alert("Error scheduling meeting: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/meetings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete meeting");

      alert("Meeting deleted.");
      fetchMeetings();
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">Book a Meeting</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaCalendarAlt /> Schedule Meeting
        </button>
      </div>

      {modalOpen && (
        <ScheduleMeetingForm
          onClose={() => setModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">Scheduled Meetings</h2>
      <table className="w-full border text-sm">
        <thead className="bg-indigo-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Room</th>
            <th className="p-2 border">Attendees</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr key={meeting.id}>
              <td className="p-2 border">{meeting.title}</td>
              <td className="p-2 border">{meeting.date || "-"}</td>
              <td className="p-2 border">{meeting.time || "-"}</td>
              <td className="p-2 border">{meeting.duration ? `${meeting.duration} min` : "-"}</td>
              <td className="p-2 border">{meeting.room?.location || "-"}</td>
              <td className="p-2 border">
                {meeting.attendees && meeting.attendees.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {meeting.attendees.map((a) => (
                      <li key={a.id}>{a.username || a.email}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="italic text-gray-400">None</span>
                )}
              </td>
              <td className="p-2 border text-center">
                <button className="text-blue-600 hover:underline mr-2">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(meeting.id)}
                  className="text-red-600 hover:underline"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
