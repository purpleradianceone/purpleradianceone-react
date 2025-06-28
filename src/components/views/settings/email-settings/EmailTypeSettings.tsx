/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { NUMBER_VALUES, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import EmailTypeSettingsType from "../../../../@types/settings/EmailTypeSettingsType";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../../@types/ui/MessageSnackbarProps";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../../not-found/AccessDeniedMessagePage";

function EmailTypeSettings() {
  const [emailTypeSettings, setEmailTypeSettings] = useState<
    EmailTypeSettingsType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();

  const {userHasAccessToViewEmailTypeSetting} = useUserAccessModules();

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

  const fetchCompanyEmailTypeSettings = async () => {
    setIsLoading(true);
    setEmailTypeSettings([]);
    const fetchCompanyEmailTypeSettingsPostData = {
      company_id: loginStatus.companyId,
      requestedby_id: loginStatus.id,
    };
    await axios
      .post(
        POST_API.GET_COMPANY_EMAIL_TYPE_SETTING,
        fetchCompanyEmailTypeSettingsPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            console.log(res);
            setEmailTypeSettings((prev) => [
              ...prev,
              {
                id: res.id,
                companyId: res.company_id,
                name: res.name,
                fromCompanyEmail: res.tosend_from_company_email,
                emailTypeId: res.email_type_id,
                createdBy: res.createdby,
                createdOn: res.createdon,
                updatedBy: res.updatedby,
                updatedOn: res.updatedon,
              },
            ]);
          });
          setIsLoading(false);
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: fetchCompanyEmailTypeSettings,
          });
          if (refreshTokenStatus) {
            fetchCompanyEmailTypeSettings();
          }
        }
      });
  };
  const handleEmailTypeSettingCheckBoxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const id = parseInt(event.target.id);
    const isChecked = event.target.checked;
    const emailTypeSettingPostData = {
      company_id: loginStatus.companyId,
      id: id,
      from_company_email: isChecked,
      updatedby_id: loginStatus.id,
    };

    await axios
      .post(
        POST_API.UPDATE_COMPANY_EMAIL_TYPE_SETTING,
        emailTypeSettingPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            setEmailTypeSettings((prevData) =>
              prevData.map((setting) =>
                setting.id === id
                  ? { ...setting, fromCompanyEmail: isChecked }
                  : setting
              )
            );
            showMessageSnackbar({message : response.data.message,type:"success"})
          }
          else{
            showMessageSnackbar({message : response.data.message,type:"error"})
          }
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: handleEmailTypeSettingCheckBoxChange,
          });
          if (refreshTokenStatus) {
            handleEmailTypeSettingCheckBoxChange(event);
          }
        }
      });
  };

  useEffect(() => {
    fetchCompanyEmailTypeSettings();
  }, []);

  return (
    <div className="w-full h-fit bg-gray-50 px-2 py-2">
      {userHasAccessToViewEmailTypeSetting && (
        <>
{isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 justify-between mb-1 text-gray-700 font-semibold text-xs">
            <div className="flex justify-between items-center">
              <span className="ml-3">Setting</span>
              <span>Mail From Company's Email</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="ml-3">Setting</span>
              <span>Mail From Company's Email</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="ml-3">Setting</span>
              <span>Mail From Company's Email</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {emailTypeSettings.map((per) => (
              <div
                key={per.id}
                className={
                  per.fromCompanyEmail
                    ? "bg-green-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" // Reduced padding and rounded corners
                    : "bg-red-100 rounded-lg shadow-sm  hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" // Reduced padding and rounded corners
                }
              >
                <div className="text-gray-800 font-medium text-xs">
                  {" "}
                  {/* Set name font size to 'xs' */}
                  {per.name}
                </div>

                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={per.fromCompanyEmail}
                    id={per.id.toString()}
                    onChange={handleEmailTypeSettingCheckBoxChange}
                  />
                  {/* Smaller toggle switch */}
                  <div className="w-6 h-3 bg-gray-400 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>{" "}
                  {/* Reduced width, height, and ring size */}
                  <div className="absolute ml-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transform peer-checked:translate-x-3 transition-all duration-300"></div>{" "}
                  {/* Reduced width, height, and translate-x */}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
       <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
        </>
      )}
      {!userHasAccessToViewEmailTypeSetting && (
        <AccessDeniedMessagePage></AccessDeniedMessagePage>
      ) }
    </div>
  );
}

export default EmailTypeSettings;
