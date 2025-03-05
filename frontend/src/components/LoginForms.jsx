import { Container, Form, Button } from "react-bootstrap";

const LoginForms = () => {
return (
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

            <Button variant="primary" type="submit"></Button>
                Iniciar sesión
            </Button>

            <div className="mt-3">
                <a href="/register">Regístrate</a> | <a href="/forgot-password">Olvidé mi contraseña</a>
            </div>
        </Form>
    </Container>
);</div>
};

export default LoginForms;
