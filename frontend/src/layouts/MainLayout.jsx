import Menu from "../components/Menu";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";


const MainLayout = () => {
  return (
    <>
      <Menu />
      <Container fluid className="p-0">
        <Outlet /> {/* Renderiza la página actual */}
      </Container>
    </>
  );
};

export default MainLayout;
