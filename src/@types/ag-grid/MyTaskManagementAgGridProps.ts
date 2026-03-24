/* eslint-disable @typescript-eslint/no-explicit-any */
import MyAllTaskProps from "../my-task-management/MyAlltaskProps";

type MyTaskManagementAgGridProps = {
  allTaskData?: MyAllTaskProps[];
  onRowSelect: (data: MyAllTaskProps | any) => void;
  handleAllTaskDataFormChange: (data: MyAllTaskProps) => void;
  handleRowClick: (event: any) => void;
  isUsedInAllTasksModule: boolean;
  gridLoading: boolean;
};
export default MyTaskManagementAgGridProps;
