import COLORS from "../../constants/Colors";

function TaskStageChip ({
    stageName,
    stageId
} : {
    stageName : string;
    stageId : number;
}){

 const getPriorityColor = (id : number) => {
  switch (id) {
    case 1:
      return COLORS.CHIP_INACTIVE;
    case 2:
      return COLORS.CHIP_SECONDARY;
    case 3:
      return COLORS.CHIP_ACTIVE;
    default:
      return "bg-white caption-custom border-gray-200";
  }
};
    return (
            <span 
            className={getPriorityColor(stageId)}
           
            >
                          {stageName}
                        </span>
    )
}

export default TaskStageChip;