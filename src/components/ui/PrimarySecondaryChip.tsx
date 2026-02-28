import COLORS from "../../constants/Colors";

function PrimarySecondaryChip ({isPrimary} : {isPrimary : boolean}) {
    return (
        <span
                  className={`rounded-md ${
                    isPrimary
                      ? COLORS.CHIP_ACTIVE
                      : COLORS.CHIP_SECONDARY
                  }`}
                >
                  {isPrimary ? "Primary" : "Secondary"}
                </span>
    )
}

export default PrimarySecondaryChip;