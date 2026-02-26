import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
            {/* Dark overlay specifically for login page to make the glass stand out */}
            <div className="position-absolute w-100 h-100 bg-dark" style={{ opacity: 0.4, zIndex: 0 }}></div>

            <Container style={{ zIndex: 1 }}>
                <Row className="w-100 justify-content-center m-0">
                    <Col md={7} lg={5} xl={4} className="px-0">
                        <Card className="glass-card border-0 p-3 p-md-4">
                            <Card.Body>
                                <div className="text-center mb-5">
                                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: 64, height: 64 }}>
                                        <span className="fs-3">✨</span>
                                    </div>
                                    <h2 className="fw-bold mb-1">Welcome Back</h2>
                                    <p className="text-muted">Sign in to CRM Nexus</p>
                                </div>

                                {error && <Alert variant="danger" className="border-0 rounded-3">{error}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4" controlId="formBasicEmail">
                                        <Form.Label className="fw-medium small text-muted text-uppercase tracking-wider">Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="py-2"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-5" controlId="formBasicPassword">
                                        <Form.Label className="fw-medium small text-muted text-uppercase tracking-wider">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="py-2"
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 py-3 shadow-sm hover-lift fw-bold fs-6" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                Authenticating...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>

                                    <div className="text-center mt-4 text-muted small" style={{ opacity: 0.8 }}>
                                        Credentials: admin@example.com / password123
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
