/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CreateSubscrtionState from "../../@types/subscription/CreateSubscriptionState";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { STATUS_CODE } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PaymentSubscription from "./PaymentSubscription";
import POST_API from "../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import { ArrowRight, CalendarDays, Loader, Users2, X } from "lucide-react";

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

  const { setLoginStatus } = useLoggedInUserContext();
  const [isPaymentSubscriptionOpen, setIsPaymentSubscriptionOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    errors: createSubscriptionErrors,
    handleBlur: handleCreateSubscrptioFormFieldOnBlur,
    setErrors: setCreateSubscriptionErrors,
  } = useFormValidation(createSubscriptionFormData, "registration");

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
        toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
        setCreateSubscriptionErrors({
          monthsToPurchase: "fill this field",
          companyUserCount: "fill this field",
        });
        return;
      }
      if (createSubscriptionFormData.numberOfUsers <= 0) {
        toast.error(MESSAGE.ERROR.SUBSCRIPTION_MIN_ONE_USER_REQUIRED);
        return;
      }
      if (
        createSubscriptionFormData.monthsToPurchase <= 0 ||
        createSubscriptionFormData.monthsToPurchase > 48
      ) {
        toast.error(MESSAGE.ERROR.SUBSCRIPTION_MONTH);
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

    await axios
      .post(POST_API.GET_SUBSCRIPTION_AMOUNT, requestData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setReponseState({
            amount: response.data.subscription_amount,
            orderId: response.data.order_id,
          });
          setIsPaymentSubscriptionOpen(true);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleCreateSubscription,
          });
          if (refreshTokenResponse) {
            handleCreateSubscription(event);
          } else {
            toast.error(
              MESSAGE.ERROR.SUBSCRIPTION_CREATION_ERROR + error.message
            );
            setLoginStatus({
              companyId: 0,
              companyName: "",
              createdOn: "",
              email: "",
              fullName: "",
              id: 0,
              message: "",
              mobileNumber: "",
              status: false,
              token: "",
              isActiveSubscription: false,
              subscriptionAllowedUsers: 0,
              activeUsersInCompany: 0,
              subscriptionId: 0,
              startDateSubscription: "",
              endDateSubscription: "",
              isSuperUser: false,
            });
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    // if (response.status === STATUS_CODE.OK) {
    //   setReponseState({
    //     amount: response.data.subscription_amount,
    //     orderId: response.data.order_id,
    //   });
    //   setIsPaymentSubscriptionOpen(true);
    // }
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
      <div className="  "></div>
      <h2 className="table-header-custom flex flex-wrap">
        <span>Active Users in the Company:</span>
        <span className="input-label-custom-inactive ml-1">
          {loginStatus.activeUsersInCompany}
        </span>
      </h2>

      <form className="space-y-5" onSubmit={handleCreateSubscription}>
        <FormInput
          logo={Users2}
          required
          label="Company users count:"
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
          logo={CalendarDays}
          required
          label="Months to purchase:"
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
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-1 text-nowrap">
            <Button type="button" onClick={onClose}>
              <div className=" flex items-center">
                <X size={16} /> Cancel
              </div>
            </Button>
          <Button type="submit">
              <div className=" flex items-center">

             {isLoading ?  <Loader size={16}/> :               <ArrowRight size={16}/>}
            {isLoading ? "Generating Order Id..." : "Continue Payment"}
              </div>
          </Button>
          </div>
        </div>
      </form>
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
