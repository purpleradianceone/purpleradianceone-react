import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../ui/Button";
import EditSubscriptionUsersModal from "../../modals/subscription-users/EditSubscrptionUsersModal";
import UpdateSubscription from "../../subscription-module/UpdateSubscription";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import LOCALSTORAGE_KEYS from "../../../constants/LocalStorage";

function SubscriptionDialogueBox({
  isOpen,
  cardTitle,
  message,
  onClose,
}: {
  isOpen: boolean;
  cardTitle: string;
  message: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [isEditSubscriptionUserModalOpen, setIsEditSubscriptionUserModalOpen] =
    useState<boolean>(false);
  const [isUpgradeSubscriptionModalOpen, setIsUpgradeSubscriptionModalOpen] =
    useState<boolean>(false);
  useEffect(() => {
    if (!isOpen) {
      localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
      localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
      localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS);
      localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
      localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
      localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
    }
  }, [isOpen]);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      navigate(ROUTES_URL.SIGN_IN, { replace: true });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-2 animate-in fade-in zoom-in duration-200">
        <div className="mb-6">
          <h2 className="section-header-custom ">{cardTitle}</h2>
          <p className="input-label-custom">{message}</p>
        </div>

        <div className="flex justify-end gap-3">
          <div className="flex">
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsEditSubscriptionUserModalOpen(true);
              }}
            >
              Deactivate Users Modal
            </Button>
          </div>

          <div className="flex">
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsUpgradeSubscriptionModalOpen(true);
              }}
            >
              Upgrade Subscription
            </Button>
          </div>
        </div>
      </div>
      {isUpgradeSubscriptionModalOpen && (
        <UpdateSubscription
          endDate={loginStatus.endDateSubscription}
          startDate={loginStatus.startDateSubscription}
          existingUserCount={loginStatus.subscriptionAllowedUsers}
          isOpen={isUpgradeSubscriptionModalOpen}
          subscriptionId={loginStatus.subscriptionId}
          onClose={() => {
            setIsUpgradeSubscriptionModalOpen(false);
            onClose();
          }}
        />
      )}
      {isEditSubscriptionUserModalOpen && (
        <EditSubscriptionUsersModal
          isOpen={isEditSubscriptionUserModalOpen}
          onClose={() => {
            setIsEditSubscriptionUserModalOpen(false);
          }}
          onRedirectToLoginPage={() => {
            setIsEditSubscriptionUserModalOpen(false);
            onClose();
          }}
        />
      )}
    </div>,
    document.body,
  );
}

export default SubscriptionDialogueBox;
