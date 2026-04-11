// import { LucideIcon } from "lucide-react";
import { ElementType } from "react";

/**
 * COMPONENT HEADER LOGO AND NAME 
 * 
 * @param logo - give lucide logo
 * @param headerText - give component name
 * 
 * @returns REUSABLE COMPONENT
 */
export const ComponentHeaderAndLogo = ({
  logo: Logo,
  headerText,
}: {
  logo: ElementType;
  headerText: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      <Logo className="text-blue-600 h-5 w-5" />
      <span className="section-header-custom">{headerText}</span>
    </div>
  );
};



