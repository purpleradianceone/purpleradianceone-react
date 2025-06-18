/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Button from "../../../ui/Button";
import axios from "axios";

import POST_API from "../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import CompanyLeadSettingType from "../../../../@types/settings/CompanyLeadSettings";

function CompanySetting() {

  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadSetting, setLeadSetting] = useState<CompanyLeadSettingType[]>([]);

  
  const getLeadSetting = async () => {
    setIsLoading(true);
    try {
      setLeadSetting([]);
      const companyLeadSettingPostData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
      };

      await axios
        .post(POST_API.GET_LEAD_SETTING_COMPANY, companyLeadSettingPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            response.data.map((res: any) => {
              setLeadSetting((prev) => [
                ...prev,
                {
                  id: res.id,
                  companyId: res.company_id,
                  leadSettingMasterId: res.lead_setting_master_id,
                  name: res.name,
                  isActive: res.isactive,
                  createdBy: res.createdby,
                  updatedBy: res.updatedby,
                  createdOn: res.createdon,
                  updatedOn: res.updatedon,
                },
              ]);
            });
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: getLeadSetting,
            });
            if (refreshTokenResponse) {
              getLeadSetting();
            }
          }
        });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getLeadSetting();
  }, []);

  

  const handleSettingCheckBoxChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const isChecked = event.target.checked;
  const id = Number(event.target.id);

  const updateLeadSettingCompanyPostData = {
    company_id: loginStatus.companyId,
    id: id,
    isactive: isChecked,
   updatedby_id: loginStatus.id,

  };

  try {
    const response = await axios.post(
      POST_API.UPDATE_LEAD_SETTING_COMPANY,
      updateLeadSettingCompanyPostData,
      {
        withCredentials: true,
      }
    );

    if (response.data.status) {
      console.log("Update successfully");
    }
  } catch (error) {
    console.error("Error updating setting:", error);
    // Optional: show toast or error message
  }

  setLeadSetting((prev) =>
    prev.map((setting) =>
      setting.id === id ? { ...setting, isActive: isChecked } : setting
    )
  );
};

  return (
    <div className="w-full min-h-screen bg-gray-50 px-5 py-4">
      {/* Header */}
      <div className="sticky z-10 top-0 p-4 flex items-center justify-between bg-white border-b shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Company Settings</h1>
        <div className="max-w-28">
          <Button
            onClick={() => {
              console.log(leadSetting);
            }}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {leadSetting.map((per) => (
            <div
              key={per.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center justify-between"
            >
              <div className="text-gray-800 font-medium text-lg">
                {per.name}
              </div>

              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={per.isActive}
                  id={per.id.toString()}
                  onChange={handleSettingCheckBoxChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-all duration-300"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanySetting;
