import React from "react";
import { AlertTriangle, Check, LucideIcon, X } from "lucide-react";
import { GAP, OPACITY, PADDING, SIZE } from "../../../../constants/AppConstants";
import FormHeader from "../../../ui/FormHeader";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import Button from "../../../ui/Button";


interface ConfirmationDialogProps {
  open: boolean;
  icon?: LucideIcon;
  title: string;
  description?: string;
  message: string;
  messageDescription?: string;
  showLoadingSpinner?: boolean;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirm: ()=> Promise<void>;
  onCancel: () => void;
}

const LeadUpdateConfirmationDialogue: React.FC<ConfirmationDialogProps> = ({
  open,
  icon = AlertTriangle,
  title,
  description,
  message,
  messageDescription,
  showLoadingSpinner,
  showCancelButton = true,
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
  onConfirm,
  onCancel,
}) => {

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
   await onConfirm()
  }
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${OPACITY.POPUP_OPACITY_AND_BACKGROUNG_COLOR} z-50`}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md ${PADDING.CONFIRMATION_DIALOG_PADDING} relative`}
      >
        <form onSubmit={handleSubmit}>
        
        <FormHeader
          icon={icon}
          postText={title}
          onClose={onCancel}
          description={
            description
              ? description
              : "Click Confirm to continue or Cancel to stay on this page."
          }
        />
        {showLoadingSpinner && (
          <div className="flex h-full w-full bg-transparent opacity-100 mt-4 justify-center items-center">
            <LoadingSpinner />
          </div>
        )}
        <p className="caption-custom">
          {
            <div className="flex-col col-span-1 gap-3 mt-2">
              <div className="caption-custom-black">{message}</div>
              <div>{messageDescription}</div>
            </div>
          }
        </p>

        {/* Footer Buttons */}
        <div
          className={`mt-6 flex justify-end ${GAP.POPUP_GAP_BETWEEN_BUTTONS}`}
        >
          {showCancelButton && (
            <div>
              <Button type="button" onClick={onCancel}>
                <div className="flex items-center justify-center gap-0.5">
                  <X size={SIZE.SIXTEEN} />
                  {cancelButtonText}
                </div>
              </Button>
            </div>
          )}
          <div>
            <Button
            autoFocus={true}
              type="submit"
            >
              <div className="flex items-center justify-center gap-0.5">
                <Check size={SIZE.SIXTEEN} />
                {showLoadingSpinner ? "Loading..." : confirmButtonText}
              </div>
            </Button>
          </div>
        </div>
         </form>
      </div>
    </div>
  );
};

export default LeadUpdateConfirmationDialogue;
