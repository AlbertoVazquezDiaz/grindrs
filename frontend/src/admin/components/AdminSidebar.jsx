import React from "react";
import {
  UserIcon,
  Cog6ToothIcon,
  ChartBarSquareIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar bg-gray-800 text-white h-full w-52 p-4 min-h-screen">
      <img src="/grindr.svg" alt="" />
      <ul>
        <li className="flex items-center mb-4 hover:bg-gray-600 hover:cursor-pointer rounded-lg p-2">
          <ChartBarSquareIcon className="icon w-6 h-6 mr-2" /> Análiticas
        </li>
        <li className="flex items-center mb-4 hover:bg-gray-600 hover:cursor-pointer rounded-lg p-2">
          <UserIcon className="icon w-6 h-6 mr-2" /> Usuarios
        </li>
        <li className="flex items-center mb-4 hover:bg-gray-600 hover:cursor-pointer rounded-lg p-2">
          <ComputerDesktopIcon className="icon w-6 h-6 mr-2" /> Productos
        </li>
        <li className="flex items-center mb-4 hover:bg-gray-600 hover:cursor-pointer rounded-lg p-2">
          <Cog6ToothIcon className="icon w-6 h-6 mr-2" /> Ajustes
        </li>
        <li className="flex items-center mb-4 hover:bg-gray-600 hover:cursor-pointer rounded-lg p-2 text-nowrap">
          <ArrowRightOnRectangleIcon className="icon w-6 h-6 mr-2" /> Cerrar
          sesión
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
