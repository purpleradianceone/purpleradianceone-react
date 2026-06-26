import { Check, X } from "lucide-react";
import Button from "../ui/Button";
import { createPortal } from "react-dom";
import { SIZE, STRING_VALUES } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

// import POST_API from "../../constants/PostApi";
import { useEffect } from "react";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import { useSearchParams } from "react-router-dom";
import { useZoomMeetingContext } from "../../context/meeting/ZoomMeetingContext";
import POST_API from "../../constants/PostApi";

function ZoomMeetingsOAuthConsent() {
  const { loginStatus } = useLoggedInUserContext();
  const { zoomMeetingStatus, setZoomMeetingStatus } = useZoomMeetingContext();
  console.log(zoomMeetingStatus);

  const [searchParams] = useSearchParams();

  const handleClose = (isFlowCompleted: boolean) => {
    if (isFlowCompleted) {
      window.history.go(-7);
    }
    window.history.back();
  };

  const handleConfirm = () => {
    localStorage.setItem(
      LOCALSTORAGE_KEYS.REDIRECT_PLATFORM,
      STRING_VALUES.ZOOM_MEETINGS,
    );
    setZoomMeetingStatus({ isConnected: false });
    const baseUrl =  `${POST_API.ZOOM_MEET_CONNECT}`
      // "http://localhost:8080/api/main/purple-crm-api/authentication/zoom";
    const params = new URLSearchParams();
    params.append("company_id", loginStatus.companyId.toString());
    params.append("company_user_id", loginStatus.id.toString());
    params.append("createdby", loginStatus.id.toString());
    params.append(
      "redirect_url",
      window.location.origin + window.location.pathname,
    );
    window.location.href = `${baseUrl}?${params}`;
  };

  
 

  useEffect(() => {
    const zoomStatus = searchParams.get("zoom");

    if (zoomStatus === "success") {
      setZoomMeetingStatus({ isConnected: true });

      // optional toast
      // toast.success("Zoom connected successfully");
    } else if (zoomStatus === "error") {
      setZoomMeetingStatus({ isConnected: false });

      // toast.error("Zoom connection failed");
    }

    // clean URL
    if (zoomStatus) {
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          handleClose(false);
        }}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => {
            handleClose(false);
          }}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="section-header-custom mb-2">
            Sign In With Zoom Meetings
          </h2>
          <p className="input-label-custom">
            Do you want to signin with your Zoom account for managing meetings
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <div className="flex">
            <Button
              type="button"
              onClick={() => {
                handleClose(false);
              }}
            >
              <div className="flex items-center gap-1">
                <X size={SIZE.SIXTEEN} />
                {STRING_VALUES.CONFIRM}
              </div>
            </Button>
          </div>

          <div className="flex">
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
                // handleClose(true);
              }}
            >
              <div className="flex items-center gap-1">
                <Check size={SIZE.SIXTEEN} />
                {STRING_VALUES.CONFIRM}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ZoomMeetingsOAuthConsent;
