// Clock.js
import React, { useState } from 'react';
import dayjs from 'dayjs';

function Clock({ onDateChange }) {
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  const handleChange = (event) => {
    const newDate = event.target.value;
    setCurrentDate(newDate);

    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <input
      type="date"
      value={currentDate}
      onChange={handleChange}
      style={{ cursor: 'pointer' }}
    />
  );
}

export default Clock;
