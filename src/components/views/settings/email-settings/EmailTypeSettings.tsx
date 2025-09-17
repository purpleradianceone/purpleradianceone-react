/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useLoggedInUserContext } from '../../../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../../../constants/PostApi';
import { emailDescriptions, STATUS_CODE } from '../../../../constants/AppConstants';
import RefreshToken from '../../../../config/validations/RefreshToken';
import EmailTypeSettingsType from '../../../../@types/settings/EmailTypeSettingsType';
import { useUserAccessModules } from '../../../../config/hooks/useAccessModules';
import AccessDeniedMessagePage from '../../not-found/AccessDeniedMessagePage';
import toast from 'react-hot-toast';
import SettingToggleCard from '../../../ui/SettingToggleCard';



function EmailTypeSettings() {
  const [emailTypeSettings, setEmailTypeSettings] = useState<EmailTypeSettingsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToViewEmailTypeSetting } = useUserAccessModules();



const getDescription = (setting : EmailTypeSettingsType) => {
  if(setting.emailTypeId === 1){
    return setting.isActive ? emailDescriptions.active.welcomeCompanyUser : emailDescriptions.inactive.welcomeCompanyUser;
  }
  else if(setting.emailTypeId === 2){
        return setting.isActive ? emailDescriptions.active.newLeadCreated : emailDescriptions.inactive.newLeadCreated;
  }
  else if(setting.emailTypeId === 3){
        return setting.isActive ? emailDescriptions.active.leadAssigned : emailDescriptions.inactive.leadAssigned;
  }
  else if(setting.emailTypeId === 4){
        return setting.isActive ? emailDescriptions.active.leadStatusChanged : emailDescriptions.inactive.leadStatusChanged;
  }
  else if(setting.emailTypeId === 9){
        return setting.isActive ? emailDescriptions.active.companyUserAssignedToCompanyProduct : emailDescriptions.inactive.companyUserAssignedToCompanyProduct;
  }
  else if(setting.emailTypeId === 10){
        return setting.isActive ? emailDescriptions.active.companyUserAssignedToCompanyTeam : emailDescriptions.inactive.companyUserAssignedToCompanyTeam;
  }
   else if(setting.emailTypeId === 11){
        return setting.isActive ? emailDescriptions.active.newAccountCreated : emailDescriptions.inactive.newAccountCreated;
  }
}

  const fetchCompanyEmailTypeSettings = async () => {
    setIsLoading(true);
    setEmailTypeSettings([]);
    const fetchCompanyEmailTypeSettingsPostData = {
      company_id: loginStatus.companyId,
      requestedby_id: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.GET_COMPANY_EMAIL_TYPE_SETTING,
        fetchCompanyEmailTypeSettingsPostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const mappedSettings = response.data.map((res: any) => ({
          id: res.id,
          companyId: res.company_id,
          name: res.name,
          isActive: res.tosend_from_company_email,
          emailTypeId: res.email_type_id,
          createdBy: res.createdby,
          createdOn: res.createdon,
          updatedBy: res.updatedby,
          updatedOn: res.updatedon,
        }));
        setEmailTypeSettings(mappedSettings);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({ callFunction: fetchCompanyEmailTypeSettings });
        if (refreshTokenStatus) {
          fetchCompanyEmailTypeSettings();
        }
      }
      toast.error('Failed to fetch email settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailTypeSettingCheckBoxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(event.target.id);
    const isChecked = event.target.checked;
    const emailTypeSettingPostData = {
      company_id: loginStatus.companyId,
      id: id,
      tosend_from_company_email: isChecked,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_EMAIL_TYPE_SETTING,
        emailTypeSettingPostData,
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          setEmailTypeSettings((prevData) =>
            prevData.map((setting) =>
              setting.id === id ? { ...setting, isActive: isChecked } : setting
            )
          );
          toast.success(response.data.message)
        } else {
         toast.error(response.data.message)
        }
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleEmailTypeSettingCheckBoxChange,
        });
        if (refreshTokenStatus) {
          handleEmailTypeSettingCheckBoxChange(event);
        }
      }
    }
  };

  useEffect(() => {
    if (userHasAccessToViewEmailTypeSetting) {
      fetchCompanyEmailTypeSettings();
    }
  }, [userHasAccessToViewEmailTypeSetting]);

  if (!userHasAccessToViewEmailTypeSetting) {
    return <AccessDeniedMessagePage />;
  }

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 lg:p-1">
      <div className="text-center mb-3">
        <p className="table-data-custom mt-2">Manage settings for different types of emails sent from your company email.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {emailTypeSettings.map((setting) => (
            <SettingToggleCard key={setting.id} setting={setting} onToggle={handleEmailTypeSettingCheckBoxChange} description={getDescription(setting)} />
          ))}
        </div>
      )}
    <div className="w-full h-fit bg-gray-50 px-2 py-2">
      {!userHasAccessToViewEmailTypeSetting && (
        <AccessDeniedMessagePage></AccessDeniedMessagePage>
      )}
    </div>
      </div>
  );
}

export default EmailTypeSettings;