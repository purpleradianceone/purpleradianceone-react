import React, { useState } from 'react';
import Button from './ui/Button';


interface DateRangePickerProps {
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date ) => void;
  onSubmitButtonClick:()=>void
}

export function DateRangePicker({ onStartDateChange, onEndDateChange ,onSubmitButtonClick   }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    onStartDateChange( new Date(e.target.value) );
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    onEndDateChange( new Date(e.target.value) );
  };

  

  return (
    <div className="flex flex-col mr-2 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="relative">
        <label htmlFor="start-date" className="block text-xs font-medium text-gray-700 ">
          Start Date
        </label>
        <div className="relative">
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate}
            className="block w-full  text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        
        </div>
      </div>

      <div className="relative">
        <label htmlFor="end-date" className="block text-xs font-medium text-gray-700 ">
          End Date
        </label>
        <div className="relative">
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            className="block w-full  text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
         
        </div>
        
      </div>
      <div >
          <Button 
          className='bg-blue-600 mt-4 text-white text-sm px-2 py-1 hover:bg-blue-700 rounded-md'
          onClick={onSubmitButtonClick}
          >Search</Button>
        </div>
    </div>
  );
}