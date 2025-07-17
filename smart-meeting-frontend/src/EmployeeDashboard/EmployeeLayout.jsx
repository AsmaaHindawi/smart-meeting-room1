import EmployeeSidebar from "./EmployeeSidebar";
import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  return (
     <div className="flex min-h-screen">
      <EmployeeSidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;

