/**
 * @import AuthLayoutPropsimported type object for props validation from from src/@types/AuthLayoutProps
 * @import "../../../assets/styles/AuthLayout.css" importing styles from the AuthLayout.css file
 */
import AuthLayoutProps from "../../../@types/auth/views/AuthLayoutProps";
import "../../../assets/styles/AuthLayout.css";
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
const AuthLayout = (props: AuthLayoutProps) => {
  return (
    <div className="bg-gray-100 flex flex-col justify-center">
      {/* left side code */}
      <div className="grid lg:grid-cols-3">
        <div
          className="g-no-repeat py-6 px-16 flex-col justify-between hidden lg:flex col-span-1 h-screen sticky top-0"
          style={{
            backgroundImage: "url(/images/auth/auth-side-bg-dark.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="logo flex justify-center">
            <img src="/images/logo/logo.png" alt="" className="w-52 h-32"/>

            {/* <Logo></Logo> */}
          </div>
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="avatar avatar-circle avatar-md">
                <img
                  className="w-16 h-16 rounded-full object-cover border-2"
                  src="/images/avatars/thumb-1.jpg"
                  
                ></img>
              </span>
              <div className="text-white">
                <div className="font-semibold text-base">Purple Radiance</div>
                <span className="opacity-80">CTO, Onward</span>
              </div>
            </div>
            <p className="text-lg text-white opacity-80">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla sint quam beatae suscipit necessitatibus eius sit impedit dolor, autem quasi aspernatur perspiciatis blanditiis. Pariatur quos perferendis porro dolor officia impedit.
            </p>
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
