/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
import FormHeader from "../../../ui/FormHeader";
import { Handshake, Save, X } from "lucide-react";
import RadioButtons from "../../../ui/RadioButton";
import { useState } from "react";
import GetAccounts from "../../../views/account/AccountManagement";
import Account from "../../../../@types/account/Account";
import Lead from "../../../../@types/lead-management/LeadManagementProps";
import ConfirmationDialog from "../../../dialogue-box/ConfirmationDialogue";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../../@types/error/ApiError";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import Button from "../../../ui/Button";
import TextAreaInput from "../../../ui/TextAreaInput";

function ConvertLeadModal({
  isOpen,
  onClose,
  leadData,
  handleLeadConversion,
  reasonText,
  onReasonChange,
  handleLeadMappedToAccount
}: {
  isOpen : boolean;
  onClose : () => void;
  leadData : Lead;
  handleLeadConversion : () => void;
  reasonText : string;
  onReasonChange : (event : React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleLeadMappedToAccount : () => void;
}) {
  const [accountTypeSelected, setAccountTypeSelected] = useState<
    "existingAccount" | "noAccount"
  >("existingAccount");
  const [finalConfirm, setFinalConfirm] = useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();

  const [selectedAccount, setSelectedAccont] = useState<Account>();
  const convertLeadRadioButtonOptions = [
    {
      label: "Existing Account",
      value: "existingAccount",
      id: "account",
      name: "accountType",
      checked: accountTypeSelected === "existingAccount" ? true : false,
    },
    {
      label: "Don't Map to any Account",
      value: "noAccount",
      id: "account",
      name: "accountType",
      checked: accountTypeSelected === "noAccount" ? true : false,
    },
  ];

  const createAccountLead = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      account_id: selectedAccount!.id,
      lead_id: leadData.id,
      is_lead_converted: true,
      createdby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.CREATE_ACCOUNT_LEAD, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
            handleLeadMappedToAccount();
          onClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: createAccountLead,
          });
          if (refreshTokenResponse) {
            createAccountLead();
          }
        }
      });
  };

  if (!isOpen) return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-50 p-5 overflow-hidden bg-black bg-opacity-5">
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="relative w-full max-w-6xl max-h-[90vh] min-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-s-lg [&::-webkit-scrollbar-track]:rounded-lg"
          >
            <div className="py-6 px-4">
              <FormHeader
                icon={Handshake}
                onClose={onClose}
                preText="Convert the lead and map it to the accounts"
                description="Convert and manage a lead for your accounts."
              />

              <form className="space-y-0">
                
               
                 
                
                <div className="flex justify-center">
                  <RadioButtons
                    options={convertLeadRadioButtonOptions}
                    onChange={(e) => {
                      if (
                        e.target.value === "existingAccount" ||
                        e.target.value === "noAccount"
                      ) {
                        setAccountTypeSelected(e.target.value);
                      }
                    }}
                  />
                </div>

                {accountTypeSelected === "existingAccount" && (
                  <div>
                    <GetAccounts
                      isUsedForAccountLead={true}
                      handleRowSelectedForLead={(data) => {
                        setSelectedAccont(data);
                        setFinalConfirm(true);
                      }}
                    />
                  </div>
                )}

                {/* {accountTypeSelected === "noAccount" && (
                  <div className="min-w-36">
                    
                  </div>
                )} */}
                {accountTypeSelected === "noAccount" && (
                    <div className="grid grid-cols-1">
                    <div>
                     <TextAreaInput
                    placeholder="Enter reason for status update"
                    value={reasonText}
                    cols={3}
                    rows={5}
                    onChange={onReasonChange}
                    label="Reason(Optional)"
                  />
                    </div>
                        <div className="flex gap-2 col-span-1 justify-end">
                        <div className="max-w-32 mt-7">
                                <Button
                        type="button"
                        onClick={()=>{
                            onClose();
                        }}
                        >
                            <div className="flex gap-1 justify-center items-center">
                                <X size={SIZE.SIXTEEN}/>
                                <span>Cancel</span>
                            </div>
                        </Button>
                        </div>
                        <div className="max-w-32 mt-7">
                                 <Button
                        type="submit"
                        onClick={(e)=>{
                            e.preventDefault();
                            handleLeadConversion();
                        }}
                        >
                            <div className="flex gap-1 justify-center items-center">
                                <Save size={SIZE.SIXTEEN}/>
                                <span>Save</span>
                            </div>
                        </Button>
                        </div>
                        
                    </div>
                    
                    
                </div>
               )} 

                <ConfirmationDialog
                  message="Please confirm! Map the lead to selected Account!"
                  onCancel={() => {
                    setFinalConfirm(false);
                  }}
                  onConfirm={() => {
                    if(accountTypeSelected === "existingAccount"){
                            createAccountLead();
                    }
                    // else{
                    //     handleLeadConversion()
                    // }
                    
                  }}
                  open={finalConfirm}
                  title="Are You Sure?"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default ConvertLeadModal;
