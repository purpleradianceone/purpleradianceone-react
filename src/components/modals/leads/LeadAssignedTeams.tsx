/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useEffect, useState } from "react";
import LeadCompanyTeam from "../../../@types/lead-management/LeadCompanyTeam";
import { Plus, X, XIcon } from "lucide-react";
import CompanyTeamsNotAssignedToLead from "./company-team-selection-modal/CompanyTeamsNotAssignedToLead";
import CompanyTeamUsers from "../../../@types/team-management/CompanyTeamUsers";
import ApiError from "../../../@types/error/ApiError";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import MESSAGE from "../../../constants/Messages";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
// import { MODULE_ACCESS_MESSAGE } from "../../../constants/Messages";

type LeadAssignedTeamsProps = {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  function handleXIconClick() {
    setOpenCreateLeadCompanyTeam(false);
  }

  //note : Message Snackbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };
  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
          getLeadAssignedCompanyteam();
        } else {
          setIsActive(prevStatus);
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
      }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <button
              disabled={!userHasAccessToUpdateLead}
              onClick={() => {
                if (userHasAccessToUpdateLead) {
                  setOpenCreateLeadCompanyTeam(true);
                } else {
                  showMessageSnackbar({
                    message:
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message,
                    type: "error",
                  });
                }
              }}
              className="border rounded-md text-white px-1 py-0.5 bg-blue-600 "
            >
              +Add
            </button>
            <span className="text-gray-400">
              Company Team is Not assigned to lead.
            </span>
          </div>
        </div>
      ) : (
        // NOTE : if there are teams assiged already
        <div className="w-full  px-1 mb-1">
          {/* Header */}
          <div className="flex justify-end items-center text-xs gap-x-2 py-1 text-gray-500">
            <span>Add</span>
            <button
              disabled={!userHasAccessToUpdateLead}
              onClick={() => {
                if (!userHasAccessToUpdateLead) {
                  showMessageSnackbar({
                    message:
                      MESSAGE.MODULE_ACCESS.LEAD_MODULE
                        .UPDATE_LEAD_ACCESS_DENIED_message,
                    type: "error",
                  });
                } else {
                  setOpenCreateLeadCompanyTeam(!openCreateLeadCompanyTeam);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
            >
              <Plus size={10} />
            </button>
          </div>
          {/* Company team List */}
          <div className="space-y-2">
            {leadCompanyTeam && leadCompanyTeam.length > 0 ? (
              leadCompanyTeam.map((companyTeam, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-100 px-3 py-2 rounded shadow-sm flex justify-between items-center hover:shadow-md"
                >
                  {/* User Name */}
                  <div>
                    <p
                      onClick={() => {
                        setSelectedCompanyTeamCard(companyTeam);
                        getComapnyTeamUsers(companyTeam);
                        setIsLoadingCompanyTeamCompanyUser(true);
                      }}
                      className="text-xs font-medium text-gray-800 hover:text-blue-500 cursor-pointer"
                    >
                      {companyTeam.teamName}
                    </p>
                  </div>
                  {/* isactive */}
                  <div className="flex text-[10px] font-semibold items-center gap-1">
                    <span
                      className={` px-2 py-1 rounded-full ${
                        companyTeam.isActive
                          ? "bg-green-100 text-green-900 border border-green-400"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {companyTeam.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <div
                      className={`rounded-full h-2.5 w-2.5 ${
                        companyTeam.isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></div>
                    <span className={`text-xs font-medium text-gray-700 `}>
                      {companyTeam.isActive ? "Active" : "Inactive"}
                    </span>
                  </div> */}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No teams are assigned available
              </p>
            )}
          </div>
          {/* view in pop up card  */}
          {selectedCompanyTeamCard && (
            <div
              className={` fixed z-10  inset-0  bg-opacity-0 flex justify-center items-center `}
            >
              <div
                className={` ${
                  isActive ? "bg-green-50" : "bg-red-50"
                }  rounded-xl shadow-2xl w-full max-w-3xl p-7 relative`}
              >
                <button
                  onClick={() => {
                    setSelectedCompanyTeamCard(null);
                    setCompanyTeamCompanyUser([]);
                    setIsLoadingCompanyTeamCompanyUser(false);
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <X size={22} />
                </button>

                {/* Header Section */}
                <div
                  className={`flex items-center justify-between   rounded-md gap-6 mb-6 `}
                >
                  {/* Team Logo */}
                  <div className="flex items-center gap-3">
                    <div
                      className={` ${
                        isActive ? "bg-green-300" : "bg-red-300"
                      } w-20 h-20 rounded-full  flex items-center justify-center text-2xl font-bold text-white bg-gray-300`}
                    >
                      {selectedCompanyTeamCard.teamName.charAt(0).toUpperCase()}
                    </div>
                    {/* Team Name */}
                    <div className="">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        {selectedCompanyTeamCard.teamName}
                      </h2>
                    </div>
                  </div>
                  {/* Team Status */}
                  <div className="flex justify-center items-center gap-4 ">
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={!userHasAccessToUpdateLead}
                        checked={isActive}
                        onChange={() => {
                          if (userHasAccessToUpdateLead) {
                            updateLeadCompanyTeam(selectedCompanyTeamCard);
                          } else {
                            showMessageSnackbar({
                              message:
                                MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                  .UPDATE_LEAD_ACCESS_DENIED_message,
                              type: "error",
                            });
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-green-500
                 after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                 after:bg-white after:border-gray-300 after:border after:rounded-full
                 after:h-5 after:w-5 after:transition-all
                 peer-checked:after:translate-x-full peer-checked:after:border-white"
                      ></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1  md:grid-cols-2 gap-4 overflow-y-auto max-h-64 p-4 bg-white rounded-xl shadow-sm text-sm">
                  <div className="text-lg font-semibold text-gray-800 col-span-2">
                    Team Members
                  </div>
                  {isLoadingCompanyTeamCompanyUser && (
                    <div className="w-full h-full col-span-2   flex justify-center items-center">
                      <LoadingSpinner />
                    </div>
                  )}
                  {isLoadingCompanyTeamCompanyUser === false &&
                    Array.isArray(companyTeamCompanyUsers) &&
                    companyTeamCompanyUsers.map((userData, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                      >
                        <div className="mb-1 sm:mb-0">
                          <span className="text-gray-600 font-medium text-sm">
                            Name:{" "}
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {userData.userName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className={`rounded-full h-2.5 w-2.5 ${
                              userData.isActive ? "bg-green-600" : "bg-red-600"
                            }`}
                          ></div>
                          <span
                            className={`text-xs font-medium text-gray-700 `}
                          >
                            {userData.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
      {/* Add Company Team Form */}
      {openCreateLeadCompanyTeam && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-20 flex justify-center items-center p-2 sm-p-6 ">
          <div className="bg-white mt-14 rounded-lg w-full max-w-6xl max-h-[80vh] overflow-y-auto shadow-2xl sm:px-4 sm:py-4">
            {/* header */}
            <div className="border-b pb-1 mb-4 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800">
                Assign team to lead
              </h2>
              <XIcon
                onClick={() => {
                  handleXIconClick();
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>
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
          </div>
        </div>
      )}
    </>
  );
};

export default LeadAssignedTeams;
