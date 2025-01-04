import { Eye, EyeOff } from "lucide-react";
import FormInput from "../ui/FormInput";
import { useState } from "react";
import Button from "../ui/Button";

function CreatePasswordForm () {

 /**
   * State to store boolean values for password visibility
   **/
  const [showPassword, setShowPassword] = useState(false);



    return (
        <>
        <form className="space-y-5">
            <div className=" relative">
            <FormInput
            label="New Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your new password"
            rightElement={
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
            }
          />
          </div>

          <div className=" relative">
            <FormInput
            label="Confirm new Password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your new password"
            rightElement={
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
            }
          />
          </div>
          <Button type="submit" >Create Password</Button>
            
            </form>
        </>
    );
}

export default CreatePasswordForm;