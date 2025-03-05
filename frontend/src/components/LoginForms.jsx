import { Container, Form, Button } from "react-bootstrap";

const LoginForms = () => {
return (
    <>
    <Container>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="Correo electrónico" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Contraseña" />
            </Form.Group>
        </Form>
        
    </Container>
    </>
);
};

export default LoginForms;
