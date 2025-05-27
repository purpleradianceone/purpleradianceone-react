import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyEmailSettingsForm from "./CompanyEmailSettingForm";
import CompanyUserEmailSettingsForm from "./CompanyUserEmailSettingsForm";


export default function EmailSettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 border rounded-lg shadow-sm">
      {/* Tab Header */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("company")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "company"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Email Setting Company
        </button>
        <button
          onClick={() => setActiveTab("companyUser")}
          className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "companyUser"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Email Setting Company User
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "company" && (
        <CompanyEmailSettingsForm/>
      )}

      {activeTab === "companyUser" && (
        <CompanyUserEmailSettingsForm/>
      )}
    </div>
  );






  

}


