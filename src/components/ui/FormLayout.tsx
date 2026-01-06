import { ReactNode } from "react";
import { createPortal } from "react-dom";

const FormLayout = ({
   children,
  padding = 4,
  width = 7,
  widthPercent,
 }
  : { 
    children: ReactNode,
    padding? : number,
    width? : number,
    widthPercent?: number
   }) => {
  return createPortal(
    <div className="fixed inset-0 z-20 bg-black bg-opacity-5 flex items-center justify-center  overflow-y-auto">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-${width}xl relative animate-fadeIn p-${padding} min-h-72 max-h-[90vh] overflow-y-auto`}
      style={{
        maxWidth: widthPercent?`${widthPercent}%`:undefined
      }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FormLayout;
