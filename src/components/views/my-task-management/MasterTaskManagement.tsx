/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInView } from "react-intersection-observer";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { motion } from "framer-motion";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useEffect, useState } from "react";
import useTaskPriority from "../../../config/hooks/useTaskPriority";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import POST_API from "../../../constants/PostApi";
import axiosClient from "../../../axios-client/AxiosClient";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import MasterTaskProps from "../../../@types/my-task-management/MasterTaskProps";
import MasterTaskManagementList from "../../lists/MasterTaskManagementList";
import PostDataToGetMasterTask from "../../../@types/my-task-management/PostDatatoGetMasterTask";
import useTaskType from "../../../config/hooks/useTaskType";
import useTaskFrequency from "../../../config/hooks/useTaskFrequency";
import CompanyUser from "../../../@types/company-users/CompanyUser";

function MasterTaskManagement({
  isUsedInAllTasksModule,
  handleRowSelectedForShowAllTask,
}: {
  isUsedInAllTasksModule: boolean;
  handleRowSelectedForShowAllTask?: (rowData: MasterTaskProps | any) => void;
}) {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userHasAccessToViewMasterTasks } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [MasterTaskData, setMasterTaskData] = useState<MasterTaskProps[]>([]);

  const { loginStatus } = useLoggedInUserContext();
  const { taskPriority } = useTaskPriority();
  const { taskType } = useTaskType();
  const { taskFrequency } = useTaskFrequency();
  const [supportTicketUpdateCount, setSupportTicketUpdateCount] =
    useState<number>(0);

  const [isActive, setIsActive] = useState<boolean>(false);

  // Read filters from LocalStorage (before hook initializes)
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.MASTER_TASK_MANAGEMENT_FILTER) ||
      "{}",
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

  const [selectedTaskType, setselectedTaskType] = useState<number | undefined>(
    savedFilters.selectedTaskType,
  );
  const [selectedPriority, setselectedPriority] = useState<number | undefined>(
    savedFilters.selectedPrioritytype,
  );
  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
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
  const [selectedFrequency, setselectedFrequency] = useState<
    number | undefined
  >(savedFilters.selectedFrequency);

  const handleSelectedTaskType = (selectedTaskType: number | undefined) => {
    setselectedTaskType(selectedTaskType);
  };
  const handleSelectedPriority = (selectedPriority: number | undefined) => {
    setselectedPriority(selectedPriority);
  };

  const handleSelectedFrequency = (selectedFrequency: number | undefined) => {
    setselectedFrequency(selectedFrequency);
  };

  const getMasterTaskData = async (signal: AbortSignal) => {
    if (dateRangeId === 8 && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;
    const effectiveDateRangeId = dateRangeId;
    const PostDataToGetAllTask: PostDataToGetMasterTask = {
      company_id: loginStatus.companyId,
      id: null,
      search_company_specific_date_range_id:
        effectiveDateRangeId === 0 ? null : effectiveDateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() === "" ? null : searchParameter,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
      general_task_priority_id: selectedPriority ?? null,
      general_task_type_id: selectedTaskType ?? null,
      frequency_id: selectedFrequency ?? null,
      assignedto: selectedCompanyUser?.id || null,
    };
    try {
      if (PostDataToGetAllTask.company_id === 0 || pageSize === 10) return;
      const response = await axiosClient.post(
        POST_API.GET_MASTER_TASK,
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
        console.log("My Task Management API Response:", responseData);

        const formattedData: MasterTaskProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            generalTaskTypeName: item.general_task_type_name,
            generalTaskPriorityId: item.general_task_priority_id,
            generalTaskPriorityName: item.general_task_priority_name,
            frequencyName: item.frequency_name,
            frequencyInterval: item.frequency_interval,
            description: item.description,
            assignedToName: item.assignedto_name,
            assignedTo: item.assignedto,
            startDate: item.start_date,
            endDate: item.end_date,
            taskTime: item.task_time,
            isActive: item.isactive,
            createdBy: item.createdby,
            updatedBy: item.updatedby,
            createdOn: item.createdon,
            updatedOn: item.updatedon,
          }),
        );
        setMasterTaskData(formattedData);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getMasterTaskData,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getMasterTaskData(signal);
        }
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getMasterTaskData(signal);

    return () => {
      controller.abort();
    };
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedTaskType,
    selectedPriority,
    selectedFrequency,
    selectedCompanyUser,
    supportTicketUpdateCount,
  ]);

  const handleAddAllTask = () => {
    setSupportTicketUpdateCount(supportTicketUpdateCount + 1);
  };

  useEffect(() => {
    if (!userHasAccessToViewMasterTasks) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewMasterTasks]);

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
      selectedTaskType: selectedTaskType,
      selectedPriority: selectedPriority,
      selectedFrequency: selectedFrequency,
      selectedCompanyUser: selectedCompanyUser,
    };

    localStorage.setItem(
      LocalStorageKeys.MASTER_TASK_MANAGEMENT_FILTER,
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
    taskType,
    selectedTaskType,
    selectedPriority,
    selectedFrequency,
    selectedCompanyUser,
  ]);
  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearSupportTicketFilters);
    function clearSupportTicketFilters() {
      localStorage.removeItem(LocalStorageKeys.MASTER_TASK_MANAGEMENT_FILTER);
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
        {userHasAccessToViewMasterTasks ? (
          <MasterTaskManagementList
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
              selectedTaskType: selectedTaskType,
            }}
            MasterTaskData={MasterTaskData}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize: pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            taskType={taskType!}
            handleSelectedTaskType={handleSelectedTaskType}
            taskPriority={taskPriority!}
            handleSelectedPriority={handleSelectedPriority}
            taskFrequency={taskFrequency!}
            handleSelectedFrequency={handleSelectedFrequency}
            selectedCompanyUser={selectedCompanyUser}
            handleSelectedCompanyUser={setSelectedCompanyUser}
            isActive={isActive}
            setIsActive={setIsActive}
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
export default MasterTaskManagement;
