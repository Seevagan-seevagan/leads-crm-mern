import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteConfirmModal({ show, onHide, onConfirm, leadName }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the lead <strong>{leadName}</strong>?
                This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Delete Lead
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteConfirmModal;
