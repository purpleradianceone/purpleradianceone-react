/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Settings } from "lucide-react";
import {  STATUS_CODE } from "../../../../constants/AppConstants";
import { createPortal } from "react-dom";
import Lead from "../../../../@types/lead-management/LeadManagementProps";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useEffect, useState } from "react";
import CompanyLeadSettingType from "../../../../@types/settings/CompanyLeadSettings";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";

function LeadSettingForLead({
  isOpen,
  onClose,
  lead,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}) {
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

      await axios
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
    const isChecked = event.target.checked;
    const id = parseInt(event.target.id);

    const updateLeadSettingCompanyPostData = {
      company_id: loginStatus.companyId,
      id: id,
      lead_id: lead.id,
      isactive: isChecked,
      updatedby_id: loginStatus.id,
    };
    await axios
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
  return createPortal(
    <div className="fixed inset-0 z-20 p-4 flex items-center justify-center bg-black bg-opacity-5  animate-fadeIn">
      <div
        className="relative w-full p-4 max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl animate-scaleUp
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {/* <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Settings className="text-blue-600" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-xl font-bold text-gray-800">
              Manage Settings for{" "}
              <span className="text-blue-600">{lead.name}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close settings"
          >
            <X size={SIZE.TWENTY_FOUR} />
          </button>
        </div> */}
        <FormHeader
          icon={Settings}
          onClose={onClose}
          userName={lead.name}
          preText="Manage lead settings - "
          description="Update and manage the settings associated with this lead."
        />

        <div className="p-1">
          <div className="bg-gray-50 rounded-lg p-2 mb-1">
            <div className="flex justify-between items-center mb-4 text-gray-600 font-semibold text-sm border-b pb-2">
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
                  <p className="text-center text-gray-500 py-8">
                    No settings available for this lead.
                  </p>
                ) : (
                  leadSetting.map((per) => (
                    <div
                      key={per.id}
                      className={`
                        relative flex items-center justify-between p-2 rounded-lg border
                        ${
                          per.isActive
                            ? "bg-green-50 border-green-200 shadow-sm"
                            : "bg-red-50 border-red-200 shadow-sm"
                        }
                        hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5
                      `}
                    >
                      <div className="text-gray-800 font-medium text-sm flex items-center gap-2">
                        {per.isActive ? (
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        )}
                        {per.name}
                      </div>

                     
                        {/* toggel button */}
                      <label className="inline-flex items-center cursor-pointer relative self-end">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={per.isActive}
                          id={per.id.toString()}
                          onChange={handleLeadSettingCheckBoxChange}
                        />
                        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />{" "}
                        {/* Adjusted size and colors */}
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />{" "}
                        {/* Adjusted size and position */}
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LeadSettingForLead;
