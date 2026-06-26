/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import { souceType } from "../../components/views/my-task-management/MyTaskManegement";
import HandleSearchOptionsForTaskProps from "../company-users/HandleSearchOptionsForTask";
import MyAllTaskProps from "../my-task-management/MyAlltaskProps";
import PostDataTypeForTaskType from "../my-task-management/PostDataTypeForTaskType";

type MyTaskManagementListProps = {
  handleSearchOption: HandleSearchOptionsForTaskProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  allTaskData: MyAllTaskProps[];
  handleAddAllTask: () => void;
  paginationData: PaginationDataWithoutCountProps;
  handleRowSelectedForShowAllTask?: (rowData: MyAllTaskProps | any) => void;
  taskStage: PostDataTypeForTaskType[];
  handleSelectedTaskStage: (selectedValue: number | undefined) => void;
  isUsedInAllTasksModule: boolean;
  handleRowSelectedForShowTask?: (rowData: MyAllTaskProps | any) => void;
  handleSelectedSource: (selectedSource: souceType | undefined) => void;
  source: souceType[];
  taskPriority: PostDataTypeForTaskType[];
  handleSelectedPriority: (selectedPriority: number | undefined) => void;
  gridLoading: boolean;
};
export default MyTaskManagementListProps;
