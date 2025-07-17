import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaVideo,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const EmployeeSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/employee/dashboard" },
    { name: "Book Meeting", icon: <FaCalendarAlt />, path: "/employee/book" },
    { name: "Minutes", icon: <FaFileAlt />, path: "/employee/minutes" },
        { name: "Setting", icon: <FaFileAlt />, path: "/employee/settings" },
  ];

  const logout = () => {
    navigate("/");
  };

  return (
    <>
      <aside className="w-64 h-screen bg-white border-r shadow-sm hidden md:flex flex-col fixed">
               <Link to="/">
  <div className="h-20 flex items-center justify-center border-b cursor-pointer">
    <img
      src="/Images/logoMeetSM.png"
      alt="SmartMeet Logo"
      className="h-20 max-w-30 mr-8"
    />
  </div>
</Link>


        <nav className="flex-1 px-4 py-6 space-y-2">
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
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 transition w-full"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogout(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                No
              </button>
              <button
                onClick={logout}
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

export default EmployeeSidebar;
