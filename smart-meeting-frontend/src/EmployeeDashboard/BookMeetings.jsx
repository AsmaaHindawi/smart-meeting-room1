import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import ScheduleMeetingForm from "./ScheduleMeetingForm";

export default function BookMeeting() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">Book a Meeting</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaCalendarAlt />
          Schedule Meeting
        </button>
      </div>

      {modalOpen && <ScheduleMeetingForm onClose={() => setModalOpen(false)} />}
    </div>
  );
}
