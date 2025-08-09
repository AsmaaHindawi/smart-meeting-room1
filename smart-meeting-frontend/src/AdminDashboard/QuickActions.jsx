import React, { useState } from "react";
import { FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import ScheduleMeetingForm from "./ScheduleMeetingForm"; // your modal component

const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex gap-4 flex-wrap">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        <FaCalendarAlt />
        <span>Schedule Meeting</span>
      </button>

      <a
        href="/admin/minutes"
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        <FaFileAlt />
        <span>View Minutes</span>
      </a>

      {isModalOpen && <ScheduleMeetingForm onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default QuickActions;
