import React from "react";


const Sidebar = () => {
  return (
    <>
      <div className="bg-black text-white h-full p-4 w-52 mt-6 rounded-md">
        <ul className="space-y-4 cursor-pointer">
          <li className="hover:bg-gray-700 p-2 rounded flex items-center">
            Motherboard
          </li>
          <li className="hover:bg-gray-700 p-2 rounded flex items-center">
            CPU
          </li>
          <li className="hover:bg-gray-700 p-2 rounded flex items-center">
            GPU
          </li>
          <li className="hover:bg-gray-700 p-2 rounded flex items-center">
            RAM
          </li>
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
    </>
  );
};

export default Sidebar;
