import {  LucideIcon, X } from "lucide-react"
import { SIZE } from "../../constants/AppConstants"

const FormHeader =({
    onClose,
    userName ,
    icon : Icon,
    preText,
    postText,
    description
}:{
    onClose : ()=>void;
    userName? : string;
    icon: LucideIcon;
    preText?:string,
    postText?: string,
    description? : string
})=>{
    return (
  <div className="flex justify-between items-center  border-b pb-1">
    {/* Left side */}
    <div className="flex items-center gap-3">
      <Icon className="text-blue-500 mt-1" size={SIZE.TWENTY} />

      <div>
        <h2 className="text-lg font-semibold text-gray-800 flex flex-wrap items-center gap-1">
          {preText}
          <span className="text-blue-700">{userName}</span>
          {postText}
        </h2>
        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>
    </div>

    {/* Close button */}
    <button
      onClick={onClose}
      className=" rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
    >
      <X size={SIZE.TWENTY} />
    </button>
  </div>
);

}

export default FormHeader;