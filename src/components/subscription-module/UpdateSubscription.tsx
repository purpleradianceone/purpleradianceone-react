/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditIcon, Save, Users, X } from "lucide-react";
import { STATUS_CODE } from "../../constants/AppConstants";
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
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import FormHeader from "../ui/FormHeader";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../views/not-found/AccessDeniedMessagePage";
import MESSAGE from "../../constants/Messages";

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
  handleSubscriptionListChange?: () => void;
}) {
  const { isSmallScreen } = useScreenSize();
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToAddSubscription } = useUserAccessModules();
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
  const handleUpdateFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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

      await axios
        .post(
          POST_API.GET_SUBSCRIPTION_AMOUNT,
          SubscriptionAmountRequestPostData,
          { withCredentials: true },
        )
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            setResponseSusbcriptionAmtOrderID({
              amount: response.data.subscription_amount,
              orderId: response.data.order_id,
            });
            setIsPaymentSubscriptionOpen(true);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunctionWithEvent: handleUpdateFormSubmit,
            });
            if (refreshTokenResponse) {
              handleUpdateFormSubmit(event);
            }
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
            ? "fixed inset-0 z-50 pl-12 pt-6 overflow-hidden bg-black bg-opacity-5"
            : "fixed inset-0 z-50 p-8 pt-4 overflow-hidden bg-black bg-opacity-5"
        }
      >
        <div className="flex  min-h-screen items-center justify-center">
          <div
            className="relative w-full border border-gray-300 max-w-[40%] max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-lg animate-fadeIn 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:bg-gray-400
        [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full p-4"
          >
            {/* Header */}
            <FormHeader
              icon={EditIcon}
              onClose={onClose}
              preText={`Update Subscription for  Date: ${startDate} to ${endDate}`}
              description="Update the subscription plan as per the needs."
            />

            {userHasAccessToAddSubscription ? (
              <div className=" ">
                {/* Information Section - Two Column Layout */}
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm text-gray-700 mb-3">
                  <span className="table-header-custom">
                    Subscription allowed users
                  </span>{" "}
                  <span className="input-label-custom">
                    : {existingUserCount}
                  </span>
                  <span className="table-header-custom">Start Date</span>{" "}
                  <span className="input-label-custom">: {startDate}</span>
                  <span className="table-header-custom">End Date</span>{" "}
                  <span className="input-label-custom">: {endDate}</span>
                </div>

                {/* Input */}
                <form onSubmit={handleUpdateFormSubmit}>
                  {/* <label className="block text-xs font-medium text-gray-700 mb-1">
                Users to Add in Subscription* :
              </label> */}
                  <FormInput
                    logo={Users}
                    label="Users to Add in Subscription :"
                    type="number"
                    required={true}
                    autoFocus={true}
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
                  <div className="flex justify-end   mt-3">
                    <div className="flex gap-1">
                      <Button onClick={onClose} type="button">
                        <div className="flex items-center ">
                          <X size={16} />
                          Cancel
                        </div>
                      </Button>
                      <Button type="submit">
                        <div className="flex items-center  gap-1">
                          <Save size={16} />
                          Save
                        </div>
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <AccessDeniedMessagePage
                message={MESSAGE.MODULE_ACCESS.SUBSCRIPTION.DENIED_ADD_ACCESS}
              />
            )}
          </div>
        </div>
      </div>
      {isPaymentSubscriptionOpen && (
        <PaymentSubscription
          updateSubscriptionUsersCount={parseInt(
            createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription.toString(),
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
            createUpdateSubscriptionFormData.companyUserCountForUpdateSubscription.toString(),
          )}
          isSubscrptionFromLoginPage={false}
          handleSubscriptionListChange={handleSubscriptionListChange!}
          cancelText="Cancel"
        />
      )}
    </>
  );
}
