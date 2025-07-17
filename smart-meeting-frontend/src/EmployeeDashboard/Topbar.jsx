import { FaBell, FaUserCircle } from "react-icons/fa";
import Banner from "./Banner";

const Topbar = () => {
  return (
    <header className="flex justify-between  p-4 border-b bg-white shadow-sm">
               <Banner
          title="Welcome back, Employee!"
          subtitle="Here’s what’s happening today."
        />
      <div></div>

      <div className="flex items-center gap-4">
     
        <button className="text-gray-600 hover:text-indigo-600">
          <FaBell size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
