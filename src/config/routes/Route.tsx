import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../../components/views/auth/AuthLayout";
import SignInForm from "../../components/forms/SignInForm";
import SignUpForm from "../../components/forms/SignUpForm";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";
import ForgotPasswordRequestPage from "../../assets/animations/EmailSentAnimation";
import CreatePasswordForm from "../../components/forms/CreatePasswordForm";
import Navbar from "../../components/views/home/navbar/Navbar";
import Hero from "../../components/views/home/Hero";
import Features from "../../components/views/home/Features";
import CallToAction from "../../components/views/home/CallToAction";
import Testimonials from "../../components/views/home/Testimonials";
import EmailVerificationLayout from "../../components/views/auth/EmailVerificationLayout";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
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
  {
    path : "/createpassword",
    element : (
      <AuthLayout title="Create Password" subtitle="Enter your new password"><CreatePasswordForm></CreatePasswordForm></AuthLayout>
    ),
  },
  {
    path: "/emailverfication/verify",
    element : (
      <EmailVerificationLayout/>
    ),
  },
  {
    path: "/home",
    element: (
      <Navbar />
    ),
  }
]);
export default router;
