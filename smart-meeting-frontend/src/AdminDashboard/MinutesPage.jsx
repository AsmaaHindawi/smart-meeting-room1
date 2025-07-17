import { useState } from "react";
import { FaSearch, FaEdit, FaFilePdf, FaShareAlt } from "react-icons/fa";

const mockMinutes = [
  {
    id: 1,
    date: "2025-06-30",
    title: "Weekly Standup",
    attendees: ["Alice", "Bob"],
    actions: [
      { task: "Send project update", assignee: "Alice", status: "Completed" },
      { task: "Fix bug #24", assignee: "Bob", status: "Pending" },
    ],
  },
  {
    id: 2,
    date: "2025-06-28",
    title: "Design Review",
    attendees: ["Charlie", "Dana"],
    actions: [
      { task: "Revise UI mockups", assignee: "Charlie", status: "Pending" },
    ],
  },
];

export default function MinutesPage() {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filtered = mockMinutes.filter((minute) => {
    const matchKeyword =
      minute.title.toLowerCase().includes(search.toLowerCase()) ||
      minute.attendees.some((a) => a.toLowerCase().includes(search.toLowerCase()));

    const matchDate = filterDate ? minute.date === filterDate : true;
    return matchKeyword && matchDate;
  });

  return (
    <div className="p-6 bg-gray-50 font-poppins">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Meeting Minutes</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by keyword or attendee"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      </div>

      {/* List of Meeting Minutes */}
      <div className="space-y-6">
        {filtered.map((minute) => (
          <div key={minute.id} className="bg-white shadow rounded p-4">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <div>
                <h2 className="text-lg font-semibold text-indigo-700">{minute.title}</h2>
                <p className="text-sm text-gray-500">{minute.date}</p>
              </div>
              <div className="flex gap-3">
                <button
                  className="text-indigo-600 hover:text-indigo-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Export as PDF"
                >
                  <FaFilePdf />
                </button>
                <button
                  className="text-green-600 hover:text-green-800"
                  title="Share"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <p className="mb-1 text-sm">
              <strong>Attendees:</strong> {minute.attendees.join(", ")}
            </p>

            <div>
              <strong>Action Items:</strong>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {minute.actions.map((a, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {a.task} - <span className="font-medium">{a.assignee}</span>
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        a.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-center">No meeting minutes found.</p>
        )}
      </div>
    </div>
  );
}
