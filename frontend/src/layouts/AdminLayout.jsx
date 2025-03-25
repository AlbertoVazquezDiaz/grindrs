import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ← ahora por defecto está abierto

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Botón solo en móviles */}
      <button
        onClick={toggleSidebar}
        className="fixed top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gray-500/80 text-white rounded-lg z-50 sm:hidden shadow-lg"
      >
        {isSidebarOpen ? (
          <ChevronLeftIcon className="h-6 w-6" />
        ) : (
          <ChevronRightIcon className="h-6 w-6" />
        )}
      </button>

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        toggleSidebarManual={toggleSidebar} // 👈 se lo pasamos aquí
      />

      <div className="h-full p-4 flex-1 m-2 justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
