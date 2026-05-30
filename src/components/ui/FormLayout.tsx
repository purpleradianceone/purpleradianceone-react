import { ReactNode } from "react";
import { createPortal } from "react-dom";

const FormLayout = ({
  children,
  padding = 4,
  width = 7,
  widthPercent,
  maxHeight=90
}
  : {
    children: ReactNode,
    padding?: number,
    width?: number,
    widthPercent?: number,
    maxHeight?:number,
  }) => {
  return createPortal(
    <div className="fixed   inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center  overflow-y-auto">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-${width}xl relative animate-fadeIn p-${padding} min-h-56 max-h-[${maxHeight}vh] overflow-y-auto`}
        style={{
          maxWidth: widthPercent ? `${widthPercent}%` : undefined
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FormLayout;
