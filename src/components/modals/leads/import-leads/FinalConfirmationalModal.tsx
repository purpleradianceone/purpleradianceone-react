import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";

type FinalConfirmationModalProps = {
  isOpen: boolean;
  message: string;
  onSave: () => void;
  onCancel: () => void;
  importTag: string;
  showLoadingSpinner: boolean;
};

const FinalConfirmationModal: React.FC<FinalConfirmationModalProps> = ({
  isOpen,
  message,
  onSave,
  onCancel,
  importTag,
  showLoadingSpinner,
}) => {
  // alert(showLoadingSpinner)
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          >
            <motion.div
              className="bg-white rounded-2xl p-3 shadow-2xl w-full max-w-md mx-4 text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b">
                Final Confirmation!
              </h2>
              <div className="flex items-center justify-center">
                <span className="font-medium text-sm text-gray-900">
                  Import Tag:
                </span>
                <p className="text-sm text-black font-medium px-1">
                  {importTag}
                </p>
              </div>
              {showLoadingSpinner && (
                <div className="flex h-full w-full bg-transparent opacity-100   justify-center items-center">
                  {/* <LoadingSpinner /> */}
                  <LoadingPopUpAnimation
                    show={showLoadingSpinner}
                  />
                </div>
              )}
              <p className="text-sm text-black mb-6 px-1">
                <b className="text-black">Note :</b> {message}
              </p>

              <div className="flex justify-evenly gap-4">
                <button
                  onClick={onCancel}
                  className="px-5 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={showLoadingSpinner}
                  className="px-5 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                 {showLoadingSpinner ? 'Loading...' : 'Comfirm & Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FinalConfirmationModal;
