import React from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import FormHeader from "../ui/FormHeader";
import Button from "../ui/Button";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  description,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-1000">
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

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <div>
            <Button onClick={onCancel}>
              <div className="flex items-center justify-center gap-0.5">
                <X size={16} />
                Cancel
              </div>
            </Button>
          </div>

          <div>
            <Button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
            >
              <div className="flex items-center justify-center gap-0.5">
                <Check size={16} />
                Confirm
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
