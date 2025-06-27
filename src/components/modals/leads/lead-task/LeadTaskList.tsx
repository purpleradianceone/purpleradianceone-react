import {
  Phone,
  Mail,
  CalendarCheck,
  HeadsetIcon,
  HandHelping,
  HandCoinsIcon,
  Notebook,
  Clipboard,
} from "lucide-react"; // Corrected import for Lucide React icons

interface Activity {
  id: string;
  tastStatusId : number
  type:
    | "phoneCall"
    | "Email"
    | "physicalMeeting"
    | "onlineMeeting"
    | "demoPresentation"
    | "proposalQuotation"
    | "notes"
    | "other";
  description: string;
  date: string; // Could be Date object, but string for simplicity in dummy data
  leadName: string;
}

// Define the props interface for the ActivitiesList component
// interface ActivitiesListProps {
//   activities: Activity[];
// }

function LeadTaskList({
  tastStatusId
} : {
  tastStatusId : number
}) {
  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "phoneCall":
        return <Phone className="text-green-500" size={20} />;
      case "Email":
        return <Mail className="text-red-500" size={20} />;
      case "physicalMeeting":
        return <CalendarCheck className="text-yellow-500" size={20} />;
      case "onlineMeeting":
        return <HeadsetIcon className="text-green-500" size={20} />;
      case "demoPresentation":
        return <HandHelping className="text-yellow-500" size={20} />;
      case "proposalQuotation":
        return <HandCoinsIcon className="text-red-500" size={20} />;
      case 'notes':
        return <Notebook className='text-green-500' size={20}/>
      case 'other':
        return <Clipboard className='text-red-500' size={20}/>
      default:
        return null;
    }
  };

  // const activities: Activity[] = [
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "9",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "10",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "11",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "12",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "1",
  //     tastStatusId : 1,
  //     type: "phoneCall",
  //     description: "Initial discovery call to understand client needs",
  //     date: "2024-06-25 10:00 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "2",
  //     type: "Email",
  //     tastStatusId : 2,
  //     description: "Sent follow-up email with product brochure",
  //     date: "2024-06-24 03:30 PM",
  //     leadName: "Bob Williams",
  //   },
  //   {
  //     id: "3",
  //     type: "physicalMeeting",
  //     tastStatusId : 3,
  //     description: "Scheduled demo meeting for new software feature",
  //     date: "2024-06-23 02:00 PM",
  //     leadName: "Charlie Davis",
  //   },
  //   {
  //     id: "4",
  //     type: "onlineMeeting",
  //     tastStatusId : 4,
  //     description: "Follow-up call regarding pricing proposal",
  //     date: "2024-06-22 11:45 AM",
  //     leadName: "Alice Johnson",
  //   },
  //   {
  //     id: "5",
  //     type: "demoPresentation",
  //     tastStatusId : 5 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "6",
  //     type: "proposalQuotation",
  //     tastStatusId : 6 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "7",
  //     type: "notes",
  //     tastStatusId : 7 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  //   {
  //     id: "8",
  //     type: "other",
  //     tastStatusId : 8 ,
  //     description: "Responded to inquiry about service customization",
  //     date: "2024-06-21 09:15 AM",
  //     leadName: "David Lee",
  //   },
  // ];


  const activities: Activity[] = [
  {
    id: "1",
    tastStatusId: 1,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 1)",
    date: "2025-06-27 05:13 AM",
    leadName: "Emily Brown",
  },
  {
    id: "2",
    tastStatusId: 1,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 2)",
    date: "2025-06-27 05:14 AM",
    leadName: "Michael Green",
  },
  {
    id: "3",
    tastStatusId: 1,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 3)",
    date: "2025-06-27 05:15 AM",
    leadName: "Sarah White",
  },
  {
    id: "4",
    tastStatusId: 1,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 4)",
    date: "2025-06-27 05:16 AM",
    leadName: "James Black",
  },
  {
    id: "5",
    tastStatusId: 1,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 5)",
    date: "2025-06-27 05:17 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "6",
    tastStatusId: 1,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 6)",
    date: "2025-06-27 05:18 AM",
    leadName: "William Red",
  },
  {
    id: "7",
    tastStatusId: 1,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 7)",
    date: "2025-06-27 05:19 AM",
    leadName: "Emily Brown",
  },
  {
    id: "8",
    tastStatusId: 1,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 8)",
    date: "2025-06-27 05:20 AM",
    leadName: "Michael Green",
  },
  {
    id: "9",
    tastStatusId: 2,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 9)",
    date: "2025-06-27 05:21 AM",
    leadName: "Sarah White",
  },
  {
    id: "10",
    tastStatusId: 2,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 10)",
    date: "2025-06-27 05:22 AM",
    leadName: "James Black",
  },
  {
    id: "11",
    tastStatusId: 2,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 11)",
    date: "2025-06-27 05:23 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "12",
    tastStatusId: 2,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 12)",
    date: "2025-06-27 05:24 AM",
    leadName: "William Red",
  },
  {
    id: "13",
    tastStatusId: 2,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 13)",
    date: "2025-06-27 05:25 AM",
    leadName: "Emily Brown",
  },
  {
    id: "14",
    tastStatusId: 2,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 14)",
    date: "2025-06-27 05:26 AM",
    leadName: "Michael Green",
  },
  {
    id: "15",
    tastStatusId: 2,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 15)",
    date: "2025-06-27 05:27 AM",
    leadName: "Sarah White",
  },
  {
    id: "16",
    tastStatusId: 2,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 16)",
    date: "2025-06-27 05:28 AM",
    leadName: "James Black",
  },
  {
    id: "17",
    tastStatusId: 3,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 17)",
    date: "2025-06-27 05:29 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "18",
    tastStatusId: 3,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 18)",
    date: "2025-06-27 05:30 AM",
    leadName: "William Red",
  },
  {
    id: "19",
    tastStatusId: 3,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 19)",
    date: "2025-06-27 05:31 AM",
    leadName: "Emily Brown",
  },
  {
    id: "20",
    tastStatusId: 3,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 20)",
    date: "2025-06-27 05:32 AM",
    leadName: "Michael Green",
  },
  {
    id: "21",
    tastStatusId: 3,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 21)",
    date: "2025-06-27 05:33 AM",
    leadName: "Sarah White",
  },
  {
    id: "22",
    tastStatusId: 3,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 22)",
    date: "2025-06-27 05:34 AM",
    leadName: "James Black",
  },
  {
    id: "23",
    tastStatusId: 3,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 23)",
    date: "2025-06-27 05:35 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "24",
    tastStatusId: 3,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 24)",
    date: "2025-06-27 05:36 AM",
    leadName: "William Red",
  },
  {
    id: "25",
    tastStatusId: 4,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 25)",
    date: "2025-06-27 05:37 AM",
    leadName: "Emily Brown",
  },
  {
    id: "26",
    tastStatusId: 4,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 26)",
    date: "2025-06-27 05:38 AM",
    leadName: "Michael Green",
  },
  {
    id: "27",
    tastStatusId: 4,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 27)",
    date: "2025-06-27 05:39 AM",
    leadName: "Sarah White",
  },
  {
    id: "28",
    tastStatusId: 4,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 28)",
    date: "2025-06-27 05:40 AM",
    leadName: "James Black",
  },
  {
    id: "29",
    tastStatusId: 4,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 29)",
    date: "2025-06-27 05:41 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "30",
    tastStatusId: 4,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 30)",
    date: "2025-06-27 05:42 AM",
    leadName: "William Red",
  },
  {
    id: "31",
    tastStatusId: 4,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 31)",
    date: "2025-06-27 05:43 AM",
    leadName: "Emily Brown",
  },
  {
    id: "32",
    tastStatusId: 4,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 32)",
    date: "2025-06-27 05:44 AM",
    leadName: "Michael Green",
  },
  {
    id: "33",
    tastStatusId: 5,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 33)",
    date: "2025-06-27 05:45 AM",
    leadName: "Sarah White",
  },
  {
    id: "34",
    tastStatusId: 5,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 34)",
    date: "2025-06-27 05:46 AM",
    leadName: "James Black",
  },
  {
    id: "35",
    tastStatusId: 5,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 35)",
    date: "2025-06-27 05:47 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "36",
    tastStatusId: 5,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 36)",
    date: "2025-06-27 05:48 AM",
    leadName: "William Red",
  },
  {
    id: "37",
    tastStatusId: 5,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 37)",
    date: "2025-06-27 05:49 AM",
    leadName: "Emily Brown",
  },
  {
    id: "38",
    tastStatusId: 5,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 38)",
    date: "2025-06-27 05:50 AM",
    leadName: "Michael Green",
  },
  {
    id: "39",
    tastStatusId: 5,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 39)",
    date: "2025-06-27 05:51 AM",
    leadName: "Sarah White",
  },
  {
    id: "40",
    tastStatusId: 5,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 40)",
    date: "2025-06-27 05:52 AM",
    leadName: "James Black",
  },
  {
    id: "41",
    tastStatusId: 1,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 41)",
    date: "2025-06-27 05:53 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "42",
    tastStatusId: 2,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 42)",
    date: "2025-06-27 05:54 AM",
    leadName: "William Red",
  },
  {
    id: "43",
    tastStatusId: 3,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 43)",
    date: "2025-06-27 05:55 AM",
    leadName: "Emily Brown",
  },
  {
    id: "44",
    tastStatusId: 4,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 44)",
    date: "2025-06-27 05:56 AM",
    leadName: "Michael Green",
  },
  {
    id: "45",
    tastStatusId: 5,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 45)",
    date: "2025-06-27 05:57 AM",
    leadName: "Sarah White",
  },
  {
    id: "46",
    tastStatusId: 1,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 46)",
    date: "2025-06-27 05:58 AM",
    leadName: "James Black",
  },
  {
    id: "47",
    tastStatusId: 2,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 47)",
    date: "2025-06-27 05:59 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "48",
    tastStatusId: 3,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 48)",
    date: "2025-06-27 06:00 AM",
    leadName: "William Red",
  },
  {
    id: "49",
    tastStatusId: 1,
    type: "phoneCall",
    description: "Initial discovery call to understand client needs (Modified 49)",
    date: "2025-06-27 06:01 AM",
    leadName: "Emily Brown",
  },
  {
    id: "50",
    tastStatusId: 2,
    type: "Email",
    description: "Sent follow-up email with product brochure (Modified 50)",
    date: "2025-06-27 06:02 AM",
    leadName: "Michael Green",
  },
  {
    id: "51",
    tastStatusId: 3,
    type: "physicalMeeting",
    description: "Scheduled demo meeting for new software feature (Modified 51)",
    date: "2025-06-27 06:03 AM",
    leadName: "Sarah White",
  },
  {
    id: "52",
    tastStatusId: 4,
    type: "onlineMeeting",
    description: "Follow-up call regarding pricing proposal (Modified 52)",
    date: "2025-06-27 06:04 AM",
    leadName: "James Black",
  },
  {
    id: "53",
    tastStatusId: 5,
    type: "demoPresentation",
    description: "Responded to inquiry about service customization (Modified 53)",
    date: "2025-06-27 06:05 AM",
    leadName: "Olivia Blue",
  },
  {
    id: "54",
    tastStatusId: 4,
    type: "proposalQuotation",
    description: "Responded to inquiry about service customization (Modified 54)",
    date: "2025-06-27 06:06 AM",
    leadName: "William Red",
  },
  {
    id: "55",
    tastStatusId: 5,
    type: "notes",
    description: "Responded to inquiry about service customization (Modified 55)",
    date: "2025-06-27 06:07 AM",
    leadName: "Emily Brown",
  },
  {
    id: "56",
    tastStatusId: 1,
    type: "other",
    description: "Responded to inquiry about service customization (Modified 56)",
    date: "2025-06-27 06:08 AM",
    leadName: "Michael Green",
  },
];

const filteredActivities = activities.filter((activity) => {
  if (tastStatusId === 1) {
    return true;
  } else {
    return (
      (activity.tastStatusId === 2 ||
        activity.tastStatusId === 3 ||
        activity.tastStatusId === 4 ||
        activity.tastStatusId === 5) &&
      activity.tastStatusId === tastStatusId
    );
  }
});
  return (
    <div className="p-1 bg-gray-50 ">
      <div className="max-w-4xl mx-auto">
        
        
        

       {activities.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-10">No activities found for this lead.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"> {/* Reduced space between items */}
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 border border-gray-100" // Adjusted padding, rounded corners, shadow, spacing
              >
                {/* Activity Icon */}
                <div className="flex-shrink-0 p-1 bg-blue-100 rounded-full"> {/* Smaller padding, subtle background */}
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate"> {/* Smaller font, less bold */}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-600"> {/* Smaller font */}
                    <span className="font-medium">{activity.type}</span> with{' '}
                    <span className="font-medium text-blue-700">{activity.leadName}</span>
                  </p>
                </div>

                {/* Date */}
                <div className="flex-shrink-0 text-xs text-gray-500 sm:text-right"> {/* Smallest font, lighter color */}
                  {activity.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadTaskList;
