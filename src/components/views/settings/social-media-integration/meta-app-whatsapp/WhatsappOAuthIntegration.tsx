import { MessageCircle } from "lucide-react";
import Button from "../../../../ui/Button";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../../../constants/Messages";
import ROUTES_URL from "../../../../../constants/Routes";
import { useNavigate } from "react-router-dom";

function WhatsappOAuthIntegration() {
  const navigate =useNavigate();
  const {userHasAccessToAddIntegrationSetting} = useUserAccessModules();

  const handleConnectButtonClick = () => {
    // Note : Check if the facebook is already connected or not.
    

    // Note : check if the user has add access for the integration module.
    if(!userHasAccessToAddIntegrationSetting){
      toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_ADD_ACCESS);
      return;
    }
    navigate(ROUTES_URL.WHATSAPP_OAUTH);
  };
  return (
    <div className="">
      <div className="flex items-center justify-center   h-96 max-h-screen  bg-gray-50  font-sans">
        <div className=" rounded-xl shadow-lg  overflow-auto  max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
          {/* Header Section */}
      
          <div className="text-center mb-1">
            <h1 className="main-title-custom tracking-tight">
              <MessageCircle className="w-12 h-12 main-title-custom-blue place-self-center"/>
              Integrate Whatsapp with  CRM
            </h1>
            <p className="input-label-custom mx-auto">
              Automatically capture and manage leads from linked Whatsppp phone number. This
              simple, one-time process securely links your business with 
              powerful CRM.
            </p>
          </div>

          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  md:mb-4">
            
          </div>

          {/* Button Section */}
          <div className="text-center">
            <div className="max-w-32 justify-self-center">
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleConnectButtonClick();
                }}
              >
                <div className="flex gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>Connect</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default WhatsappOAuthIntegration;
