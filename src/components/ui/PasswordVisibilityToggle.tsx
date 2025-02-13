import { Eye, EyeOff } from "lucide-react";
import PasswordVisibilityToggleProps from "../../@types/ui/PasswordVisibilityToggleProps";

function PasswordVisibilityToggle({ showPassword, setShowPassword}: PasswordVisibilityToggleProps){

    return (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-400 hover:text-gray-500"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    );
  };
  
  export default PasswordVisibilityToggle;
  