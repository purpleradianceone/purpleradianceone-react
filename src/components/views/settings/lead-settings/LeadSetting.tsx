/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLoggedInUserContext } from '../../../../context/user/LoggedInUserContext';
import POST_API from '../../../../constants/PostApi';
import { STATUS_CODE } from '../../../../constants/AppConstants';
import RefreshToken from '../../../../config/validations/RefreshToken';
import CompanyLeadSettingType from '../../../../@types/settings/CompanyLeadSettings';
import { useGoogleMeetStatus } from '../../../../config/hooks/useGoogleMeetStatus';
import { useZoomMeetingsStatus } from '../../../../config/hooks/useZoomMeetingsStatus';
import SettingToggleCard from '../../../ui/SettingToggleCard';


const LeadSetting: React.FC = () => {
  useGoogleMeetStatus();
  useZoomMeetingsStatus();

  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadSetting, setLeadSetting] = useState<CompanyLeadSettingType[]>([]);

  const getLeadSetting = async () => {
    setIsLoading(true);
    try {
      const companyLeadSettingPostData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
      };

      const response = await axios.post(
        POST_API.GET_LEAD_SETTING_COMPANY,
        companyLeadSettingPostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const mappedSettings = response.data.map((res: any) => ({
          id: res.id,
          companyId: res.company_id,
          leadSettingMasterId: res.lead_setting_master_id,
          name: res.name,
          isActive: res.isactive,
          createdBy: res.createdby,
          updatedBy: res.updatedby,
          createdOn: res.createdon,
          updatedOn: res.updatedon,
        }));
        setLeadSetting(mappedSettings);
      }
    } catch (error: any) {
      if (error.response?.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({ callFunction: getLeadSetting });
        if (refreshTokenResponse) {
          getLeadSetting();
        }
      }
      console.error(error);
      toast.error('Failed to load settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeadSetting();
  }, []);

  const handleLeadSettingCheckBoxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const id = parseInt(event.target.id, 10);

    const updateLeadSettingCompanyPostData = {
      company_id: loginStatus.companyId,
      id,
      isactive: isChecked,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_LEAD_SETTING_COMPANY,
        updateLeadSettingCompanyPostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          setLeadSetting((prev) =>
            prev.map((setting) => (setting.id === id ? { ...setting, isActive: isChecked } : setting))
          );
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error: any) {
      if (error.response?.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithEvent: handleLeadSettingCheckBoxChange,
        });
        if (refreshTokenResponse) {
          handleLeadSettingCheckBoxChange(event);
        }
      }
      console.error(error);
      toast.error('Failed to update setting.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-1">
      <div className="text-center mb-3">
        <p className="text-sm text-gray-500 mt-2">Manage your company's lead-related configurations.</p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {leadSetting.map((per) => (
            <SettingToggleCard key={per.id} setting={per} onToggle={handleLeadSettingCheckBoxChange} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadSetting;