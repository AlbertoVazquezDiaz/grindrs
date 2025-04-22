import Menu from "../components/Megamenu";
import { Outlet } from "react-router-dom";

const BlackLayout = () => {
  return (
    <div className="w-full min-h-screen bg-black">
      <Menu />
      <div className="w-full min-h-screen bg-black">
        <Outlet /> {/* Renderiza la página actual */}
      </div>
    </div>
  );
};

export default BlackLayout;
