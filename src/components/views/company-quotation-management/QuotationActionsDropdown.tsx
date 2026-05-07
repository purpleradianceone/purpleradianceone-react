/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, Trash2 } from "lucide-react";
import { JSX_CHILDREN_NAME } from "../../../constants/AppConstants";
import ActionsDropdownButton from "../../ui/ActionsDropdownButton";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";

const QuotationActionsDropdown = ({ data, context }: any) => {
  console.log("QuotationActionDropdown data:");
  console.log(data);
  const [open, setOpen] = useState(false);
  const [isOpenConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const dropdownHeight = 90;
    const spaceBelow = window.innerHeight - rect.bottom;
    const isUpward = spaceBelow < dropdownHeight;

    setPosition({
      top: isUpward
        ? rect.top + window.scrollY - dropdownHeight
        : rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 40,
    });

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const deleteQuotation = () => {
    context.onDelete?.(data);
    setOpen(false);
    // setOpenConfirmationDialog(false);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={handleClick}
      >
        {JSX_CHILDREN_NAME.ACTIONS}
      </button>

      {/* DROPDOWN */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute bg-white border rounded-md shadow-lg w-34 ml-4 z-50"
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <ActionsDropdownButton
              onClick={() => {
                context.handleRowSelect(data);
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Eye size={14} />
                Details
              </div>
            </ActionsDropdownButton>

            {data.quotationStatusId === 2 && (
              <ActionsDropdownButton
                onClick={() => {
                  context.onDownloadQuotation(data);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Download size={14} />
                  Download
                </div>
              </ActionsDropdownButton>
            )}

            {data.quotationStatusId === 1 && (
              <ActionsDropdownButton
                onClick={() => {
                  // context.onDelete?.(data);
                  // setOpen(false);
                  setOpenConfirmationDialog(true);
                }}
              >
                <div className="flex items-center gap-2 text-red-600">
                  <Trash2 size={14} />
                  Delete
                </div>
              </ActionsDropdownButton>
            )}
          </div>,
          document.body,
        )}
      <ConfirmationDialog
        icon={Trash2}

        open={isOpenConfirmationDialog}
        title={`Deleting ${data.quotationNumber}`}
        message={`You are deleting this quotation: ${data.quotationNumber} `}
        description={`All the changes related to quotation will be deleted.`}
        messageDescription=""
        onCancel={() => setOpenConfirmationDialog(false)}
        onConfirm={deleteQuotation}
        // confirmButtonText="Proceed"
      />
    </>
  );
};
export default QuotationActionsDropdown;
