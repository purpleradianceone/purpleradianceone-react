import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../../components/views/auth/AuthLayout";
import SignInForm from "../../components/forms/SignInForm";
import SignUpForm from "../../components/forms/SignUpForm";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";
import ForgotPasswordRequestPage from "../../assets/animations/EmailSentAnimation";
import CreatePasswordForm from "../../components/forms/CreatePasswordForm";
import Navbar from "../../components/views/home/navbar/Navbar";
import Hero from "../../components/views/home/landing-page/Hero";
import Features from "../../components/views/home/landing-page/Features";
import CallToAction from "../../components/views/home/landing-page/CallToAction";
import Testimonials from "../../components/views/home/landing-page/Testimonials";
import EmailVerificationLayout from "../../components/views/auth/EmailVerificationLayout";
// import AddCompanyUser from "../../components/views/manage-company-users/AddCompanyUser";
import GetCompanyUsers from "../../components/views/manage-company-users/GetCompanyUsers";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "../../components/views/not-found/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "*",
    element:(
        <NotFoundPage></NotFoundPage>
    ),
  },
  {
    path: "/",
    element: (
      <div className="min-h-screen">
        <Navbar>
          <Hero />
          <Features />
          <Testimonials />
          <CallToAction />
        </Navbar>
      </div>
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
    element: (
      <AuthLayout
        title="Forgot Password"
        subtitle="Enter your email to reset your password"
      >
        <ForgotPasswordForm></ForgotPasswordForm>
      </AuthLayout>
    ),
  },
  {
    path: "/forgotpasswordrequestpage",
    element: (
      <AuthLayout
        title="Mail Sent"
        subtitle="Check your email to and click on link in email to reset your password"
      >
        <ForgotPasswordRequestPage></ForgotPasswordRequestPage>
      </AuthLayout>
    ),
  },
  {
    path: "/createpassword",
    element: (
      <AuthLayout title="Reset Password" subtitle="Create a new password">
        <CreatePasswordForm></CreatePasswordForm>
      </AuthLayout>
    ),
  },
  {
    path: "/emailverfication/verify",
    element: <EmailVerificationLayout />,
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <div className="min-h-95vh">
          <Navbar>
            <div className="flex items-center justify-center">Home Screen</div>
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },

  {
    path: "/home/manage-users/users",
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <GetCompanyUsers />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
]);
export default router;
