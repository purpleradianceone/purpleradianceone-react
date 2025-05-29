import LeadMeetingsModal from "../../modals/meetings/LeadMeetingsModal";


function Meetings(){
    return (
        <div className="flex min-w-[98%] ml-5">
<LeadMeetingsModal
         isMeetingModalOpenFromProp = {true}
          isCalendarViewEnabled = {true}
          showConnectToPlatform = {false}
          />
          </div>
    )
}

export default Meetings;