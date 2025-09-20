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
        <h2 className="table-header-custom">
          {preText}
          <span className="table-header-custom ">{userName}</span>
          {postText}
        </h2>
        <p className="caption-custom">
          {description}
        </p>
      </div>
    </div>

    {/* Close button */}
    <button
      onClick={onClose}
      className=" right-4 top-4 input-label-custom"
    >
      <X size={SIZE.TWENTY} />
    </button>
  </div>
);


}

export default FormHeader;