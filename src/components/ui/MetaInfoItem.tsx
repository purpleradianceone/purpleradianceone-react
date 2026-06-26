import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import COLORS from "../../constants/Colors";

interface MetaInfoItemProps {
  icon: LucideIcon;
  label: string;
  value?: ReactNode;
  action?: ReactNode;
  className?: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

function MetaInfoItem({
  icon: Icon,
  label,
  value,
  action,
  className = "",
  iconBgClass = COLORS.LIGHT_PURPLE_BACKGROUND,
  iconColorClass = COLORS.PRIMARY_PURPLE,
}: MetaInfoItemProps) {
  return (
    <div className={`flex gap-3 items-start ${className}`}>
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center ${iconBgClass}`}
      >
        <Icon size={16} className={iconColorClass} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="caption-custom">{label}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="truncate input-label-custom ">
            {value ?? (
              <span className="italic text-gray-400">
                Not provided
              </span>
            )}
          </div>

          {action}
        </div>
      </div>
    </div>
  );
}

export default MetaInfoItem;