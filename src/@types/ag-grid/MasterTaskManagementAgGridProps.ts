/* eslint-disable @typescript-eslint/no-explicit-any */
import MasterTaskProps from "../my-task-management/MasterTaskProps";

type MasterTaskManagementAgGridProps = {
  MasterTaskData?: MasterTaskProps[];
  onRowSelect: (data: MasterTaskProps | any) => void;
  handleAllTaskDataFormChange: (data: MasterTaskProps) => void;
  handleRowClick: (event: any) => void;
  isUsedInAllTasksModule: boolean;
  downloadTaskDocument: (taskId: number) => void;
};
export default MasterTaskManagementAgGridProps;
