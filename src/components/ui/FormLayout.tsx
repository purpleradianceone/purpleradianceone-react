import { ReactNode } from "react";
import { createPortal } from "react-dom";

const FormLayout = ({ children }: { children: ReactNode }) => {
  return createPortal(
    <div className="fixed inset-0 z-20 bg-black bg-opacity-5 flex items-center justify-center  overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl relative animate-fadeIn p-2 min-h-72 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FormLayout;
