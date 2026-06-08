/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import qs from "query-string";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiError from "../../@types/error/ApiError";
import MyTaskManagementListProps from "../../@types/List/MyTaskManagementListProps";
import MyAllTaskProps from "../../@types/my-task-management/MyAlltaskProps";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import useScreenSize from "../../config/hooks/useScreenSize";
import RefreshToken from "../../config/validations/RefreshToken";
import { STATUS_CODE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";
import MESSAGE from "../../constants/Messages";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import { usePanel } from "../../context/panel/usePanel";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useUserPreference } from "../../context/user/UserPreference";
import MyTaskManagementAgGrid from "../ag-grid/MyTaskManagementAgGrid";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import CreateGeneralTaskMasterModal from "../modals/general-task-master/CreateGeneralTaskMasterModal";
import CustomDropdown from "../modals/leads/CustomDropdown";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { supportTicketDataUrlSearchParamKey } from "./SupportTicketManagementList";
import SummaryCards from "../ui/SummaryCards";
import TaskSummary from "../../@types/my-task-management/TaskSummary";

export const MytaskQueryKey = "task";

function MyAllTaskManagementList({
  isUsedInAllTasksModule,
  handleRowSelectedForShowAllTask,
  allTaskData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  handleAddAllTask,
  taskStage,
  handleSelectedTaskStage,
  source,
  handleSelectedSource,
  taskPriority,
  handleSelectedPriority,
  gridLoading,
}: MyTaskManagementListProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { position } = usePanel();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const { userPreference } = useUserPreference();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
  const { userHasAccessToViewAllTasks } = useUserAccessModules();
  const { userHasAccessToViewMasterTasks, userHasAccessToViewSupportTicket } =
    useUserAccessModules();
  const [isCreateTaskMasterModalOpen, setIsCreateTaskMasterModalOpen] =
    useState<boolean>(searchParams.get("fromDashboard") === "true");
  const [isLoadingForNavigate, setIsLoadingForNavigate] =
    useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();
  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
  total_task_assigned: 0,
  total_task_overdue: 0,
  total_task_due_today: 0,
  total_task_completed_this_month: 0,
});

const fetchTaskSummary = async () => {
  try {
    const postData = {
  company_id: loginStatus.companyId,
  requestedby: loginStatus.id,
};

    const response = await axiosClient.post(
      POST_API.SUMMARY_GENERAL_TASK,
      postData,
      {
        withCredentials: true,
      },
    );

    if (response.data?.length > 0) {
       setTaskSummary(response.data[0]);
    }
  } catch (error: any) {
    handleApiError(error);
  }
};



