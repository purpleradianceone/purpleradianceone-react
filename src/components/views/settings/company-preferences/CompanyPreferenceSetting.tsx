/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import CompanyPreferencesType from "../../../../@types/settings/CompanyPreferences";
import toast from "react-hot-toast";

// New, reusable card component for each company preference
interface PreferenceCardProps {
  label: string;
  name: string;
  checked: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreferenceCard: React.FC<PreferenceCardProps> = ({
  label,
  name,
  checked,
  onToggle
}) => {
  return (
    // <div className="relative rounded-lg p-6 bg-white shadow-sm border border-gray-100 flex flex-col justify-between h-40">
    //   <div>
    //     <h3 className="text-base font-semibold text-gray-900 mb-1">{label}</h3>
    //   </div>

    //   <label className="inline-flex items-center cursor-pointer relative self-end">
    //     <input
    //       type="checkbox"
    //       className="sr-only peer"
    //       checked={checked}
    //       name={name}
    //       onChange={onToggle}
    //     />
    //     <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
    //     <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
    //   </label>
    // </div>
    <div className="relative rounded-lg p-4 bg-white shadow-sm border border-gray-100 flex flex-col justify-between h-28">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1"> {/* Increased font size and weight */}
          {label}
        </h3>
      </div>

      <label className="inline-flex items-center cursor-pointer relative self-end"> {/* Align toggle to bottom-right */}
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          name={name}
          onChange={onToggle}
        />
        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" /> {/* Adjusted size and colors */}
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" /> {/* Adjusted size and position */}
      </label>
    </div>
  );
};

function CompanyPreferenceSetting() {
  const { loginStatus } = useLoggedInUserContext();

  const [companyPreferences, setCompanyPreferences] =
    useState<CompanyPreferencesType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCompanyPreferences = async () => {
    setIsLoading(true);
    const getCompanyPreferencesPostData = {
      company_id: loginStatus.companyId,
      requestedby_id: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.GET_COMPANY_PREFERENCES,
        getCompanyPreferencesPostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        setCompanyPreferences({
          id: response.data.id,
          companyId: response.data.companyId,
          isEmailServiceOn: response.data.is_email_service_on,
          isNotificationServiceMobileOn:
            response.data.is_notification_service_mobile_on,
          isNotificatonServiceWebOn:
            response.data.is_notification_service_web_on,
          uIdWebLeadCapture: response.data.uid_web_lead_capture,
          createdBy: response.data.createdby,
          createdOn: response.data.createdon,
          updatedBy: response.data.updatedby,
          updatedOn: response.data.updatedon,
        });
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getCompanyPreferences,
        });
        if (refreshTokenStatus) {
          getCompanyPreferences();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyPreferenceCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setIsLoading(true);

    const updatedPreferences = {
      ...companyPreferences,
      [name]: checked,
    };

    const updateCompanyPreferencesPostData = {
      company_id: loginStatus.companyId,
      is_email_service_on: updatedPreferences.isEmailServiceOn,
      is_notification_service_mobile_on:
        updatedPreferences.isNotificationServiceMobileOn,
      is_notification_service_web_on:
        updatedPreferences.isNotificatonServiceWebOn,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_PREFERENCES,
        updateCompanyPreferencesPostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          toast.success(response.data.message);
          setCompanyPreferences(updatedPreferences as CompanyPreferencesType);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleCompanyPreferenceCheckboxChange
        });
        if (refreshTokenStatus) {
          handleCompanyPreferenceCheckboxChange(event);
        }
      } else {
        toast.error("Failed to update preference.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanyPreferences();
  }, []);

 

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 lg:p-1">
      <div className="text-center mb-3">
        <p className="text-sm text-gray-500 mt-2">
          Manage your company's default settings and services.
        </p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companyPreferences && (
            <>
              <PreferenceCard
                label="Email Notifications"
                name="isEmailServiceOn"
                checked={companyPreferences.isEmailServiceOn}
                onToggle={handleCompanyPreferenceCheckboxChange}
              />
              <PreferenceCard
                label="Mobile App Notifications"
                name="isNotificationServiceMobileOn"
                checked={companyPreferences.isNotificationServiceMobileOn}
                onToggle={handleCompanyPreferenceCheckboxChange}
              />
              <PreferenceCard
                label="Web App Notifications"
                name="isNotificatonServiceWebOn"
                checked={companyPreferences.isNotificatonServiceWebOn}
                onToggle={handleCompanyPreferenceCheckboxChange}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyPreferenceSetting;
