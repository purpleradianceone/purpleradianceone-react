import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";

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
        <div className="flex items-center justify-center">Home Screen</div>
    )
}

export default Dashboard;