import { Plus } from "lucide-react";
import LeadTaskTabs from "../../../tabs/LeadTasksTabs";

function LeadTasksModal() {
  return (
    <div className="w-full">
      <div className="w-full pt-1 pl-5 pr-1 gap-1">
        <div className="sticky top-16 p-1 flex bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex justify-between  w-full ">
              <h2 className="text-sm px-3 font-bold text-gray-800 mb-2 pb-2 border-b-2 border-blue-600">
                 Tasks
              </h2>
              <div className="flex justify-end items-center text-xs gap-x-2 text-gray-500">
                <span>Add</span>
                <button
                  disabled={false}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
          
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <LeadTaskTabs></LeadTaskTabs>
        </div>
      </div>
    </div>
  );
}

export default LeadTasksModal;
