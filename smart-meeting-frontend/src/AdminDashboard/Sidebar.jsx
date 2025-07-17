import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaDoorOpen,
  FaCalendarAlt,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaUsersCog
} from "react-icons/fa";

import AdminSettings from "./AdminSetting";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Manage Rooms", icon: <FaDoorOpen />, path: "/admin/manageRooms" },
    { name: "Bookings", icon: <FaCalendarAlt />, path: "/admin/bookMeeting" },
    { name: "Minutes", icon: <FaFileAlt />, path: "/admin/minutes" },
  { name: "Add Users", icon: <FaUserPlus />, path: "/admin/addUsers" },
  { name: "Settings", icon: <FaCog />, path: "/admin/settingsPage" },

  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <aside className="w-64 h-screen   border-r shadow-sm hidden md:flex flex-col fixed">
          <Link to="/">
  <div className="h-20 flex items-center justify-center border-b cursor-pointer">
    <img
      src="/Images/logoMeetSM.png"
      alt="SmartMeet Logo"
      className="h-20 max-w-30 mr-8"
    />
  </div>
</Link>

        <nav className="flex-1 px-4 py-6 space-y-2 ">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition ${
                location.pathname === item.path
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            className="flex items-center gap-3 text-red-600 hover:text-red-700 transition w-full"
            onClick={() => setShowLogoutModal(true)}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
