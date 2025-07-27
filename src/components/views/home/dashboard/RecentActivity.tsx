import { Clock, User, Phone, Calendar, FileText, CheckCircle, AlertCircle, Briefcase, CalendarCheck, CheckSquare, Edit, FileEdit, MailOpen, MailWarning, PhoneCall, PhoneMissed, PlusSquare, RefreshCcw, UserMinus, XCircle, Notebook } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'deal',
    title: 'Deal Closed',
    description: 'TechCorp Enterprise License - $45,000',
    time: '2 minutes ago',
    icon: CheckCircle,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700'
  },
  {
    id: 2,
    type: 'call',
    title: 'Call Completed',
    description: 'Follow-up call with Sarah Johnson',
    time: '1 hour ago',
    icon: Phone,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    id: 3,
    type: 'email',
    title: 'Proposal Sent',
    description: 'Q2 Marketing Package to Global Dynamics',
    time: '3 hours ago',
    icon: FileText,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  {
    id: 4,
    type: 'meeting',
    title: 'Demo Scheduled',
    description: 'Product demo with InnovateX team',
    time: '5 hours ago',
    icon: Calendar,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  {
    id: 5,
    type: 'contact',
    title: 'New Lead',
    description: 'Emma Wilson from StartupXYZ added',
    time: '8 hours ago',
    icon: User,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700'
  },
  {
    id: 6,
    type: 'task',
    title: 'Task Completed',
    description: 'Research competitor pricing models',
    time: '10 hours ago',
    icon: CheckSquare,
    color: 'bg-teal-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700'
  },
  {
    id: 7,
    type: 'note',
    title: 'New Note',
    description: 'Meeting notes from quarterly review',
    time: '12 hours ago',
    icon: Notebook,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  },
  {
    id: 8,
    type: 'deal',
    title: 'Deal Stage Change',
    description: 'Acme Corp - Negotiation stage',
    time: '1 day ago',
    icon: RefreshCcw,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  },
  {
    id: 9,
    type: 'call',
    title: 'Missed Call',
    description: 'Call from David Lee',
    time: '1 day ago',
    icon: PhoneMissed,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  {
    id: 10,
    type: 'email',
    title: 'Email Opened',
    description: 'Your marketing newsletter was opened',
    time: '2 days ago',
    icon: MailOpen,
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700'
  },
  {
    id: 11,
    type: 'meeting',
    title: 'Meeting Canceled',
    description: 'Team sync meeting',
    time: '2 days ago',
    icon: XCircle,
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700'
  },
  {
    id: 12,
    type: 'contact',
    title: 'Contact Updated',
    description: 'Phone number for John Smith updated',
    time: '3 days ago',
    icon: Edit,
    color: 'bg-lime-500',
    bgColor: 'bg-lime-50',
    textColor: 'text-lime-700'
  },
  {
    id: 13,
    type: 'task',
    title: 'New Task',
    description: 'Prepare presentation for client pitch',
    time: '3 days ago',
    icon: PlusSquare,
    color: 'bg-fuchsia-500',
    bgColor: 'bg-fuchsia-50',
    textColor: 'text-fuchsia-700'
  },
  {
    id: 14,
    type: 'note',
    title: 'Note Edited',
    description: 'Updated details on potential partnership',
    time: '4 days ago',
    icon: FileEdit,
    color: 'bg-violet-500',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700'
  },
  {
    id: 15,
    type: 'deal',
    title: 'New Deal Created',
    description: 'Prospect: Zenith Innovations',
    time: '5 days ago',
    icon: Briefcase,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    id: 16,
    type: 'call',
    title: 'Scheduled Call',
    description: 'Discovery call with new lead',
    time: '5 days ago',
    icon: PhoneCall,
    color: 'bg-sky-500',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700'
  },
  {
    id: 17,
    type: 'email',
    title: 'Email Bounced',
    description: 'Newsletter to old email address',
    time: '6 days ago',
    icon: MailWarning,
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700'
  },
  {
    id: 18,
    type: 'meeting',
    title: 'Meeting Rescheduled',
    description: 'Quarterly review with sales team',
    time: '6 days ago',
    icon: CalendarCheck,
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700'
  },
  {
    id: 19,
    type: 'contact',
    title: 'Contact Deleted',
    description: 'Old contact Jane Doe removed',
    time: '7 days ago',
    icon: UserMinus,
    color: 'bg-slate-500',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700'
  },
  {
    id: 20,
    type: 'task',
    title: 'Task Due Soon',
    description: 'Follow-up with pending invoice',
    time: '7 days ago',
    icon: AlertCircle,
    color: 'bg-red-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  }
];

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-y-auto border-gray-100 p-8 h-full flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h3>
          <p className="text-gray-600">Latest updates and interactions</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-3 rounded-xl ${activity.bgColor} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {activity.title}
                  </h4>
                  <div className="flex items-center space-x-1 text-gray-500 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">{activity.time}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;