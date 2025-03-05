import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Menu = () => {
    return (
        <Navbar bg="white" variant="light" expand="lg">
        <Container>
          {/* Logo o Nombre de la Marca */}
          <Navbar.Brand as={Link} to="/">
            <img src="https://fakeimg.pl/40x40?font=noto" alt="Logo" />
          </Navbar.Brand>

          {/* Botón para expandir en móviles */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Contenedor colapsable de los enlaces */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/auth/login">Iniciar sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default Menu;