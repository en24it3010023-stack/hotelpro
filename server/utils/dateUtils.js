const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const validateDateRange = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: 'Invalid check-in or check-out date format.' };
  }

  if (start < today) {
    return { valid: false, message: 'Check-in date cannot be in the past.' };
  }

  if (end <= start) {
    return { valid: false, message: 'Check-out date must be at least one day after check-in date.' };
  }

  const nights = calculateNights(start, end);
  if (nights > 30) {
    return { valid: false, message: 'Maximum reservation length is 30 consecutive nights.' };
  }

  return { valid: true, nights };
};

const formatDisplayDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

module.exports = {
  calculateNights,
  validateDateRange,
  formatDisplayDate,
};
