import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarSquareIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const logout = useLogout();

  const menuItems = [
    {
      label: "Análiticas",
      to: "/admin/dashboard",
      icon: <ChartBarSquareIcon className="w-6 h-6" />,
    },
    {
      label: "Usuarios",
      to: "/admin/users",
      icon: <UserIcon className="w-6 h-6" />,
    },
    {
      label: "Productos",
      to: "/admin/products",
      icon: <ComputerDesktopIcon className="w-6 h-6" />,
    },
    {
      label: "Ajustes",
      to: "/admin/settings",
      icon: <Cog6ToothIcon className="w-6 h-6" />,
    },
    {
      label: "Cerrar sesión",
      action: logout,
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
    },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-black text-white flex flex-col justify-between
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${isOpen ? "w-52" : "w-20"} 
        md:static md:flex md:max-w-fit
      `}
    >
      <div className="p-4">
        <div
          className={`flex items-center mb-6 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <img src="/grindr.svg" alt="logo" className="w-24 hidden md:block" />
        </div>

        <ul className={`space-y-4 ${isOpen ? "mt-12" : "mt-4"}`}>
          {menuItems.map((item, i) => {
            const isActive = location.pathname.startsWith(item.to || "");

            return item.to ? (
              <Link
                key={i}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                  isActive ? "text-yellow-400" : "text-white"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                {item.icon}
                {isOpen && <span className="ml-2">{item.label}</span>}
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.action}
                className={`w-full text-left flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                  isOpen ? "justify-start" : "justify-center"
                } text-white`}
              >
                {item.icon}
                {isOpen && <span className="ml-2">{item.label}</span>}
              </button>
            );
          })}
        </ul>
      </div>

      {/* Botón de colapsar solo en escritorio */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex items-center justify-center p-2 m-4 rounded-full hover:bg-gray-700 transition-colors self-end"
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
};

export default AdminSidebar;
