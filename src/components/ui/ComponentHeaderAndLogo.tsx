// import { LucideIcon } from "lucide-react";
import { ElementType } from "react";
// import COLORS from "../../constants/Colors";

/**
 * COMPONENT HEADER LOGO AND NAME 
 * 
 * @param logo - give lucide logo
 * @param headerText - give component name
 * 
 * @returns REUSABLE COMPONENT
 */
export const ComponentHeaderAndLogo = ({
  // logo: Logo,
  headerText,
}: {
  logo: ElementType;
  headerText: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* <Logo className={`${COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE}`}  /> */}
      <span className="section-header-custom pl-2">{headerText}</span>
    </div>
  );
};



