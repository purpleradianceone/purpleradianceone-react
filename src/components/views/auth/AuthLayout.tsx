 /**
  * @import AuthLayoutPropsimported type object for props validation from from src/@types/AuthLayoutProps
  * @import "../../../assets/styles/AuthLayout.css" importing styles from the AuthLayout.css file
  */
import AuthLayoutProps from '../../../@types/AuthLayoutProps';
import '../../../assets/styles/AuthLayout.css'


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
const AuthLayout = (props : AuthLayoutProps) => {
  return (
    <div className="bg-gray-100 flex flex-col justify-center">
      <div className="grid lg:grid-cols-3">
      <div className="h-screen bg-no-repeat py-6 px-16 flex-col justify-between hidden lg:flex col-span-1" style={{backgroundImage: 'url(/images/auth-side-bg.jpg)', backgroundSize: 'cover'}}>
        <div className="logo ">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Purple Radiance</h2>
          {/* <img src="/images/logo.png" alt="" /> */}
        </div>
        <div className='mt-3 text-center text-3xl font-extrabold text-gray-900'>
        <div className='circular'></div>
        <h1 className='text-white'>Welcome!</h1>
        <div className="col-span-2 p-6 text-sm text-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. In eius vel autem doloribus excepturi corrupti dolore, exercitationem error tempora libero modi non sapiente, commodi at quam quo quidem perspiciatis voluptatibus.
      </div>
        </div>
        
      </div>
      
      
      <div className='lg:col-span-2'>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          {props.subtitle}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {props.title}
        </p>
      </div>
      {props.children}
      
    </div>
    </div>
    </div>
  );
};

/**
 * @exports AuthLayout component as default export
 */
export default AuthLayout;