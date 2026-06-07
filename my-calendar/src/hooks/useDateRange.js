import { useState } from 'react';

export const useDateRange = () => {
  const [range, setRange] = useState({ start: null, end: null });

  const handleDateClick = (day) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: day, end: null });
    } else if (day < range.start) {
      setRange({ start: day, end: null });
    } else {
      setRange({ ...range, end: day });
    }
  };

  const isInRange = (day) => {
    if (!range.start || !range.end) return false;
    return day > range.start && day < range.end;
  };

  return { range, handleDateClick, isInRange };
};