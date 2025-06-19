/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

import POST_API from "../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import ApiError from "../../../../@types/error/ApiError";
import { NUMBER_VALUES, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import CompanyLeadSettingType from "../../../../@types/settings/CompanyLeadSettings";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../../@types/ui/MessageSnackbarProps";

function LeadSetting() {

  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadSetting, setLeadSetting] = useState<CompanyLeadSettingType[]>([]);


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

  

  const handleLeadSettingCheckBoxChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const isChecked = event.target.checked;
  const id = parseInt(event.target.id);

  const updateLeadSettingCompanyPostData = {
    company_id: loginStatus.companyId,
    id: id,
    isactive: isChecked,
    updatedby_id: loginStatus.id,

  };
    await axios.post(
      POST_API.UPDATE_LEAD_SETTING_COMPANY,
      updateLeadSettingCompanyPostData,
      {
        withCredentials: true,
      }
    ).then((response) => {
        if(response.status === STATUS_CODE.OK){
          if (response.data.status) {
      setLeadSetting((prev) =>
    prev.map((setting) =>
      setting.id === id ? { ...setting, isActive: isChecked } : setting
    )
  );
        showMessageSnackbar({message : response.data.message,type:"success"})
    }
    else{
        showMessageSnackbar({message : response.data.message,type:"error"})

    }
        }
    }).catch(async(error : ApiError | any) => {
      if(error.status === STATUS_CODE.UNATHORISED){
        const refreshTokenResponse = await RefreshToken({callFunctionWithEvent : handleLeadSettingCheckBoxChange})
        if(refreshTokenResponse){
          handleLeadSettingCheckBoxChange(event);
        }
      }
    } )

    
  

  
};

  return (
    <div className="w-full h-fit bg-gray-50 px-2 py-2">
  {isLoading ? (
    <div className="flex justify-center items-center mt-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
    </div>
  ) : (
    <>
      <div className="flex justify-between mb-2 text-gray-700 font-semibold text-xs"> {/* Reduced font size to 'xs' */}
        <span className="ml-3">Setting</span>
        <span>Status</span> {/* Changed "status" to "Status" for better capitalization */}
      </div>
      <div className="space-y-1"> {/* Reduced vertical space between items */}
        {leadSetting.map((per) => (
          <div
            key={per.id}
            className={
              per.isActive
                ? "bg-green-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" // Reduced padding and rounded corners
                : "bg-red-100 rounded-lg shadow-sm  hover:shadow-md transition-all duration-200 p-2 flex items-center justify-between" // Reduced padding and rounded corners
            }
          >
            <div className="text-gray-800 font-medium text-xs"> {/* Set name font size to 'xs' */}
              {per.name}
            </div>

            <label className="inline-flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={per.isActive}
                id={per.id.toString()}
                onChange={handleLeadSettingCheckBoxChange}
              />
              {/* Smaller toggle switch */}
              <div className="w-6 h-3 bg-gray-400 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div> {/* Reduced width, height, and ring size */}
              <div className="absolute ml-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transform peer-checked:translate-x-3 transition-all duration-300"></div> {/* Reduced width, height, and translate-x */}
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
</div>
  );
}

export default LeadSetting;
