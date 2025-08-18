
import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
