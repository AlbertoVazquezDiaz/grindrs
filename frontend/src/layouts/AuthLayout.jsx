import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Container
      fluid
      className="d-flex vh-100 align-items-center justify-content-center"
    >
      <Row className="w-100">
        <Col
          md={{ span: 4, offset: 4 }}
          className="p-4 shadow rounded bg-white"
        >
          <Outlet /> {/* Renderiza la página actual (Login o Registro) */}
        </Col>
      </Row>
    </Container>
  );
};

export default AuthLayout;
