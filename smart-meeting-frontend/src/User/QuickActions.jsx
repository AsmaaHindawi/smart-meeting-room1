import { useState } from "react";
import { FaCalendarAlt, FaVideo, FaFileAlt } from "react-icons/fa";

const QuickActions = () => {


  return (
    <div className="flex gap-4 flex-wrap">
   
      <a
        href="/MinutesPage"
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
      >
        <FaFileAlt />
        <span>View Minutes</span>
      </a>


    </div>
  );
}

export default QuickActions;
