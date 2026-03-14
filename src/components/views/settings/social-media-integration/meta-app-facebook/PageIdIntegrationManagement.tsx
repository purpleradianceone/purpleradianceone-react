import { useState } from "react";
import Button from "../../../../ui/Button";
import PageIdIntegration from "../PageIdIntegration";
import { PageIdList } from "./PageIdList";
import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { Plus } from "lucide-react";
import { FiFacebook } from "react-icons/fi";
import LeadAccessInstructions from "./LeadAccessInstructions";

export const PageIdIntegrationManagement = () => {
  const [showAddPageDetailsPopUp, setShowAddPageDetailsPopUp] =
    useState<boolean>(false);

  const handelAddButtonClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowAddPageDetailsPopUp(true);
  };

  const [refreshCount , setRefreshCount ] = useState<number>(0);

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
