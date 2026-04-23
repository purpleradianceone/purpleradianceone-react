/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, Trash2 } from "lucide-react";
import { JSX_CHILDREN_NAME } from "../../../constants/AppConstants";
import ActionsDropdownButton from "../../ui/ActionsDropdownButton";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";

const InvoiceActionsDropdown = ({ data, context }: any) => {
  console.log(data);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
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

  const handleConfirmDelete = () => {
    if (selectedRow) {
      context.onDelete?.(selectedRow);
    }
    setConfirmOpen(false);
    setSelectedRow(null);
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

    const handleScroll = () => {
      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll, true); // 👈 important

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

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

            {data.statusId === 2 && (
              <ActionsDropdownButton
                onClick={() => {
                  context.onDownloadInvoice(data);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Download size={14} />
                  Download
                </div>
              </ActionsDropdownButton>
            )}

            {!context.userHasAccessToUpdateCompanyInvoiceDraft ||
              (data.statusId === 1 && (
                <ActionsDropdownButton
                  // onClick={() => {
                  //   context.onDelete?.(data);
                  //   setOpen(false);
                  // }}
                  onClick={() => {
                    setSelectedRow(data);
                    setConfirmOpen(true);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 text-red-600">
                    <Trash2 size={14} />
                    Delete
                  </div>
                </ActionsDropdownButton>
              ))}
          </div>,
          document.body,
        )}
      <ConfirmationDialog
        message={`You are about to delete invoice ${
          selectedRow?.invoiceNumber || ""
        } for ${
          selectedRow?.accountName || "this account"
        }. This action cannot be undone. Do you want to continue?`}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRow(null);
        }}
        onConfirm={handleConfirmDelete}
        open={confirmOpen}
        title="Delete Invoice"
      />
    </>
  );
};
export default InvoiceActionsDropdown;
