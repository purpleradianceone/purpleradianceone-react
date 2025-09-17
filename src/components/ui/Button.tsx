import ButtonProps from "../../@types/ui/ButtonProps";
import { CheckCircle2, Loader2 } from "lucide-react";
import COLORS from "../../constants/Colors";
import useScreenSize from "../../config/hooks/useScreenSize";

/**
 *
 * @param prop which is a type for type checking which is imported from ../types/ButtonProp
 * @returns the button component which has given css below in the component
 * if you want to change the button style ,make the changes here.
 */
function Button(prop: ButtonProps) {
  const { isSmallScreen } = useScreenSize();

  // Define consistent padding classes based on the original enabled button's smaller size
  const paddingClasses = isSmallScreen ? "py-1.5 px-2.5" : "py-1.5 px-3"; // Using the original smaller values

  if (prop.disabled) {
    return (
      <button
        title={prop.title}
        type={prop.type}
        onClick={prop.onClick}
        className={
          prop.className
            ? "cursor-not-allowed opacity-50 " + prop.className
            : (prop.children == "Reset Password" ? "mt-6 " : "") +
              `w-full flex justify-center ${paddingClasses} opacity-50 border border-transparent rounded-md shadow-sm action-btn-custom disabled-btn ${COLORS.BG_BLUE_600_COLOR} ${COLORS.HOVER_BG_BLUE_700_COLOR_HOVER} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`
        }
      >
        {prop.children}
      </button>
    );
  } else {
    return (
      <button
        title={prop.title}
        type={prop.type}
        onClick={prop.onClick}
        className={
          prop.className
            ? prop.className
            : (prop.children == "Reset Password" ? "mt-6 " : "") +
              `w-full flex justify-center ${paddingClasses} border border-transparent rounded-md shadow-sm action-btn-custom ${COLORS.BG_BLUE_600_COLOR} ${COLORS.HOVER_BG_BLUE_700_COLOR_HOVER} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`
        }
      >
        {prop.spinner ? (
          prop.spinner.status === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>{prop.spinner.message}</span>
            </>
          ) : prop.spinner.status === "success" ? (
            <>
              <CheckCircle2 size={20} />
              <span>{prop.spinner.message}</span>
            </>
          ) : (
            prop.children
          )
        ) : (
          prop.children
        )}
      </button>
    );
  }
}
export default Button;