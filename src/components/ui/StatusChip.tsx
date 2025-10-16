import COLORS from "../../constants/Colors";

function StatusChip ({isActive} : {isActive : boolean}) {
    return(
                    <span
                      className={`${
                        isActive
                          ? COLORS.CHIP_ACTIVE
                          : COLORS.CHIP_INACTIVE
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
    )
}

export default StatusChip;