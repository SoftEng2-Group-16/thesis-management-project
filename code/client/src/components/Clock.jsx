import React, { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'react-bootstrap';

function Clock(props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowModal(true);

  };

  /*   const handleConfirm = () => {
      setShowModal(true);
    }; */

  const handleClose = () => {
    setShowModal(false);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    let today = new Date();
    if (currentDate != today) {
      console.log("clocks sends")
      props.onDateChange(dayjs(currentDate).format('DD-MM-YYYY'));
    }
  };

  return (
    <div>
      <DatePicker
        selected={currentDate}
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy"
        customInput={<input style={{ cursor: 'pointer' }} />}
      />
      {/* <Button variant="secondary"
      disabled={isSameDay(currentDate, new Date())}
      onClick={handleConfirm}>
      Change System Time
      </Button> */}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Do you want to change the system time to ${dayjs(currentDate).format('DD-MM-YYYY')}?`}
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
