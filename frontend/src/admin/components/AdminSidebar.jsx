import React, { useRef } from "react";
import { useLocation, Link } from "react-router-dom";

import {
  UserIcon,
  Cog6ToothIcon,
  ChartBarSquareIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const AdminSidebar = ({ isOpen, toggleSidebarManual }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  

  const menuItems = [
    { icon: <ChartBarSquareIcon className="w-6 h-6" />, label: "Análiticas", to: "/admin/dashboard" },
    { icon: <UserIcon className="w-6 h-6" />, label: "Usuarios", to: "/admin/users" },
    { icon: <ComputerDesktopIcon className="w-6 h-6" />, label: "Productos", to: "/admin/products" },
    { icon: <Cog6ToothIcon className="w-6 h-6" />, label: "Ajustes", to: "/admin/settings" },
    {
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
      label: "Cerrar sesión",
    },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed sm:static inset-y-0 left-0 ${
        isOpen ? "w-52" : "w-20"
      } bg-black text-white p-4 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      } transition-all duration-300 ease-in-out z-40 shadow-lg sm:shadow-none flex flex-col justify-between`}
    >
      <div>
        <div
          className={`flex items-center mb-6 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <img src="/grindr.svg" alt="logo" className="" />
        </div>

        <ul className="w-full">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.to); // puedes usar "===" si quieres exactitud
            return (
              <Link key={index} to={item.to}>
                <li
                  className={`flex items-center mb-4 rounded-lg p-2 transition-all hover:bg-gray-600 hover:cursor-pointer ${
                    isOpen ? "justify-start" : "justify-center"
                  } ${isActive ? "text-yellow-400" : "text-white"}`}
                >
                  {item.icon}
                  <span
                    className={`ml-2 whitespace-nowrap transition-all ${
                      !isOpen ? "hidden" : "inline"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>

      {/* Botón plegar/expandir (solo en pantallas grandes) */}
      <button
        onClick={toggleSidebarManual}
        className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition-colors self-end"
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default AdminSidebar;
