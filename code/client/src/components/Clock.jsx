import React, { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'react-bootstrap';

function Clock(props) {
  //const [currentDate, setCurrentDate] = useState(new Date());
  //const [newDate, setNewDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateChange = (date) => {
    props.setNewDate(date);
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
    if (props.newDate != today) {
      props.onDateChange(dayjs(props.newDate).format('DD-MM-YYYY'));
      props.setCurrentDate(props.newDate);
      props.setNewDate("");
      props.setShowClock(false);
    }
  };

  return (
    <div>
      <DatePicker
        className='mydatepicker'
        selected={props.currentDate}
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy"
        customInput={<input className='datepicker-input' type='text'/>}
      />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Do you want to change the system time to ${dayjs(props.newDate).format('DD-MM-YYYY')}?`}
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
