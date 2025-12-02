
import React, { useState } from 'react';
import DateRangePickerProps from '../../@types/ui/DateRangePickerProps';
// import Button from './ui/Button';




function DateRangePicker({ onStartDateChange, onEndDateChange,   }: DateRangePickerProps) {

  const getDefaultStartDate = () => {
   
    const today = new Date();
    const date10DaysAgo = new Date(today); // Create a new Date object to avoid modifying 'today'
    date10DaysAgo.setDate(today.getDate() - 10); // Subtract 10 days

    // Format the date to YYYY-MM-DD
    return date10DaysAgo.toISOString().split('T')[0];
  };


  const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    onStartDateChange( new Date(e.target.value) );
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    onEndDateChange( new Date(e.target.value) );
  };

  //   // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  return (
    <div className="flex  flex-col space-y-4 sm:flex-row sm:space-x-1 sm:space-y-0">
      <div className="relative flex gap-1 justify-center items-center">
        <label htmlFor="start-date" className="block caption-custom">
          From :
        </label>
        <div className="relative">
          <input
            type="date"
            id="start-date"
            value={startDate }
            onChange={handleStartDateChange}
            max={endDate ? endDate : getCurrentDate() }
            // min={endDate}
            className="block w-full caption-custom border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        
        </div>
      </div>

      <div className="relative flex gap-1 justify-center items-center">
        <label htmlFor="end-date" className="block caption-custom">
           To :
        </label>
        <div className="relative">
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            max={getCurrentDate()}
            
            className="block w-full  caption-custom border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
         
        </div>
        
      </div>
    </div>
  );
}

export default DateRangePicker;