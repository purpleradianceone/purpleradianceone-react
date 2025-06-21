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
import { NUMBER_VALUES, STATUS_CODE } from "../../../../constants/AppConstants";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import Button from "../../../ui/Button";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import MESSAGE from "../../../../constants/Messages";
import EmailTypeSettings from "./EmailTypeSettings";

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
  const { userHasAccessToAddEmailSetting, userHasAccessToUpdateEmailSetting } =
    useUserAccessModules();

  const handleModalSubmit = async (data: any) => {
    console.log("Submitted data:", data);
    await getEmailSettings();
    // TODO: Update state or send to backend here
  };

  const { loginStatus } = useLoggedInUserContext();
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

  const getEmailSettings = async () => {
    setIsLoading(true); // Start loading
    setCompanySettings([]);
    setUserSettings([]);
    try {
      const responseCompanyEmailSettings = await axios.post(
        POST_API.GET_EMAIL_SETTING_COMPANY,
        {
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
        },
        { withCredentials: true }
      );

      if (responseCompanyEmailSettings.status === STATUS_CODE.OK) {
        const companyEmailSetting = responseCompanyEmailSettings.data;
        setCompanySettings(
          companyEmailSetting.length > 0 ? companyEmailSetting : []
        );
      }

      const responseCompanyUserEmailSettings = await axios.post(
        POST_API.GET_EMAIL_SETTING_COMPANY_USER,
        {
          company_id: loginStatus.companyId,
          company_user_id: loginStatus.id,
          requestedby_id: loginStatus.id,
        },
        { withCredentials: true }
      );

      if (responseCompanyUserEmailSettings.status === STATUS_CODE.OK) {
        const companyUserEmailSetting = responseCompanyUserEmailSettings.data;
        setUserSettings(
          companyUserEmailSetting.length > 0 ? companyUserEmailSetting : []
        );
      }
    } catch (error) {
      console.error("Error fetching template types:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getEmailSettings();
  }, []);

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
            className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow-sm"
            onClick={() => {
              if (userHasAccessToUpdateEmailSetting) {
                setModalType("company");
                setEditData(setting);
                setIsModalOpen(true);
              } else {
                showMessageSnackbar({
                  message: MESSAGE.ERROR.NOT_ATHORISED,
                  type: "error",
                });
              }
            }}
          >
            Edit
          </Button>

          <div className="flex items-center space-x-2 mb-2">
            <Mail className="text-blue-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>Company Email:</strong> {setting.email}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <KeyRound className="text-gray-500 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>Email Password:</strong> ********
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="text-green-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>SMTP Host:</strong> {setting.smtp_host}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="text-purple-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>SMTP Port:</strong> {setting.smtp_port}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="text-orange-500 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>Security Type:</strong>{" "}
              {setting.email_security_type_id === 1
                ? "SSL"
                : setting.email_security_type_id === 2
                ? "TLS"
                : "Unknown"}
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
              <strong>Authentication Required:</strong>{" "}
              {setting.authentication_required ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            {setting.isactive ? (
              <CheckCircle className={`w-5 h-5 ${"text-emerald-600"}`} />
            ) : (
              <XCircle className={`w-5 h-5 ${"text-red-600"}`} />
            )}
            <p className="text-gray-700 text-sm">
              <strong>Active:</strong> {setting.isactive ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Created By:</strong> {setting.createdby}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Created On:</strong> {setting.createdon}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Updated By:</strong> {setting.updatedby}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Updated On:</strong> {setting.updatedon}
            </p>
          </div>
        </div>
      </div>
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </>
  );

  const renderUserEmailCard = (
    setting: CompanyUserEmailSetting,
    index: number
  ) => (
    <>
      <div className="flex justify-between">
        <div
          key={index}
          className="w-[40vw] min-w-80 relative rounded-xl border border-gray-200 bg-white shadow-md p-6 hover:shadow-lg transition duration-300"
        >
          <Button
            disabled={!userHasAccessToUpdateEmailSetting}
            className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow-sm"
            onClick={() => {
              if (userHasAccessToUpdateEmailSetting) {
                setModalType("user");
                setEditData(setting);
                setIsModalOpen(true);
              } else {
                showMessageSnackbar({
                  message: MESSAGE.ERROR.NOT_ATHORISED,
                  type: "error",
                });
              }
            }}
          >
            Edit
          </Button>
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="text-blue-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>User Email:</strong> {setting.email}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <KeyRound className="text-gray-500 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>Email Password:</strong> ********
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="text-green-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>SMTP Host:</strong> {setting.smtp_host}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="text-purple-600 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>SMTP Port:</strong> {setting.smtp_port}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="text-orange-500 w-5 h-5" />
            <p className="text-gray-700 text-sm">
              <strong>Security Type:</strong>{" "}
              {setting.email_security_type_id === 1
                ? "SSL"
                : setting.email_security_type_id === 2
                ? "TLS"
                : "Unknown"}
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
              <strong>Authentication Required:</strong>{" "}
              {setting.authentication_required ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            {setting.isactive ? (
              <CheckCircle className={`w-5 h-5 ${"text-emerald-600"}`} />
            ) : (
              <XCircle className={`w-5 h-5 ${"text-red-600"}`} />
            )}
            <p className="text-gray-700 text-sm">
              <strong>Active:</strong> {setting.isactive ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Created By:</strong> {setting.createdby}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Created On:</strong> {setting.createdon}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Updated By:</strong> {setting.updatedby}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-700 text-sm">
              <strong>Updated On:</strong> {setting.updatedon}
            </p>
          </div>
        </div>
      </div>
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </>
  );

  //message snakbar

  return (
    <div className="w-full">
      <div className="sticky z-5 top-0 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm w-full min-w-full ">
        <div className="flex justify-between w-full items-center">
          {/* <div className="flex gap-1">
            {<LucideMail className="w-6 h-6 text-blue-600" />}
            {<LucideSettings className="w-4 h-4 text-blue-600" />}
            <span className="text-xl font-bold ">Email Settings</span>
          </div> */}
          {/* {activeTab !== "email type" && (
<div className="flex float-end ">
            {activeTab === "company" ? (
              <div className="flex justify-end ">
                <Button
                  disabled={!userHasAccessToAddEmailSetting}
                  className=" top-20 right-4 flex items-center bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 text-sm"
                  onClick={() => {
                    if (userHasAccessToAddEmailSetting) {
                      setModalType("company");
                      setEditData(null);
                      setIsModalOpen(true);
                    } else {
                      showMessageSnackbar({
                        message: MESSAGE.ERROR.NOT_ATHORISED,
                        type: "error",
                      });
                    }
                  }}
                >
                  <Plus className="w-5 h-5 text-white " />{" "}
                  <span className=" font-bold ">Create</span>
                </Button>
              </div>
            ) : (
              <div className="flex justify-end ">
                <Button
                  disabled={!userHasAccessToAddEmailSetting}
                  className=" top-20 right-4 flex items-center bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 text-sm"
                  onClick={() => {
                    if (userHasAccessToAddEmailSetting) {
                      setModalType("user");
                      setEditData(null);
                      setIsModalOpen(true);
                    } else {
                      showMessageSnackbar({
                        message: MESSAGE.ERROR.NOT_ATHORISED,
                        type: "error",
                      });
                    }
                  }}
                >
                  <Plus className="w-5 h-5 text-white " />{" "}
                  <span className=" font-bold ">Create</span>{" "}
                </Button>
              </div>
            )}
            <MessageSnackBar
              isOpen={messageSnackbar.open}
              message={messageSnackbar.message}
              type={messageSnackbar.type}
              onClose={handleMessageSnackbarClose}
              duration={NUMBER_VALUES.SNACKBAR_DURATION}
            />
          </div>
          )}
           */}
        </div>
      </div>
      <div className="mb-2 flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("company")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "company"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          Company Email Settings
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "user"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          Company User Email Settings
        </button>
        <button
          onClick={() => setActiveTab("email type")}
          className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "email type"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
          }`}
        >
          Email Type
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "company" ? (
          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-[40vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div>
                {companySettings.length > 0 ? (
                  companySettings.map(renderCompanyEmailCard)
                ) : (
                  <div className="text-center w-full justify-items-center text-gray-500 mt-10 p-4  rounded-md bg-white shadow-sm">
                    <span>No Email Settings For company </span>
                    <div className="max-w-36">
                      <Button
                        disabled={!userHasAccessToAddEmailSetting}
                        onClick={() => {
                          if (userHasAccessToAddEmailSetting) {
                            setModalType("company");
                            setEditData(null);
                            setIsModalOpen(true);
                          } else {
                            showMessageSnackbar({
                              message: MESSAGE.ERROR.NOT_ATHORISED,
                              type: "error",
                            });
                          }
                        }}
                      >
                        <Plus className="w-5 h-5 text-white " />{" "}
                        <span className=" font-bold ">Create</span>{" "}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeTab === "user" ? (
          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-[40vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div>
                {userSettings.length > 0 ? (
                  userSettings.map(renderUserEmailCard)
                ) : (
                  <div className="text-center w-full justify-items-center text-gray-500 mt-10 p-4  rounded-md bg-white shadow-sm">
                    <span>No Email Settings For company </span>
                    <div className="flex justify-center  items-center max-w-36">
                      <Button
                        disabled={!userHasAccessToAddEmailSetting}
                        onClick={() => {
                          if (userHasAccessToAddEmailSetting) {
                            setModalType("user");
                            setEditData(null);
                            setIsModalOpen(true);
                          } else {
                            showMessageSnackbar({
                              message: MESSAGE.ERROR.NOT_ATHORISED,
                              type: "error",
                            });
                          }
                        }}
                      >
                        <Plus className="w-5 h-5 text-white " />{" "}
                        <span className=" font-bold ">Create</span>{" "}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <EmailTypeSettings></EmailTypeSettings>
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
          handleResponseMessage={({
            message,
            type,
          }: ShowMessageSnackbarProps) => {
            showMessageSnackbar({ message: message, type: type });
          }}
        />
      </div>
    </div>
  );
}
