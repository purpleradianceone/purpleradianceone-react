/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CreateSubscrtionState from "../../@types/subscription/CreateSubscriptionState";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../ui/MessageSnackbar";
import { NUMBER_VALUES, STATUS_CODE } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PaymentSubscription from "./PaymentSubscription";
import POST_API from "../../constants/PostApi";

function CreateSubscription({
  isSubscrptionFromLoginPage,
  handleSubscriptionListChange,
  isOpen,
  onClose,
}: {
  isSubscrptionFromLoginPage?: boolean;
  handleSubscriptionListChange?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const initialCreateSubscriptionFormData: CreateSubscrtionState = {
    numberOfUsers: 0,
    monthsToPurchase: 0,
  };
  const { loginStatus } = useLoggedInUserContext();
  const [responseState, setReponseState] = useState<{
    orderId: number;
    amount: number;
  }>({
    orderId: 0,
    amount: 0,
  });
  const { formData: createSubscriptionFormData, handleChange } = useFormChange(
    initialCreateSubscriptionFormData
  );

  const [isPaymentSubscriptionOpen, setIsPaymentSubscriptionOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    errors: createSubscriptionErrors,
    handleBlur: handleCreateSubscrptioFormFieldOnBlur,
    setErrors: setCreateSubscriptionErrors,
  } = useFormValidation(createSubscriptionFormData, "registration");

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOnCancelPaymentPage = () => {
    setIsPaymentSubscriptionOpen(false);
  };

  //API REQUEST LOGIC
  const handleCreateSubscription = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      createSubscriptionFormData.monthsToPurchase <= 0 ||
      createSubscriptionFormData.numberOfUsers <= 0
    ) {
      if (
        createSubscriptionFormData.monthsToPurchase <= 0 &&
        createSubscriptionFormData.numberOfUsers <= 0
      ) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.REQUIRED_FIELDS,
          type: "error",
        });
        setCreateSubscriptionErrors({
          monthsToPurchase: "fill this field",
          companyUserCount: "fill this field",
        });
        return;
      }
      if (createSubscriptionFormData.numberOfUsers <= 0) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.SUBSCRIPTION_MIN_ONE_USER_REQUIRED,
          type: "error",
        });
        return;
      }
      if (createSubscriptionFormData.monthsToPurchase <= 0 || createSubscriptionFormData.monthsToPurchase >48) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.SUBSCRIPTION_MONTH,
          type: "error",
        });
        return;
      }
    }

    setIsLoading(true);

    const requestData = {
      no_of_users: createSubscriptionFormData.numberOfUsers,
      no_of_months: createSubscriptionFormData.monthsToPurchase,
      email: loginStatus.email,
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      subscription_id: null,
    };

    try {
      const response = await axios.post(
        POST_API.GET_SUBSCRIPTION_AMOUNT,
        requestData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        setReponseState({
          amount: response.data.subscription_amount,
          orderId: response.data.order_id,
        });
        setIsPaymentSubscriptionOpen(true);
      }
    } catch (error: any) {
      // console.error("Error creating subscription:", error);
      showMessageSnackbar({
        message: MESSAGE.ERROR.SUBSCRIPTION_CREATION_ERROR + error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCreateSubscriptionErrors({
        monthsToPurchase: "",
        companyUserCount: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
    <div className="border-t border-gray-300 "></div>
      <h2 className="font-semibold text-sm sm:text-base flex flex-wrap">
        <span>Active Users in the Company:</span>
        <span className="text-red-600 font-bold ml-1">
          {loginStatus.activeUsersInCompany}
        </span>
      </h2>

      <form className="space-y-7" onSubmit={handleCreateSubscription}>
        <FormInput
          label="Company users count: *"
          placeholder="Count of users (min 1)"
          type="number"
          value={createSubscriptionFormData.numberOfUsers.toString()}
          name="numberOfUsers"
          onChange={handleChange}
          onBlur={handleCreateSubscrptioFormFieldOnBlur}
          min={1}
          error={createSubscriptionErrors.companyUserCount}
        />
        <FormInput
          label="Months to purchase: *"
          placeholder="Number of months (min: 1 to max: 48 months)"
          type="number"
          value={createSubscriptionFormData.monthsToPurchase.toString()}
          name="monthsToPurchase"
          onChange={handleChange}
          onBlur={handleCreateSubscrptioFormFieldOnBlur}
          min={1}
          max={48}
          error={createSubscriptionErrors.monthsToPurchase}
        />
        <Button type="submit">
          {isLoading ? "Generating Order Id..." : "Continue Payment"}
        </Button>
      </form>
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
      {isPaymentSubscriptionOpen && (
        <PaymentSubscription 
        isSubscriptionForUpdate={false}
          descriptionInformation="Confirm & Pay for Subscription"
          amount={responseState.amount}
          orderId={responseState.orderId}
          onCancel={handleOnCancelPaymentPage}
          monthsOfSubscription={parseInt(
            createSubscriptionFormData.monthsToPurchase.toString()
          )}
          onClose={onClose!}
          numberOfCompanyUsers={parseInt(
            createSubscriptionFormData.numberOfUsers.toString()
          )}
          isSubscrptionFromLoginPage={isSubscrptionFromLoginPage!}
          handleSubscriptionListChange={handleSubscriptionListChange!}
          // onPay={handleOnPay}
          cancelText="Cancel"
        />
      )}
    </>
  );
}

export default CreateSubscription;
