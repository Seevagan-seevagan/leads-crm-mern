import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createLead, updateLead } from '../services/leadService';

function LeadModal({ show, onHide, lead, onSuccess }) {
    const isEditing = !!lead;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Other',
        status: 'New'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            if (lead) {
                setFormData({
                    name: lead.name,
                    email: lead.email,
                    phone: lead.phone,
                    source: lead.source,
                    status: lead.status
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    source: 'Other',
                    status: 'New'
                });
            }
            setError(null);
        }
    }, [show, lead]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                await updateLead(lead._id, formData);
            } else {
                await createLead(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" centered contentClassName="border-0 shadow-lg rounded-4">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold fs-4">{isEditing ? 'Edit Lead' : 'Add New Lead'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Source</Form.Label>
                        <Form.Select name="source" value={formData.source} onChange={handleChange}>
                            <option value="Website">Website</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Referral">Referral</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    {isEditing && (
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Interested">Interested</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                            </Form.Select>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={onHide} disabled={loading} className="px-4 fw-medium">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading} className="px-4 fw-medium shadow-sm hover-lift">
                        {loading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                            isEditing ? 'Save Changes' : 'Create Lead'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default LeadModal;
