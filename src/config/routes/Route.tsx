import { createBrowserRouter, Link } from "react-router-dom";
import AuthLayout from "../../components/views/auth/AuthLayout";
import SignInForm from "../../components/forms/SignInForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthLayout>
        <div>
          <Link to="/signin">Home Screen</Link>
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
//   {
//     path: "/signup",
//     element: (
//       <AuthLayout title="Sign Up and get your account" subtitle="Create Account">
//         <SignInForm />
//       </AuthLayout>
//     ),
//   },
]);
export default router;
