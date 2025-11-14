import { CheckCircle2, XCircle } from "lucide-react";

function StatusIndicator({
  isActive,
  activeLabel = "Active",
  inactiveLabel = "Inactive",

} : {
  isActive : boolean
  activeLabel? : string,
  inactiveLabel? : string 
}){
   return isActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 -mt-0.5 caption-custom-active" />

                  <span className="caption-custom-active">{activeLabel}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 -mt-0.5 caption-custom-inactive" />
                  <span className="caption-custom-inactive">{inactiveLabel}</span>
                </>
              )
}
export default StatusIndicator;