useEffect(() => {
  if (  userHasAccessToViewAllTasks &&
    loginStatus.companyId && loginStatus.id) {
    fetchTaskSummary();
  }
}, [   userHasAccessToViewAllTasks ,loginStatus.companyId, loginStatus.id]);

  if (userHasAccessToViewAllTasks) {
    const getLeadDetails = async (leadId: number) => {
      if (isLoadingForNavigate) return;

      const postDataToGetLead = {
        company_id: loginStatus.companyId,
        id: leadId,
        requestedby: loginStatus.id,
      };
      await axiosClient
        .post(POST_API.GET_LEAD, postDataToGetLead, {
          withCredentials: true,
        })
        .then((response) => {
          const leadData = response.data.map((item: any) => {
            const queryParams = qs.stringify({
              leadData: JSON.stringify({
                id: item.id,
                name: item.name,
                email: item.email,
                mobileNumber: item.mobilenumber,
                companyId: item.company_id,
                companyUserId: item.ownerid,
                count: item.count,
                createdBy: item.createdby,
                createdOn: item.createdon,
                leadOwner: item["Lead Owner"],
                leadSource: item["Lead Source"],
                leadSourceId: item.lead_source_id,
                leadStatus: item["Lead Status"],
                leadStatusId: item.lead_status_id,
                updatedBy: item.updatedby,
                updatedOn: item.updatedon,
              }),
            });
            return queryParams;
          });
          navigate(ROUTES_URL.LEAD_DETAILS + `?${leadData}`);
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunctionWithParamsNotEvent: getLeadDetails,
            });

            // setIsDialogueOpen(!refreshTokenStatus);
            if (refreshTokenStatus) {
              getLeadDetails(leadId);
            }
          }
        })
        .finally(() => {
          setIsLoadingForNavigate(false);
        });
    };
    const getSupportTicketDetails = async (supportTicketId: number) => {
      if (isLoadingForNavigate) return;
      setIsLoadingForNavigate(true);

      if (userHasAccessToViewSupportTicket) {
        const postDataToGetLead = {
          company_id: loginStatus.companyId,
          id: supportTicketId,
          requestedby: loginStatus.id,
        };
        await axiosClient
          .post(POST_API.GET_SUPPORT_TICKET, postDataToGetLead, {
            withCredentials: true,
          })
          .then((response) => {
            const supportTicketData = response.data.map((item: any) => {
              const queryParams = qs.stringify({
                [supportTicketDataUrlSearchParamKey]: JSON.stringify({
                  count: item.count,
                  id: item.id,
                  ticketNumber: item.ticket_number,
                  companyId: item.company_id,
                  accountName: item.account_name,
                  accountEmail: item.account_email,
                  accountMobileNumber: item.account_mobilenumber,
                  companyProductId: item.company_product_id,
                  companyProductName: item.company_product_name,
                  accountCompanyProductId: item.account_company_product_id,
                  supportTicketCategoryId: item.support_ticket_category_id,
                  supportTicketCategoryName: item.support_ticket_category_name,
                  supportTicketEscalationLevelId:
                    item.support_ticket_escalation_level_id,
                  supportTicketEscalationLevelName:
                    item.support_ticket_escalation_level_name,
                  supportTicketLifecycleId: item.support_ticket_lifecycle_id,
                  supportTicketLifecycleName:
                    item.support_ticket_lifecycle_name,
                  companyProductSlaId: item.company_product_sla_id,
                  companyProductSlaName: item.company_product_sla_name,
                  supportTicketSourceId: item.support_ticket_source_id,
                  supportTicketSourceName: item.support_ticket_source_name,
                  queryDescription: item.query_description,
                  publicNotes: item.public_notes,
                  resolutionApplied: item.resolution_applied,
                  assignedTo: item.assignedto,
                  assignedToName: item.assignedto_name,
                  resolvedBy: item.resolvedby,
                  resolvedByName: item.resolvedby_name,
                  dueDateTime: item.due_date_time,
                  completedAtDateTime: item.completed_at_date_time,
                  createdBy: item.createdby,
                  createdOn: item.createdon,
                  updatedBy: item.updatedby,
                  updatedOn: item.updatedon,
                }),
              });
              return queryParams;
            });
            navigate(
              ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${supportTicketData}`,
            );
          })
          .catch(async (error: any) => {
            handleApiError(error);
          })
          .finally(() => {
            setIsLoadingForNavigate(false);
          });
      } else {
        toast.error(MESSAGE.MODULE_ACCESS.SUPPORT_MODULE.DENIED_VIEW_ACCESS);
      }
    };

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
        const rowData: MyAllTaskProps = event.data;
        if (!rowData.isActive) {
          toast.error("This record is inactive and cannot be accessed.");
          return;
        }
        switch (rowData?.source?.split(" ")[0]) {
          case source[0].name: {
            const path = ROUTES_URL.GENERAL_TASK.replace(
              ":taskId",
              String(rowData.id),
            ).replace(":masterId", String(rowData.masterId));

            navigate(path);

            break;
          }
          case source[1].name: {
            getLeadDetails(rowData.sourceId);
            break;
          }
          case source[2].name: {
            getSupportTicketDetails(rowData.sourceId);
            break;
          }
        }
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
      }
    };

    //note : this is new
    const handleAllTaskDataFormChange = (data: MyAllTaskProps) => {
      console.log(data);
    };



  

    return (
      <div
        className={`w-full ${
          position === "left" && isUsedInAllTasksModule ? "" : "pr-1 "
        }  gap-1 ${isLoadingForNavigate ? "cursor-wait" : ""} px-2  `}
      >
        {/* Task Overview Cards */}
        {/* My Task Overview Cards */}
        <SummaryCards
          cardCss="bg-white border border-slate-200 rounded-2xl px-5 py-1.5 shadow-sm flex items-center justify-between gap-2 hover:shadow-md transition-all"
          showGraph
          cardGap={40}
          loading={gridLoading}
          cards={[
            {
              title: "My Tasks",
              count: taskSummary.total_task_assigned,
              subtitle: "Tasks assigned to you",
              icon: ListTodo,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
              graphColor: "bg-violet-500",
            },

            {
              title: "Overdue",
              count: taskSummary.total_task_overdue,
              subtitle: "Tasks need attention",
              icon: AlertCircle,
              iconBg: "bg-red-100",
              iconColor: "text-red-500",
              graphColor: "bg-red-500",
            },

            {
              title: "Due Today",
              count: taskSummary.total_task_due_today,
              subtitle: "Tasks due today",
              icon: CalendarClock,
              iconBg: "bg-orange-100",
              iconColor: "text-orange-500",
              graphColor: "bg-orange-500",
            },

            {
              title: "Completed",
              count: taskSummary.total_task_completed_this_month,
              subtitle: "This month",
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
            className={`sticky z-10 ${userHasAccessToViewMasterTasks ? "top-12" : "top-0"}  px-3 py-2  flex flex-wrap items-center justify-between gap-3 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR}  mb-3 border rounded-lg
                      w-full
                    `}
          >
            {/* LEFT SECTION - all task Label */}
            {isUsedInAllTasksModule && (
              <div className="flex gap-1 items-center w-fit">
                {!isSmallScreen && (
                  <ListTodo
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
                    My Tasks
                  </span>
                )}
                <div className="flex items-start justify-start gap-4">
                  {/* Search Box */}
                  <div
                    className={`relative flex items-start ${
                      isCustomDateOptionSelected ? "w-56 " : "w-56 "
                    }`}
                  >
                    <SearchInput
                      value={handleSearchOption.searchParameter}
                      placeholder="Search by subject, description or remark"
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value,
                        );
                      }}
                    ></SearchInput>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      {dateRangeDropdownOptions ? (
                        <div className="grid grid-cols-1 justify-center gap-4 w-full">
                          {/* Shared width wrapper */}
                          <div className="relative w-fit flex justify-center gap-1">
                            <div className="flex col-span-2 w-fit">
                              <DateRangeFilterDropdown
                                dropdownOptions={dateRangeDropdownOptions}
                                handleDateIdChange={handleDateRangeIdChange}
                                selectedOption={selectedDateName}
                              />
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
                      ) : (
                        <div className="h-4 w-34 bg-gray-200 rounded" />
                      )}
                    </div>

                    {/* All Task FILTERS */}
                    {isUsedInAllTasksModule && (
                      <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        {/* Source */}
                        <div className="min-w-[150px]">
                          <CustomDropdown
                            labelName="source"
                            preselectedOption={
                              handleSearchOption.selectedSource?.id
                            }
                            options={source!}
                            onSelect={(rem) => {
                              handleSelectedSource(
                                source.find((num) => num.id == rem),
                              );
                            }}
                          />
                        </div>
                        {/* priority */}
                        <div className="min-w-[150px]">
                          <CustomDropdown
                            preselectedOption={
                              handleSearchOption.selectedPriority
                            }
                            labelName="priority"
                            options={taskPriority!}
                            onSelect={handleSelectedPriority}
                          />
                        </div>

                        {/* Category */}
                        <div className="min-w-[150px]">
                          <CustomDropdown
                            preselectedOption={
                              handleSearchOption.selectedTaskStage
                            }
                            labelName="stage"
                            options={taskStage!}
                            onSelect={handleSelectedTaskStage}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        }

        <div className="bg-white overflow-y-auto ">
          <div
            className={
              userPreference.isLeftMenu
                ? `w-full ${userHasAccessToViewMasterTasks ? "h-[calc(100vh-317px)]" : "h-[calc(100vh-120px)]"}`
                : `w-full  ${userHasAccessToViewMasterTasks ? "h-[calc(100vh-192px)]" : "h-[calc(100vh-124px)]"}`
            }
          >
            <MyTaskManagementAgGrid
              isUsedInAllTasksModule={isUsedInAllTasksModule}
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              handleAllTaskDataFormChange={handleAllTaskDataFormChange}
              allTaskData={allTaskData}
              gridLoading={gridLoading}
              isDataLoading={gridLoading}
            />
          </div>
          <CreateGeneralTaskMasterModal
            isOpen={isCreateTaskMasterModalOpen}
            handleClose={handleCreateTaskMasterModalClose}
            handleTaskMasterCreate={handleAddAllTask}
            refreshSummary={fetchTaskSummary}
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

export default MyAllTaskManagementList;
