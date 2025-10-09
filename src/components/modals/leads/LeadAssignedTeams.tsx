/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useEffect, useState } from "react";
import LeadCompanyTeam from "../../../@types/lead-management/LeadCompanyTeam";
import { X } from "lucide-react";
import CompanyTeamsNotAssignedToLead from "./company-team-selection-modal/CompanyTeamsNotAssignedToLead";
import CompanyTeamUsers from "../../../@types/team-management/CompanyTeamUsers";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import toast from "react-hot-toast";
import COLORS from "../../../constants/Colors";
import StatusChip from "../../ui/StatusChip";
import ToggleButton from "../../ui/ToggleButton";
import { createPortal } from "react-dom";
import Button from "../../ui/Button";

type LeadAssignedTeamsProps = {
  isOpen: boolean;
  selectedLeadData: any;
};

const LeadAssignedTeams = ({
  isOpen,
  selectedLeadData,
}: LeadAssignedTeamsProps) => {
  // context
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  //States
  const [leadCompanyTeam, setLeadCompnayTeam] = useState<LeadCompanyTeam[]>([]);
  const [openCreateLeadCompanyTeam, setOpenCreateLeadCompanyTeam] =
    useState<boolean>(false);
  const [selectedCompanyTeamCard, setSelectedCompanyTeamCard] =
    useState<LeadCompanyTeam | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true); // default to active
  const [companyTeamCompanyUsers, setCompanyTeamCompanyUser] = useState<
    CompanyTeamUsers[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingCompanyTeamCompanyUser, setIsLoadingCompanyTeamCompanyUser] =
    useState<boolean>(true);

  //   Note : Get Lead assigned company team
  const getLeadAssignedCompanyteam = async () => {
    const postDataForLeadAssignedCompanyTeam = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      company_team_id: null,
      isactive: null,
      search_company_specific_date_range_id: null,
      search_parameter: null,
      search_parameter_date: null,
      offset: null,
      limit: null,
      requestedby: loginStatus.id,
    };

    await axios
      .post(
        POST_API.GET_LEAD_ASSIGNED_COMPANY_TEAM,
        postDataForLeadAssignedCompanyTeam,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;
          const companyTeam: LeadCompanyTeam[] = responseData.map(
            (item: any) => ({
              count: item.count,
              id: item.id,
              leadId: item.lead_id,
              leadName: item.lead_name,
              isActive: item.isactive,
              companyTeamId: item.company_team_id,
              leadEmail: item.lead_email,
              leadMobileNumber: item.lead_mobilenumber,
              teamName: item.team_name,
              createdBy: item.createdby,
              createdOn: item.createdon,
              teamDescription: item.team_description,
            })
          );
          setLeadCompnayTeam(companyTeam);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getLeadAssignedCompanyteam,
          });
          // need to get suggeastions for here
          if (refreshTokenResponse) {
            getLeadAssignedCompanyteam();
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Note : Get Company team company User
  const getComapnyTeamUsers = async (companyTeam: any) => {
    const postDataToGetCompanyTeamUsers = {
      company_id: loginStatus.companyId,
      company_team_id: companyTeam.companyTeamId,
      company_user_id: null,
      isactive: true,
      search_company_specific_date_range_id: null,
      search_parameter: null,
      search_parameter_date: null,
      offset: null,
      limit: null,
      requestedby: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_COMPANY_TEAM_USERS, postDataToGetCompanyTeamUsers, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setIsLoadingCompanyTeamCompanyUser(false);
          const res = response.data;

          const signleData: CompanyTeamUsers[] = res.map((item: any) => ({
            count: item.count,
            id: item.id,
            companyTeamId: item.company_team_id,
            teamName: item["Team Name"],
            companyUserId: item.company_user_id,
            userName: item["User Name"],
            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
          }));

          setCompanyTeamCompanyUser(signleData);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: getComapnyTeamUsers,
          });
          // need to get suggeastions for here
          if (refreshTokenResponse) {
            getComapnyTeamUsers(companyTeam);
          }
        }
      });
  };

  const updateLeadCompanyTeam = async (selectedTeamCard: LeadCompanyTeam) => {
    const prevStatus = isActive;
    const newStatus = !isActive;

    //we are setting it locally
    setIsActive(newStatus);

    const postDataUpdateLeadCompanyTeam = {
      company_id: loginStatus.companyId,
      id: selectedTeamCard.id,
      isactive: newStatus,
      updatedbyid: loginStatus.id,
    };

    await axios
      .post(POST_API.UPDATE_LEAD_COMPANY_TEAM, postDataUpdateLeadCompanyTeam, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          getLeadAssignedCompanyteam();
        } else {
          setIsActive(prevStatus);
          toast.error(response.data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: updateLeadCompanyTeam,
          });
          if (refreshTokenResponse) {
            updateLeadCompanyTeam(selectedTeamCard);
          }
        }
      });
  };

  // use effects
  useEffect(() => {
    if (selectedCompanyTeamCard?.isActive !== undefined) {
      setIsActive(selectedCompanyTeamCard.isActive);
    }
  }, [selectedCompanyTeamCard]);
  // use effect
  useEffect(() => {
    getLeadAssignedCompanyteam();
  }, []);

  if (!isOpen) return null;

  if (isLoading)
    return (
      <>
        <div className="w-full h-full  flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </>
    );
  return (
    <>
      {/* NOTE : if there is no any team  */}
      {leadCompanyTeam && leadCompanyTeam.length == 0 ? (
        <div className=" w-full h-full bg-slate-0">
          <div className="flex gap-1 w-full text-xs h-full bg-green-0 items-center justify-center">
            <Button
              disabled={!userHasAccessToUpdateLead}
              onClick={() => {
                if (userHasAccessToUpdateLead) {
                  setOpenCreateLeadCompanyTeam(true);
                } else {
                  // showMessageSnackbar({
                  //   message:
                  //     MESSAGE.MODULE_ACCESS.LEAD_MODULE
                  //       .UPDATE_LEAD_ACCESS_DENIED_message,
                  //   type: "error",
                  // });
                  toast.error(
                    MESSAGE.MODULE_ACCESS.LEAD_MODULE
                      .UPDATE_LEAD_ACCESS_DENIED_message
                  );
                }
              }}
              className={COLORS.ADD_BUTTON}
            >
              +Add
            </Button>
            <span className="caption-custom italic">
              Company Team is Not assigned to lead.
            </span>
          </div>
        </div>
      ) : (
        // NOTE : if there are teams assiged already
        <div className="w-full  px-1 mb-1">
          {/* Header */}
          <div className="flex justify-end items-center text-xs gap-x-2 py-1 text-gray-500">
            <Button
              disabled={!userHasAccessToUpdateLead}
              onClick={() => {
                if (!userHasAccessToUpdateLead) {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.LEAD_MODULE
                      .UPDATE_LEAD_ACCESS_DENIED_message
                  );
                } else {
                  setOpenCreateLeadCompanyTeam(!openCreateLeadCompanyTeam);
                }
              }}
              className={COLORS.ADD_BUTTON}
            >
              +Add
            </Button>
          </div>
          {/* Company team List */}
          <div className="space-y-2">
            {leadCompanyTeam && leadCompanyTeam.length > 0 ? (
              leadCompanyTeam.map((companyTeam, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCompanyTeamCard(companyTeam);
                    getComapnyTeamUsers(companyTeam);
                    setIsLoadingCompanyTeamCompanyUser(true);
                  }}
                  className={COLORS.CONTACT_CARD}
                >
                  {/* Left: Avatar + Team Info */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold shadow-sm text-white ${
                        companyTeam.isActive ? "bg-blue-500" : "bg-red-500"
                      }`}
                    >
                      {companyTeam.teamName
                        ? companyTeam.teamName.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    {/* Team Name */}
                    <div>
                      <>
                        <p className="table-data-custom">
                          {companyTeam.teamName || "Unnamed Team"}
                        </p>
                        <p
                          title={
                            companyTeam.teamDescription ??
                            "Team description is not given"
                          }
                          className="caption-custom"
                        >
                          {" "}
                          {companyTeam.teamDescription ? (
                            companyTeam.teamDescription.length <= 70 ? (
                              companyTeam.teamDescription
                            ) : (
                              companyTeam.teamDescription.substring(0, 69) +
                              "..."
                            )
                          ) : (
                            <>
                              <span className="caption-custom italic">
                                team description is not given
                              </span>
                            </>
                          )}
                        </p>
                      </>
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div className="flex items-center">
                  <StatusChip
                  isActive={companyTeam.isActive}
                  />
                  </div>
                </div>
              ))
            ) : (
              <p className="input-label-custom text-center">
                No teams are assigned available
              </p>
            )}
          </div>
        </div>
      )}
      {/* view in pop up card  */}
          {selectedCompanyTeamCard && createPortal(
            <div className="fixed inset-0 bg-opacity-5 bg-black flex justify-center items-center z-20 p-4">
              {/* Overlay */}
              {/* <div
                className="fixed inset-0 bg-black bg-opacity-5 "
                onClick={() => {
                  setSelectedCompanyTeamCard(null);
                  setCompanyTeamCompanyUser([]);
                  setIsLoadingCompanyTeamCompanyUser(false);
                }}
              ></div> */}

              {/* Modal */}
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10 animate-[fadeInScale_0.3s_ease]">
                {/* Close button */}
                <button
                  onClick={() => {
                    setSelectedCompanyTeamCard(null);
                    setCompanyTeamCompanyUser([]);
                    setIsLoadingCompanyTeamCompanyUser(false);
                  }}
                  className="absolute top-1 right-4 p-2 caption-custom hover:text-gray-600 transition-all duration-200 z-20"
                >
                  <X size={20} />
                </button>

                <div className="p-8">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                    {/* Left Section - Team Info */}
                    <div className="flex items-center gap-6 flex-1">
                      {/* Team logo */}
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg
                      ${
                        isActive
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : "bg-gradient-to-br from-red-500 to-red-600"
                      }`}
                      >
                        {selectedCompanyTeamCard.teamName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Team details */}
                      <div className="flex-1 min-w-0">
                        <h2 className="section-header-custom">
                          {selectedCompanyTeamCard.teamName}
                        </h2>
                        <p
                          title={
                            selectedCompanyTeamCard.teamDescription
                              ? "Team Description: " +
                                selectedCompanyTeamCard.teamDescription
                              : "Team description is not given"
                          }
                          className="table-data-custom leading-relaxed"
                        >
                          {selectedCompanyTeamCard.teamDescription ? (
                            selectedCompanyTeamCard.teamDescription.length <=
                            200 ? (
                              selectedCompanyTeamCard.teamDescription
                            ) : (
                              selectedCompanyTeamCard.teamDescription.substring(
                                0,
                                199
                              ) + "..."
                            )
                          ) : (
                            <span className="italic table-data-custom">
                              Team description is not available
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right Section - Status Controls */}
                    <div className="flex flex-col items-end gap-1 lg:min-w-[200px]">
                      {/* Status Badge */}
                      <div className="flex items-center gap-3">
                        {/* <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm
                        ${
                          isActive
                            ? "bg-green-100 input-label-custom-active border border-green-200"
                            : "bg-red-100 input-label-custom-inactive border border-red-200"
                        }`}
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2
                          ${isActive ? "bg-green-600" : "bg-red-600"}`}
                          ></span>
                          {isActive ? "Active" : "Inactive"}
                        </span> */}
                        <StatusChip
                        isActive={isActive}
                        />
                      </div>

                      {/* Toggle Switch */}
                      <div className="flex items-center gap-3">
                        <span className="input-label-custom">Status:</span>
                        {/* <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {
                              if (userHasAccessToUpdateLead) {
                                updateLeadCompanyTeam(selectedCompanyTeamCard);
                              } else {
                                toast.error(
                                  MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                    .UPDATE_LEAD_ACCESS_DENIED_message
                                );
                              }
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-6 shadow-inner"></div>
                        </label> */}
                        <ToggleButton
                        checked={isActive}
                        name="isActive"
                        onToggle={() => {
                              if (userHasAccessToUpdateLead) {
                                updateLeadCompanyTeam(selectedCompanyTeamCard);
                              } else {
                                toast.error(
                                  MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                    .UPDATE_LEAD_ACCESS_DENIED_message
                                );
                              }
                            }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* Team Members Section */}
                  <div>
                    <h3 className="table-header-custom mb-1 flex items-center gap-2">
                      Team Members
                      <span className="bg-gray-100 input-label-custom px-2 py-1 rounded-full">
                        {Array.isArray(companyTeamCompanyUsers)
                          ? companyTeamCompanyUsers.length
                          : 0}
                      </span>
                    </h3>

                    {/* Members Grid */}
                    <div className="bg-gray-50 rounded-xl p-6 max-h-80 overflow-y-auto">
                      {isLoadingCompanyTeamCompanyUser ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : Array.isArray(companyTeamCompanyUsers) &&
                        companyTeamCompanyUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {companyTeamCompanyUsers.map((userData, index) => (
                            <div
                              key={index}
                              className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                                    {userData.userName
                                      ? userData.userName
                                          .charAt(0)
                                          .toUpperCase()
                                      : "?"}
                                  </div>
                                  <div>
                                    <p className="input-label-custom">
                                      {userData.userName || "Unnamed User"}
                                    </p>
                                    <p className="caption-custom">
                                      Team Member
                                    </p>
                                  </div>
                                </div>

                                {/* Status Indicator */}
                                <div
                                  
                                >
                                  <StatusChip 
                                  isActive={userData.isActive}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium">
                            No team members found
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            This team doesn't have any members assigned yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

      {/* Add Company Team Form */}
      {openCreateLeadCompanyTeam && createPortal(
        <div className="fixed inset-0 z-10 bg-black bg-opacity-5 flex justify-center items-center p-2 sm-p-6 ">
          <div className="grid grid-cols-1 sm-grid-cols-2 gap-4 text-sm">
            <div>
              {/* note : need to make changes in the isopen and onclose */}
              <CompanyTeamsNotAssignedToLead
                getLeadAssignedCompanyteam={getLeadAssignedCompanyteam}
                isOpen={openCreateLeadCompanyTeam}
                onClose={() => {
                  setOpenCreateLeadCompanyTeam(false);
                }}
                selectedLeadData={selectedLeadData}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LeadAssignedTeams;
