import COLORS from "../../constants/Colors";

function TaskPriorityChip({ priorityName }: { priorityName: string }) {
  // ⭐ Auto Priority Config
  const getPriorityConfig = (
    name: string,
  ): {
    color: string;
  } => {
    switch (name) {
      // LOW
      case "Low":
        return {
          color: COLORS.CHIP_ACTIVE,
        };

      // MEDIUM
      case "Medium":
        return {
          color: COLORS.CHIP_SECONDARY,
        };

      // HIGH
      case "High":
        return {
          color: COLORS.CHIP_INACTIVE,
        };
      default:
        return {
          color: "bg-white caption-custom border border-gray-200",
        };
    }
  };
  const { color } = getPriorityConfig(priorityName);

  if (!priorityName) {
    return null;
  }

  return (
    <span className={` rounded-full ${color}`}>
      <span>{priorityName}</span>
    </span>
  );
}

export default TaskPriorityChip;
