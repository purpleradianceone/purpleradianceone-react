import { Video, Users } from 'lucide-react';
import { useGoogleMeetContext } from '../../../../context/meeting/GoogleMeetContext';
import { useZoomMeetingContext } from '../../../../context/meeting/ZoomMeetingContext';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../../../constants/Routes';
import Button from '../../../ui/Button';


function MeetingSettings() {
  const { googleMeetStatus } = useGoogleMeetContext();
  const { zoomMeetingStatus } = useZoomMeetingContext();
  const navigate = useNavigate();

  const meetingSettings = [
    {
      id: 1,
      name: "Connect to Google Meet",
      isConnected: googleMeetStatus.isConnected,
      icon: <Video className="w-6 h-6 text-green-500" />,
      iconBg: "bg-green-50"
    },
    {
      id: 2,
      name: "Connect to Zoom Meetings",
      isConnected: zoomMeetingStatus.isConnected,
      icon: <Video className="w-6 h-6 text-blue-500" />,
      iconBg: "bg-blue-50"
    },
    {
      id: 3,
      name: "Connect to Microsoft Teams",
      isConnected: false,
      icon: <Users className="w-6 h-6 text-purple-500" />,
      iconBg: "bg-purple-50"
    },
  ];

  return (
    <div className="w-full max-w-2xl min-h-96 mx-auto p-6 space-y-4">
      {meetingSettings.map((platform) => (
        <div
          key={platform.id}
          className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className={`${platform.iconBg} p-3 rounded-full`}>
              {platform.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {platform.name}
              </h3>
            </div>
          </div>

          <div>
            {platform.id !== 3 ? (
              <Button
                disabled={platform.isConnected}
                onClick={(e) => {
                  e.preventDefault();
                  if (platform.id === 1 && !googleMeetStatus.isConnected) {
                    navigate(ROUTES_URL.GOOGLE_OAUTH);
                  } else if (platform.id === 2 && !zoomMeetingStatus.isConnected) {
                    navigate(ROUTES_URL.ZOOM_OAUTH);
                  }
                }}
              >
                {platform.isConnected ? "Connected" : "Connect"}
              </Button>
            ) : (
              <Button disabled={true}>
                Coming Soon...
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeetingSettings;