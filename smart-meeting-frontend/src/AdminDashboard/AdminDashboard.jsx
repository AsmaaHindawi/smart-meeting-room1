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

  useEffect(() => {
    axios.get("http://localhost:8000/api/contact")
      .then((res) => {
        setContacts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch contacts", err);
      });
  }, []);

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
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
              No contact messages found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      </main>
    </div>
  );
}
