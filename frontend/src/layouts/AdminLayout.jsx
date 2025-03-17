import React from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="h-full p-4 flex-1  m-2">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
