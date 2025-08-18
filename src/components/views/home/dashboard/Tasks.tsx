import { useState } from 'react';
import { Calendar, Clock, CheckCircle, Phone, FileText, Mail, CheckSquare, Notebook } from 'lucide-react';
import LeadTaskType from '../../../../@types/lead-management/LeadTaskType';
import LoadingSpinner from '../../../../assets/animations/LoadingSpinner';


// Helper function to get icon based on activity name
const getActivityIcon = (activity: LeadTaskType) => {
  const activityType = activity.leadActivityId
  if (activityType === 1) return Phone;
  if (activityType === 2) return Mail;
  if (activityType === 3) return Mail;
  if (activityType === 4) return Calendar;
  if (activityType === 5) return CheckSquare;
  if (activityType === 6) return FileText;
  if (activityType === 7) return Notebook;
  if (activityType === 8) return CheckCircle;
  return Calendar;
};

// Helper function to get background color from hex color code
const getBgColorFromHex = (colorCode: string) => {
  const hex = colorCode.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

// Helper function to get border color from hex color code
const getBorderColorFromHex = (colorCode: string) => {
  const hex = colorCode.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.3)`;
};

const getIconColorFromHex = (colorCode: string) => {
  const hex = colorCode.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};


// Helper function to get priority styling
const getPriorityColor = (activity : LeadTaskType) => {
  switch (activity.leadTaskPriorityId) {
    case 1:
      return `bg-red-200 text-red-800 border-red-200`;
    case 2:
      return `bg-yellow-200 text-yellow-800 border-yellow-200`;
    case 3:
      return `bg-blue-200 text-blue-800 border-blue-200`;
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

function Tasks({
  isLoading,
  leadTasks,
  taskType,
} : {
  isLoading : boolean;
  leadTasks : LeadTaskType[];
  taskType : "upcoming" | "pending" | "completed";
}) {
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({});
  // State to manage hover for the custom tooltip
  // const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);


  const toggleDescription = (taskId: number) => {
    setExpandedDescriptions(prevState => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));
  };

  const DESCRIPTION_TRUNCATE_LENGTH = 80;




  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{taskType === 'upcoming' ? "Upcoming Tasks" : taskType === 'pending' ? "Pending Tasks" : "Completed Tasks"}</h3>
          <p className="text-gray-700">{taskType === 'upcoming' ? "Your scheduled activities and deadlines" : taskType === "pending" ? "Your Pending activities and deadlines" : "Your completed activities and deadlines"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {isLoading && (
          <LoadingSpinner></LoadingSpinner>
        )}
        {!isLoading && (
          
            <div className="space-y-4">
              {leadTasks.length === 0 && (
                <h3 className="text-2xl text-center font-bold text-gray-300 mb-2">{taskType === "upcoming" ? "No Upcoming Tasks" : taskType === "pending" ? "No Pending Tasks" : "No Completed Tasks"}</h3>
              )}
          {
          leadTasks.map((task, index) => {
            const IconComponent = getActivityIcon(task);
            const isDescriptionExpanded = expandedDescriptions[task.id];
            const showViewMore = task.description.length > DESCRIPTION_TRUNCATE_LENGTH;
            const displayedDescription =
              showViewMore && !isDescriptionExpanded
                ? `${task.description.substring(0, DESCRIPTION_TRUNCATE_LENGTH)}...`
                : task.description;

            // Ensure assignedToName is an array, default to empty if not present
            // const assignedNames = Array.isArray(task.assignedToName) ? task.assignedToName : [];


            return (
              <div
                key={task.id}
                className="flex items-start min-h-28 space-x-4 p-3 border-2 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer group"
                style={{
                  backgroundColor: getBgColorFromHex(task.colorCode),
                  borderColor: getBorderColorFromHex(task.colorCode),
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div
                  className="p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                  style={{ backgroundColor: getIconColorFromHex(task.colorCode) }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
                        {task.subject}
                      </h4>
                      <p className="text-xs text-gray-700 mt-1">
                        {displayedDescription}
                        {showViewMore && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(task.id);
                            }}
                            className="text-blue-600 hover:underline ml-1 text-xs"
                          >
                            {isDescriptionExpanded ? 'View Less' : 'View More'}
                          </button>
                        )}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(task)} flex-shrink-0`}>
                      {task.leadTaskPriorityName} Priority
                    </span>
                  </div>

                  <div className="flex-1 items-center justify-between mt-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-700">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">{task.dueDateTime}</span> {/* Displaying raw dueDateTime */}
                      </div>
                      {/* <div
                        className="relative flex gap-2"
                        onMouseEnter={() => setHoveredTaskId(task.id)}
                        onMouseLeave={() => setHoveredTaskId(null)}
                      >
                        <User className="w-3 h-3 text-gray-700" />
                        <span className="text-xs cursor-pointer">
                          {assignedNames.length > 1
                            ? `${assignedNames[0]} +${assignedNames.length - 1}`
                            : assignedNames[0] || 'Unassigned'
                          }
                        </span>
                        {hoveredTaskId === task.id && assignedNames.length > 0 && (
                          <div
                            className="absolute z-20 p-2 mt-1 bg-gray-800 text-white rounded shadow-lg"
                            style={{
                              top: '100%', 
                              left: '50%',
                              transform: 'translateX(-50%)',
                              whiteSpace: 'nowrap',
                              minWidth: 'max-content'
                            }}
                          >
                            <ul className="list-none p-0 m-0 text-xs">
                              {assignedNames.map((name, nameIndex) => (
                                <li key={nameIndex}>{name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div> */}
                      <span className="text-xs text-gray-700 px-1.5 py-0.5 bg-white rounded-full">
                        {task.leadTaskStageName}
                      </span>
                       <button
                    type='button'
                      className="text-xs text-gray-700 hover:text-gray-700 font-medium px-2 py-1 hover:bg-white rounded transition-colors flex-shrink-0"
                    >
                      {taskType === "completed" ?  `${task.completedAt}` : `${task.overdueStatus}`}
                    </button>
                    {taskType === "completed" && (
                        <button
                    type='button'
                      className="text-xs text-gray-700 hover:text-gray-700 font-medium px-2 py-1 hover:bg-white rounded transition-colors flex-shrink-0"
                    >
                      {task.overdueStatus}
                    </button>
                    )
                    }
                    </div>
                    {/* <button
                    type='button'
                      className="text-xs text-gray-700 hover:text-gray-700 font-medium px-2 py-1 hover:bg-white rounded transition-colors flex-shrink-0"
                    >
                      {taskType === "completed" ?  `${task.completedAt}` : `${task.overdueStatus}`}
                    </button>
                    {taskType === "completed" && (
                        <button
                    type='button'
                      className="text-xs text-gray-700 hover:text-gray-700 font-medium px-2 py-1 hover:bg-white rounded transition-colors flex-shrink-0"
                    >
                      {task.overdueStatus}
                    </button>
                    )
                    } */}
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
        
      </div>
    </div>
  );
}

export default  Tasks;