/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import MyAllTaskProps from "../../../@types/my-task-management/MyAlltaskProps";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MyAllTaskManagementList from "../../lists/MyAllTaskManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {
  customDateRangeId,
  useSearchFilterPaginationDateHandlers,
} from "../../../config/hooks/usePaginationHandler";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import axiosClient from "../../../axios-client/AxiosClient";
import useTaskPriority from "../../../config/hooks/useTaskPriority";
import useTaskStage from "../../../config/hooks/useTaskStage";
import PostDataToGetAllTask from "../../../@types/my-task-management/PostDataToGetAllTask";
import { handleApiError } from "../../../config/error/handleApiError";

export type souceType = { id: number; name: string; isactive: boolean };

function MyTaskManagement({
  isUsedInAllTasksModule,
  handleRowSelectedForShowAllTask,
}: {
  isUsedInAllTasksModule: boolean;
  handleRowSelectedForShowAllTask?: (rowData: MyAllTaskProps | any) => void;
}) {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userHasAccessToViewAllTasks } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [allTaskData, setAllTaskData] = useState<MyAllTaskProps[]>([]);
  const [gridLoading, setGridLoading] = useState(true);
  const { taskStage } = useTaskStage();
  const { taskPriority } = useTaskPriority();

  const { loginStatus } = useLoggedInUserContext();

  const [supportTicketUpdateCount, setSupportTicketUpdateCount] =
    useState<number>(0);

  // Read filters from LocalStorage (before hook initializes)
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.MY_TASK_MANAGEMENT_FILTERS) || "{}",
  );

  const {
    currentPage,
    currentPageData,
    pageSize,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    searchParameter,
    handleDatePageIdChange,
    handleEndDateChange,
    setCurrentPageData,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const [selectedTaskStage, setselectedTaskStage] = useState<
    number | undefined
  >(savedFilters.selectedTaskStage);
  const [selectedPriority, setselectedPriority] = useState<number | undefined>(
    savedFilters.selectedPriority,
  );
  const source: souceType[] = [
    // { id: 1, name: "all", isactive: true },
    { id: 1, name: "General", isactive: true },
    { id: 2, name: "Lead", isactive: true },
    { id: 3, name: "Support", isactive: true },
  ];

  const [selectedSource, setselectedSource] = useState<souceType | undefined>(
    savedFilters.selectedSource,
  );

  const handleSelectedTaskStage = (selectedTaskStage: number | undefined) => {
    setselectedTaskStage(selectedTaskStage);
  };
  const handleSelectedPriority = (selectedPriority: number | undefined) => {
    setselectedPriority(selectedPriority);
  };

  const getAllTaskData = async (signal: AbortSignal) => {
    setGridLoading(true);
    setAllTaskData([]);
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") {
      setGridLoading(false);
      return;
    }
    const offset = (currentPage - 1) * pageSize;
    const effectiveDateRangeId = dateRangeId;
    const PostDataToGetAllTask: PostDataToGetAllTask = {
      company_id: loginStatus.companyId,
      id: null,
      search_company_specific_date_range_id:
        effectiveDateRangeId === 0 ? null : effectiveDateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() === "" ? null : searchParameter,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
      task_priority_id: selectedPriority ?? null,
      task_stage_id: selectedTaskStage ?? null,
      source: selectedSource?.name.toLocaleLowerCase() ?? "all",
    };
    try {
      if (PostDataToGetAllTask.company_id === 0 || pageSize === 10) {
        setGridLoading(false);
        return;
      }
      const response = await axiosClient.post(
        POST_API.GET_ALL_MY_TASK,
        PostDataToGetAllTask,
        {
          signal,
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        setCurrentPageData({
          currentPage: currentPage,
          pageDataLength: response.data.length,
        });
        // console.log("My Task Management API Response:", responseData);

        const formattedData: MyAllTaskProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            source: item.source,
            subject: item.subject,
            sourceId: item.source_id,
            masterId: item.master_id,
            taskType: item.task_type,
            taskPriority: item.task_priority,
            taskStage: item.task_stage,
            taskStageId: item.task_stage_id,
            description: item.description,
            remark: item.remark, // or result_or_remark if you changed alias
            dueDateTime: item.due_date_time,
            completedAtDateTime: item.completed_at_date_time,
            isActive: item.isactive,
            createdBy: item.createdby,
          }),
        );
        setAllTaskData(formattedData);
        setGridLoading(false);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      handleApiError(error);
    }
  };
  console.log(allTaskData);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getAllTaskData(signal);

    return () => {
      controller.abort();
    };
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    taskStage,
    selectedTaskStage,
    selectedSource,
    selectedPriority,
    supportTicketUpdateCount,
  ]);

  const handleAddAllTask = () => {
    setSupportTicketUpdateCount(supportTicketUpdateCount + 1);
  };

  useEffect(() => {
    if (!userHasAccessToViewAllTasks) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewAllTasks]);

  // Save all filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
      selectedTaskStage: selectedTaskStage,
      selectedSource: selectedSource,
      selectedPriority: selectedPriority,
    };

    localStorage.setItem(
      LocalStorageKeys.MY_TASK_MANAGEMENT_FILTERS,
      JSON.stringify(filters),
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    taskStage,
    selectedTaskStage,
    selectedSource,
    selectedPriority,
  ]);
  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearSupportTicketFilters);
    function clearSupportTicketFilters() {
      localStorage.removeItem(LocalStorageKeys.MY_TASK_MANAGEMENT_FILTERS);
    }
    return () =>
      window.removeEventListener("beforeunload", clearSupportTicketFilters);
  }, []);

  return (
    <div className="w-full ">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {userHasAccessToViewAllTasks ? (
          <MyAllTaskManagementList
            isUsedInAllTasksModule={isUsedInAllTasksModule}
            handleRowSelectedForShowAllTask={handleRowSelectedForShowAllTask}
            handleAddAllTask={handleAddAllTask}
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
              selectedTaskStage: selectedTaskStage,
              selectedSource: selectedSource,
              selectedPriority: selectedPriority,
            }}
            allTaskData={allTaskData}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize: pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            taskStage={taskStage!}
            handleSelectedTaskStage={handleSelectedTaskStage}
            source={source}
            taskPriority={taskPriority!}
            handleSelectedSource={setselectedSource}
            handleSelectedPriority={handleSelectedPriority}
            gridLoading={gridLoading}
          />
        ) : (
          <div className="flex-none mx-96 mt-14">
            <AccessDeniedPopup
              isOpen={accessDeniedPopUpOpen}
              onClose={() => {
                setAccessDeniedPopUpOpen(false);
                window.history.back();
              }}
            />
          </div>
        )}
      </motion.section>
    </div>
  );
}
export default MyTaskManagement;
