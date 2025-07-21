/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import { NUMBER_VALUES, STATUS_CODE } from "../../../../constants/AppConstants";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import { useEffect, useState } from "react";
import CompanyPreferencesType from "../../../../@types/settings/CompanyPreferences";
import { DialogueBox } from "../../../dialogue-box/Dialogue";
import ROUTES_URL from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";

function CompanyPreferenceSetting() {
  const { loginStatus } = useLoggedInUserContext();

  const [companyPreferences, setCompanyPreferences] =
    useState<CompanyPreferencesType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);


  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

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

  const getCompanyPreferences = async () => {
    setIsLoading(true);
    const getCompanyPreferencesPostData = {
      company_id: loginStatus.companyId,
      requestedby_id: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_COMPANY_PREFERENCES, getCompanyPreferencesPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setCompanyPreferences({
            id: response.data.id,
            companyId: response.data.companyId,
            isEmailServiceOn: response.data.is_email_service_on,
            isNotificationServiceMobileOn : response.data.is_notification_service_mobile_on,
            isNotificatonServiceWebOn : response.data.is_notification_service_web_on,
            uIdWebLeadCapture : response.data.uid_web_lead_capture,
            createdBy: response.data.createdby,
            createdOn: response.data.createdon,
            updatedBy: response.data.updatedby,
            updatedOn: response.data.updatedon,
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getCompanyPreferences,
          });
          if (refreshTokenStatus) {
            getCompanyPreferences();
            setIsDialogueOpen(false);
          } else {
            setIsDialogueOpen(true);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCompanyPreferenceCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    const { name, checked } = event.target;

    const updateCompanyPreferencesPostData = {
      company_id: loginStatus.companyId,
      is_email_service_on: name === "isEmailServiceOn" ? checked : companyPreferences!.isEmailServiceOn,
      is_notification_service_mobile_on : name === "isNotificationServiceMobileOn" ? checked : companyPreferences!.isNotificationServiceMobileOn,
      is_notification_service_web_on : name === "isNotificatonServiceWebOn" ? checked : companyPreferences!.isNotificatonServiceWebOn,
      updatedby_id: loginStatus.id,
    };
    await axios
      .post(
        POST_API.UPDATE_COMPANY_PREFERENCES,
        updateCompanyPreferencesPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            showMessageSnackbar({
              message: response.data.message,
              type: "success",
            });
            setCompanyPreferences((prev) => ({ ...prev!, [name]: checked }));
          } else {
            showMessageSnackbar({
              message: response.data.message,
              type: "error",
            });
          }
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: handleCompanyPreferenceCheckboxChange,
          });
          if (refreshTokenStatus) {
            handleCompanyPreferenceCheckboxChange(event);
            setIsDialogueOpen(false);
          } else {
            setIsDialogueOpen(true);
          }
        }
        if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsDialogueOpen(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getCompanyPreferences();
  }, []);

  return (
    <div className="grid w-full">
        {isLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-3 border-b border-blue-100">
              <label
                htmlFor="isEmailServiceOn"
                className="text-lg text-gray-700 cursor-pointer"
              >
                Email Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isEmailServiceOn"
                  name="isEmailServiceOn"
                  checked={companyPreferences?.isEmailServiceOn}
                  onChange={handleCompanyPreferenceCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-300 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-blue-100">
              <label
                htmlFor="isNotificationServiceMobileOn"
                className="text-lg text-gray-700 cursor-pointer"
              >
                Mobile App Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isNotificationServiceMobileOn"
                  name="isNotificationServiceMobileOn"
                  checked={companyPreferences?.isNotificationServiceMobileOn}
                  onChange={handleCompanyPreferenceCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-300 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-blue-100">
              <label
                htmlFor="isNotificatonServiceWebOn"
                className="text-lg text-gray-700 cursor-pointer"
              >
                Web App Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isNotificatonServiceWebOn"
                  name="isNotificatonServiceWebOn"
                  checked={companyPreferences?.isNotificatonServiceWebOn}
                  onChange={handleCompanyPreferenceCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-300 peer-checked:bg-blue-600"></div>
              </label>
            </div>
       
            <MessageSnackBar
              isOpen={messageSnackbar.open}
              message={messageSnackbar.message}
              type={messageSnackbar.type}
              onClose={handleMessageSnackbarClose}
              duration={NUMBER_VALUES.SNACKBAR_DURATION}
            />
            <DialogueBox
              isOpen={isDialogueOpen}
              onClose={() => setIsDialogueOpen(false)}
              onConfirm={handleDialogueConfirm}
              title="Session Expired !"
              message="Session Expired. Please login again."
            />
          </>
           )}
    </div>
  );
}

export default CompanyPreferenceSetting;
