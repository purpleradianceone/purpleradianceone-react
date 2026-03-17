import { LucideIcon, X } from "lucide-react";
import { SIZE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";
import { IconType } from "react-icons/lib";
import { ReactNode } from "react";

const FormHeader = ({
  onClose,
  userName,
  icon: Icon,
  preText,
  postText,
  description,
  isModal = true,
  wantBorderBottom = true,
  children,
}: {
  onClose?: () => void;
  userName?: string;
  icon: LucideIcon | IconType;
  preText?: string;
  postText?: string;
  description?: string;
  isModal?: boolean;
  wantBorderBottom?: boolean;
  children?: ReactNode;
}) => {
  return (
    // ${isModal ? 'justify-between' : 'justify-start'}
    <div
      className={`flex  items-center justify-between ${wantBorderBottom ? "border-b" : ""}  pb-1`}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Icon className={COLORS.FORM_HEADER_ICONS_COLOR} size={SIZE.TWENTY} />

        <div>
          <h2
            className={isModal ? "table-header-custom" : "input-label-custom"}
          >
            {preText} <span className="table-header-custom ">{userName}</span>
            {postText}
          </h2>
          <p className="caption-custom">{description}</p>
        </div>
      </div>
      <div className="flex gap-3">
        {/* Note : You can give any ReactNode as a children 
            use this children as button eg: (for add button) 
        */}
        {children}

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className=" right-4 top-4 input-label-custom rounded-xl p-0.5 hover:bg-gray-100"
          >
            <X size={SIZE.TWENTY} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FormHeader;
