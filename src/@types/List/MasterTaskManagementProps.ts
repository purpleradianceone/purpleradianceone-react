/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import CompanyUser from "../company-users/CompanyUser";
import HandleSearchOptionsForTaskMasterProps from "../company-users/HandleSearchOptionsForTaskMasterProps";
import MasterTaskProps from "../my-task-management/MasterTaskProps";
import PostDataTypeForTaskFrequency from "../my-task-management/PostDataTypeForTaskFrequency";
import PostDataTypeForTaskPriority from "../my-task-management/PostDataTypeForTaskPriority";
import PostDataTypeForTaskType from "../my-task-management/PostDataTypeForTaskType";

type MasterTaskManagementProps = {
    handleSearchOption: HandleSearchOptionsForTaskMasterProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    MasterTaskData : MasterTaskProps[];
    handleAddAllTask : () => void;
    paginationData: PaginationDataWithoutCountProps;
    handleRowSelectedForShowAllTask? : (rowData: MasterTaskProps | any) => void;
    taskType : PostDataTypeForTaskType[];
    handleSelectedTaskType : (selectedValue: number | undefined ) => void;
    taskFrequency : PostDataTypeForTaskFrequency[];
    handleSelectedFrequency : (selectedFrequency: number | undefined ) => void;
    isUsedInAllTasksModule : boolean,
    handleRowSelectedForShowTask? : (rowData: MasterTaskProps | any) => void;
    taskPriority : PostDataTypeForTaskPriority[];
    handleSelectedPriority : (selectedPriority: number | undefined ) => void;
    selectedCompanyUser  : CompanyUser;
    handleSelectedCompanyUser : (selectedUser: CompanyUser) => void;
   
}
export default MasterTaskManagementProps;