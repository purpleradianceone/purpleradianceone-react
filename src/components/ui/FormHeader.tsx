import {  LucideIcon, X } from "lucide-react"
import { SIZE } from "../../constants/AppConstants"

const FormHeader =({
    onClose,
    userName ,
    icon : Icon,
    preText,
    postText
}:{
    onClose : ()=>void;
    userName? : string;
    icon: LucideIcon;
    preText?:string,
    postText?: string
})=>{
    return(
         <div className="flex justify-between items-center  mb-3 border-b ">
                <div className="flex gap-2">
                  <Icon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                  <h2 className="table-header-custom">
                    {preText} <span className="table-header-custom">{userName}</span>{postText}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className=" right-4 top-4 input-label-custom"
                >
                  <X size={SIZE.TWENTY} />
                </button>
              </div>
    )
}

export default FormHeader;