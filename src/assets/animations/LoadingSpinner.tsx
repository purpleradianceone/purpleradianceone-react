
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  width?: number;
  height?: number;
  colour? : "blue" | "gray" | "red"
}

// Note : Can give custom hieght , width and colour also.
//        as per your chioce and usage.
const LoadingSpinner = ({
  width = 24,
  height = 24,
  colour="blue"
}: LoadingSpinnerProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2
        style={{ width, height }}
        className={`text-${colour}-600 animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
