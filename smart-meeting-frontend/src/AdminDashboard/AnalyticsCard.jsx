import React, { useEffect, useState } from "react";
import axios from "axios";

const AnalyticsCard = ({ title, chartData }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-indigo-700 mb-4">{title}</h3>
      <ul className="text-sm space-y-1">
        {chartData.labels.map((label, index) => (
          <li key={index} className="flex justify-between">
            <span>{label}</span>
            <span className="text-gray-600">{chartData.usage[index].toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function RoomUsageAnalytics() {
  const [rooms, setRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalAvailableHoursPerWeek = 6 * 5; // 8AM-2PM × 5 days = 30 hours

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, meetingsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/rooms"),
          axios.get("http://localhost:8000/api/meetings"),
        ]);
        setRooms(roomsRes.data);
        setMeetings(meetingsRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to get Monday of the current week
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // adjust Sunday to Monday
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Calculate overlapping minutes between two Date ranges
  const overlapMinutes = (start1, end1, start2, end2) => {
    const latestStart = start1 > start2 ? start1 : start2;
    const earliestEnd = end1 < end2 ? end1 : end2;
    const diff = (earliestEnd - latestStart) / (1000 * 60); // minutes
    return diff > 0 ? diff : 0;
  };

  // Calculate booked minutes within 8AM-2PM window in current week for one meeting
  const calculateMeetingOverlapInWeek = (meetingStart, meetingEnd, weekStart) => {
    // Loop each day Mon-Fri in the week, check overlap with 8AM-2PM
    let totalMinutes = 0;
    for (let i = 0; i < 5; i++) {
      const dayStart = new Date(weekStart);
      dayStart.setDate(dayStart.getDate() + i);
      const day8AM = new Date(dayStart);
      day8AM.setHours(8, 0, 0, 0);
      const day2PM = new Date(dayStart);
      day2PM.setHours(14, 0, 0, 0);

      // Calculate overlap between meeting and this day's 8AM-2PM window
      totalMinutes += overlapMinutes(meetingStart, meetingEnd, day8AM, day2PM);
    }
    return totalMinutes;
  };

  const calculateUsagePercent = (roomId) => {
    const now = new Date();
    const monday = getMonday(now);
    let bookedMinutes = 0;

    meetings
      .filter((m) => m.room_id === roomId)
      .forEach((m) => {
        const start = new Date(m.start_time);
        const end = new Date(m.end_time);

        // Only count meetings that have some overlap with the current week Mon-Fri 8AM-2PM
        // Because calculateMeetingOverlapInWeek clamps anyway, no need to filter here strictly

        bookedMinutes += calculateMeetingOverlapInWeek(start, end, monday);
      });

    const usage = (bookedMinutes / (totalAvailableHoursPerWeek * 60)) * 100;
    return usage > 0 ? Math.min(usage, 100) : 0;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const labels = rooms.map((r) => r.location);
  const usage = rooms.map((r) => calculateUsagePercent(r.id));

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <AnalyticsCard title="Room Usage This Week (8AM-2PM, Mon-Fri)" chartData={{ labels, usage }} />
    </div>
  );
}
