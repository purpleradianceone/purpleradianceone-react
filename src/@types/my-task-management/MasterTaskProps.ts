type MasterTaskProps = {
  id: number;

  generalTaskTypeId: number;
  generalTaskTypeName: string;

  generalTaskPriorityId: number;
  generalTaskPriorityName: string;

  frequencyId: number;
  frequencyName: string;
  frequencyInterval: number;

  description: string;

  assignedTo: number;
  assignedToName: string;

  startDate: string;
  endDate: string;
  taskTime: string;

  isActive: boolean;

  createdByName: string;
  updatedByName: string;

  createdOn: string;
  updatedOn: string;
};

export default MasterTaskProps;
