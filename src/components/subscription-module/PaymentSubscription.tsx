/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import { X } from "lucide-react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useState } from "react";
import axios from "axios";
import { NUMBER_VALUES, SUBSCRIPTION } from "../../constants/AppConstants";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import MessageSnackBar from "../ui/MessageSnackbar";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import POST_API from "../../constants/PostApi";
import COLORS from "../../constants/Colors";
import PaymentSuccess from "../../assets/animations/PaymentSuccessfull";

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

  const navigate = useNavigate();
  const handlePayment = () => {
    const options = {
      key: SUBSCRIPTION.RAZORPAY_KEY, // Replace with your Razorpay Key ID
      currency: SUBSCRIPTION.RAZORPAY_CURRENCY,
      name: SUBSCRIPTION.COMPANY_NAME,
      description: "Subscription Payment",
      order_id: orderId, // Order ID from backend
      handler: function (response: any) {
        console.log("Payment Successful:", response);
        // alert(
        //   `Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nOrder ID: ${response.razorpay_order_id}\nSignature: ${response.razorpay_signature}`
        // );
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

          axios
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
                showMessageSnackbar({
                  message: "Subscription created successfully.",
                  type: "success",
                });

                if (isSubscrptionFromLoginPage) {
                  setTimeout(() => {
                    localStorage.clear();
                    navigate(ROUTES_URL.SIGN_IN);
                  }, 3000); //animation Time
                } else {
                  setTimeout(() => {
                    onClose();
                    setIsPaymentSuccessfull(false);
                    handleSubscriptionListChange();
                  }, 2000);
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
          console.log("Payment modal closed by user or payment failed.");
          setIsPaymentSuccessfull(false);
          onCancel();
        },
      },
    };

    // NOTE : ADD SNACKBAR HERE FOR ERROR
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on("payment.failed", function (response: any) {
      console.error("Payment Failed", response);
    });

    razorpayInstance.open();
  };
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      {!isPaymentSuccessfull && (
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 px-6 py-5 animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
          {/* Description Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {descriptionInformation}
            </h3>
            <hr className="my-3 border-gray-300" /> {/* Divider */}
          </div>
          {/* Subscription Details in Proper Column Format */}
          <div className="mb-6 grid grid-cols-[auto_10px_1fr] gap-y-2 text-gray-900 text-sm font-semibold">
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
              {cancelText}
            </button>

            <Button
              onClick={handlePayment}
              className={`flex items-center gap-2  text-white px-3 rounded-lg ${COLORS.BG_BLUE_600_COLOR}  ${COLORS.HOVER_BG_BLUE_700_COLOR_HOVER}`}
            >
              {/* <CheckCircle2 className="h-5 w-5" /> */}
              <span>Confirm Payment</span>
            </Button>
          </div>
        </div>
      )}

      {/* Snackbar for Messages */}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />

      {/* Loading Spinner when Payment is Successful */}
      {isPaymentSuccessfull && !isSubscrptionFromLoginPage && (
        <PaymentSuccess />
      )}
      {isPaymentSuccessfull && isSubscrptionFromLoginPage && <PaymentSuccess />}
    </div>,
    document.body
  );

  // return createPortal(
  //   <div className="fixed inset-0 z-50 flex items-center justify-center">
  //     <div
  //       className="fixed inset-0 bg-black/50 backdrop-blur-sm"
  //       onClick={onCancel}
  //     />
  //     {!isPaymentSuccessfull && (
  //       <div className="relative bg-white rounded-md shadow-xl w-full max-w-md mx-4 px-3 py-3  animate-in fade-in zoom-in duration-200">
  //         <button
  //           onClick={onCancel}
  //           className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
  //         >
  //           <X size={20} />
  //         </button>

  //         <div className="mb-6">
  //           <h3 className="text-xl font-semibold text-gray-900">
  //             {descriptionInformation}
  //           </h3>
  //           <h2 className="text-sm font-semibold text-gray-900 ">
  //            User Count :  {numberOfCompanyUsers}
  //           </h2>
  //           <h2 className="text-sm font-semibold text-gray-900 ">
  //            Order Id :  {orderId}
  //           </h2>
  //           <h2 className="text-sm font-semibold text-gray-900">
  //           Subscription Duration :  {monthsOfSubscription} {monthsOfSubscription===1 ? "month" : "months"}
  //           </h2>
  //           <p className="text-sm font-semibold text-gray-900">Amount :  ₹{amount}</p>
  //         </div>

  //         <div className="flex justify-end gap-3">
  //           <button
  //             onClick={onCancel}
  //             className="px-8 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
  //           >
  //             {cancelText}
  //           </button>

  //           <Button onClick={handlePayment}><CheckCircle2 className="h-5 w-5"/> <span className="ml-1">Continue Payment</span></Button>
  //         </div>
  //       </div>
  //     )}
  //     <MessageSnackBar
  //       isOpen={messageSnackbar.open}
  //       message={messageSnackbar.message}
  //       type={messageSnackbar.type}
  //       onClose={handleMessageSnackbarClose}
  //       duration={NUMBER_VALUES.SNACKBAR_DURATION}
  //     />

  //     {isPaymentSuccessfull && <LoadingSpinner />}
  //   </div>,
  //   document.body
  // );
}
