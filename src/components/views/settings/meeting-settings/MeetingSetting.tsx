import { Plus } from "lucide-react";
import Button from "../../../ui/Button";

function MeetingSettings() {
  const meetingSettings = [
    {
      id: 1,
      name: "Connect to Google Meet",
    },
    {
      id: 2,
      name: "Connect to Zoom Meetings",
    },
    {
      id: 3,
      name: "Connect to Microsoft Teams",
    },
  ];

  return (
   <div className="w-full h-fit bg-gray-50 px-2 py-2">
  <div className="flex justify-between mb-1 text-gray-700 font-semibold text-xs"> {/* Adjusted font to xs, mb-1 */}
    <span className="ml-3">Platform</span>
    <span className="mr-16">Status</span>
  </div>
  <div className="space-y-1"> {/* Reduced vertical spacing */}
    {meetingSettings.map((per) => (
      <div
        key={per.id}
        className={
          per.id !== 3
            ? per.id !== 1
              ? "bg-red-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" /* Reduced padding, rounded-lg */
              : "bg-green-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" /* Reduced padding, rounded-lg */
            : "bg-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" /* Reduced padding, rounded-lg */
        }
      >
        <div className="text-gray-800 font-medium text-xs"> {/* Reduced font to xs */}
          {per.name}
        </div>

        <label className="inline-flex items-center cursor-pointer relative">
          {per.id === 1 && (
            <div className="min-w-36"> {/* Adjusted min-width for a more compact button */}
              <Button disabled={true} > {/* Apply smaller font and padding to Button */}
                <span className="ml-1">Connected</span> {/* Reduced ml */}
              </Button>
            </div>
          )}
          {per.id === 2 && (
            <div className="min-w-36"> {/* Adjusted min-width for a more compact button */}
              <Button> {/* Apply smaller font and padding to Button */}
                {/* Assuming Plus is an icon, it might need size adjustment if it's too large */}
                <Plus className="w-3 h-3" /> {/* Example: Adjusting icon size */}
                <span className="ml-1">Connect</span> {/* Reduced ml */}
              </Button>
            </div>
          )}
          {per.id === 3 && (
            <div className="min-w-36"> {/* Adjusted min-width for a more compact button */}
              <Button disabled={true}> {/* Apply smaller font and padding to Button */}
                <span className="ml-1">Coming Soon...</span> {/* Reduced ml */}
              </Button>
            </div>
          )}
        </label>
      </div>
    ))}
  </div>
</div>
  );
}

export default MeetingSettings;
