/**
 * @import AuthLayoutProps imported type object for props validation from from src/@types/AuthLayoutProps
 * @import "../../../assets/styles/AuthLayout.css" importing styles from the AuthLayout.css file
 */
import { useState, useEffect } from "react"; // Import useEffect
import AuthLayoutProps from "../../../@types/auth/views/AuthLayoutProps";
import "../../../assets/styles/AuthLayout.css";
import AuthSideSvg from "../../../assets/svg/AuthSideSvg";
import useScreenSize from "../../../config/hooks/useScreenSize";
import { IMAGE_SOURCE } from "../../../constants/ImageSource";

/**
 *
 * @param props props of AuthLayout Component
 * {
 * children: React.ReactNode, // children of AuthLayout Component i.e SignUpForm or SignInForm
 * title: string, // title of AuthLayout Component
 * subtitle: string, // subtitle of AuthLayout Component
 * }
 * @returns Layout/Veiw for SignUpForm and signInForm components
 */
function AuthLayout(props: AuthLayoutProps) {
  // State to control the gradient flow direction ('b' for bottom, 't' for top)
  const [gradientFlow, setGradientFlow] = useState<"b" | "t">("b");

  // useEffect hook to manage the setInterval lifecycle
  useEffect(() => {
    // Set up an interval to toggle the gradientFlow state every 5 seconds
    const intervalId = setInterval(() => {
      console.log("changing color"); // For debugging purposes
      setGradientFlow((prevFlow) => (prevFlow === "b" ? "t" : "b"));
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup function: This runs when the component unmounts or before the effect re-runs
    // It clears the interval to prevent memory leaks and unwanted behavior.
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  const { isLargeScreen } = useScreenSize();

  // Determine the background position based on the current gradientFlow state.
  // When gradientFlow is 'b', the gradient starts from the top-left corner (0% 0%).
  // When gradientFlow is 't', the gradient moves to the bottom-right corner (100% 100%)
  // to create the illusion of flowing across the diagonal.
  const backgroundPosition = gradientFlow === "b" ? "0% 0%" : "100% 100%";

  return (
    <div
      className={
        isLargeScreen
          ? "fixed bg-gray-100 flex flex-col justify-center"
          : "fixed bg-gray-100 flex flex-col justify-center min-w-full"
      }
    >
      {/* Left side code - This is where the gradient background is applied */}
      <div
        className={
          isLargeScreen ? "h-screen grid lg:grid-cols-3" : "h-screen grid grid-cols-1"
        }
      >
        {isLargeScreen && (
          <div
            // Apply Tailwind classes for layout and transition properties
            className={`py-6 px-16 flex-col justify-between hidden lg:flex col-span-1 h-screen sticky top-0
                        transition-all duration-[5000ms] ease-in-out`} // Transition all properties over 5 seconds with ease-in-out timing
            style={{
              // Define the linear gradient using hex codes for a skyblue glossy effect
              // This gradient uses varying shades of skyblue and a touch of white for the glossy highlight.
              // Direction is 'to bottom right' for a diagonal flow.
              backgroundImage: `linear-gradient(to bottom right, #153F6B, #2A5A8A, #4F7EA8, #7AA6C7, #FFFFFF, #7AA6C7, #4F7EA8, #2A5A8A, #153F6B)`,
              // Make the background gradient larger diagonally to allow for full corner-to-corner movement
              backgroundSize: "200% 200%", // Increased size to ensure diagonal coverage
              // Dynamically set backgroundPosition to create the smooth diagonal flow effect
              backgroundPosition: backgroundPosition,
            }}
          >
            <div className="logo flex justify-center">
              <img src={IMAGE_SOURCE.PR_LOGO} alt="" className="w-72 h-72" />
            </div>
            <div className="flex justify-center">
              <AuthSideSvg></AuthSideSvg>
            </div>
            <div>
              <div className="mb-6 flex items-center gap-4">
                <span className="avatar avatar-circle avatar-md"></span>
              </div>
            </div>
          </div>
        )}

        {/* Right side code */}
        <div className={isLargeScreen ? "lg:col-span-2 overflow-y-auto " : "grid"}>
          <div>
            <div className="flex justify-center"></div>
            <h2 className="mt-5 text-center text-3xl font-extrabold text-gray-900">
              {props.title}
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              {props.subtitle}
            </p>
          </div>
          {/*
            if you want to make changes in the right side code for sign in and sign up
            make chages here below.
          */}
          <div className="mt-0 sm:mx-auto sm:w-full sm:max-w-md lg:px-3">
            <div className="py-8 px-1 jus sm:px-10">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @exports AuthLayout component as default export
 */
export default AuthLayout;
