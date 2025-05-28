/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Mail,
  Server,
  Lock,
  KeyRound,
  Plus,
  LucideMail,
  LucideSettings,
} from "lucide-react";
import SettingsModal from "./SettingsModal";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";

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
  company_user_id:number;
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

// const mockCompanySettings: CompanyEmailSetting[] = [
//   {
//     id:1,
//     company_id:1,
//     email: "support@company.com",
//     email_password: "secret",
//     smtp_host: "smtp.company.com",
//     smtp_port: 587,
//     email_security_type_id: 1,
//     authentication_required: true,
//      isactive: true,
//   createdby: "Owner",
//   updatedby: "Owner",
//   createdon: "1 May 2025",
//   updatedon: "1 May 2025",

//   },
// ];

// const mockUserSettings: CompanyUserEmailSetting[] = [
//   {
//     id:1,
//     company_id:1,
//     company_user_id:1,
//     email: "john.doe@company.com",
//     email_password: "secretuser",
//     smtp_host: "smtp.user.com",
//     smtp_port: 465,
//     email_security_type_id: 2,
//     authentication_required: false,
//      isactive: true,
//   createdby: "Owner",
//   updatedby: "Owner",
//   createdon: "1 May 2025",
//   updatedon: "1 May 2025",
//   },
// ];

export default function EmailSettingsTabs() {
  const [activeTab, setActiveTab] = useState<"company" | "user">("company");
  const [companySettings, setCompanySettings] = useState<CompanyEmailSetting[]>([]);
  const [userSettings, setUserSettings] = useState<CompanyUserEmailSetting[]>([]);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [modalType, setModalType] = useState<"company" | "user">("company");

  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleModalSubmit = (data: any) => {
    console.log("Submitted data:", data);
    // TODO: Update state or send to backend here
  };

    const { loginStatus } = useLoggedInUserContext();
  

const getEmailSettings = async () => {
  setIsLoading(true); // Start loading
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
      setCompanySettings(companyEmailSetting.length > 0 ? companyEmailSetting : []);
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
      setUserSettings(companyUserEmailSetting.length > 0 ? companyUserEmailSetting : []);
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

  
  const renderCompanyEmailCard = (setting: CompanyEmailSetting, index: number) => (
    <div
      key={index}
      className="w-[40vw] min-w-80 relative rounded-xl border border-gray-200 bg-white shadow-md p-6 hover:shadow-lg transition duration-300"
    >
      <button
        className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow-sm"
        onClick={() => {
          setModalType("company");
          setEditData(setting);
          setIsModalOpen(true);
        }}
      >
        Edit
      </button>
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
      <div className="flex items-center space-x-2">
        <ShieldCheck
          className={`w-5 h-5 ${
            setting.authentication_required ? "text-emerald-600" : "text-gray-400"
          }`}
        />
        <p className="text-gray-700 text-sm">
          <strong>Authentication Required:</strong>{" "}
          {setting.authentication_required ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );

  const renderUserEmailCard = (setting: CompanyUserEmailSetting, index: number) => (
    <div
      key={index}
      className="w-[40vw] min-w-80 relative rounded-xl border border-gray-200 bg-white shadow-md p-6 hover:shadow-lg transition duration-300"
    >
      <button
        className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow-sm"
        onClick={() => {
          setModalType("user");
          setEditData(setting);
          setIsModalOpen(true);
        }}
      >
        Edit
      </button>
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
      <div className="flex items-center space-x-2">
        <ShieldCheck
          className={`w-5 h-5 ${
            setting.authentication_required ? "text-emerald-600" : "text-gray-400"
          }`}
        />
        <p className="text-gray-700 text-sm">
          <strong>Authentication Required:</strong>{" "}
          {setting.authentication_required ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 w-full">
      <div className="sticky z-5 top-8 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm w-full min-w-full ">
        <div className="flex justify-between w-full h-12 items-center">
          <div className="flex gap-1">
            {<LucideMail className="w-6 h-6 text-blue-600" />}
            {<LucideSettings className="w-4 h-4 text-blue-600" />}
            <span className="text-xl font-bold ">Email Settings</span>
          </div>
        </div>
      </div>
      <div className="mb-6 flex border-b border-gray-300">
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
      </div>

      {/* Content */}
      <div>
        {activeTab === "company" ? (
          <div className="w-full">
            <div className="flex justify-end mb-4">
              <button
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                onClick={() => {
                  setModalType("company");
                  setEditData(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" /> Create
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-[40vh]">
               <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companySettings.length > 0 ? (
                  companySettings.map(renderCompanyEmailCard)
                ) : (
                  <div className="justify-center items-center">
                    <h6 className="justify-center items-center">
                      {" "}
                      No Email Settings For company{" "}
                    </h6>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <div className="flex justify-end mb-4">
              <button
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                onClick={() => {
                  setModalType("user");
                  setEditData(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" /> Create
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-[40vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSettings.length > 0 ? (
                  userSettings.map(renderUserEmailCard)
                ) : (
                  <div className="justify-center items-center">
                    {" "}
                    <h6 className="justify-center items-center">
                      {" "}
                      No Email Settings For Company User{" "}
                    </h6>
                  </div>
                )}
              </div>
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


