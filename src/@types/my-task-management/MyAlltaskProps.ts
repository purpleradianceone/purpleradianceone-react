export type MyAllTaskProps = {
 id: number;
    source: string;
    sourceId: number;
    taskType: string;
    taskPriority: string;
    taskStage: string;
    taskStageId: number;
    description: string;
    remark: string;
    dueDateTime: string | null;
    completedAtDateTime: string | null;
    isActive: boolean;
    createdby?: number;
    
};

export default MyAllTaskProps;