import Button from "../../../../ui/Button";
import FormHeader from "../../../../ui/FormHeader";
import { MessageCircleIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import FormLayout from "../../../../ui/FormLayout";
import { handleApiError } from "../../../../../config/error/handleApiError";
import { ResponseStatus } from "../MetaAppsIntegration";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import { getFacebookComapnyStatus } from "../../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import FormSkeleton from "../../../../modals/Account/FormSkeleton";
import MetaAppWhatsappIntegration from "./MetaIntegrationDeniedMessage";

/**
 * WHATSAPP PHONE NUMBER INTEGRATION COMPONENT  AND INTEGRATED WHATSAPP NUMBERS
 *
 * - Parent component - includes rules for the Whatsapp phone number integration.
 * pop up form for addition of number.
 * list of connected phone numbers.
 * @returns Component for whatsapp phone number integration
 */
export const WhatsappPhoneNumberIntegrationManagement = () => {
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

  const [
    openIntegrateWhatsappAccountForm,
    setOpenIntegrateWhatsappAccountForm,
  ] = useState<boolean>(false);

  // const [refreshCount, setRefreshCount] = useState<number>(0);

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
      console.log("this is the response");

      console.log(response.data);

      if (response.status === STATUS_CODE.OK) {
        const res = response.data;

        const formattedData: ResponseStatus = {
          createdBy: res.createdby,
          createdOn: res.createdon,
          expiringOn: res.expiringOn,
          id: res.id,
          isActive: res.isactive,
        };
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

  // Note : if the facebook is not integrated then , this card will show
  if (!loading && !facebookStatus.isActive) {
    return <MetaAppWhatsappIntegration />;
  }
  return (
    <div className="min-h-72 my-5 h-auto w-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
        {/* <LeadAccessInstructions /> */}
        <div className=" ">
          <FormHeader
            icon={MessageCircleIcon}
            preText="Whatsapp Phone Number Integration"
            description="Connect and manage your Whatsapp Account ."
            children={
              <Button
                onClick={() => {
                  setOpenIntegrateWhatsappAccountForm(true);
                }}
              >
                <div className="flex items-center justify-center">
                  <Plus size={16} /> <div>Add</div>
                </div>
              </Button>
            }
          />
          {openIntegrateWhatsappAccountForm && (
            <>
              <FormLayout width={3}>
                <FormHeader
                  icon={Plus}
                  onClose={() => {
                    setOpenIntegrateWhatsappAccountForm(false);
                  }}
                  preText="Whatsapp Account Integration"
                  description="Integrate Whatsapp using phone number."
                />
                {/* <WhatsappPhoneNumberAddition
                  handleRefreshApiCall={() => {
                    setRefreshCount((prev) => prev + 1);
                  }}
                /> */}
              </FormLayout>
            </>
          )}

          {/* Note : page list  */}
          <div className="h-full min-h-56 flex items-center justify-center">
            <h1 className="caption-custom">Whatsapp Account List</h1>
            {/* <PageIdList refreshCount={refreshCount} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
