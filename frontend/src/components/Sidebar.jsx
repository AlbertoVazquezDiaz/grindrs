import { useEffect, useRef } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
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
      {/* Backdrop (solo en móviles y si está abierto) */}
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
          {[
            "Motherboard",
            "CPU",
            "GPU",
            "RAM",
            "Storage",
            "Power Supply",
            "Cooling System",
            "Case",
          ].map((item, i) => (
            <li
              key={i}
              onClick={() => {
                console.log(`Filtrar: ${item}`);
                if (window.innerWidth < 768) onClose();
              }}
              className="cursor-pointer p-2 rounded hover:bg-white/10 hover:text-yellow-400 transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
