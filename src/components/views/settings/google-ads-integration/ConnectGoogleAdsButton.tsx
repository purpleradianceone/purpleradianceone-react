import axiosClient from "../../../../axios-client/AxiosClient";
import { GoogleIntegrationStatusType } from "./GoogleAdsIntegrationManagement";
import toast from "react-hot-toast";
import MESSAGE from "../../../../constants/Messages";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

/**
 * THIS IS THE MAIN CONNECT GOOGLE OAUTH BUTTON
 * @returns TSX
 */
export const ConnectGoogleAdsButton = ({
    googleIntegrationStatus
}:{
    googleIntegrationStatus : GoogleIntegrationStatusType | null
}) => {

    const {userHasAccessToAddIntegrationSetting} = useUserAccessModules();

  const handleConnect = async () => {
    if(googleIntegrationStatus?.isActive){
        toast.error(MESSAGE.ERROR.DENIED_GOOGLE_INTEGRATION_MESSAGE);
        return;
    }
    if(!userHasAccessToAddIntegrationSetting){
        toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_ADD_ACCESS);
        return;
    }

    try {
      const response = await axiosClient.get("http://localhost:8080/api/main/purple-crm-api/api/google/oauth/url", {
        withCredentials : true
      });
      const { authUrl } = response.data;

      // Redirect to Google Consent Screen
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error generating Google auth URL", error);
    }
  };

  if(!googleIntegrationStatus ){
    return null;
  }

  return (
    <button
      onClick={handleConnect}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4285F4",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Connect Google Ads
    </button>
  );
};
