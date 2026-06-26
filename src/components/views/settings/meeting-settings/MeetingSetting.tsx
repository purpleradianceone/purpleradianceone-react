// import { useGoogleMeetContext } from "../../../../context/meeting/GoogleMeetContext";
import { useZoomMeetingContext } from "../../../../context/meeting/ZoomMeetingContext";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import Button from "../../../ui/Button";
import GoogleMeetIcon from "../../../../assets/svg/GoogleMeetIcon";
import ZoomMeetingsIcon from "../../../../assets/svg/ZoomMeetingsIcon";
import TeamsIcon from "../../../../assets/svg/TeamsIcon";
// import { useGoogleMeetStatus } from "../../../../config/hooks/useGoogleMeetStatus";
import { useZoomMeetingsStatus } from "../../../../config/hooks/useZoomMeetingsStatus";
import { Mail } from "lucide-react";
import axiosClient from "../../../../axios-client/AxiosClient";
import POST_API from "../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { handleApiError } from "../../../../config/error/handleApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useEffect, useState } from "react";
import { GoogleMeetStatus } from "../../../../@types/meeting/GoogleMeetStatus";

function MeetingSettings() {
  // useGoogleMeetStatus();
 useZoomMeetingsStatus();
  const { loginStatus } = useLoggedInUserContext();

  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean> (false);
  const [googleMeetStatus, setGoogleMeetStatus] = useState<GoogleMeetStatus>();
  // const {setGoogleMeetStatus} = useGoogleMeetContext();

  const getGoogleMeetStatus = async () => {
    try {
      const response = await axiosClient.post(
        POST_API.GOOGLE_MEET_STATUS,
        {
          requestedby: loginStatus.id,
          company_id: loginStatus.companyId,
          company_user_id: loginStatus.id,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status == STATUS_CODE.OK) {
        const item = response.data[0];

        const formattedData: GoogleMeetStatus = {
          userName: item["User Name"],
          company_id: item.company_id,
          company_user_id: item.company_user_id,
          createdby: item.createdby,
          createdon: item.createdon,
          current_date: item.current_date,
          gmail_address: item.gmail_address,
          id: item.id,
          isactive: item.isactive,
        };

        setGoogleMeetStatus(formattedData);
      } else {
        alert();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {      
      // handleApiError(error);
    }
  };

  //get the status of the google meet
  useEffect(() => {
    getGoogleMeetStatus();
  }, []);

  // =============================
    // Revoke Google
    // =============================
    const revokeGoogleCalendar = async () => {
      try {
        setIsUpdateLoading(true);
  
        await axiosClient.post(POST_API.GOOGLE_CALENDAR_REVOKE, {
          company_id: loginStatus.companyId,
          company_user_id: loginStatus.id,
          calendar_type_id: 1,
          isactive: true,
          requestedby_id: loginStatus.id,
          updatedby_id: loginStatus.id,
        });

       await  getGoogleMeetStatus()
        // setIsGoogleConnected(false);
      } catch (error) {
        console.error("Error revoking Google:", error);
      } finally {
        setIsUpdateLoading(false);
      }
    };

    // =============================
    // Revoke Zoom meeting
    // =============================
    const revokeZoomMeet = async () => {
      try {
        setIsUpdateLoading(true);
  
        await axiosClient.post(POST_API.ZOOM_MEET_REVOKE, {
          company_id: loginStatus.companyId,
          company_user_id: loginStatus.id,
          requestedby_id: loginStatus.id,
          updatedby_id: loginStatus.id,
        });

        
        await refreshZoomMeetingStatus()
  
        // setIsGoogleConnected(false);
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsUpdateLoading(false);
      }
    };

  // const { googleMeetStatus } = useGoogleMeetContext();
  const { zoomMeetingStatus , refreshZoomMeetingStatus } = useZoomMeetingContext();
  const navigate = useNavigate();

  // const fetchProviderStatus = async () => {
  //     if (!userHasAccessToViewSettingReminder) return;
  //     try {
  //       setIsLoading(true);

  //       const response = await axiosClient.post(
  //         POST_API.GET_GOOGLE_CALENDAR_PROVIDER_STATUS,
  //         {
  //           company_user_id: loginStatus.id,
  //           company_id: loginStatus.companyId,
  //           requestedby_id: loginStatus.id,
  //         },
  //         {
  //           withCredentials: true,
  //         },
  //       );

  //       const data = response.data;
  //       console.log(data);

  //       if (data && data.length > 0) {
  //         const googleProvider = data.find((p: any) => p.calendar_type_id == 1);
  //         const outlookProvider = data.find((p: any) => p.calendar_type_id == 2);

  //         if (googleProvider) {
  //           setGoogleCalendarData(googleProvider);
  //           setIsGoogleConnected(googleProvider.isactive);
  //         }
  //         if (outlookProvider) {
  //           setIsoutlookConnected(outlookProvider.isactive);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching provider status:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  const meetingSettings = [
    {
      id: 1,
      name: "Connect to Google Meet",
      mail: googleMeetStatus?.gmail_address,
      isConnected: googleMeetStatus?.isactive,
      icon: <GoogleMeetIcon className="w-6 h-6 text-green-500" />,
      iconBg: "bg-green-50",
      connect_status : "Google Meet Linked Account"
    },
    {
      id: 2,
      name: "Connect to Zoom Meetings",
      mail: zoomMeetingStatus.email,
      isConnected: zoomMeetingStatus.isConnected,
      icon: <ZoomMeetingsIcon className="w-6 h-6 text-blue-500" />,
      iconBg: "bg-blue-50",
      connect_status : "Zoom Linked Account"

    },
    {
      id: 3,
      name: "Connect to Microsoft Teams",
      mail: zoomMeetingStatus.email,
      isConnected: false,
      icon: <TeamsIcon className="w-6 h-6 text-purple-500" />,
      iconBg: "bg-purple-50",
      connect_status : "Microsoft Teams linked account"

    },
  ];
  return (
    <div className="w-full max-w-2xl min-h-[81vh] mx-auto p-6 space-y-4">
      {meetingSettings.map((platform) => (
        <div
          key={platform.id}
          className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className={`${platform.iconBg} p-3 rounded-full`}>
              {platform.icon}
            </div>
            <div className="flex flex-col">
              <h3 className="table-header-custom">{!platform.isConnected ?  platform.name : platform.connect_status}</h3>
              {platform.isConnected && platform.mail && (
                <p className="text-xs flex items-center gap-1 text-gray-500 mt-1">
                  <Mail size={12} color="red" />
                  Connected as:{" "}
                  <span className="font-medium">{platform.mail}</span>
                </p>
              )}
            </div>
          </div>

          <div className="min-w-32">
            {platform.id !== 3 ? (
              <Button
              className={`self-end px-3 py-1 text-sm text-white rounded transition ${!isUpdateLoading ? "" : "cursor-not-allowed bg-blue-200 hover:bg-blue-200"} ${
          platform.isConnected
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
                type="submit"
                disabled={isUpdateLoading}
                onClick={(e) => {
                  e.preventDefault();
                  if(!platform.isConnected){

                    if (platform.id === 1 && !googleMeetStatus?.isactive) {
                      navigate(ROUTES_URL.GOOGLE_OAUTH);
                    } else if (
                      platform.id === 2 &&
                      !zoomMeetingStatus.isConnected
                    ) {
                      navigate(ROUTES_URL.ZOOM_OAUTH);
                    }
                  }else {
                    // user wants to disconnect intagration
                    if(platform.id ===1){
                      revokeGoogleCalendar()
                    }else if (platform.id ===2){
                      revokeZoomMeet();
                    }
                  }
                
                }
                }
              >
                {platform.isConnected ? "Revoke" : "Connect"}
              </Button>
            ) : (
              <Button disabled={true}>Coming Soon...</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeetingSettings;
