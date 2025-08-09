import React, { useState, useEffect } from "react";
import { Calendar, Views } from "react-big-calendar";
import { localizer } from "./calendarSetup";
import api from "../api";

const roomColors = [
  "#7d65fb",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#d946ef",
  "#facc15",
];

function parseDuration(durationStr) {
  const num = parseInt(durationStr);
  return isNaN(num) ? 1 : num; // default 1 hour if invalid
}

const RoomCalendar = () => {
  const [rooms, setRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [roomFilter, setRoomFilter] = useState("All");
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    api.get("/rooms").then(res => setRooms(res.data));
    api.get("/meetings").then(res => setMeetings(res.data));
  }, []);

  // Map room name to color
  const roomColorMap = {};
  rooms.forEach((room, idx) => {
    roomColorMap[room.location.trim()] = roomColors[idx % roomColors.length];
  });

  // Create calendar events with correct end date
  const fullEvents = meetings.map(meeting => {
    const start = new Date(meeting.start_time);
    const durationHours = parseDuration(meeting.duration);
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    const roomName = rooms.find(r => r.id === meeting.room_id)?.location.trim() || "Unknown Room";

    return {
      id: meeting.id,
      title: meeting.title,
      start,
      end,
      room: roomName,
      color: roomColorMap[roomName] || "#7d65fb",
    };
  });

  // Filter events by roomFilter
  const filteredEvents = roomFilter === "All" ? fullEvents : fullEvents.filter(e => e.room === roomFilter);

  // Unique room list for dropdown
  const uniqueRooms = ["All", ...new Set(fullEvents.map(e => e.room))];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-6xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-[#7d65fb] mb-4">Room Availability</h2>

      <div className="flex justify-between mb-6 gap-4">
        <select
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="border rounded-md px-4 py-2 max-w-xs"
        >
          {uniqueRooms.map(room => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button onClick={() => setView(Views.MONTH)} className={`px-4 py-1.5 rounded-md ${view === Views.MONTH ? "bg-[#7d65fb] text-white" : "border border-gray-300"}`}>Month</button>
          <button onClick={() => setView(Views.WEEK)} className={`px-4 py-1.5 rounded-md ${view === Views.WEEK ? "bg-[#7d65fb] text-white" : "border border-gray-300"}`}>Week</button>
          <button onClick={() => setView(Views.DAY)} className={`px-4 py-1.5 rounded-md ${view === Views.DAY ? "bg-[#7d65fb] text-white" : "border border-gray-300"}`}>Day</button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view}
        onView={setView}
        onNavigate={setDate}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        style={{ height: "70vh" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "6px",
            color: "white",
            border: "none",
          },
        })}
        dayPropGetter={date => {
          const dayHasEvent = filteredEvents.some(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            return eventStart <= dayEnd && eventEnd >= dayStart;
          });

          return {
            style: {
              backgroundColor: dayHasEvent ? "#dbeafe" : undefined,
              borderRadius: dayHasEvent ? "8px" : undefined,
            },
          };
        }}
      />
    </div>
  );
};

export default RoomCalendar;
