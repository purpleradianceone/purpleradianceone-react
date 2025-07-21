import Button from "../../../ui/Button";
import { useGoogleMeetContext } from "../../../../context/meeting/GoogleMeetContext";
import { useZoomMeetingContext } from "../../../../context/meeting/ZoomMeetingContext";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";

function MeetingSettings() {
  const { googleMeetStatus } = useGoogleMeetContext();
  const { zoomMeetingStatus } = useZoomMeetingContext();

  const navigate = useNavigate();
  const meetingSettings = [
    {
      id: 1,
      name: "Connect to Google Meet",
      isConnected: googleMeetStatus.isConnected,
    },
    {
      id: 2,
      name: "Connect to Zoom Meetings",
      isConnected: zoomMeetingStatus.isConnected,
    },
    {
      id: 3,
      name: "Connect to Microsoft Teams",
      isConnected: false,
    },
  ];

  return (
    <div className="w-full h-fit bg-gray-50 px-2 py-2">
      <div className="flex justify-between mb-1 text-gray-700 font-semibold text-xs">
        {" "}
        {/* Adjusted font to xs, mb-1 */}
        <span className="ml-3">Platform</span>
        <span className="mr-16">Status</span>
      </div>
      <div className="space-y-1">
        {" "}
        {/* Reduced vertical spacing */}
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
            <div className="text-gray-800 font-medium text-xs">
              {" "}
              {/* Reduced font to xs */}
              {per.name}
            </div>

            <label className="inline-flex items-center cursor-pointer relative">
              {per.id !== 3 && (
                <div className="min-w-36">
                  <Button
                    disabled={per.isConnected}
                    onClick={(e) => {
                      e.preventDefault();
                      if (per.id === 1) {
                        if (!googleMeetStatus.isConnected) {
                          navigate(ROUTES_URL.GOOGLE_OAUTH);
                        }
                      } else if (per.id === 2) {
                        if (!zoomMeetingStatus.isConnected) {
                          navigate(ROUTES_URL.ZOOM_OAUTH);
                        }
                      }
                    }}
                  >
                    <span className="ml-1">
                      {per.isConnected ? "Connected" : "Connect"}
                    </span>
                  </Button>
                </div>
              )}
              {per.id === 3 && (
                <div className="min-w-36">
                  {" "}
                  {/* Adjusted min-width for a more compact button */}
                  <Button disabled={true}>
                    {" "}
                    {/* Apply smaller font and padding to Button */}
                    <span className="ml-1">Coming Soon...</span>{" "}
                    {/* Reduced ml */}
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
