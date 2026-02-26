import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Spinner, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getLeads, deleteLead } from '../services/leadService';
import { logout } from '../services/authService';
import { getToken, getUser } from '../utils/auth';
import LeadTable from '../components/LeadTable';
import LeadModal from '../components/LeadModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function Dashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination & Filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const limit = 10;

    // Modals
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    const navigate = useNavigate();
    const user = getUser();

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getLeads(page, limit, search, statusFilter);
            setLeads(data.data);
            setTotalPages(data.pages);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            } else {
                setError('Failed to fetch leads');
            }
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter, limit, navigate]);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
            return;
        }
        fetchLeads();
    }, [fetchLeads, navigate]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openAddModal = () => {
        setSelectedLead(null);
        setShowLeadModal(true);
    };

    const openEditModal = (lead) => {
        setSelectedLead(lead);
        setShowLeadModal(true);
    };

    const openDeleteModal = (lead) => {
        setSelectedLead(lead);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteLead(selectedLead._id);
            setShowDeleteModal(false);
            fetchLeads(); // Refresh list
        } catch (err) {
            alert('Failed to delete lead');
        }
    };

    const handleModalSuccess = () => {
        setShowLeadModal(false);
        fetchLeads(); // Refresh list after add/edit
    };

    return (
        <div className="pb-5">
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-4 px-2">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Leads Portfolio</h2>
                        <p className="text-muted mb-0">Manage and track your customer pipelines</p>
                    </div>
                </div>

                <Card className="glass-card mb-4 border-0">
                    <Card.Body className="p-4 p-md-5">
                        <Row className="mb-3 align-items-center g-2">
                            <Col xs={12} md={4}>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Search by name, email or phone"
                                        value={search}
                                        onChange={handleSearch}
                                    />
                                    {search && (
                                        <Button variant="outline-secondary" onClick={() => { setSearch(''); setPage(1); }}>
                                            Clear
                                        </Button>
                                    )}
                                </InputGroup>
                            </Col>

                            <Col xs={12} sm={6} md={3}>
                                <Form.Select value={statusFilter} onChange={handleStatusFilter}>
                                    <option value="">All Statuses</option>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Interested">Interested</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Closed">Closed</option>
                                </Form.Select>
                            </Col>

                            <Col xs={12} sm={6} md={5} className="text-sm-end">
                                <Button variant="primary" onClick={openAddModal} className="w-100 w-sm-auto">
                                    + Add New Lead
                                </Button>
                            </Col>
                        </Row>

                        {error && <div className="alert alert-danger">{error}</div>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Loading leads...</p>
                            </div>
                        ) : (
                            <>
                                <LeadTable
                                    leads={leads}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteModal}
                                />

                                {leads.length > 0 && totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-4">
                                        <Pagination>
                                            <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                                            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />

                                            {[...Array(totalPages)].map((_, i) => (
                                                <Pagination.Item
                                                    key={i + 1}
                                                    active={i + 1 === page}
                                                    onClick={() => handlePageChange(i + 1)}
                                                >
                                                    {i + 1}
                                                </Pagination.Item>
                                            ))}

                                            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
                                        </Pagination>
                                    </div>
                                )}

                                {leads.length === 0 && (
                                    <div className="text-center py-4 text-muted">
                                        No leads found matching your criteria.
                                    </div>
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <LeadModal
                show={showLeadModal}
                onHide={() => setShowLeadModal(false)}
                lead={selectedLead}
                onSuccess={handleModalSuccess}
            />

            <DeleteConfirmModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                leadName={selectedLead?.name}
            />
        </div>
    );
}

export default Dashboard;
