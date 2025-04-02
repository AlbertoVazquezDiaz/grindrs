import Footer from "../components/Footer";
import Menu from "../components/Megamenu";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Menu />
      <div className="w-screen overflow-x-hidden min-h-screen bg-black">
        <Outlet /> {/* Renderiza la página actual */}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
