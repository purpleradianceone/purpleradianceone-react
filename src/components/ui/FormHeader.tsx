import {  LucideIcon, X } from "lucide-react"
import { SIZE } from "../../constants/AppConstants"
import COLORS from "../../constants/Colors";

const FormHeader =({
    onClose,
    userName ,
    icon : Icon,
    preText,
    postText,
    description,
    isModal = true,
}:{
    onClose : ()=>void;
    userName? : string;
    icon: LucideIcon;
    preText?:string,
    postText?: string,
    description? : string,
    isModal? : boolean,
})=>{
    return (
  <div className={`flex ${isModal ? 'justify-between' : 'justify-center'} items-center  border-b pb-1`}>
    {/* Left side */}
    <div className="flex items-center gap-3">
      <Icon className={COLORS.FORM_HEADER_ICONS_COLOR} size={SIZE.TWENTY} />

      <div>
        <h2 className={isModal ? "table-header-custom" : "input-label-custom"}>
          {preText}{' '}
          <span className="table-header-custom ">{userName}</span>
          {postText}
        </h2>
        <p className="caption-custom">
          {description}
        </p>
      </div>
    </div>

    {/* Close button */}
    {isModal && (
      <button
      onClick={onClose}
      className=" right-4 top-4 input-label-custom"
    >
      <X size={SIZE.TWENTY} />
    </button>
    )}
    
  </div>
);


}

export default FormHeader;