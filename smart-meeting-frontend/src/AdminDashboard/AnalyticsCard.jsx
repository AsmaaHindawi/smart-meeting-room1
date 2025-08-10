import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";


const AnalyticsCard = ({ title, items, highlightTop = true, topN = 5 }) => {
  
  const rows = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, topN);
  }, [items, topN]);

  const max = useMemo(() => Math.max(...rows.map((r) => r.value), 1), [rows]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-full">
      <h3 className="text-lg font-semibold text-indigo-700 mb-4">{title}</h3>

      <ul className="space-y-3">
        {rows.map((row, idx) => (
          <li key={row.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                {highlightTop && idx === 0 ? <span className="inline-block">🏆</span> : null}
                {row.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {row.value}
              </span>
            </div>
            {/* progress bar */}
            <div className="h-2 w-full bg-gray-100 rounded">
              <div
                className="h-2 rounded bg-indigo-500"
                style={{ width: `${(row.value / max) * 100}%` }}
                aria-hidden
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function toStartDate(m) {
  if (m.start_time) return new Date(m.start_time);
  if (m.date && m.time) return new Date(`${m.date}T${m.time}`);
  if (m.date) return new Date(m.date);
  return null; // unknown
}

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function sameWeek(d, monday) {
  if (!d) return false;
  const start = new Date(monday);
  const end = new Date(monday);
  end.setDate(end.getDate() + 7);
  return d >= start && d < end;
}

function sameMonth(d, ref) {
  if (!d) return false;
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}
function getRoomName(meeting, rooms) {
  if (meeting.room && typeof meeting.room === "object" && meeting.room !== null) {
    return String(meeting.room.location || "Unknown Room").trim();
  }
  if (typeof meeting.room_name === "string" && meeting.room_name.trim()) return meeting.room_name.trim();
  if (typeof meeting.room === "string" && meeting.room.trim()) return meeting.room.trim();
  const viaId = rooms.find((r) => r.id === meeting.room_id)?.location;
  return viaId ? String(viaId).trim() : "Unknown Room";
}

export default function RoomUsageMostBooked() {
  const [rooms, setRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);


  const [scope, setScope] = useState("all");

  useEffect(() => {
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
      .catch((e) => console.error("Error fetching data", e))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const counts = useMemo(() => {
    const refNow = new Date();
    const monday = getMonday(refNow);

  
    const tally = {};
    meetings.forEach((m) => {
      const d = toStartDate(m);
      const include =
        scope === "all"
          ? true
          : scope === "week"
          ? sameWeek(d, monday)
          : sameMonth(d, refNow); 

      if (!include) return;

      const roomName = getRoomName(m, rooms);
      if (!tally[roomName]) tally[roomName] = 0;
      tally[roomName] += 1;
    });

    rooms.forEach((r) => {
      const name = String(r.location || "").trim();
      if (name && !(name in tally)) tally[name] = 0;
    });

 
    return Object.entries(tally).map(([label, value]) => ({ label, value }));
  }, [meetings, rooms, scope]);

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  return (
    
    <section className="w-full bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-0">
      
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-indigo-700">
            Most Used Rooms (by number of bookings)
          </h2>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm bg-white"
            aria-label="Time scope"
          >
            <option value="all">All time</option>
            <option value="month">This month</option>
            <option value="week">This week</option>
          </select>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
      
          <AnalyticsCard title="Top 3 Rooms" items={counts} highlightTop={true} topN={3} />

       
          <AnalyticsCard title="All Rooms by Bookings" items={counts} highlightTop={false} topN={counts.length} />
        </div>
      </div>
    </section>
  );
}
