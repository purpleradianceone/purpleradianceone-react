import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useUserPreference } from "../../../context/user/UserPreference";
import LeadMeetingsModal from "../../modals/meetings/LeadMeetingsModal";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";


function Meetings() {
  const { userPreference } = useUserPreference();
  const { userHasAccessToViewMeeting } = useUserAccessModules();

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  useEffect(() => {
    if (!userHasAccessToViewMeeting) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewMeeting]);
  return (
    <div
      className={`flex min-w-[100%] ${
        userPreference.isLeftMenu ? "pl-4" : ""
      } `}
    >
       
      {userHasAccessToViewMeeting ? (
        <LeadMeetingsModal
          isMeetingModalOpenFromProp={true}
          isCalendarViewEnabled={true}
          showConnectToPlatform={false}
        />
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
      
    </div>
  );
}

export default Meetings;
