import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Modal, Button } from 'react-bootstrap';

function Clock({ onDateChange, onConfirm }) {
  const [currentDate, setCurrentDate] = useState(dayjs().format('DD-MM-YYYY'));
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setCurrentDate(event.target.value);
  };

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    if (onDateChange) {
      onDateChange(currentDate);
      if (onConfirm) {
        onConfirm();
      }
    }
  };

  return (
    <div>
      <input
        type="date"
        value={currentDate}
        onChange={handleChange}
        style={{ cursor: 'pointer' }}
      />
      <Button variant="primary" onClick={handleConfirm}>
        Change System Time
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Do you want to change the system time to ${currentDate}?`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmModal}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Clock;
