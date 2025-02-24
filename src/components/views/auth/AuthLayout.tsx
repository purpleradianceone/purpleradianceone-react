/**
 * @import AuthLayoutPropsimported type object for props validation from from src/@types/AuthLayoutProps
 * @import "../../../assets/styles/AuthLayout.css" importing styles from the AuthLayout.css file
 */
import AuthLayoutProps from "../../../@types/auth/views/AuthLayoutProps";
import "../../../assets/styles/AuthLayout.css";
import AuthSideSvg from "../../../assets/svg/AuthSideSvg";
import { IMAGE_SOURCE } from "../../../constants/ImageSource";
// import Logo from "../../../assets/svg/Logo";

/**
 *  
 * @param props props of AuthLayout Component 
    {
      children: React.ReactNode, // children of AuthLayout Component i.e SignUpForm or SignInForm
      title: string, // title of AuthLayout Component
      subtitle: string, // subtitle of AuthLayout Component
    }
 * @returns Layout/Veiw for SignUpForm and signInForm components
 */
function AuthLayout(props: AuthLayoutProps){
  return (
    <div className="fixed bg-gray-100 flex flex-col justify-center">
      {/* left side code */}
      <div className="h-screen grid lg:grid-cols-3">
        <div
          className="g-no-repeat py-6 px-16 flex-col justify-between bg-blue-500 hidden lg:flex col-span-1 h-screen sticky top-0"
        >

          <div className="logo flex justify-center">
          <img src={IMAGE_SOURCE.PR_LOGO} alt="" className="w-52 h-32"/>  
         
          </div>
          <div className="flex justify-center">
           <AuthSideSvg></AuthSideSvg>
           </div>
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="avatar avatar-circle avatar-md">
                
              </span>
            </div>
          </div>
        </div>

        {/* right side code */}
        <div className="lg:col-span-2 overflow-y-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
            <div className="py-8 px-1  sm:px-10">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @exports AuthLayout component as default export
 */
export default AuthLayout;
