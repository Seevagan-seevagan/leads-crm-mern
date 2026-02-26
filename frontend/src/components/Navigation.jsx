import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logout } from '../services/authService';
import { getUser } from '../utils/auth';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <Navbar collapseOnSelect expand="lg" className="glass-nav mb-4 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center me-2 shadow-sm" style={{ width: 36, height: 36 }}>
                            <span className="fs-5">✨</span>
                        </div>
                        CRM Nexus
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            as={Link}
                            to="/dashboard"
                            className={`fw-medium px-3 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-dark'}`}
                        >
                            Dashboard
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/reports"
                            className={`fw-medium px-3 ${location.pathname === '/reports' ? 'text-primary' : 'text-dark'} disabled`}
                        >
                            Reports (Soon)
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/settings"
                            className={`fw-medium px-3 ${location.pathname === '/settings' ? 'text-primary' : 'text-dark'} disabled`}
                        >
                            Settings (Soon)
                        </Nav.Link>
                    </Nav>
                    <Nav className="align-items-lg-center">
                        <div className="d-none d-lg-block border-end py-3 me-3 opacity-25"></div>
                        <NavDropdown title={<span className="fw-medium text-dark"><span className="fw-light text-muted me-1">Hello,</span>{user.name}</span>} id="collasible-nav-dropdown" align="end">
                            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#billing">Billing</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout} className="text-danger flex align-items-center">
                                Log out
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
