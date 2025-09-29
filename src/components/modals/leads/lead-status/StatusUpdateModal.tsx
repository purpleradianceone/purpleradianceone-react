import React from 'react';
import { Save, X } from 'lucide-react'; 
import COLORS from '../../../../constants/Colors';

function StatusUpdateModal({
  reasonText,
  onReasonChange,
  handleSaveStatusUpdate,
  handleCancel,
} : {
     reasonText : string;
  onReasonChange : (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveStatusUpdate : () => Promise<void>;
  handleCancel : () => void;
}) {
  return (
    <div className="flex m-3 w-full pr-40 gap-1">
      {/* Reason Label */}
      <label className="input-label-custom">
        Reason (Optional)
      </label>
      
      {/* Reason Text Input */}
      <input
        type="text"
        placeholder="Enter reason for status update"
        className="border rounded px-3 w-72 input-label-custom"
        value={reasonText}
        onChange={onReasonChange}
      />
      
      {/* Save Button */}
      <button
        className={COLORS.ADD_BUTTON} // Using the provided COLORS constant
        onClick={handleSaveStatusUpdate}
      >
        <div className="flex gap-0.5 items-center">
          <Save className="w-4 h-4 -mt-0.5"/>
          <span>Save</span>
        </div>
      </button>
      
      {/* Cancel Button */}
      <button
        // Combining all the necessary classes for the cancel button
        className={`px-2 rounded input-label-custom-white ${COLORS.BG_GRAY_500_COLOR} ${COLORS.HOVER_BG_GRAY_600_COLOR_HOVER}`} 
        onClick={handleCancel}
      >
        <div className="flex gap-0.5 items-center">
          <X className="w-4 h-4 -mt-0.5"/>
          <span>Cancel</span>
        </div>
      </button>
    </div>
  );
};

export default StatusUpdateModal;