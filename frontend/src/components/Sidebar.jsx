import React, { useEffect, useRef } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  // Cerrar la Sidebar al hacer clic fuera de ella (solo en móviles)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed sm:static inset-y-0 left-0 w-52 bg-black text-white p-4 mt-6 rounded-md transform ${
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      } transition-transform duration-300 ease-in-out z-40 shadow-lg sm:shadow-none`}
    > 
      <ul className="space-y-4 cursor-pointer">
        <li className="hover:bg-gray-700 hover:text-yellow-400 p-2 rounded flex items-center">
          Motherboard
        </li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">CPU</li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">GPU</li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">RAM</li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">
          Storage
        </li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">
          Power Supply
        </li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">
          Cooling System
        </li>
        <li className="hover:bg-gray-700 p-2 rounded flex items-center">
          Case
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
