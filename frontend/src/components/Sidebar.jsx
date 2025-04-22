import { useEffect, useRef, useState } from "react";
import api from "../API/axiosConfig";

const Sidebar = ({ isOpen, onClose, onFilter }) => {
  const sidebarRef = useRef(null);
  const [tiposComponentes, setTiposComponentes] = useState([]);

  const fetchTipos = async () => {
    const response = await api.get("tipoComponente/");
    setTiposComponentes(response.data);
  };

  useEffect(() => {
    fetchTipos();
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
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
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`fixed sm:static inset-y-0 left-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } w-64 bg-black text-gray-300 p-6 transform transition-transform duration-300 ease-in-out shadow-lg sm:shadow-none sm:w-64 rounded-r-xl z-40
        sm:mt-0 mt-14`}
      >
        <h2 className="text-lg font-semibold mb-4">Filtrar por categoría</h2>
        <ul className="space-y-2">
          <li
            onClick={() => {
              onFilter(null);
              if (window.innerWidth < 768) onClose();
            }}
            className="cursor-pointer p-2 rounded hover:bg-white/10 hover:text-yellow-400 transition"
          >
            Todos los productos
          </li>

          {tiposComponentes.map((tipo) => (
            <li
              key={tipo.id}
              onClick={() => {
                onFilter(tipo.id);
                if (window.innerWidth < 768) onClose();
              }}
              className="cursor-pointer p-2 rounded hover:bg-white/10 hover:text-yellow-400 transition"
            >
              {tipo.nombre}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
