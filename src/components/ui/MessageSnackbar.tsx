import  { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import MessageSnackbarProps from "../../@types/ui/MessageSnackbarProps";
import { COLORS } from "../../constants/constant";

function MessageSnackBar(props: MessageSnackbarProps) {
  useEffect(() => {
    if (props.isOpen) {
      const timer = setTimeout(() => {
        props.onClose();
      }, props.duration);

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen, props.duration, props.onClose]);

  if (!props.isOpen) return null;

  return (
    <div className="fixed top-20 right-4 animate-slide-up">
      <div
        className={`flex items-center gap-2 rounded-lg px-2 py-2 shadow-lg ${
          props.type === "success"
            ? `bg-green-100  ${COLORS.PRIMARY_SNACKBAR_TEXT_GREEN_COLOR}`
            :`bg-red-100 ${COLORS.PRIMARY_SNACKBAR_TEXT_RED_COLOR}`
        }`}
      >
        {props.type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        <p className="text-sm font-medium">{props.message}</p>
        <button
          onClick={props.onClose}
          className="ml-4 rounded-full p-1 hover:bg-black/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default MessageSnackBar;
