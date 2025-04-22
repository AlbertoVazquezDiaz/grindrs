import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../admin/components/AdminSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // cerrado por defecto en móvil
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Botón hamburguesa en pantallas pequeñas */}
      <header className="md:hidden fixed top-0 left-0 w-full h-14 bg-black z-50 flex items-center px-4 shadow">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-full hover:bg-gray-100 transition"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido principal (se ajusta solo en md o más) */}
      <main
        className={`transition-all duration-300 flex-1 overflow-auto pt-16 md:pt-6 ${
          isSidebarOpen && window.innerWidth >= 768
            ? "ml-52"
            : window.innerWidth >= 768
            ? "ml-8"
            : ""
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="px-4"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminLayout;
