import { EditIcon, X } from "lucide-react";
import { SIZE, STATUS_CODE } from "../../constants/AppConstants";
import useScreenSize from "../../config/hooks/useScreenSize";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import UpdateSubscriptionType from "../../@types/subscription/UpdateSubscription";
import { useEffect, useState } from "react";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import PaymentSubscription from "./PaymentSubscription";

export default function UpdateSubscription({
  isOpen,
  onClose,
  startDate,
  endDate,
  existingUserCount,
  subscriptionId,
  handleSubscriptionListChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  existingUserCount: number;
  subscriptionId: number;
  handleSubscriptionListChange: () => void;
}) {
  const { isSmallScreen } = useScreenSize();
  const { loginStatus } = useLoggedInUserContext();
  //initial state of input fields data
  const initialUpdateSubscriptionFormData: UpdateSubscriptionType = {
    companyUserCountForUpdateSubscription: 0,
  };

  const {
    formData: createUpdateSubscriptionFormData,
    handleChange: handleInputValueChange,
  } = useFormChange(initialUpdateSubscriptionFormData);

  const [isPaymentSubscriptionOpen, setIsPaymentSubscriptionOpen] =
    useState<boolean>(false);

  const [responseSusbcriptionAmtOrderID, setResponseSusbcriptionAmtOrderID] =
    useState<{
      orderId: number;
      amount: number;
    }>({
      orderId: 0,
      amount: 0,
    });

  const {
    errors: updateSubscriptionErrors,
    handleBlur: handleBlurUpdateSubscription,
    setErrors: setUpdateSubscriptionErrors,
  } = useFormValidation(createUpdateSubscriptionFormData, "registration");

  const handleOnCancelPaymentPage = () => {
    setIsPaymentSubscriptionOpen(false);
  };
  const handleUpdateFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription <=
      0
    ) {
      setUpdateSubscriptionErrors({
        companyUserCountForUpdateSubscription:
          "Company user count should be greater than 0",
      });
    }

    if (
      createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription > 0
    ) {
      //api call
      const SubscriptionAmountRequestPostData = {
        company_id: loginStatus.companyId,
        subscription_id: subscriptionId,
        no_of_months: null,
        no_of_users:
          createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription,
        currency: null,
        email: loginStatus.email,
        requestedby: loginStatus.id,
      };

      axios
        .post(
          POST_API.GET_SUBSCRIPTION_AMOUNT,
          SubscriptionAmountRequestPostData,
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);

          if (response.status === STATUS_CODE.OK) {
            setResponseSusbcriptionAmtOrderID({
              amount: response.data.subscription_amount,
              orderId: response.data.order_id,
            });
            setIsPaymentSubscriptionOpen(true);
          }
        });
    }
  };

  //for resseting the form data if clicks on x
  useEffect(() => {
    if (!isOpen) {
      setUpdateSubscriptionErrors({
        companyUserCountForUpdateSubscription: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      <div
        className={
          isSmallScreen
            ? "fixed inset-0 z-50 pl-12 pt-6 overflow-hidden bg-black bg-opacity-45"
            : "fixed inset-0 z-50 p-8 pt-4 overflow-hidden bg-black bg-opacity-45"
        }
      >
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="relative w-full max-w-md max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-lg animate-fadeIn 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:bg-gray-400
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full p-4"
          >
            {/* Header */}
            <div className="flex items-center gap-2 bg-white py-2">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY} />
              <h2 className="text-base font-semibold text-gray-800">
                Subscription for {startDate} - {endDate}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-300 mb-3" />

            {/* Information Section - Two Column Layout */}
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-gray-700 mb-3">
              <span className="font-medium">Existing User Count</span>{" "}
              <span>: {existingUserCount}</span>
              <span className="font-medium">Start Date</span>{" "}
              <span>: {startDate}</span>
              <span className="font-medium">End Date</span>{" "}
              <span>: {endDate}</span>
            </div>

            {/* Input */}
            <form onSubmit={handleUpdateFormSubmit}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Users to Add in Subscription* :
              </label>
              <FormInput
                type="number"
                value={createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription.toString()}
                placeholder="Number of users to add in subscription"
                name="companyUserCountForUpdateSubscription"
                min={1}
                onChange={handleInputValueChange}
                onBlur={handleBlurUpdateSubscription}
                error={
                  updateSubscriptionErrors.companyUserCountForUpdateSubscription
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Submit Button */}
              <div className="flex justify-center mt-3">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isPaymentSubscriptionOpen && (
        <PaymentSubscription
          updateSubscriptionUsersCount={parseInt(
            createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription.toString()
          )}
          isSubscriptionForUpdate={true}
          descriptionInformation="Confirm & Pay for Subscription"
          amount={responseSusbcriptionAmtOrderID.amount}
          orderId={responseSusbcriptionAmtOrderID.orderId}
          onCancel={handleOnCancelPaymentPage}
          subscriptionId={subscriptionId}
          //   monthsOfSubscription={
          //     parseInt(
          //     createSubscriptionFormData.monthsToPurchase.toString()
          //   )
          // }
          onClose={onClose!}
          numberOfCompanyUsers={parseInt(
            createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription.toString()
          )}
          isSubscrptionFromLoginPage={false}
          handleSubscriptionListChange={handleSubscriptionListChange!}
          cancelText="Cancel"
        />
      )}
    </>
  );
}
