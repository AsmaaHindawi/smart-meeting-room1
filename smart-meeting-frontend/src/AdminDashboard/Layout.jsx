import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto bg-gray-50">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
