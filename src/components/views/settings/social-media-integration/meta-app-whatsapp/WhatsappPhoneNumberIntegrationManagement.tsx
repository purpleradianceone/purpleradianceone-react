import Button from "../../../../ui/Button";
import FormHeader from "../../../../ui/FormHeader";
import { MessageCircleIcon, Plus } from "lucide-react";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import { Popover } from "../../../../ui/PopOver";

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
  const { userHasAccessToAddIntegrationSetting } = useUserAccessModules();

//   const [refreshCount, setRefreshCount] = useState<number>(0);

  return (
    <div className="min-h-72 my-5 h-auto w-full flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mt-0 pt-0 md:p-3 border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
        {/* <LeadAccessInstructions /> */}
        <div className="mt-4 ">
          <FormHeader
            icon={MessageCircleIcon}
            preText="Whatsapp Phone Number Integration"
            description="Connect and manage your whatapp phone number."
            children={
              <Popover
                align="right"
                padding={4}
                width={500}
                accessRight={userHasAccessToAddIntegrationSetting}
                trigger={
                  <div className="flex justify-end ">
                    <div>
                      <Button >
                        {" "}
                        <div className="flex items-center gap-1">
                          <Plus size={14} />
                          Add
                        </div>
                      </Button>
                    </div>
                  </div>
                }
              >
                {(onClose) => (
                  <>
                    <FormHeader
                      icon={Plus}
                      onClose={onClose}
                      preText="Whatsapp Account Integration"
                      description="Integrate Whatsapp using phone number."
                    />
                    {/* <WhatsappPhoneNumberAddition
                      handleRefreshApiCall={() => {
                        setRefreshCount((prev) => prev + 1);
                      }}
                    /> */}
                  </>
                )}
              </Popover>
            }
          />

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
