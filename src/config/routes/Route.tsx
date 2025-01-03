import { createBrowserRouter, Link } from "react-router-dom";
import AuthLayout from "../../components/views/auth/AuthLayout";
import SignInForm from "../../components/forms/SignInForm";
import SignUpForm from "../../components/forms/SignUpForm";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";
import ForgotPasswordRequestPage from "../../components/views/auth/pages/ForgotPasswordRequestPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthLayout>
        <div>
          <Link to="/signin" style={{color:"black"}}>Home Screen</Link>
        </div>
      </AuthLayout>
    ),
  },
  {
    path: "/signin",
    element: (
      <AuthLayout title="Welcome back!" subtitle="Sign in to your account">
        <SignInForm />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout title="Sign Up" subtitle="Create your account">
        <SignUpForm />
      </AuthLayout>
    ),
  },
  {
    path: "/forgotpassword",
    element : (
      <AuthLayout title="Forgot Password" subtitle="Enter your email to reset your password">
        <ForgotPasswordForm></ForgotPasswordForm>
      </AuthLayout>
    ),
  },
  {
    path: "/forgotpasswordrequestpage",
    element : (
      <AuthLayout title="Mail Sent" subtitle="Check your email to and click on link in email to reset your password" >
        <ForgotPasswordRequestPage></ForgotPasswordRequestPage>
      </AuthLayout>
    ),
  },
]);
export default router;
