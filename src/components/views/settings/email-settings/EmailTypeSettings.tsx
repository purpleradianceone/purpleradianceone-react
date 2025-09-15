/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useLoggedInUserContext } from '../../../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../../../constants/PostApi';
import { STATUS_CODE } from '../../../../constants/AppConstants';
import RefreshToken from '../../../../config/validations/RefreshToken';
import EmailTypeSettingsType from '../../../../@types/settings/EmailTypeSettingsType';
import { useUserAccessModules } from '../../../../config/hooks/useAccessModules';
import AccessDeniedMessagePage from '../../not-found/AccessDeniedMessagePage';
import toast from 'react-hot-toast';
import SettingToggleCard from '../../../ui/SettingToggleCard';

// New, reusable card component for each email setting
// interface EmailSettingCardProps {
//   setting: EmailTypeSettingsType;
//   onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const EmailSettingCard: React.FC<EmailSettingCardProps> = ({ setting, onToggle }) => {
//   return (
//     <div className="relative rounded-lg p-4 bg-white shadow-sm border border-gray-100 flex flex-col justify-between h-28">
//       <div>
//         <h3 className="text-base font-semibold text-gray-900 mb-1">
//           {setting.name}
//         </h3>
//       </div>

//       <label className="inline-flex items-center cursor-pointer relative self-end">
//         <input
//           type="checkbox"
//           className="sr-only peer"
//           checked={setting.fromCompanyEmail}
//           id={setting.id.toString()}
//           onChange={onToggle}
//         />
//         <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
//         <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
//       </label>
//     </div>
//   );
// };

function EmailTypeSettings() {
  const [emailTypeSettings, setEmailTypeSettings] = useState<EmailTypeSettingsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToViewEmailTypeSetting } = useUserAccessModules();

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
          fromCompanyEmail: res.tosend_from_company_email,
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
              setting.id === id ? { ...setting, fromCompanyEmail: isChecked } : setting
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
      toast.error('Failed to update email setting.');
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
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-1">
      <div className="text-center mb-3">
        <p className="text-sm text-gray-500 mt-2">Manage settings for different types of emails sent from your company.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {emailTypeSettings.map((setting) => (
            <SettingToggleCard key={setting.id} setting={setting} onToggle={handleEmailTypeSettingCheckBoxChange} />
          ))}
        </div>
      )}
    </div>
  );
}

export default EmailTypeSettings;