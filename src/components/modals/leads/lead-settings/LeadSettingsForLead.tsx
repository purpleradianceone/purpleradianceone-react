/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Settings } from "lucide-react";
import {  STATUS_CODE } from "../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useEffect, useState } from "react";
import CompanyLeadSettingType from "../../../../@types/settings/CompanyLeadSettings";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import ToggleButton from "../../../ui/ToggleButton";
import axiosClient from "../../../../axios-client/AxiosClient";
import LeadDataProps from "../../../../@types/lead-management/LeadProps";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import MESSAGE from "../../../../constants/Messages";

function LeadSettingForLead({
  isOpen,
  onClose,
  lead,
}: {
  isOpen: boolean;
  onClose: () => void;
  // lead : Lead
  lead: LeadDataProps;
}) {

  const {userHasAccessToUpdateLeadSettings} = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadSetting, setLeadSetting] = useState<CompanyLeadSettingType[]>([]);

  const getLeadSetting = async () => {
    setIsLoading(true);
    try {
      setLeadSetting([]);
      const companyLeadSettingPostData = {
        company_id: loginStatus.companyId,
        lead_id: lead.id,
        requestedby_id: loginStatus.id,
      };

      await axiosClient
        .post(POST_API.GET_LEAD_SETTING_LEAD, companyLeadSettingPostData, {
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

  const handleLeadSettingCheckBoxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // NOTE: check if the user hase access to update the lead settings
    if(!userHasAccessToUpdateLeadSettings) {
      toast.error(MESSAGE.MODULE_ACCESS.LEADS_SETTINGS.DENIED_UPDATE_ACCESS);
      return;
    }
    const isChecked = event.target.checked;
    const id = parseInt(event.target.id);

    const updateLeadSettingCompanyPostData = {
      company_id: loginStatus.companyId,
      id: id,
      lead_id: lead.id,
      isactive: isChecked,
      updatedby_id: loginStatus.id,
    };
    await axiosClient
      .post(
        POST_API.UPDATE_LEAD_SETTING_LEAD,
        updateLeadSettingCompanyPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            setLeadSetting((prev) =>
              prev.map((setting) =>
                setting.id === id
                  ? { ...setting, isActive: isChecked }
                  : setting
              )
            );
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleLeadSettingCheckBoxChange,
          });
          if (refreshTokenResponse) {
            handleLeadSettingCheckBoxChange(event);
          }
        }
      });
  };

  useEffect(() => {
    if (isOpen) {
      getLeadSetting();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return(
  <div className="">
        <FormHeader
          icon={Settings}
          onClose={onClose}
          userName={lead.name || lead.email || "unnamed lead"}
          preText="Manage lead settings - "
          description="Update and manage the settings associated with this lead."
        />

        <div className="">
          <div className="bg-gray-0  px-1 pb-1 ">
            <div className="flex justify-between items-center mb-1 py-1 table-header-custom border-b ">
              <span className="ml-2">Setting Name</span>
              <span className="mr-2">Status</span>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner/>
              </div>
            ) : (
              <div className="space-y-2">
                {leadSetting.length === 0 ? (
                  <p className="text-center input-label-custom py-8">
                    No settings available for this lead.
                  </p>
                ) : (
                  leadSetting.map((per) => (
                    <div
                      key={per.id}
                      className="relative flex items-center justify-between p-1 rounded-md border hover:shadow-md hover:bg-gray-50 hover:p-2 transition-all duration-900 transform hover:-translate-y-0.2"
                    >
                      <div className="table-data-custom flex items-center gap-2">
                        {per.name}
                      </div>
                      <ToggleButton
                      checked={per.isActive}
                      name={per.id.toString()}
                      onToggle={handleLeadSettingCheckBoxChange}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        </div>
  )
}

export default LeadSettingForLead;
