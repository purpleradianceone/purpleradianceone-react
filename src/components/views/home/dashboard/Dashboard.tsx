import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import LeadMeetingsModal from "../../../modals/meetings/LeadMeetingsModal";

function Dashboard(){
    const navigate = useNavigate();

    useEffect(() => {
      window.history.pushState(null, document.title, window.location.href);
  
      const handleBackButton = (event: PopStateEvent) => {
        event.preventDefault();
        navigate(ROUTES_URL.HOME, { replace: true }); 
      };
  
      window.addEventListener('popstate', handleBackButton);

      return () => {
        window.removeEventListener('popstate', handleBackButton);
      };
    }, [navigate]);

    

    return (
        <div className="flex w-full">
          <div className="flex min-w-[100%] ml-5">
              home Screen
          </div>
          
        </div>
    )
}

export default Dashboard;