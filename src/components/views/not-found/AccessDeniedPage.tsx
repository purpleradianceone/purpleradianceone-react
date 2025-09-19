import { XCircle, X } from 'lucide-react';
import Button from '../../ui/Button';

interface AccessDeniedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

function AccessDeniedPopup({ 
  isOpen, 
  onClose,
  message = "You don't have permission to access this section."
}: AccessDeniedPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 space-y-5">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 table-header-custom transition-colors"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-red-500">
            <XCircle size={48} />
          </div>
          
          <h2 className="section-header-custom mb-2">
            Access Denied
          </h2>
          
          <p className="table-data-custom">
            {message}
          </p>
          <div className='flex items-center justify-center'>
              <div>
              <Button
            onClick={onClose}>
            Got it
          </Button>
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPopup;