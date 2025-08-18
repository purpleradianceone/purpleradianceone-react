import { useUserPreference } from "../../../context/user/UserPreference";
import LeadMeetingsModal from "../../modals/meetings/LeadMeetingsModal";


function Meetings(){
    const {userPreference} = useUserPreference();
    return (
        <div className={`flex min-w-[100%] ${userPreference.isLeftMenu ? "pl-4" : ""} `}>
<LeadMeetingsModal
         isMeetingModalOpenFromProp = {true}
          isCalendarViewEnabled = {true}
          showConnectToPlatform = {false}
          />
          </div>
    )
}

export default Meetings;