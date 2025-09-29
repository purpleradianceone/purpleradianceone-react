/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
import FormHeader from "../../../ui/FormHeader";
import { Handshake } from "lucide-react";
import RadioButtons from "../../../ui/RadioButton";
import { useState } from "react";
import GetAccounts from "../../../views/account/AccountManagement";
import CreateAccount from "../../Account/CreateAccount";
import Account from "../../../../@types/account/Account";
import Lead from "../../../../@types/lead-management/LeadManagementProps";
import ConfirmationDialog from "../../../dialogue-box/ConfirmationDialogue";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import FormInput from "../../../ui/FormInput";

function ConvertLeadModal({
  isOpen,
  onClose,
  leadData,
  handleLeadConversion,
  reasonText,
  onReasonChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  leadData: Lead;
  handleLeadConversion: () => void;
  reasonText: string;
  onReasonChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [accountTypeSelected, setAccountTypeSelected] = useState<
    "existingAccount" | "newAccount"
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
      label: "New Account",
      value: "newAccount",
      id: "account",
      name: "accountType",
      checked: accountTypeSelected === "newAccount" ? true : false,
    },
  ];

  const createAccountLead = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      account_id: selectedAccount!.id,
      lead_id: leadData.id,
      is_lead_converted: null,
      createdby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.CREATE_ACCOUNT_LEAD, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleLeadConversion();
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
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-s-lg [&::-webkit-scrollbar-track]:rounded-lg"
          >
            <div className="py-6 px-4">
              <FormHeader
                icon={Handshake}
                onClose={onClose}
                preText="Add Company User"
                description="Create and manage a new user account for your company."
              />

              <form className="space-y-3">
                <div className="flex justify-center">
                  <FormInput
                    type="text"
                    placeholder="Enter reason for status update"
                    value={reasonText}
                    onChange={onReasonChange}
                  />
                </div>
                <div className="flex justify-center">
                  <RadioButtons
                    options={convertLeadRadioButtonOptions}
                    onChange={(e) => {
                      if (
                        e.target.value === "existingAccount" ||
                        e.target.value === "newAccount"
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

                {accountTypeSelected === "newAccount" && (
                  <div>
                    <CreateAccount
                      handleCreateAccount={() => {}}
                      onClose={() => {
                        setAccountTypeSelected("existingAccount");
                      }}
                    />
                  </div>
                )}

                <ConfirmationDialog
                  message="Please confirm! Map the lead to selected Account!"
                  onCancel={() => {
                    setFinalConfirm(false);
                  }}
                  onConfirm={() => {
                    createAccountLead();
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
