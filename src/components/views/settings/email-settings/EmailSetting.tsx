/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Mail,
  Server,
  Lock,
  KeyRound,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import SettingsModal from "./SettingsModal";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import Button from "../../../ui/Button";

import MESSAGE from "../../../../constants/Messages";
import EmailTypeSettings from "./EmailTypeSettings";
import AccessDeniedMessagePage from "../../not-found/AccessDeniedMessagePage";
import toast from "react-hot-toast";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";

interface CompanyEmailSetting {
  id: number;
  company_id: number;
  email: string;
  email_password: string;
  smtp_host: string;
  smtp_port: number;
  email_security_type_id: number;
  authentication_required: boolean;
  isactive: boolean;
  createdby: string;
  updatedby: string;
  createdon: string;
  updatedon: string;
}

interface CompanyUserEmailSetting {
  id: number;
  company_id: number;
  company_user_id: number;
  email: string;
  email_password: string;
  smtp_host: string;
  smtp_port: number;
  email_security_type_id: number;
  authentication_required: boolean;
  isactive: boolean;
  createdby: string;
  updatedby: string;
  createdon: string;
  updatedon: string;
}

export default function EmailSettingsTabs() {
  const [activeTab, setActiveTab] = useState<"company" | "user" | "email type">(
    "company"
  );
  const [companySettings, setCompanySettings] = useState<CompanyEmailSetting[]>(
    []
  );
  const [userSettings, setUserSettings] = useState<CompanyUserEmailSetting[]>(
    []
  );

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [modalType, setModalType] = useState<"company" | "user">("company");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    userHasAccessToAddEmailSetting,
    userHasAccessToUpdateEmailSetting,
    userHasAccessToViewEmailSetting,
    userHasAccessToViewEmailSettingCompany,
    userHasAccessToViewEmailTypeSetting,
  } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const handleModalSubmit = async (data: any) => {
    console.log("Submitted data:", data);
    if (activeTab === "company") {
      getEmailSettingsCompany();
    }
    if (activeTab === "user") {
      getEmailSettingsUser();
    }
  };

  const getEmailSettingsCompany = async () => {
    setIsLoading(true); // Start loading
    setCompanySettings([]);
    try {
      await axios
        .post(
          POST_API.GET_EMAIL_SETTING_COMPANY,
          {
            company_id: loginStatus.companyId,
            requestedby_id: loginStatus.id,
          },
          { withCredentials: true }
        )
        .then((result) => {
          if (result.status === STATUS_CODE.OK) {
            const companyEmailSetting = result.data;
            setCompanySettings(
              companyEmailSetting.length > 0 ? companyEmailSetting : []
            );
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunction: getEmailSettingsCompany,
            });
            if (refreshTokenStatus) {
              getEmailSettingsCompany();
            }
          }
        });
    } catch (error) {
      console.error("Error fetching  company email settings:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const getEmailSettingsUser = async () => {
    setIsLoading(true); // Start loading
    setUserSettings([]);
    try {
      await axios
        .post(
          POST_API.GET_EMAIL_SETTING_COMPANY_USER,
          {
            company_id: loginStatus.companyId,
            company_user_id: loginStatus.id,
            requestedby_id: loginStatus.id,
          },
          { withCredentials: true }
        )
        .then((result) => {
          if (result.status === STATUS_CODE.OK) {
            const companyUserEmailSetting = result.data;
            setUserSettings(
              companyUserEmailSetting.length > 0 ? companyUserEmailSetting : []
            );
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunction: getEmailSettingsUser,
            });
            if (refreshTokenStatus) {
              getEmailSettingsUser();
            }
          }
        });
    } catch (error) {
      console.error("Error fetching user email setting:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (activeTab === "company") {
      getEmailSettingsCompany();
    }
    if (activeTab === "user") {
      getEmailSettingsUser();
    }
  }, [activeTab]);

  const onEmailSettingToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setting: CompanyUserEmailSetting | CompanyEmailSetting,
    isForCompany: boolean
  ) => {
    const { checked } = event.target;

    if (userHasAccessToUpdateEmailSetting) {
      const updateEmailSettingPostData = {
        company_id: loginStatus.companyId,
        id: setting.id,
        email: setting.email,
        email_password: setting.email_password,
        smtp_host: setting.smtp_host,
        smtp_port: setting.smtp_port,
        email_security_type_id: setting.email_security_type_id,
        authentication_required: setting.authentication_required,
        isactive: checked,
        updatedby_id: loginStatus.id,
      };

      await axios
        .post(
          isForCompany
            ? POST_API.UPDATE_EMAIL_SETTING_COMPANY
            : POST_API.UPDATE_EMAIL_SETTING_COMPANY_USER,
          updateEmailSettingPostData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            if (response.data.status) {
              if (isForCompany) {
                setCompanySettings((prev) =>
                  prev.map((item) =>
                    item.id === setting.id
                      ? { ...item, isactive: checked }
                      : item
                  )
                );
              } else {
                setUserSettings((prev) =>
                  prev.map((item) =>
                    item.id === setting.id
                      ? { ...item, isactive: checked }
                      : item
                  )
                );
              }
            }

            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunctionWithTwoParamsAndEvent: onEmailSettingToggle,
            });

            if (refreshTokenStatus) {
              onEmailSettingToggle(event, setting, isForCompany);
            }
          }
        });
    }
  };

  const renderCompanyEmailCard = (
    setting: CompanyEmailSetting,
    index: number
  ) => (
    <>
      <div className="flex justify-between">
        <div
          key={index}
          className="flex-col w-[40vw] min-w-80 relative rounded-xl border border-gray-200 bg-white shadow-md p-6 hover:shadow-lg transition duration-300"
        >
          <Button
            disabled={!userHasAccessToUpdateEmailSetting}
            className="absolute top-4 right-4 bg-blue-600 action-btn-custom px-3 py-1 rounded hover:bg-blue-700 shadow-sm"
            onClick={() => {
              if (userHasAccessToUpdateEmailSetting) {
                setModalType("company");
                setEditData(setting);
                setIsModalOpen(true);
              } else {
                toast.error(MESSAGE.ERROR.NOT_ATHORISED);
              }
            }}
          >
            Edit
          </Button>

          <div className="flex items-center space-x-2 mb-2">
            <Mail className="text-blue-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Company Email:</strong> <span className="caption-custom">{setting.email}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <KeyRound className="text-gray-500 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Email Password:</strong> <span className="caption-custom">********</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="text-green-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">SMTP Host:</strong> <span className="caption-custom">{setting.smtp_host}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="text-purple-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">SMTP Port:</strong> <span className="caption-custom">{setting.smtp_port}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="text-orange-500 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Security Type:</strong>{" "}
              <span className="caption-custom">
              {setting.email_security_type_id === 1
                ? "SSL"
                : setting.email_security_type_id === 2
                ? "TLS"
                : "Unknown"}
                </span>
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck
              className={`w-5 h-5 ${
                setting.authentication_required
                  ? "text-emerald-600"
                  : "text-gray-400"
              }`}
            />
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Authentication Required:</strong>{" "}
               <span className="caption-custom">{setting.authentication_required ? "Yes" : "No"}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            {setting.isactive ? (
              <CheckCircle className={`w-5 h-5 ${"text-emerald-600"}`} />
            ) : (
              <XCircle className={`w-5 h-5 ${"text-red-600"}`} />
            )}
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Active:</strong>
            </p>
            <label className="inline-flex items-center cursor-pointer relative self-end">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={setting.isactive}
                id={setting.id.toString()}
                onChange={(e) => {
                  onEmailSettingToggle(e, setting, true);
                }}
              />
              <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />{" "}
              {/* Adjusted size and colors */}
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />{" "}
              {/* Adjusted size and position */}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Created By:</strong> <span className="caption-custom">{setting.createdby}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Created On:</strong> <span className="caption-custom">{setting.createdon}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Updated By:</strong> <span className="caption-custom">{setting.updatedby}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong className="input-label-custom">Updated On:</strong> <span className="caption-custom">{setting.updatedon}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderUserEmailCard = (
    setting: CompanyUserEmailSetting,
    index: number
  ) => (
    <>
      {userHasAccessToViewEmailSetting ? (
        <>
          <div className="flex justify-between">
            <div
              key={index}
              className="w-[40vw] min-w-80 relative rounded-xl border border-gray-200 bg-white shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <Button
                disabled={!userHasAccessToUpdateEmailSetting}
                className="absolute top-4 right-4 bg-blue-600 action-btn-custom px-3 py-1 rounded hover:bg-blue-700 shadow-sm"
                onClick={() => {
                  if (userHasAccessToUpdateEmailSetting) {
                    setModalType("user");
                    setEditData(setting);
                    setIsModalOpen(true);
                  } else {
                    toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                  }
                }}
              >
                Edit
              </Button>
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="text-blue-600 w-5 h-5" />
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">User Email:</strong> <span className="caption-custom">{setting.email}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <KeyRound className="text-gray-500 w-5 h-5" />
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Email Password:</strong> <span className="caption-custom">********</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Server className="text-green-600 w-5 h-5" />
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">SMTP Host:</strong> <span className="caption-custom">{setting.smtp_host}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Server className="text-purple-600 w-5 h-5" />
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">SMTP Port:</strong> <span className="caption-custom">{setting.smtp_port}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="text-orange-500 w-5 h-5" />
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Security Type:</strong>{" "}
                  <span className="caption-custom">
                  {setting.email_security_type_id === 1
                    ? "SSL"
                    : setting.email_security_type_id === 2
                    ? "TLS"
                    : "Unknown"}
                    </span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheck
                  className={`w-5 h-5 ${
                    setting.authentication_required
                      ? "text-emerald-600"
                      : "text-gray-400"
                  }`}
                />
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Authentication Required:</strong>{" "}
                  <span className="caption-custom">{setting.authentication_required ? "Yes" : "No"}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                {setting.isactive ? (
                  <CheckCircle className={`w-5 h-5 ${"text-emerald-600"}`} />
                ) : (
                  <XCircle className={`w-5 h-5 ${"text-red-600"}`} />
                )}
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Active:</strong>
                </p>
                <label className="inline-flex items-center cursor-pointer relative self-end">
                  {" "}
                  {/* Align toggle to bottom-right */}
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={setting.isactive}
                    id={setting.id.toString()}
                    onChange={(e) => {
                      onEmailSettingToggle(e, setting, false);
                    }}
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />{" "}
                  {/* Adjusted size and colors */}
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />{" "}
                  {/* Adjusted size and position */}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Created By:</strong> <span className="caption-custom">{setting.createdby}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Created On:</strong> <span className="caption-custom">{setting.createdon}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Updated By:</strong> <span className="caption-custom">{setting.updatedby}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-700 text-sm">
                  <strong className="input-label-custom">Updated On:</strong> <span className="caption-custom">{setting.updatedon}</span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <AccessDeniedMessagePage></AccessDeniedMessagePage>
      )}
    </>
  );

  return (
    <div className="w-full">
      <div className="mb-2 flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("company")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "company"
              ? "border-teal-600 table-header-custom active"
              : "border-transparent table-header-custom"
          }`}
        >
          Company Email Settings
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "user"
              ? "border-teal-600 table-header-custom active"
              : "border-transparent table-header-custom"
          }`}
        >
          Company User Email Settings
        </button>
        <button
          onClick={() => setActiveTab("email type")}
          className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "email type"
              ? "border-teal-600 table-header-custom active"
              : "border-transparent table-header-custom"
          }`}
        >
          Email Type
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "company" ? (
          <div className="w-full">
            {userHasAccessToViewEmailSettingCompany ? (
              isLoading ? (
                <div className="flex justify-center items-center h-[40vh]">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div>
                  {companySettings.length > 0 ? (
                    companySettings.map(renderCompanyEmailCard)
                  ) : (
                    <div className=" w-full justify-items-end text-gray-500 p-4  rounded-md bg-white shadow-sm">
                      <div className="max-w-36">
                        <Button
                          disabled={!userHasAccessToAddEmailSetting}
                          onClick={() => {
                            if (userHasAccessToAddEmailSetting) {
                              setModalType("company");
                              setEditData(null);
                              setIsModalOpen(true);
                            } else {
                              toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                            }
                          }}
                        >
                          <Plus className="w-5 h-5 text-white " />{" "}
                          <span className=" font-bold ">Create</span>{" "}
                        </Button>
                      </div>
                      <span>No Email Settings For company </span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <AccessDeniedMessagePage></AccessDeniedMessagePage>
            )}
          </div>
        ) : activeTab === "user" ? (
          <div className="w-full">
            {userHasAccessToViewEmailSetting ? (
              isLoading ? (
                <div className="flex justify-center items-center h-[40vh]">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div>
                  {userSettings.length > 0 ? (
                    userSettings.map(renderUserEmailCard)
                  ) : (
                    <div className="text-center w-full justify-items-end text-gray-500 p-4  rounded-md bg-white shadow-sm">
                      <div className="flex justify-center  items-center max-w-36">
                        <Button
                          disabled={!userHasAccessToAddEmailSetting}
                          onClick={() => {
                            if (userHasAccessToAddEmailSetting) {
                              setModalType("user");
                              setEditData(null);
                              setIsModalOpen(true);
                            } else {
                              toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                            }
                          }}
                        >
                          <Plus className="w-5 h-5 text-white " />{" "}
                          <span className=" font-bold ">Create</span>{" "}
                        </Button>
                      </div>
                      <span>No Email Settings For User </span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <AccessDeniedMessagePage></AccessDeniedMessagePage>
            )}
          </div>
        ) : (
          <div>
            {userHasAccessToViewEmailTypeSetting ? (
              <EmailTypeSettings></EmailTypeSettings>
            ) : (
              <AccessDeniedMessagePage></AccessDeniedMessagePage>
            )}
          </div>
        )}
      </div>

      <div className="w-[50vw]">
        {/* Settings Modal */}
        <SettingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          settingType={modalType}
          initialData={editData}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
}
