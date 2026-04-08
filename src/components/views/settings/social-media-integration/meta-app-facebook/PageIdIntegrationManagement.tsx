import { useEffect, useState } from "react";
import Button from "../../../../ui/Button";
import PageIdIntegration from "../PageIdIntegration";
import { PageIdList } from "./PageIdList";
import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { Plus } from "lucide-react";
import { FiFacebook } from "react-icons/fi";
import LeadAccessInstructions from "./LeadAccessInstructions";
import MetaAppWhatsappIntegration from "../meta-app-whatsapp/MetaIntegrationDeniedMessage";
import FormSkeleton from "../../../../modals/Account/FormSkeleton";
import { handleApiError } from "../../../../../config/error/handleApiError";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import { ResponseStatus } from "../MetaAppsIntegration";
import { getFacebookComapnyStatus } from "../../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";

export const PageIdIntegrationManagement = () => {
  const {loginStatus} = useLoggedInUserContext();
  const [showAddPageDetailsPopUp, setShowAddPageDetailsPopUp] =
    useState<boolean>(false);

  const handelAddButtonClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowAddPageDetailsPopUp(true);
  };

  const [loading, setLoading] = useState<boolean>(false);

   //Note : storing api response here , to show if the facebook account is connected or not
  const [facebookStatus, setFacebookStatus] = useState<ResponseStatus>({
    createdBy: "",
    createdOn: "",
    expiringOn: "",
    id: 0,
    isActive: false,
  });


  const [refreshCount , setRefreshCount ] = useState<number>(0);


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
  
    // Note : if the facebook is not integrated then , this card will show
    if(!loading && !facebookStatus.isActive){
      return(
        <MetaAppWhatsappIntegration/>
      )
    } 
  return (
    <div className="min-h-56 my-5 h-auto w-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
        <LeadAccessInstructions/>
        <div className="mt-4">

        <FormHeader
          icon={FiFacebook}
          preText="Facebook Page Integration"
          description="Connect and manage your Facebook pages for getting leads form page ads."
          children={
            <div className="flex justify-end ">
              <div>
                <Button onClick={handelAddButtonClick}> <div className="flex items-center gap-1">
                    <Plus size={14}/>
                    Add
                    </div>
                     </Button>
              </div>
            </div>
          }
          />
        {showAddPageDetailsPopUp && (
          <FormLayout padding={3} width={3}>
            <FormHeader
              icon={Plus}
              onClose={() => {
                  setShowAddPageDetailsPopUp(false);
                }}
                description="Add facebook page using facebook page id."
                preText="Integrate new facebook page"
            />
            <PageIdIntegration
                handleRefreshApiCall={()=>{
                    setRefreshCount(prev => prev +1);
                }}
            />
          </FormLayout>
        )}

        {/* Note : page list  */}
        <div>
          <PageIdList 
            refreshCount={refreshCount}
            />
        </div>
                    </div>
      </div>
    </div>
  );
};
