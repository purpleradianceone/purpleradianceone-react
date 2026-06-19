import { ReactNode } from "react";
import COLORS from "../../constants/Colors";

interface AgGridProfileCellProps {
  primaryText?: string;
  secondaryText?: string;
  icon?: ReactNode;
}

function AgGridProfileCell({
  primaryText = "-",
  secondaryText,
  icon,
}: AgGridProfileCellProps) {
  const displayName = primaryText?.trim() || "-";

  const initials =
    displayName !== "-"
      ? displayName
          .split(/\s+/)
          .filter(Boolean)
          .map((word: string, index: number, array: string[]) =>
            index === 0 || index === array.length - 1
              ? word.charAt(0)
              : "",
          )
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "-";

  return (
    <div className="flex items-center gap-3 h-full overflow-hidden">
      <div
        className={`w-8 h-8 rounded-full ${COLORS.LIGHT_PURPLE_BACKGROUND} ${COLORS.PRIMARY_PURPLE} text-xs font-semibold 
        flex items-center justify-center flex-shrink-0`}
      >
        {icon || initials}
      </div>

      <div className="flex flex-col justify-center overflow-hidden">
        <span className="text-sm font-semibold text-gray-800 truncate">
          {displayName}
        </span>

        {secondaryText && (
          <span className="text-xs text-gray-500 truncate">
            {secondaryText}
          </span>
        )}
      </div>
    </div>
  );
}

export default AgGridProfileCell;