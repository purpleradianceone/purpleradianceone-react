import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetaInfoItemProps {
  icon: LucideIcon;
  label: string;
  value?: string | number | null;
  iconBgClass?: string;
  iconColorClass?: string;
  children?: ReactNode;
  className?: string;
}

function MetaInfoItem({
  icon: Icon,
  label,
  value,
  iconBgClass = "bg-violet-50",
  iconColorClass = "text-violet-600",
  children,
  className = "",
}: MetaInfoItemProps) {
  return (
    <div className={`flex gap-3 items-start ${className}`}>
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center ${iconBgClass}`}
      >
        <Icon size={16} className={iconColorClass} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="caption-custom">{label}</p>

        {children ?? (
          <p className="input-label-custom break-words">
            {value ?? "-"}
          </p>
        )}
      </div>
    </div>
  );
}

export default MetaInfoItem;