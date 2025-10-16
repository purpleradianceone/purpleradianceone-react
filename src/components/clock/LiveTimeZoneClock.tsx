import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

interface LiveTimezoneClockProps {
  /**
   * The IANA time zone name (e.g., "America/New_York", "Europe/London", "Asia/Kolkata").
   */
  timeZone: string;
  /**
   * The format string for displaying the time (e.g., "HH:mm:ss", "dd-MM-yyyy HH:mm:ss zzz").
   * Refer to date-fns format documentation for options.
   */
  formatString?: string;
  /**
   * Optional: A label to display above the clock.
   */
  label?: string;
}

const LiveTimezoneClock: React.FC<LiveTimezoneClockProps> = ({
  timeZone,
  formatString = "HH:mm:ss", // Default format
  label,
}) => {
  // State to hold the current time, initialized with a Date object
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Set up the interval when the component mounts
    const intervalId = setInterval(() => {
      // Update the state with a new Date object every second
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    // This is crucial to prevent memory leaks!
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once on mount and unmount

  // Format the current time for display using date-fns-tz
  const formattedTime = formatInTimeZone(currentTime, timeZone, formatString);

  return (
    <div style={{
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding : '0 8px' ,
    }}>
      {label && <div style={{ fontSize: '0.6em', color: '#555' }}>{label}</div>}
      <div className='input-label-custom-blue'>
        {formattedTime}{' '}
      </div>
      <div className='caption-custom'>
        { timeZone}
      </div>
    </div>
  );
};

export default LiveTimezoneClock;