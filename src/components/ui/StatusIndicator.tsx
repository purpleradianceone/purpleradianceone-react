import { CheckCircle2, XCircle } from "lucide-react";

function StatusIndicator({isActive} : {isActive : boolean}){
   return isActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 -mt-0.5 caption-custom-active" />

                  <span className="caption-custom-active">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 -mt-0.5 caption-custom-inactive" />
                  <span className="caption-custom-inactive">Inactive</span>
                </>
              )
}
export default StatusIndicator;