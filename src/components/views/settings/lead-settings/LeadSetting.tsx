/* eslint-disable react-hooks/exhaustive-deps */
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
// import { useGoogleMeetStatus } from "../../../../config/hooks/useGoogleMeetStatus";
import { useZoomMeetingsStatus } from "../../../../config/hooks/useZoomMeetingsStatus";
import SettingToggleCard from "../../../ui/SettingToggleCard";
import { Handshake, User2 } from "lucide-react";
import FormHeader from "../../../ui/FormHeader";
import GetCompanyUsersForLead from "../../../modals/leads/company-users-selection-modal/GetCompanyUsersForLead";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import axiosClient from "../../../../axios-client/AxiosClient";
import MESSAGE from "../../../../constants/Messages";
import FacebookPageSkeleton from "../social-media-integration/meta-app-facebook/PafeIdListCardPopUp";

const LeadSetting: React.FC = () => {
  // useGoogleMeetStatus();
  useZoomMeetingsStatus();

  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadSetting, setLeadSetting] = useState<CompanyLeadSettingType[]>([]);

  const { userHasAccessToUpdateSettingLead } =
    useUserAccessModules();

  const getLeadSetting = async () => {
    setIsLoading(true);
    try {
      const companyLeadSettingPostData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
      };

      const response = await axiosClient.post(
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
    if (!userHasAccessToUpdateSettingLead) {
      toast.error(MESSAGE.MODULE_ACCESS.LEADS_SETTINGS.DENIED_UPDATE_ACCESS);
      return;
    }
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
    if (!userHasAccessToUpdateSettingLead) {
      toast.error(MESSAGE.MODULE_ACCESS.LEADS_SETTINGS.DENIED_UPDATE_ACCESS);
      return false;
    }
    if (data === null || data === undefined) {
      return false;
    }
    //////////////////////////////////////
    if (
      data.id === null ||
      data.id === undefined ||
      data.all_leads_visible === null ||
      data.all_leads_visible === undefined
    ) {
      return false;
    }
    const allLeadsVisibleStatus = !data.all_leads_visible;

    const postData = {
      company_id: loginStatus.companyId,
      id: data.id,
      all_leads_visible: allLeadsVisibleStatus,
      updatedby: loginStatus.id,
    };

    let result = false;
    try {
      axios
        .post(POST_API.UPDATE_LEAD_COMPANY_USERS, postData, {
          withCredentials: true,
        })
        .then((response) => {
          toast.success(response.data.message);
          result = true;
        })
        .catch((error) => {
          result = false;
          toast.error(error);
        });
    } catch (e) {
      console.log(e);
    }

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
    <div className="w-full h-full   p-2 ">
      <div className="">
        <FormHeader
          preText="Manage your company's lead-related configurations."
          description="Select and assign a user to whom lead will be visible."
          // onClose={() => {
          //   // setCompanyUserModalOpen(false);
          // }}
          icon={Handshake}
          isModal={false}
          wantBorderBottom={false}
        />
        {isLoading ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        <FacebookPageSkeleton />
        <FacebookPageSkeleton />
        <FacebookPageSkeleton />
      </div>
          // <div className="flex justify-center items-center mt-20">
          //   <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
          // </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-1">
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
      </div>

      {/* divider */}
      <div className="border-b  p-1 border-gray-300"></div>

      <div className="  rounded-2xl py-3 w-full   relative animate-fadeIn">
        <FormHeader
          preText="Assign Users to whom all leads should be visible"
          description="Select and assign a user to whom all the lead's will be visible."
          // onClose={() => {
          //   // setCompanyUserModalOpen(false);
          // }}
          icon={User2}
          isModal={false}
          wantBorderBottom={false}
        />
        <div className="bg-white z-50 rounded-lg shadow-sm p-0">
          <div className="ag-theme-balhal w-full">
            <GetCompanyUsersForLead
              handleSelectedCompanyUserChange={() => {
                // setCompanyUserModalOpen(false);
              }}
              selectedUserId={null}
              isUsedForSettings={true}
              handleUpdateLeadUser={handleUpdateLeadUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadSetting;
