/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import { CheckCircle2, CreditCard,  X } from "lucide-react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useState } from "react";
import axios from "axios";
import { STATUS_CODE, SUBSCRIPTION } from "../../constants/AppConstants";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import POST_API from "../../constants/PostApi";
import COLORS from "../../constants/Colors";
import PaymentSuccess from "../../assets/animations/PaymentSuccessfull";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import FormHeader from "../ui/FormHeader";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentSubscription({
  orderId,
  amount,
  onCancel,
  cancelText,
  descriptionInformation,
  monthsOfSubscription,
  numberOfCompanyUsers,
  isSubscrptionFromLoginPage,
  handleSubscriptionListChange,
  isSubscriptionForUpdate,
  onClose,
  subscriptionId,
  updateSubscriptionUsersCount,
}: {
  orderId: number;
  amount: number;
  onCancel: () => void;
  cancelText: string;
  descriptionInformation: string;
  monthsOfSubscription?: number;
  numberOfCompanyUsers: number;
  isSubscrptionFromLoginPage: boolean;
  handleSubscriptionListChange: () => void;
  onClose: () => void;
  isSubscriptionForUpdate: boolean;
  subscriptionId?: number;
  updateSubscriptionUsersCount?: number;
}) {
  const { loginStatus } = useLoggedInUserContext();
  const [isPaymentSuccessfull, setIsPaymentSuccessfull] = useState(false);

  const navigate = useNavigate();
  const handlePayment = () => {
    const options = {
      key: SUBSCRIPTION.RAZORPAY_KEY, // Replace with your Razorpay Key ID
      currency: SUBSCRIPTION.RAZORPAY_CURRENCY,
      name: SUBSCRIPTION.COMPANY_NAME,
      description: "Subscription Payment",
      order_id: orderId, // Order ID from backend
      handler: async function (response: any) {
        if (response.razorpay_payment_id !== null) {
          setIsPaymentSuccessfull(true);
          const createSubscriptionPostData = {
            company_id: loginStatus.companyId,
            month: monthsOfSubscription,
            company_user: numberOfCompanyUsers,
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            createdby: loginStatus.id,
          };

          const updateSubscriptionPostData = {
            company_id: loginStatus.companyId,
            subscription_id: subscriptionId!,
            company_user_count: updateSubscriptionUsersCount,
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            updatedby: loginStatus.id,
          };

          await axios
            .post(
              isSubscriptionForUpdate
                ? POST_API.UPDATE_EXISTING_SUBSCRIPTION
                : POST_API.CREATE_SUBSCRIPTION,
              isSubscriptionForUpdate
                ? updateSubscriptionPostData
                : createSubscriptionPostData,
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              if (response.data.status) {
                //CLEARED THE LOCAL STORAGE
                // showMessageSnackbar({
                //   message: "Subscription created successfully.",
                //   type: "success",
                // });
                toast.success(response.data.message);

                if (isSubscrptionFromLoginPage) {
                  setTimeout(() => {
                    localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT
                    );
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS
                    );
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS
                    );
                    localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.NOTIFICATION_COUNT
                    );
                    navigate(ROUTES_URL.SIGN_IN);
                  }, 3000); //animation Time
                } else {
                  setTimeout(() => {
                    onClose();
                    setIsPaymentSuccessfull(false);
                    handleSubscriptionListChange();
                  }, 2000);
                }
              } else {
                //   showMessageSnackbar({
                //   message: "Error creating subscription.",
                //   type: "error",
                // });
                toast.error(response.data.message);
                if (isSubscrptionFromLoginPage) {
                  setTimeout(() => {
                    localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT
                    );
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS
                    );
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS
                    );
                    localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.NOTIFICATION_COUNT
                    );
                    navigate(ROUTES_URL.SIGN_IN);
                  }, 3000);
                } else {
                  setTimeout(() => {
                    onClose();
                    setIsPaymentSuccessfull(false);
                    handleSubscriptionListChange();
                  }, 2000);
                }
              }
            })
            .catch(async (error: ApiError | any) => {
              if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenResponse = await RefreshToken({
                  callFunctionWithParamsNotEvent: options.handler,
                });
                if (refreshTokenResponse) {
                  options.handler(response);
                }
              }
            });
        }
      },
      prefill: {
        name: loginStatus.fullName,
        email: loginStatus.email,
        contact: loginStatus.mobileNumber,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          setIsPaymentSuccessfull(false);
          onCancel();
        },
      },
    };

    // NOTE : ADD SNACKBAR HERE FOR ERROR
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on("payment.failed", function (response: any) {
      console.log(response);
      // console.log("payment Falied");
      //  showMessageSnackbar({
      //             message: "payment Falied . If money debited from your account please contact us.",
      //             type: "success",
      //           });
      toast.error(
        "Payment Falied . If money debited from your account Pease contact Support Team."
      );

      if (isSubscrptionFromLoginPage) {
        setTimeout(() => {
          localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
          localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
          localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
          navigate(ROUTES_URL.SIGN_IN);
        }, 3000);
      } else {
        setTimeout(() => {
          onClose();
          setIsPaymentSuccessfull(false);
          handleSubscriptionListChange();
        }, 2000);
      }
    });

    razorpayInstance.open();
  };

  const handlePaymentProceed = async (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    await axios
      .post(
        POST_API.CHECK_USER_IS_VALID,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          handlePayment();
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: handlePaymentProceed,
          });
          if (refreshTokenStatus) {
            handlePaymentProceed(event);
          }
        }
      });
  };
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/5 backdrop-blur-sm" />
      {!isPaymentSuccessfull && (
        <div className="relative border border-gray-300 bg-white rounded-lg shadow-xl w-full max-w-lg mx-2 px-4 py-3 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <FormHeader
            icon={CreditCard}
            onClose={onCancel}
            preText={descriptionInformation}
            description="Complete the process by confirming and paying for your subscription."
          />
          {/* Subscription Details in Proper Column Format */}
          <div className=" space-y-1 py-2 grid grid-cols-[auto_10px_1fr] gap-y-2 text-gray-900 text-sm font-semibold">
            <span className="pr-2 text-gray-700">Order ID</span>
            <span className="text-gray-700">:</span>
            <span className="pl-1 break-words truncate">{orderId}</span>

            <span className="pr-2 text-gray-700">User Count</span>
            <span className="text-gray-700">:</span>
            <span className="pl-1">{numberOfCompanyUsers}</span>

            {!isSubscriptionForUpdate && (
              <>
                <span className="pr-2 text-gray-700">
                  Subscription Duration
                </span>
                <span className="text-gray-700">:</span>
                <span className="pl-1">
                  {monthsOfSubscription}{" "}
                  {monthsOfSubscription === 1 ? "month" : "months"}
                </span>
              </>
            )}

            <span className="pr-2 text-gray-700">Amount</span>
            <span className="text-gray-700">:</span>
            <span className="pl-1">₹{amount}</span>
          </div>
          <hr className="my-3 border-gray-300" /> {/* Divider */}
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
             <div className="flex items-center gap-0.5">
              <X size={16}/>
               {cancelText}
              </div>
            </button>

            <Button
              onClick={handlePaymentProceed}
              className={`flex items-center gap-2  text-white px-3 rounded-lg ${COLORS.BG_BLUE_600_COLOR}  ${COLORS.HOVER_BG_BLUE_700_COLOR_HOVER}`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Confirm Payment</span>
            </Button>
          </div>
        </div>
      )}

      {/* Loading Spinner when Payment is Successful */}
      {isPaymentSuccessfull && !isSubscrptionFromLoginPage && (
        <PaymentSuccess />
      )}
      {isPaymentSuccessfull && isSubscrptionFromLoginPage && <PaymentSuccess />}
    </div>,
    document.body
  );
}
