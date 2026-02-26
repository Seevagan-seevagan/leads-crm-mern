import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

function LeadTable({ leads, onEdit, onDelete }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return 'info';
            case 'Contacted': return 'primary';
            case 'Interested': return 'warning';
            case 'Converted': return 'success';
            case 'Closed': return 'secondary';
            default: return 'light';
        }
    };

    return (
        <div className="table-responsive">
            <Table hover className="align-middle text-nowrap">
                <thead className="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Added On</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead._id}>
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.source}</td>
                            <td>
                                <Badge bg={getStatusBadge(lead.status)}>
                                    {lead.status}
                                </Badge>
                            </td>
                            <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                            <td className="text-end">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2 mb-1 mb-sm-0"
                                    onClick={() => onEdit(lead)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mb-1 mb-sm-0"
                                    onClick={() => onDelete(lead)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default LeadTable;
