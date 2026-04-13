import React from "react";
import COLORS from "../../../../constants/Colors";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
import TextAreaInput from "../../../ui/TextAreaInput";
import { FileText } from "lucide-react";

function StatusUpdateModal({
  reasonText,
  onReasonChange,
  handleSaveStatusUpdate,
  handleCancel,
  isLeadStatusSaving,
}: {
  reasonText: string;
  onReasonChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSaveStatusUpdate: () => Promise<void>;
  handleCancel: () => void;
  isLeadStatusSaving: boolean;
}) {
  return (
    <div className="  w-full">
      {/* Reason Label */}
      <TextAreaInput
      autoFocus={true}
        cols={2}
        logo={FileText}
        label="Reason (Optional)"
        rows={3}
        name="reason"
        value={reasonText}
        onChange={onReasonChange}
      />
      {/* <label className="input-label-custom">
        Reason (Optional)
        </label> */}
      {isLeadStatusSaving && (
        <LoadingPopUpAnimation show={isLeadStatusSaving} />
      )}

      {/* Reason Text Input */}
      {/* <input
        type="text"
        placeholder="Enter reason for status update"
        className="border rounded px-3 w-72 input-label-custom"
        value={reasonText}
        onChange={onReasonChange}
        /> */}

      <div className="flex justify-end items-center p-1 gap-1">
        <button
          className={`caption-custom white-text h-fit px-2 py-1 rounded-md ${COLORS.BG_GRAY_500_COLOR} ${COLORS.HOVER_BG_GRAY_600_COLOR_HOVER}`}
          onClick={handleCancel}
        >
          <div className="flex gap-0.5 items-center">
            {/* <X className="w-4 h-4 -mt-0.5"/> */}
            <span>Cancel</span>
          </div>
        </button>
        <button
          className={`caption-custom white-text h-fit px-2 py-1 rounded-md ${COLORS.BG_BLUE_600_COLOR}`}
          // className={COLORS.ADD_BUTTON} // Using the provided COLORS constant
          onClick={handleSaveStatusUpdate}
        >
          <div className="flex gap-0.5 items-center">
            {/* <Save className="w-4 h-4 -mt-0.5"/> */}
            <span>Save</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default StatusUpdateModal;
