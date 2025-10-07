/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import {
  leadSettingDescriptions,
  STATUS_CODE,
} from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import CompanyLeadSettingType from "../../../../@types/settings/CompanyLeadSettings";
import { useGoogleMeetStatus } from "../../../../config/hooks/useGoogleMeetStatus";
import { useZoomMeetingsStatus } from "../../../../config/hooks/useZoomMeetingsStatus";
import SettingToggleCard from "../../../ui/SettingToggleCard";
import Button from "../../../ui/Button";
import { User2, UserCheck2Icon } from "lucide-react";
import { createPortal } from "react-dom";
import FormHeader from "../../../ui/FormHeader";
import GetCompanyUsersForLead from "../../../modals/leads/company-users-selection-modal/GetCompanyUsersForLead";
import CompanyUser from "../../../../@types/company-users/CompanyUser";

const LeadSetting: React.FC = () => {
  useGoogleMeetStatus();
  useZoomMeetingsStatus();
  const [companyUserModalOpen, setCompanyUserModalOpen] =
    useState<boolean>(false);

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
        const refreshTokenResponse = await RefreshToken({
          callFunction: getLeadSetting,
        });
        if (refreshTokenResponse) {
          getLeadSetting();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeadSetting();
  }, []);

  const handleLeadSettingCheckBoxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            prev.map((setting) =>
              setting.id === id ? { ...setting, isActive: isChecked } : setting
            )
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
    }
  };

  const handleUpdateLeadUser = (data: CompanyUser | null): boolean => {
    if (data === null || data === undefined) {
      console.log("handleUpdateLeadUser false");
      return false;
    }
//////////////////////////////////////
if (
      data.id === null ||
      data.id === undefined ||
      data.all_leads_visible === null ||
      data.all_leads_visible === undefined
    ) {
      console.log("handleUpdate false");
      return false;
    }
    const allLeadsVisibleStatus = !data.all_leads_visible;
    console.log(data.id);
    console.log(data.all_leads_visible);

    const postData = {
      company_id: loginStatus.companyId,
      id: data.id,
      all_leads_visible: allLeadsVisibleStatus,
      updatedby: loginStatus.id,
    };

    let result = false;
    try {

      console.log("previous value: "+ data.all_leads_visible);
       axios
        .post(POST_API.UPDATE_LEAD_COMPANY_USERS, postData, {
          withCredentials: true,
        })
        .then((response) => {
          toast.success(response.data.message);
          result = true;
          console.log("after value: "+ data.all_leads_visible)

        })
        .catch((error) => {
          result = false;
          toast.error(error);
        });
    } catch (e) {
      console.log(e);
    }
    console.log("handleUpdate "+result);

    return result;
  };

  const getDescription = (setting: CompanyLeadSettingType) => {
    if (setting.leadSettingMasterId === 1) {
      return setting.isActive
        ? leadSettingDescriptions.active.leadsAreVisibleToProductUsers
        : leadSettingDescriptions.inactive.leadsAreVisibleToProductUsers;
    } else if (setting.leadSettingMasterId === 2) {
      return setting.isActive
        ? leadSettingDescriptions.active.leadsAreVisibleToProductTeams
        : leadSettingDescriptions.inactive.leadsAreVisibleToProductTeams;
    } else if (setting.leadSettingMasterId === 3) {
      return setting.isActive
        ? leadSettingDescriptions.active.leadsAreVisibleToLeadTeams
        : leadSettingDescriptions.inactive.leadsAreVisibleToLeadTeams;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex justify-between items-center mb-3 w-full">
        <div className="flex-1"></div>

        <div className="flex justify-center items-center flex-1">
          <p className="table-data-custom mt-2 text-center">
            Manage your company's lead-related configurations.
          </p>
        </div>

        <div className="flex-1 flex justify-end min-w-36">
          <div>
            <Button
              onClick={() => {
                setCompanyUserModalOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <UserCheck2Icon />
                MDLM
              </div>
            </Button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {leadSetting.map((per) => (
            <SettingToggleCard
              key={per.id}
              setting={per}
              onToggle={handleLeadSettingCheckBoxChange}
              description={getDescription(per)}
            />
          ))}
        </div>
      )}
      {companyUserModalOpen &&
        createPortal(
          <div className="fixed top-12 inset-0 z-50 bg-black bg-opacity-5 flex items-center justify-center p-4 ">
            <div className="bg-white p-3  rounded-2xl shadow-lg w-full max-w-6xl max-h-[100%] overflow-y-auto relative animate-fadeIn">
              <FormHeader
                preText="Assign new lead owner."
                description="Select and assign a new owner to manage this lead."
                onClose={() => {
                  setCompanyUserModalOpen(false);
                }}
                icon={User2}
              />
              <div className="bg-white z-50 overflow-y-auto rounded-lg shadow-sm p-0">
                <div
                  className="ag-theme-balhal w-full"
                  style={{ height: "460px", width: "100%" }}
                >
                  <GetCompanyUsersForLead
                    handleSelectedCompanyUserChange={() => {
                      setCompanyUserModalOpen(false);
                    }}
                    selectedUserId={null}
                    isUsedForSettings={true}
                    handleUpdateLeadUser={handleUpdateLeadUser}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LeadSetting;
