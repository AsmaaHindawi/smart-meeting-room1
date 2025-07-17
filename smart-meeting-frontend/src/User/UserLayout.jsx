import { Outlet } from "react-router-dom";
import { UserSidebar } from "./UserSidebar";
const UserLayout = () => {
  return (
     <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;

