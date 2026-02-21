export type MyAllTaskProps = {
 id: number;
    source: string;
    sourceId: number;
    taskType: string;
    taskPriority: string;
    taskStage: string;
    description: string;
    remark: string;
    dueDateTime: string | null;
    completedAtDateTime: string | null;
    isActive: boolean;
    
};

export default MyAllTaskProps;