type CalendarEventType = {
  count?: number;
  companyId: number;
  id: number;
  companyUserId: number;
  meetingIdFromGoogle?: string;
  meetingStatusFromGoogle?: "confirmed" | "cancelled" | "";
  meetingLink?: string;
  meetingConferenceId?: string;
  meetingIdFromZoom?: number;
  meetingHostIdFromZoom?: string;
  meetingStatusFromZoom?:
    | "waiting"
    | "started"
    | "end"
    | "scheduled"
    | "closed"
    | "cancelled"
    | "";
  title: string;
  description: string;
  creatorEmail: string;
  zoomMeetingJoinLink?: string;
  zoomMeetingStartLink?: string;
  zoomMeetingPasswordGeneral?: string;
  zoomMeetingPasswordH323?: string;
  zoomMeetingPassworsPstn?: string;
  creatorAttenting: string;
  organizerEmail?: string;
  startDateByIST: string;
  endDateByIST: string;
  colorCode: string;
  startDateByUserTimeZone: Date;
  startDateByUserTimeZoneString: string;
  endDateByUserTimeZone: Date;
  endDateByUserTimeZoneString: string;
  attendeesEmailAll: string[];
  attendeesCompanyUserId: number[];
  isAttendeePresent: boolean;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdOn?: string;
  updatedOn?: string;
  platform: number;
  taskId?: number;
  masterId?: number;
};

export default CalendarEventType;

// {
//         "count": 1,//
//         "id": 1,//
//         "company_id": 1,//
//         "company_user_id": 2,//
//         "meeting_id_from_zoom": 78594620134,//
//         "meeting_host_id_from_zoom": "nVp3jzpcQZWz1Ai16ZCxQQ",//
//         "meeting_status_from_zoom": "waiting",//
//         "summary_title": "zoom Meeting test 12",//
//         "description": "zoom Meeting test 12",//
//         "creator_email": "shindevaibhav580@gmail.com",//
//         "meeting_join_link": "https://us04web.zoom.us/j/78594620134?pwd=bquXzBu05D9WU2evLWaDtzK7k7d6o3.1",//
//         "meeting_start_link": "https://us04web.zoom.us/s/78594620134?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMiIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJ3ZWIiLCJjbHQiOjAsIm1udW0iOiI3ODU5NDYyMDEzNCIsImF1ZCI6ImNsaWVudHNtIiwidWlkIjoiblZwM2p6cGNRWld6MUFpMTZaQ3hRUSIsInppZCI6ImQxYmNmYzMyMjI4NTRjOGM5MDkxMjlhOWU4NTIwMzdmIiwic2siOiIwIiwic3R5IjoxMDAsIndjZCI6InVzMDQiLCJleHAiOjE3NDc2NTc0OTcsImlhdCI6MTc0NzY1MDI5NywiYWlkIjoicnFzLU0zcjhUSENWU19KeDcxY0ZMUSIsImNpZCI6IiJ9.H5nVXbps9J7L64QmLAkNkLGvItCXtQ7hgskwWpByZGM",//
//         "meeting_password_general": "P0SMQ4",//
//         "meeting_h323_password": "951642",//
//         "meeting_pstn_password": "951642",//
//         "Start Date By Indian Time": "2025-05-20 15:30:00.0",//
//         "End Date By Indian Time": "2025-05-20 16:30:00.0",//
//         "Start Date By User Time Zone": "2025-05-20 15:30:00.0",//
//         "End Date By User Time Zone": "2025-05-20 16:30:00.0",//
//         "attendees_email_all": [
//             "shindevaibhav580@gmail.com",
//             "boscovaby@gmail.com"
//         ],//
//         "attendees_company_user_id": [
//             2,
//             3,
//             4
//         ],//
//         "isactive": true,//
//         "createdby": "Vaibhav Shinde",//
//         "updatedby": "Vaibhav Shinde",//
//         "createdon": "May 19, 2025",//
//         "updatedon": "May 19, 2025"//
//     }

//     {
//         "count": 2,
//         "company_id": 1,
//          "id": 7,
//         "company_user_id": 2,
//         "meeting_id_from_google": "6p4imihrckunh7ntqhag5jslh4",
//         "meeting_status_from_google": "confirmed",
//         "meeting_link": "https://meet.google.com/pzf-eykg-jwx",
//         "meeting_conference_id": "pzf-eykg-jwx",
//         "summary_title": "testing 25",
//         "description": "testing 25",
//         "creator_email": "shindevaibhav580@gmail.com",
//         "organizer_email": "27dc3e4dc3daec12801f61e80f8f3daa3e4d18f510c9f6d353e5934942d0fde1@group.calendar.google.com",
//         "Start Date By Indian Time": "2025-05-13 15:00:00.0",
//         "End Date By Indian Time": "2025-05-13 16:00:00.0",
//         "Start Date By User Time Zone": "2025-05-13 15:00:00.0",
//         "End Date By User Time Zone": "2025-05-13 16:00:00.0",
//         "attendees_email_all": [
//             "boscovaby@gmail.com",
//             "nitikesh.yewale@purpleradiance.com",
//             "pratik.pawar@purpleradiance.com",
//             "hrutik.sargar@purpleradiance.com",
//             "crm@purpleradiance.com",
//             "suraj.darade@purpleradiance.com",
//             "chandrakala.auti@purpleradiance.com"
//         ],
//         "attendees_company_user_id": [
//             2,
//             4,
//             9,
//             10,
//             11,
//             1,
//             8,
//             17
//         ],
//         "isactive": true,
//         "createdby": "Vaibhav Shinde",
//         "updatedby": "Vaibhav Shinde",z
//         "createdon": "May 13, 2025",
//         "updatedon": "May 13, 2025"
//     },
