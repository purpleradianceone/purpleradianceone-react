import { useEffect, useState } from "react";
import { getFacebookComapnyStatus } from "../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import MetaIntegration from "./MetaIntegration";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { handleApiError } from "../../../../config/error/handleApiError";
import FormSkeleton from "../../../modals/Account/FormSkeleton";
import { AlertCircle } from "lucide-react";

export type ResponseStatus = {
  createdBy: string;
  createdOn: string;
  expiringOn: string;
  isActive: boolean;
  id: number;
};
function MetaAppsIntegration() {
  const { loginStatus } = useLoggedInUserContext();
  const [loading, setLoading] = useState<boolean>(false);

  //Note : storing api response here , to show if the facebook account is connected or not
  const [facebookStatus, setFacebookStatus] = useState<ResponseStatus>({
    createdBy: "",
    createdOn: "",
    expiringOn: "",
    id: 0,
    isActive: false,
  });
  const getFacebookStatus = async () => {
    // Note : loading state true
    setLoading(true);

    try {
      // Note : post data
      const postData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
      };

      // Note : api call here
      const response = await getFacebookComapnyStatus(postData);
     

      if (response.status === STATUS_CODE.OK) {
        const res= response.data;

        const formattedData : ResponseStatus ={
          createdBy : res.createdby,
          createdOn : res.createdon,
          expiringOn : res.expiringOn,
          id : res.id,
          isActive : res.isactive,
        }
        setFacebookStatus(formattedData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Note : api call on first render
  useEffect(() => {
    getFacebookStatus();
  }, []);

  // Note : show the skeleton till api executes
  if (loading) {
    return (
      <div className="w-full h-full">
        <FormSkeleton />
      </div>
    );
  }
  return (
    <div className="relative">
      {
        <div
          className={`w-full border ${facebookStatus.isActive ? "bg-green-100 border-green-300 text-green-700" : "bg-red-100 border-red-300 text-red-700"}    px-4 py-3 rounded-md flex items-center justify-center gap-2`}
        >
          <AlertCircle size={18} />          
          {facebookStatus.isActive ? (
            <span className="font-medium ">
            Facebook Account is connected, integrate pages or whatsapp account on other tabs.
            </span>
          ) : <span className="font-medium ">
              Facebook Account is not connected.
            </span>}
        </div>
      }
      <MetaIntegration faceBookConnectionStatus={facebookStatus} getFacebookStatus={getFacebookStatus} />
    </div>
  );
}

export default MetaAppsIntegration;
