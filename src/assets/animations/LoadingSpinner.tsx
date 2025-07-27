// import { Loader2 } from "lucide-react";

// function LoadingSpinner(){
//         return (
                
//                 <div className="fixed z-50 w-14 h-6 rounded-lg flex justify-center">
//                   <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//                 </div>
//         );

    
// }

// export default LoadingSpinner;
import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
