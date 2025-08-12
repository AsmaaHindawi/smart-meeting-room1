import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaVideo, FaFileAlt } from "react-icons/fa";
import Topbar from "./Topbar";
import QuickActions from "./QuickActions";
import MeetingList from "./MeetingList";
import RoomCalendar from "./RoomCalendar";
import NotificationPanel from "./NotificationPanel";
import AnalyticsCard from "./AnalyticsCard";

export default function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
const [deleteId, setDeleteId] = useState(null);


  useEffect(() => {
    axios.get("http://localhost:8000/api/contact")
      .then((res) => {
        setContacts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch contacts", err);
      });
  }, []);
 const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete contact", err);
    }
  };
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Topbar />
      <main className="p-6 space-y-6 overflow-auto flex-1">
     <QuickActions
  actions={[
    { label: "Schedule Meeting", icon: <FaCalendarAlt />, to: "/book-meeting" },
    { label: "View Minutes", icon: <FaFileAlt />, to: "admin/minutes" },
  ]}
/>


        {/* <MeetingList
          title="Upcoming Meetings"
          meetings={[
            { time: "10:00 AM", title: "Team Sync", room: "Room A" },
            { time: "1:30 PM", title: "Budget Review", room: "Room B" },
          ]}
        /> */}

        <div className="grid md:grid-cols-1 gap-2">
          <RoomCalendar />
          {/* <NotificationPanel
            notifications={[
              { type: "info", message: "Room C is under maintenance" },
              { type: "reminder", message: "Meeting with HR at 3 PM" },
            ]}
          /> */}
        </div>

<AnalyticsCard title="Room Usage" />


  <div className="bg-white rounded-xl shadow-md p-6">
  <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Contact Messages</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2 text-sm text-gray-800">{contact.name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{contact.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{contact.message}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {new Date(contact.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-sm">
  <button
    onClick={() => setDeleteId(contact.id)}
    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
  >
    Delete
  </button>
</td>

            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
              No contact messages found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
{deleteId !== null && (
  <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
      <p className="text-gray-600 mb-6">Are you sure you want to delete this message?</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete(deleteId)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}



      </main>
    </div>
  );
}
