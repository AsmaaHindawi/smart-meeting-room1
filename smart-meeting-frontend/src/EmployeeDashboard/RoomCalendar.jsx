import { useState } from "react";
import { Calendar, Views } from "react-big-calendar";
import { localizer } from "./calendarSetup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaUsers, FaPhone } from "react-icons/fa";

const RoomCalendar = () => {
  const fullEvents = [
    {
      title: "Team Sync",
      start: new Date(2025, 6, 7, 10, 0),
      end: new Date(2025, 6, 7, 11, 0),
      room: "Room A",
      organizer: "Sarah",
      icon: <FaUsers />,
    },
    {
      title: "Client Call",
      start: new Date(2025, 6, 8, 15, 0),
      end: new Date(2025, 6, 8, 16, 0),
      room: "Room C",
      organizer: "Mark",
      icon: <FaPhone />,
    },
    {
      title: "Budget Meeting",
      start: new Date(2025, 6, 9, 14, 0),
      end: new Date(2025, 6, 9, 15, 0),
      room: "Room A",
      organizer: "Sarah",
      icon: <FaUsers />,
    },
  ];

  const [roomFilter, setRoomFilter] = useState("All");
  const [organizerFilter, setOrganizerFilter] = useState("All");
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  const filteredEvents = fullEvents.filter((event) => {
    const roomMatch = roomFilter === "All" || event.room === roomFilter;
    const organizerMatch = organizerFilter === "All" || event.organizer === organizerFilter;
    return roomMatch && organizerMatch;
  });

  const uniqueRooms = [...new Set(fullEvents.map((e) => e.room))];
  const uniqueOrganizers = [...new Set(fullEvents.map((e) => e.organizer))];

  const handleNavigate = (action) => {
    const newDate = new Date(date);
    if (action === "TODAY") setDate(new Date());
    else if (action === "NEXT") {
      if (view === Views.MONTH) newDate.setMonth(newDate.getMonth() + 1);
      else if (view === Views.WEEK) newDate.setDate(newDate.getDate() + 7);
      else newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    } else if (action === "BACK") {
      if (view === Views.MONTH) newDate.setMonth(newDate.getMonth() - 1);
      else if (view === Views.WEEK) newDate.setDate(newDate.getDate() - 7);
      else newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-6xl mx-auto mt-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#7d65fb]">Room Availability</h2>
        <p className="text-gray-500 mt-1 text-sm">Switch between month, week, or day views</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="flex gap-4 items-center">
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="border rounded-md px-4 py-2"
          >
            <option value="All">All Rooms</option>
            {uniqueRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          <select
            value={organizerFilter}
            onChange={(e) => setOrganizerFilter(e.target.value)}
            className="border rounded-md px-4 py-2"
          >
            <option value="All">All Organizers</option>
            {uniqueOrganizers.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigate("TODAY")}
            className="px-4 py-1.5 rounded-md bg-[#7d65fb] text-white font-medium hover:bg-[#6b59e0] transition"
          >
            Today
          </button>
          <button
            onClick={() => handleNavigate("BACK")}
            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={() => handleNavigate("NEXT")}
            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* View Switch */}
      <div className="flex gap-2 mb-4">
        {["month", "week", "day"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-md font-medium transition ${
              view === v
                ? "bg-[#e4e0fe] text-[#7d65fb]"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onView={setView}
          onNavigate={setDate}
          views={["month", "week", "day"]}
          min={new Date(1970, 1, 1, 8, 0)}
          max={new Date(1970, 1, 1, 18, 0)}
          style={{ height: "70vh" }}
          eventPropGetter={() => ({
            className:
              "bg-[#7d65fb] text-white text-sm px-3 py-1 rounded-md shadow-sm hover:bg-[#6b59e0] transition",
          })}
          components={{
            event: ({ event }) => (
              <div className="flex items-center gap-2">
                {event.icon}
                <span>{event.title}</span>
              </div>
            ),
          }}
          toolbar={false}
        />
      </div>
    </div>
  );
};

export default RoomCalendar;
