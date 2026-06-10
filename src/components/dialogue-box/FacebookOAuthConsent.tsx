import { Check, X } from "lucide-react";
import Button from "../ui/Button";
import { createPortal } from "react-dom";
import { SIZE, STRING_VALUES } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import POST_API from "../../constants/PostApi";

function FacebookOAuthConsent() {
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();


  const handleClose = (isFlowCompleted: boolean) => {
    if (isFlowCompleted) {
      window.history.go(-7);
    }
    // NOTE : Navigating back when clicked on the cancel button or outside the card
    navigate(
      ROUTES_URL.INTEGRATIONS_SETTINGS + "/" + ROUTES_URL.SETTING_META_APP,
    );
    // window.history.back();
  };

  // http://localhost:8080/api/main/purple-crm-api/main/facebook
  // "http://localhost:8080/api/main/purple-crm-api/main/facebook";
  const handleConfirm = () => {
    
    const baseUrl = POST_API.OAUTH_CONSENT_FACEBOOK_ACCOUNT
    
    const params = new URLSearchParams();
    params.append("company_id", loginStatus.companyId.toString());
    params.append("company_user_id", loginStatus.id.toString());
    window.location.href = `${baseUrl}?${params}`;
  };


  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 opacity-50 backdrop-blur-sm"
        onClick={() => {
          handleClose(false);
        }}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => {
            handleClose(false);
          }}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="section-header-custom mb-2">Sign In With Facebook</h2>
          <p className="input-label-custom">
            Do you want to signin with your Facebook account for managing leads
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <div className="flex">
            <Button
              onClick={() => {
                handleClose(false);
              }}
              type="button"
            >
              <div className="flex items-center gap-1">
                <X size={SIZE.SIXTEEN} />
                {STRING_VALUES.CANCEL}
              </div>
            </Button>
          </div>

          <div className="flex">
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
                // handleClose(true);
              }}
              type="submit"
            >
              <div className="flex items-center gap-1">
                <Check size={SIZE.SIXTEEN} />
                {STRING_VALUES.CONFIRM}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default FacebookOAuthConsent;
