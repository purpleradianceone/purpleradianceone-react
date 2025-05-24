import React from 'react';
import moment from 'moment';
import CalendarEventType from '../../../@types/meeting/CalendarEventType'; // Adjust path if needed
import { CalendarProps } from 'react-big-calendar';

// We tell this component to expect the props that RBC's agenda view provides,
// but we specify that the 'events' will be of your custom type.
const CustomCalendarAgendaView: React.FC<CalendarProps<CalendarEventType>> = ({
  date,
  events
}) => {
  // A helper to format time from your event objects
  const formatTime = (time: Date | undefined) => {
    if (!time) return '';
    return moment(time).format('h:mm A');
  };

  return (
    <div className="custom-agenda-container">
      {/* Date Header Row */}
      <div className="custom-agenda-date-header">
        <strong>
          {moment(date).format('dddd, MMMM Do, YYYY')}
        </strong>
      </div>

      {/* Events List for that Date */}
      <div className="custom-agenda-events-list">
        {events!.length > 0 ? (
          events!.map((event : CalendarEventType) => (
            <div key={event.id} className="custom-agenda-event-row">
              <div className="custom-agenda-event-time">
                {formatTime(event.startDateByUserTimeZone)} - {formatTime(event.endDateByUserTimeZone)}
              </div>
              <div className="custom-agenda-event-title">
                {event.title}
              </div>
              <div className="custom-agenda-event-platform">
                 {/* Optional: Show which platform it is */}
                 {event.platform === 1 && 'Google Meet'}
                 {event.platform === 2 && 'Zoom'}
              </div>
            </div>
          ))
        ) : (
          <div className="custom-agenda-event-row no-events">
            No meetings scheduled for this day.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCalendarAgendaView;