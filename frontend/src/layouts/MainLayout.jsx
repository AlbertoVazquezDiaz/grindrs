import Footer from "../components/Footer";
import Menu from "../components/Megamenu";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Menu />
      <div className="w-full overflow-x-hidden min-h-screen bg-black">
        <Outlet /> 
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
