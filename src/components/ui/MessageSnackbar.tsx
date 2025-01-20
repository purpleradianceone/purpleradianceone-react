import  { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import MessageSnackbarProps from "../../@types/ui/MessageSnackbarProps";

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
    <div className="fixed  top-6 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg ${
          props.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
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
