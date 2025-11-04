import { createPortal } from "react-dom";


interface LoadingPopupProps {
  show: boolean;
  text?: string;
}

const LoadingPopUpAnimation : React.FC<LoadingPopupProps> = ({ show, text = "Loading..." }) => {
  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4 animate-fadeIn">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />

        {/* Text */}
        <p className="text-lg font-semibold text-gray-700">{text}</p>
      </div>
    </div>, document.body
  );
};

export default LoadingPopUpAnimation;