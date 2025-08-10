// src/pages/RoomCalendar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Views } from "react-big-calendar";
import { localizer } from "./calendarSetup";
import axios from "axios";

const roomColors = ["#7d65fb", "#f97316", "#10b981", "#ef4444", "#3b82f6", "#d946ef", "#facc15"];

/** "1", "1 hour", "2 hours", "90", "90m", "90 minutes" -> minutes */
function parseDurationToMinutes(raw) {
  if (raw == null) return 60;
  const s = String(raw).trim().toLowerCase();
  const n = parseInt(s, 10);
  if (Number.isNaN(n)) return 60;
  if (/(^|\s)(h|hour|hours)\b/.test(s)) return n * 60;  // hours
  if (/(^|\s)(m|min|mins|minute|minutes)\b/.test(s)) return n; // minutes
  return n <= 12 ? n * 60 : n; // assume small = hours, big = minutes
}

/** Build a JS Date from separate date+time or use start_time if present */
function toStartDate(meeting) {
  if (meeting.start_time) return new Date(meeting.start_time);
  if (meeting.date && meeting.time) return new Date(`${meeting.date}T${meeting.time}`);
  if (meeting.date) return new Date(meeting.date);
  return new Date();
}

/** Safely extract a room name from various shapes */
function getRoomName(meeting, rooms) {
  // If API eager-loaded the relation: meeting.room = { id, location, ... }
  if (meeting.room && typeof meeting.room === "object" && meeting.room !== null) {
    return String(meeting.room.location || "Unknown Room").trim();
  }
  // If API sent a string field directly
  if (typeof meeting.room_name === "string" && meeting.room_name.trim()) {
    return meeting.room_name.trim();
  }
  if (typeof meeting.room === "string" && meeting.room.trim()) {
    return meeting.room.trim();
  }
  // Fallback: lookup by room_id in /api/rooms payload
  const viaId = rooms.find((r) => r.id === meeting.room_id)?.location;
  if (viaId) return String(viaId).trim();

  return "Unknown Room";
}

export default function RoomCalendar() {
  const [rooms, setRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [roomFilter, setRoomFilter] = useState("All");
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    let mounted = true;
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:8000/api/rooms"),
      axios.get("http://localhost:8000/api/meetings"),
    ])
      .then(([roomsRes, meetingsRes]) => {
        if (!mounted) return;
        setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
        setMeetings(Array.isArray(meetingsRes.data) ? meetingsRes.data : []);
      })
      .catch((err) => console.error("Failed to load calendar data:", err))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
=======
    axios.get("http://localhost:8000/api/rooms").then(res => setRooms(res.data));
    axios.get("http://localhost:8000/api/meetings").then(res => setMeetings(res.data));
>>>>>>> parent of c0e33f0c (Merge pull request #7 from AsmaaHindawi/codex/refactor-components-to-use-shared-api-instance)
  }, []);

  // Color map by room NAME so “Room A/B/C/…” are consistent
  const roomColorByName = useMemo(() => {
    const names = rooms.map((r) => String(r.location || "").trim()).filter(Boolean);
    const map = new Map();
    names.forEach((name, idx) => map.set(name, roomColors[idx % roomColors.length]));
    return map;
  }, [rooms]);

  // Build calendar events safely (all strings)
  const events = useMemo(() => {
    return meetings.map((m) => {
      const start = toStartDate(m);
      const minutes = parseDurationToMinutes(m.duration);
      const end = new Date(start.getTime() + minutes * 60 * 1000);

      const roomName = getRoomName(m, rooms);                 // <- never an object
      const color = roomColorByName.get(roomName) || "#7d65fb";
      const titleText = m.title ? String(m.title) : "Meeting"; // <- force string

      return {
        id: m.id,
        title: `${titleText} — ${roomName}`,
        start,
        end,
        roomName,
        color,
      };
    });
  }, [meetings, rooms, roomColorByName]);

  // Filter options from rooms + events (strings only)
  const roomOptions = useMemo(() => {
    const fromRooms = rooms.map((r) => String(r.location || "").trim()).filter(Boolean);
    const fromEvents = events.map((e) => e.roomName).filter(Boolean);
    const set = new Set([...fromRooms, ...fromEvents]);
    return ["All", ...Array.from(set)];
  }, [rooms, events]);

  const filteredEvents = useMemo(() => {
    if (roomFilter === "All") return events;
    return events.filter((e) => e.roomName === roomFilter);
  }, [events, roomFilter]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-6xl mx-auto mt-6">
        <h2 className="text-3xl font-bold text-[#7d65fb] mb-2">Room Availability</h2>
        <p className="text-gray-500">Loading calendar…</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-6xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-[#7d65fb]">Room Availability</h2>

        <div className="flex items-center gap-4">
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="border rounded-md px-4 py-2 max-w-xs"
            aria-label="Filter by room"
          >
            {roomOptions.map((room) => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setView(Views.MONTH)}
              className={`px-4 py-1.5 rounded-md ${view === Views.MONTH ? "bg-[#7d65fb] text-white" : "border border-gray-300"}`}
            >Month</button>
            <button
              onClick={() => setView(Views.WEEK)}
              className={`px-4 py-1.5 rounded-md ${view === Views.WEEK ? "bg-[#7d65fb] text-white" : "border border-gray-300"}`}
            >Week</button>
            <button
              onClick={() => setView(Views.DAY)}
              className={`px-4 py-1.5 rounded-md ${view === Views.DAY ? "bg-[#7d65fb] text-white" : "border border-gray-300"}`}
            >Day</button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {roomOptions
          .filter((name) => name !== "All")
          .map((name, idx) => (
            <div key={name} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-3.5 h-3.5 rounded-sm"
                style={{ backgroundColor: roomColorByName.get(name) || roomColors[idx % roomColors.length] }}
              />
              <span className="text-gray-700">{name}</span>
            </div>
          ))}
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
        toolbar={false} // only one control set
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            color: "white",
            borderRadius: "6px",
            border: "none",
          },
        })}
      />
    </div>
  );
}
