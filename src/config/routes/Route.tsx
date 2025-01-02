import { createBrowserRouter, Link } from "react-router-dom";
import AuthLayout from "../../components/views/auth/AuthLayout";
import SignInForm from "../../components/forms/SignInForm";
import SignUpForm from "../../components/forms/SignUpForm";
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
      <AuthLayout title="Sign in to your account" subtitle="Welcome back!">
        <SignInForm />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout title=" Create your account" subtitle="Sign Up">
        <SignUpForm />
      </AuthLayout>
    ),
  },
]);
export default router;
