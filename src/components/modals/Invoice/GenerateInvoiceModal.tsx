/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Calendar,
  FileCheck,
  FileText,
  MapPin,
  MessageSquare,
  Save,
  Truck,
  User,
  X,
} from "lucide-react";
import FormLayout from "../../ui/FormLayout";
import FormHeader from "../../ui/FormHeader";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import toast from "react-hot-toast";
import Account from "../../../@types/account/Account";
import axiosClient from "../../../axios-client/AxiosClient";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import { handleApiError } from "../../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LookupAccountDropdown } from "../../views/lookups/lookup-account-dropdown/LookupAccountDropdown";
import FormInput from "../../ui/FormInput";
import { useAccountDetails } from "../../../config/hooks/useGetAccountDetails";

function GenerateInvoiceModal({
  isOpen,
  onClose,
  account,
  handleAddInvoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  handleAddInvoice: () => void;
}) {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [terms, setTerms] = useState("");
  const [remarks, setRemarks] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { loginStatus } = useLoggedInUserContext();
  const hasAccount = !!account;
  const accountId = hasAccount ? account?.id : selectedAccount?.id;
  const { accountDetails } = useAccountDetails(accountId && Number(accountId));

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account);
  };
  useEffect(() => {
    if (account && !selectedAccount) {
      setBillingAddress(account.billingAddress || "");
      setShippingAddress(account.shippingAddress || "");
    }
  }, [account]);

  useEffect(() => {
    if (accountDetails) {
      setBillingAddress(accountDetails.billingAddress || "");
      setShippingAddress(accountDetails.shippingAddress || "");
    }
  }, [accountDetails]);

  useEffect(() => {
    if (!isOpen) {
      setDueDate("");
      setTerms("");
      setRemarks("");
    }
  }, [isOpen]);

  const handleSaveHeader = async () => {
    if (!dueDate) {
      toast.error("Please select due date");
      return;
    }
    if (!hasAccount && !selectedAccount) {
      toast.error("Please select an account");
      return;
    }
    const formPayload = {
      company_id: loginStatus.companyId,
      account_id: hasAccount ? account?.id : selectedAccount?.id,
      terms_and_conditions: terms,
      remark: remarks,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      due_date: dueDate,
      createdby_id: loginStatus.id,
    };
    console.log(formPayload);
    console.log(selectedAccount);

    await axiosClient
      .post(POST_API.CREATE_COMPANY_INVOICE, formPayload, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          // setIsSubmitting(false);
          handleAddInvoice();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);
        handleApiError(error);
      })
      .finally(() => {
        // setIsSubmitting(false);
      });
  };

  if (!isOpen) return null;

  return (
    <FormLayout widthPercent={75}>
      <FormHeader
        icon={FileText}
        preText="Generate Tax Invoice"
        description={
          hasAccount
            ? `Account: ${account?.name}`
            : "generate invoice for selected account"
        }
        onClose={onClose}
      />

      <div className="text-sm font-roboto bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-auto py-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {!hasAccount && (
              <>
                <div className="">
                  <LookupAccountDropdown
                    icon={<User size={14} />}
                    value={selectedAccount}
                    label="Select Account"
                    handleAccountSelection={handleAccountSelect}
                  />
                </div>
                <div></div>
              </>
            )}

            <TextAreaInput
              logo={MapPin}
              placeholder="Enter Billing Address"
              label="Billing Address"
              value={billingAddress}
              onChange={(e: any) => setBillingAddress(e.target.value)}
              rows={4}
              cols={2}
            />

            <TextAreaInput
              logo={Truck}
              placeholder="Enter Shipping Address"
              label="Shipping Address"
              value={shippingAddress}
              onChange={(e: any) => setShippingAddress(e.target.value)}
              rows={4}
              cols={2}
            />

            <TextAreaInput
              logo={FileCheck}
              label="Terms & Conditions"
              placeholder="Enter Terms & Conditions"
              onChange={(e: any) => setTerms(e.target.value)}
              rows={4}
              cols={2}
            />
            <div className="gap-2">
              <TextAreaInput
                logo={MessageSquare}
                placeholder="Enter Remarks"
                label="Remarks"
                onChange={(e: any) => setRemarks(e.target.value)}
                rows={1}
                cols={3}
              />
              <div className="w-fit py-2">
                <FormInput
                  logo={Calendar}
                  label="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" bg-white px-4 flex justify-end items-center">
          {/* RIGHT SIDE */}
          <div className="flex w-fit gap-2">
            <Button onClick={onClose} type="button">
              <div className="flex items-center gap-0.5">
                <X size={16} />
                <span>Cancel</span>
              </div>
            </Button>

            <Button onClick={handleSaveHeader}>
              <div className="flex items-center gap-1">
                <Save size={16} />
                <span>Save</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}

export default GenerateInvoiceModal;
