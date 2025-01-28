import { Loader2 } from "lucide-react";

function LoadingSpinner(){
        return (

                <div className="w-14 h-14 bg-white rounded-lg flex justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
        );

    
}

export default LoadingSpinner;