import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Form, Button, Card } from "react-bootstrap";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", formData);
            navigate("/login");
        } catch (error) {
            console.error("Error en registro:", error.response?.data?.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Card style={{ width: "400px", padding: "20px" }}>
                <h3 className="text-center">Registro</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="name" placeholder="Ingrese su nombre" value={formData.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Ingrese su email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Ingrese su contraseña" value={formData.password} onChange={handleChange} required />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100 mt-3">
                        Registrarse
                    </Button>
                </Form>
                <p className="mt-3 text-center">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </Card>
        </Container>
    );
};

export default Register;
