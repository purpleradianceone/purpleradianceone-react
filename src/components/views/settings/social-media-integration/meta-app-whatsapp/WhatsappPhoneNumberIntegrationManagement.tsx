import { useState } from "react";
import Button from "../../../../ui/Button";
import FormLayout from "../../../../ui/FormLayout";
import FormHeader from "../../../../ui/FormHeader";
import { MessageCircleIcon, Plus } from "lucide-react";
import { PageIdList } from "../meta-app-facebook/PageIdList";
import WhatsappPhoneNumberAddition from "./WhatsappPhoneNumberAddition";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../../../constants/Messages";

/**
 * WHATSAPP PHONE NUMBER INTEGRATION COMPONENT  AND INTEGRATED WHATSAPP NUMBERS 
 * 
 * - Parent component - includes rules for the Whatsapp phone number integration.
 * pop up form for addition of number.
 * list of connected phone numbers.
 * 
 *
 * @returns Component for whatsapp phone number integration 
 */
export const WhatsappPhoneNumberIntegrationManagement = () => {
    const  {userHasAccessToAddIntegrationSetting}= useUserAccessModules();

  const [showAddPageDetailsPopUp, setShowAddPageDetailsPopUp] =
    useState<boolean>(false);

  const handelAddButtonClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    //check user has access to add 
    if(!userHasAccessToAddIntegrationSetting){
        toast.error(MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_ADD_ACCESS )
        return;
    }

    setShowAddPageDetailsPopUp(true);
  };

  const [refreshCount, setRefreshCount] = useState<number>(0);

  return (
    <div className="min-h-56 my-5 h-auto w-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
        {/* <LeadAccessInstructions /> */}
        <div className="mt-4">
          <FormHeader
            icon={MessageCircleIcon}
            preText="Whatsapp Phone Number Integration"
            description="Connect and manage your whatapp phone number."
            children={
              <div className="flex justify-end ">
                <div>
                  <Button onClick={handelAddButtonClick}>
                    {" "}
                    <div className="flex items-center gap-1">
                      <Plus size={14} />
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
                preText="Whatsapp Account Integration"
                description="Integrate Whatsapp using phone number."
              />
              <WhatsappPhoneNumberAddition
                handleRefreshApiCall={() => {
                  setRefreshCount((prev) => prev + 1);
                }}
              />
            </FormLayout>
          )}

          {/* Note : page list  */}
          <div>
            <PageIdList refreshCount={refreshCount} />
          </div>
        </div>
      </div>
    </div>
  );
};
