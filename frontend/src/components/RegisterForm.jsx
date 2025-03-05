import { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

export default function RegisterForm() {
  const [formData, setFormData] = useState({});
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/register/")
      .then((res) => res.json())
      .then((data) => {
        setFormData(data.fields);
        setValues(Object.fromEntries(Object.keys(data.fields).map((key) => [key, ""])));
      });
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(values),
    });

    const data = await response.json();
    if (data.success) {
      alert(data.message);
      setValues(Object.fromEntries(Object.keys(formData).map((key) => [key, ""])));
    } else {
      setErrors(data.errors);
    }
  };

  return (
    <Container>
      <h2 className="text-center">Registro</h2>
      <Form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <Form.Group key={field} className="mb-3">
            <Form.Label>{formData[field]}</Form.Label>
            <Form.Control
              type={field.includes("password") ? "password" : "text"}
              name={field}
              value={values[field]}
              onChange={handleChange}
              placeholder={`Ingrese ${formData[field]}`}
            />
            {errors[field] && <p className="text-danger">{errors[field]}</p>}
          </Form.Group>
        ))}
        <Button variant="primary" type="submit">Registrarse</Button>
      </Form>
    </Container>
  );
}
