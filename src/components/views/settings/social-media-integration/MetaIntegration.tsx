import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2
} from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import MetaIcon from "../../../../assets/svg/MetaIcon";
import Button from "../../../ui/Button";
import { ResponseStatus } from "./MetaAppsIntegration";
import toast from "react-hot-toast";
import MESSAGE from "../../../../constants/Messages";
import FormLayout from "../../../ui/FormLayout";
import { SIZE } from "../../../../constants/AppConstants";
import { disconnectFacebookAccount } from "../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { handleApiError } from "../../../../config/error/handleApiError";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";

interface MetaIntegrationProps {
  faceBookConnectionStatus: ResponseStatus;
  getFacebookStatus: () => void;
}

const MetaIntegration: React.FC<MetaIntegrationProps> = ({
  faceBookConnectionStatus,
  getFacebookStatus
}) => {
  const navigate = useNavigate();
  const {loginStatus} = useLoggedInUserContext();
  const [showDisconnectPopUp, setShowDisconnectPopUp] =useState<boolean>(false);
  const {userHasAccessToUpdateIntegrationSetting, userHasAccessToAddIntegrationSetting} = useUserAccessModules();
  const [isDeleting , setIsDeleting] = useState<boolean>(false);

  const stepItems = [
    {
      icon: <MetaIcon className="w-6 h-6 table-header-custom-blue" />,
      title: "Sign In Securely",
      description:
        "You will be securely redirected to Meta's login page to authenticate with your personal Facebook account. This is a one-time process that allows us to access your business assets without ever seeing or storing your password.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 table-header-custom-green" />,
      title: "Select Your Business Assets",
      description:
        "From the list provided by Meta, select the Facebook Page, Instagram account, and WhatsApp Business account you wish to connect. You are granting us permission to securely retrieve leads and manage messages on your behalf.",
    },
    {
      icon: <Settings className="w-6 h-6 table-header-custom" />,
      title: "Activate Lead Capture",
      description:
        "Once you confirm, our system will automatically configure the necessary connections. Your CRM is now ready to receive new leads and customer chats from your selected Meta accounts in real-time.",
    },
  ];

  const handleConnectButtonClick = () => {
    // Note : Check if the facebook is already connected or not.
    if (faceBookConnectionStatus.isActive) {
      toast.error(MESSAGE.ERROR.DENIED_FACEBOOK_INTEGRATION_MESSAGE);
      return;
    }

    // Note : check if the user has add access for the integration module.
    if(!userHasAccessToAddIntegrationSetting){
      toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_ADD_ACCESS);
      return;
    }
    navigate(ROUTES_URL.FACEBOOK_OAUTH);
  };

  // Note : first show the pop up for the confirmation
  const handleDisconnectButtonClick = () => {
    setShowDisconnectPopUp(true);
  };

  // Note : disconnect facebbok api call here
  const handelConfirmFacebookAccountRemove =async () => {
    if(!userHasAccessToUpdateIntegrationSetting){
      toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_UPDATE_ACCESS);
      return;
    }
    try{
      setIsDeleting(true)
      
      const response = await disconnectFacebookAccount({
        company_id : loginStatus.companyId,
        requestedby : loginStatus.id
      });
      
      if(response){
        if(response.data.body.status){
          toast.success(response.data.body.message);
        }else{
          toast.error(response.data.body.message)
        }
        console.log(response);
        getFacebookStatus()
      }
    }catch(error){
      handleApiError(error)
    }finally{
      setIsDeleting(false)
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50  font-sans">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
          {/* Header Section */}
         {
          faceBookConnectionStatus.isActive && 
           <div className=" flex items-center justify-end">
            <div className="">
              <Button
              className="bg-white"
                title="Disconnect Facebook Account"
                onClick={handleDisconnectButtonClick}
                type="button"
              >
                <div className="flex   items-center ">
                  {/* <XCircle size={15} /> */}
                  {/* <a >disconnect</a> */}
                  <span className="underline   caption-custom hover:text-red-600">Disconnect</span>
                </div>
              </Button>
            </div>
          </div>
         }
          <div className="text-center mb-1">
            <h1 className="main-title-custom tracking-tight">
              <MetaIcon className="w-12 h-12 main-title-custom-blue place-self-center" />
              Integrate META with Your CRM
            </h1>
            <p className="input-label-custom mx-auto">
              Automatically capture and manage leads from your Facebook. This
              simple, one-time process securely links your business and allows
              us to centralize all your customer conversations into a single,
              powerful CRM.
            </p>
          </div>

          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8  md:mb-4">
            {stepItems.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-inner"
              >
                <div className="mb-4 section-header-custom">
                  <span className="bg-white rounded-full p-2 shadow-md inline-block min-w-8">
                    {index + 1}
                  </span>
                </div>
                <div className="mb-3">{step.icon}</div>
                <h3 className="section-header-custom mb-2">{step.title}</h3>
                <p className="input-label-custom">{step.description}</p>
              </div>
            ))}
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
                  <MetaIcon className="w-6 h-6" />
                  <span>Connect</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showDisconnectPopUp && (
        <FormLayout widthPercent={35} padding={1}>
          <div className="bg-pink-00 p-2 h-full">
            <div className="max-w-md rounded-xl space-y-5">
              {/* Header */}
              <div className="flex items-center border-b pb-1 gap-3">
                 
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="text-red-600 " size={SIZE.SAVE_BUTTON_LOGO_SIZE} />
                </div>

                <div className="text-lg font-semibold text-gray-800">
                  Confirm Removal
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-gray-600">
                Please confirm that you want to remove the Facebook integration.
              </div>

              {/* Warning Box */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-gray-700">
                Removing this integration will permanently delete all connected
                Facebook page information. This action cannot be undone.
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                   onClick={() => {
                    setShowDisconnectPopUp(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                disabled={isDeleting}
                 onClick={handelConfirmFacebookAccountRemove}
                  type="submit"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDeleting ? "bg-red-100":" bg-red-600 hover:bg-red-700"}  text-white  transition`}
                >
                  {
                    !isDeleting ? <>
                    
                    <Trash2 size={16} />
                  Confirm
                  </> : <>
                   <LoadingSpinner height={16} width={16} colour={"red"} /> Deleting
                  </>
                  }
                  
                </button>
              </div>
            </div>
          </div>
        </FormLayout>
      )}
    </>
  );
};

export default MetaIntegration;
