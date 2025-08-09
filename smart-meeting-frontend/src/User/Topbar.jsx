import { FaBell, FaUserCircle } from "react-icons/fa";
import Banner from "./Banner";

const Topbar = () => {
  return (
    <header className="flex justify-between  p-4 border-b bg-white shadow-sm">
               <Banner
          title="Welcome back, User!"
          subtitle="Here’s what’s happening today."
        />
      <div></div>

      <div className="flex items-center gap-4">
     
       
      </div>
    </header>
  );
};

export default Topbar;
