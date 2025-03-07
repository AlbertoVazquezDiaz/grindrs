import Menu from "../components/Megamenu";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
      <Menu />
      <div className="container mx-auto p-0">
        <Outlet /> {/* Renderiza la página actual */}
      </div>
    </>
  );
};

export default MainLayout;
