import React from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import FormHeader from "../ui/FormHeader";
import Button from "../ui/Button";
import { OPACITY, SIZE } from "../../constants/AppConstants";
import { createPortal } from "react-dom";
import LoadingSpinner from "../../assets/animations/LoadingSpinner";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  description?: string;
  showLoadingSpinner?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  description,
  showLoadingSpinner,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center ${OPACITY.POPUP_OPACITY_AND_BACKGROUNG_COLOR} z-50`}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <FormHeader
          icon={AlertTriangle}
          postText={title}
          onClose={onCancel}
          description={
            description
              ? description
              : "Click Confirm to continue or Cancel to stay on this page."
          }
        />
        <p className="caption-custom">
          {
            <div>
              <br />
              {message}
            </div>
          }
          
        </p>
{showLoadingSpinner && (
            <div className="flex h-full w-full bg-transparent opacity-100   justify-center items-center">
              <LoadingSpinner />
            </div>
          )}
        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <div>
            <Button type="button" onClick={onCancel}>
              <div className="flex items-center justify-center gap-0.5">
                <X size={SIZE.SIXTEEN} />
                Cancel
              </div>
            </Button>
          </div>

          <div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
                onCancel();
              }}
              type="submit"
            >
              <div className="flex items-center justify-center gap-0.5">
                <Check size={SIZE.SIXTEEN} />
                {showLoadingSpinner ? "Loading..." : "Comfirm"}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationDialog;
