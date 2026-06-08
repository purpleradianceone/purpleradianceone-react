/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertCircle,
  BookCheck,
  CheckCircle2,
  ClipboardList,
  Repeat,
} from "lucide-react";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import MasterTaskManagementProps from "../../@types/List/MasterTaskManagementProps";
import MasterTaskProps from "../../@types/my-task-management/MasterTaskProps";
import MyAllTaskProps from "../../@types/my-task-management/MyAlltaskProps";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";
import MESSAGE from "../../constants/Messages";
import ROUTES_URL from "../../constants/Routes";
import { usePanel } from "../../context/panel/usePanel";
import { useUserPreference } from "../../context/user/UserPreference";
import MasterTaskManagementAgGrid from "../ag-grid/MasterTaskManagementAgGrid";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import CreateGeneralTaskMasterModal from "../modals/general-task-master/CreateGeneralTaskMasterModal";
import CustomDropdown from "../modals/leads/CustomDropdown";
import Button from "../ui/Button";
import CompanyUserSearchFieldInput from "../ui/CompanyUserSearchFieldInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import SummaryCards from "../ui/SummaryCards";
import GeneralTaskMasterSummary from "../../@types/my-task-management/GeneralTaskMasterSummary";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

function MasterTaskManagementList({
  isUsedInAllTasksModule,
  handleRowSelectedForShowAllTask,
  MasterTaskData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  handleAddAllTask,
  taskType,
  handleSelectedTaskType,
  taskPriority,
  handleSelectedPriority,
  taskFrequency,
  handleSelectedFrequency,
  selectedCompanyUser,
  handleSelectedCompanyUser,
  downloadTaskDocument,
  isDataLoading,
  // isActive,
  // setIsActive,
}: MasterTaskManagementProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { position } = usePanel();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const { userPreference } = useUserPreference();
  const { userHasAccessToViewAllTasks, userHasAccessToAddMasterTasks } =
    useUserAccessModules();
  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
  const [isCreateTaskMasterModalOpen, setIsCreateTaskMasterModalOpen] =
    useState<boolean>(searchParams.get("fromDashboard") === "true");
  // const [selectedRowData, setSelectedRowData] = useState<MasterTaskProps>()
   const { loginStatus } = useLoggedInUserContext();

const [summaryData, setSummaryData] =
  useState<GeneralTaskMasterSummary>({
    total_master_task_created: 0,
    total_master_task_high_priority: 0,
    total_master_task_recurring: 0,
    total_master_task_active: 0,
  });

  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  const fetchSummaryGeneralTaskMaster = useCallback(async () => {
  try {
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.SUMMARY_GENERAL_TASK_MASTER,
      postData,
      {
        withCredentials: true,
      }
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
  setSummaryData(response.data[0]);
}
  } catch (error) {
    console.log(error);
  }
}, [loginStatus.companyId, loginStatus.id]);


useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchSummaryGeneralTaskMaster();
  }
}, [fetchSummaryGeneralTaskMaster]);
    

  if (userHasAccessToViewAllTasks) {
    const handleCreateTaskMasterModalClose = () => {
      setIsCreateTaskMasterModalOpen(false);
    };

    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
    const handleRowClicked = (event: any) => {
      if (isUsedInAllTasksModule) {
        const rowData: MasterTaskProps = event.data;
        console.log(rowData);
        navigate(
          ROUTES_URL.MASTER_TASK_DETAILS.replace(
            ":taskId",
            rowData.id.toString(),
          ),
        );
      }
    };

    const handleRowSelected = (rowData: MyAllTaskProps | any) => {
      if (isUsedInAllTasksModule) {
        // const queryParams = qs.stringify({
        //   [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
        // });
        // navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
      } else {
        handleRowSelectedForShowAllTask!(rowData);
        const queryParams = qs.stringify({
          ["task"]: JSON.stringify(rowData),
        });
        navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
      }
    };

    //note : this is new
    const handleAllTaskDataFormChange = (data: MasterTaskProps) => {
      console.log(data);
    };

    return (
      <div
        className={`w-full ${
          position === "left" && isUsedInAllTasksModule ? "" : "pl-1"
        } gap-1 px-2`}
      >
        {/* Master Task Overview Cards */}
        <SummaryCards
          cardCss="bg-white border border-slate-200 rounded-2xl px-5 py-1.5  shadow-sm flex items-center justify-between gap-2 over:shadow-md transition-all  "
          showGraph
          cardGap={40}
          loading={isDataLoading}
          cards={[
            {
              title: "Master Tasks",
              count: summaryData.total_master_task_created,
              subtitle: "Total created tasks",
              icon: ClipboardList,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
              graphColor: "bg-violet-500",
            },

            {
              title: "High Priority",
              
               count: summaryData.total_master_task_high_priority,
              subtitle: "Critical tasks",
              icon: AlertCircle,
              iconBg: "bg-red-100",
              iconColor: "text-red-500",
              graphColor: "bg-red-500",
            },

            {
              title: "Recurring",
              count: summaryData.total_master_task_recurring,
              subtitle: "Repeating schedules",
              icon: Repeat,
              iconBg: "bg-blue-100",
              iconColor: "text-blue-500",
              graphColor: "bg-blue-500",
            },

            {
              title: "Active",
              count: summaryData.total_master_task_active,
              subtitle: "Currently active",
              icon: CheckCircle2,
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-500",
              graphColor: "bg-emerald-500",
            },
          ]}
        />

        {/* sticky */}
        {
          <div
            className={`sticky z-10 top-12 mt-1 px-3 py-1.5 flex flex-wrap items-center justify-between gap-3 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} mb-3 border rounded-lg
                      w-full
                    `}
          >
            {/* LEFT SECTION - Support Label */}
            {isUsedInAllTasksModule && (
              <div className="flex gap-1 items-center w-fit">
                {!isSmallScreen && (
                  <ClipboardList
                    className={`${
                      isCustomDateOptionSelected
                        ? "w-4 h-4 text-blue-600"
                        : COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE
                    } `}
                  />
                )}

                {(isMediumScreen || isLargeScreen) && (
                  <span
                    className={`${
                      isCustomDateOptionSelected
                        ? "text-xs"
                        : "section-header-custom"
                    } mr-4`}
                  >
                    Master Tasks
                  </span>
                )}
                <div className="flex items-start justify-start gap-2">
                  <div
                    className={`relative flex items-start ${
                      isCustomDateOptionSelected ? "w-40" : "w-52"
                    }`}
                  >
                    <SearchInput
                      placeholder="Search by subject or description "
                      value={handleSearchOption.searchParameter}
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value,
                        );
                      }}
                    ></SearchInput>
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <div className="grid grid-cols-1 justify-center gap-1 w-full">
                        {/* Shared width wrapper */}
                        <div className="relative w-fit flex justify-center gap-1">
                          <div className="flex col-span-2  w-fit">
                            <div className="w-40">
                              <DateRangeFilterDropdown
                                dropdownOptions={dateRangeDropdownOptions}
                                handleDateIdChange={handleDateRangeIdChange}
                                selectedOption={selectedDateName}
                              />
                            </div>
                            {isCustomDateOptionSelected && (
                              <div className="mt-1 w-fit">
                                <DateRangePicker
                                  onStartDateChange={onStartDateChange}
                                  onEndDateChange={onEndDateChange}
                                  initialStartDate={
                                    handleSearchOption.startDate
                                  }
                                  initialEndDate={handleSearchOption.endDate}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isUsedInAllTasksModule && (
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {/* priority */}

                        <div className="min-w-[100px]">
                          <CustomDropdown
                            preselectedOption={
                              // savedFilters.selectedtaskType || null
                              handleSearchOption.selectedPriority
                            }
                            labelName="priority"
                            options={taskPriority!}
                            onSelect={handleSelectedPriority}
                          />
                        </div>

                        {/* Type */}

                        <div className="min-w-[120px]">
                          <CustomDropdown
                            preselectedOption={
                              // savedFilters.selectedtaskType || null
                              handleSearchOption.selectedTaskType
                            }
                            labelName="type"
                            options={taskType!}
                            onSelect={handleSelectedTaskType}
                          />
                        </div>
                        {/* Frequency */}

                        <div className="min-w-[100px]">
                          <CustomDropdown
                            preselectedOption={
                              // savedFilters.selectedtaskType || null
                              handleSearchOption.selectedFrequency
                            }
                            labelName="frequency"
                            options={taskFrequency!}
                            onSelect={handleSelectedFrequency}
                          />
                        </div>
                        <div
                          className={`${isCustomDateOptionSelected ? "min-w-[80px]" : "min-w-[100px]"}`}
                        >
                          <CompanyUserSearchFieldInput
                            label=""
                            required={false}
                            placeholder={"Assign To"}
                            defaultValue={
                              selectedCompanyUser.fullname === ""
                                ? ""
                                : selectedCompanyUser.fullname
                            }
                            // logo={User}
                            onUserSelected={(user) => {
                              if (user && user.id !== 0) {
                                handleSelectedCompanyUser(user);
                              }
                              if (user === null || user === undefined) {
                                handleSelectedCompanyUser({
                                  company_id: 0,
                                  id: 0,
                                  fullname: "",
                                  email: "",
                                  mobilenumber: "",
                                  createdby: "",
                                  isactive: false,
                                  requestedby: "",
                                  generate_password: "",
                                });
                              }
                            }}
                            // isDisabled={!userHasAccessToViewUser}
                            disabledMessage={
                              MESSAGE.MODULE_ACCESS.COMPANY_USER
                                .DENIED_VIEW_ACCESS
                            }
                            has={{
                              border: true,
                              penLogo: false,
                              searchLogo: false,
                              xLogo: true,
                            }}
                          />
                        </div>
                        {/* <div className="min-w-[100px]">
                          <BooleanDropdown
                            // labelName="Active"
                            value={isActive}
                            onChange={(val: any) => setIsActive(val)}
                          />
                        </div> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 w-fit">
              {/* Search Box */}

              {/* DATE FILTERS */}
              <div className="flex flex-wrap items-center gap-2 w-fit">
                {/* Master task FILTERS */}

                {/* RIGHT SECTION - Create Button */}
                {isUsedInAllTasksModule && (
                  <div className="flex gap-1 justify-end w-fit">
                    <Button
                      type="submit"
                      disabled={!userHasAccessToAddMasterTasks}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!userHasAccessToAddMasterTasks) {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.MY_TASK.MASTER_TASK
                              .DENIED_ADD_ACCESS,
                          );
                          return;
                        }
                        setIsCreateTaskMasterModalOpen(true);
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {!isSmallScreen && <BookCheck size={SIZE.SIXTEEN} />}
                        {isSmallScreen && <BookCheck size={SIZE.EIGHT} />}
                        {isLargeScreen && JSX_CHILDREN_NAME.ADD_GENERAL_TASK}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        }

        <div className="bg-white  overflow-y-auto ">
          <div
            className={
              userPreference.isLeftMenu
                ? `w-full h-[calc(100vh-314px)]`
                : "w-full h-[calc(100vh-192px)]"
            }
          >
            <MasterTaskManagementAgGrid
              isUsedInAllTasksModule={isUsedInAllTasksModule}
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              handleAllTaskDataFormChange={handleAllTaskDataFormChange}
              MasterTaskData={MasterTaskData}
              downloadTaskDocument={downloadTaskDocument}
              isDataLoading={isDataLoading}
            />
          </div>
          <CreateGeneralTaskMasterModal
            isOpen={isCreateTaskMasterModalOpen}
            handleClose={handleCreateTaskMasterModalClose}
            handleTaskMasterCreate={handleAddAllTask}
            refreshSummary={fetchSummaryGeneralTaskMaster}
          ></CreateGeneralTaskMasterModal>
        </div>

        <div className="flex items-center justify-end col-span-1 ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageSizeChange={paginationData.onPageSizeChange}
            onPageChange={paginationData.onPageChange}
          />
        </div>
      </div>
    );
  }
}

export default MasterTaskManagementList;
