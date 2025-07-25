import Button from '../ui/Button';
import { STRING_VALUES } from '../../constants/AppConstants';
import DialogueBoxProps from '../../@types/dialogue/DialogueProps';
import { createPortal } from 'react-dom';



export function DialogueBox({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = STRING_VALUES.CONFIRM,
}: DialogueBoxProps) {
  if (!isOpen) return null;

  return (createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        // onClick={onClose}
      />
      

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button> */}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end gap-3">
          {/* <div className='flex'>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          </div> */}
         

         <div className="flex">
         <Button
            onClick={() => {
              
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
         </div>
          
        </div>
      </div>
    </div>,
    document.body
  ));
}