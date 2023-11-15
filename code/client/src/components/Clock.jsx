import React, { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'react-bootstrap';

function Clock(props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newDate, setNewDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateChange = (date) => {
    setNewDate(date);
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
    if (newDate != today) {
      console.log("clocks sends")
      props.onDateChange(dayjs(newDate).format('DD-MM-YYYY'));
      setCurrentDate(newDate);
      setNewDate("");
    }
  };

  return (
    <div>
      <DatePicker
        className='mydatepicker'
        selected={currentDate}
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy"
        customInput={<input className='datepicker-input' type='text'/>}
      />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Do you want to change the system time to ${dayjs(newDate).format('DD-MM-YYYY')}?`}
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
