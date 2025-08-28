import { FileText, X } from "lucide-react";
import LeadImportResponse from "../../../../@types/lead-management/LeadImportResponse";
import { motion } from "framer-motion";
const LeadImportResultPopUp = ({
  data,
  onClose,
}: {
  data: LeadImportResponse;
  onClose: () => void;
}) => {
  if (!data) return null;
 return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      {/* Background fade-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-4 w-96 relative border border-gray-200"
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-blue-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Import Summary
          </h2>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="font-medium text-gray-800">Message: </span>
            <span className="text-gray-600">{data.message}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
  // return (
  //   <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
  //     <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
  //       <button
  //         className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
  //         onClick={onClose}
  //       >
  //         <X size={16}/>
  //       </button>

  //       <h2 className="text-lg font-semibold mb-4">Import Summary</h2>

  //       <div className="text-sm space-y-2">
  //         <div>
  //           <strong>Message:</strong> {data.message}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default LeadImportResultPopUp;
