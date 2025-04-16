/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Headset, X } from "lucide-react";
import LeadMeetingsModalProps from "../../../@types/modal/LeadMeetingsModalProps";
import { SIZE } from "../../../constants/AppConstants";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event } from 'react-big-calendar';
const localizer = momentLocalizer(moment);
import '../../../assets/styles/CalendarWithTicks.css';

function LeadMeetingsModal({ isOpen, onClose }: LeadMeetingsModalProps) {

  const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();
 
const hardcodedEvents: Event[] = [
  {
    title: 'Team Meeting',
    start: new Date(currentYear, currentMonth, currentDay, 10, 0), // Today, 10:00 AM
    end: new Date(currentYear, currentMonth, currentDay, 12, 0), // Today, 12:00 PM
    allDay: false,
    resource: 'Conference Room A',
    description: 'Discuss project milestones and upcoming tasks.',
  },
  {
    title: 'Code Review',
    start: new Date(currentYear, currentMonth, currentDay, 12, 0), // Today, 10:00 AM
    end: new Date(currentYear, currentMonth, currentDay, 14, 0), // Today, 12:00 PM
    allDay: false,
    resource: 'Conference Room A',
    description: 'Discuss project milestones and upcoming tasks.',
  },
  {
    title: 'Client Presentation',
    start: new Date(currentYear, currentMonth, currentDay + 1, 14, 0), // Tomorrow, 2:00 PM
    end: new Date(currentYear, currentMonth, currentDay + 1, 15, 30), // Tomorrow, 3:30 PM
    allDay: false,
    resource: 'Online Meeting',
    description: 'Present the product demo to the client.',
  },
  {
    title: 'Birthday Party',
    start: new Date(currentYear, currentMonth, currentDay + 2, 18, 0), // Two days from now, 6:00 PM
    end: new Date(currentYear, currentMonth, currentDay + 2, 22, 0), // Two days from now, 10:00 PM
    allDay: false,
    resource: 'Home',
    description: "Celebrate John's birthday!",
  },
  {
    title: 'All-Day Event',
    start: new Date(currentYear, currentMonth, currentDay + 3, 0, 0), // Three days from now, 12:00 AM
    end: new Date(currentYear, currentMonth, currentDay + 3, 23, 59), // Three days from now, 11:59 PM
    allDay: true,
    resource: 'Various Locations',
    description: 'A day full of activities.',
  },
    {
    title: 'Training Session',
    start: new Date(currentYear, currentMonth, currentDay + 4, 9, 0), // Four days from now, 9:00 AM
    end: new Date(currentYear, currentMonth, currentDay + 4, 11, 0), // Four days from now, 11:00 AM
    allDay: false,
    resource: 'Training Room B',
    description: 'Learn about new software features.',
  },
    {
    title: 'Project Review',
    start: new Date(currentYear, currentMonth, currentDay + 5, 13, 0), // Five days from now, 1:00 PM
    end: new Date(currentYear, currentMonth, currentDay + 5, 16, 0), // Five days from now, 4:00 PM
    allDay: false,
    resource: 'Conference Room C',
    description: 'Review project progress and plan next steps.',
  },

];

  const dayPropGetter = (date : any) => {
      const hasEvents = hardcodedEvents.some((event) => {
          const eventDate = moment(event.start).startOf('day');
          const currentDate = moment(date).startOf('day');
          console.log(eventDate)
          return eventDate.isSame(currentDate, 'day');
      });

      if (hasEvents) {
        
          return {
                className: 'day-with-event', // Or any highlight color you prefer
          };
      } else {
          return {}; // Return empty object if no events
      }
  };



  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-45 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl relative animate-fadeIn px-6 py-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <Headset className="text-blue-500" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Your Meetings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>
        </div>
        <div className="flex">
          <div className="cursor-pointer">
            <svg
              height="48px"
              viewBox="0 0 48 48"
              width="48px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                fill="#fff"
                height="16"
                transform="rotate(-90 20 24)"
                width="16"
                x="12"
                y="16"
              />
              <polygon
                fill="#1e88e5"
                points="3,17 3,31 8,32 13,31 13,17 8,16"
              />
              <path
                d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                fill="#4caf50"
              />
              <path
                d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                fill="#fbc02d"
              />
              <path
                d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"
                fill="#1565c0"
              />
              <polygon fill="#e53935" points="13,7 13,17 3,17" />
              <polygon fill="#2e7d32" points="38,24 37,32.45 27,24 37,15.55" />
              <path
                d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                fill="#4caf50"
              />
            </svg>
          </div>
          <div className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <circle cx="24" cy="24" r="20" fill="#2196f3"></circle>
              <path
                fill="#fff"
                d="M29,31H14c-1.657,0-3-1.343-3-3V17h15c1.657,0,3,1.343,3,3V31z"
              ></path>
              <polygon fill="#fff" points="37,31 31,27 31,21 37,17"></polygon>
            </svg>{" "}
          </div>
          <div className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <path
                fill="#5059c9"
                d="M44,22v8c0,3.314-2.686,6-6,6s-6-2.686-6-6V20h10C43.105,20,44,20.895,44,22z M38,16	c2.209,0,4-1.791,4-4c0-2.209-1.791-4-4-4s-4,1.791-4,4C34,14.209,35.791,16,38,16z"
              ></path>
              <path
                fill="#7b83eb"
                d="M35,22v11c0,5.743-4.841,10.356-10.666,9.978C19.019,42.634,15,37.983,15,32.657V20h18	C34.105,20,35,20.895,35,22z M25,17c3.314,0,6-2.686,6-6s-2.686-6-6-6s-6,2.686-6,6S21.686,17,25,17z"
              ></path>
              <circle cx="25" cy="11" r="6" fill="#7b83eb"></circle>
              <path
                d="M26,33.319V20H15v12.657c0,1.534,0.343,3.008,0.944,4.343h6.374C24.352,37,26,35.352,26,33.319z"
                opacity=".05"
              ></path>
              <path
                d="M15,20v12.657c0,1.16,0.201,2.284,0.554,3.343h6.658c1.724,0,3.121-1.397,3.121-3.121V20H15z"
                opacity=".07"
              ></path>
              <path
                d="M24.667,20H15v12.657c0,0.802,0.101,1.584,0.274,2.343h6.832c1.414,0,2.56-1.146,2.56-2.56V20z"
                opacity=".09"
              ></path>
              <linearGradient
                id="DqqEodsTc8fO7iIkpib~Na_zQ92KI7XjZgR_gr1"
                x1="4.648"
                x2="23.403"
                y1="14.648"
                y2="33.403"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#5961c3"></stop>
                <stop offset="1" stop-color="#3a41ac"></stop>
              </linearGradient>
              <path
                fill="url(#DqqEodsTc8fO7iIkpib~Na_zQ92KI7XjZgR_gr1)"
                d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"
              ></path>
              <path
                fill="#fff"
                d="M18.068,18.999H9.932v1.72h3.047v8.28h2.042v-8.28h3.047V18.999z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex mt-5">
        <div style={{ height: 400,width:1100 }}>
      <Calendar
        localizer={localizer}
        events={hardcodedEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(e)=>{
          alert(e.title)
        }}
        dayPropGetter={dayPropGetter}
      />
    </div>
        </div>
        
      </div>
    </div>
  );
}

export default LeadMeetingsModal;