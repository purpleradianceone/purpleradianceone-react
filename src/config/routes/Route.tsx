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
import GetCompanyUsers from "../../components/views/manage-company-users/CompanyUsersManagement";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "../../components/views/not-found/NotFoundPage";
import ROUTES_URL from "../../constants/Routes";
import LoggedInRoute from "./LoggedInRoute";
import ContactUs from "../../components/views/home/landing-page/ContactUs";
import LeadManagement from "../../components/views/lead-management/LeadManagement";

export const router = createBrowserRouter([
  {
    path: ROUTES_URL.NOT_FOUND,
    element:(
        <NotFoundPage></NotFoundPage>
    ),
  },
  {
    path: ROUTES_URL.LANDING_PAGE,
    element: (
      <LoggedInRoute>
      <div className="min-h-screen">
        <Navbar>
          <Hero />
          <Features />
          <Testimonials />
          <ContactUs/>
          <CallToAction />
        </Navbar>
      </div>
      </LoggedInRoute>
    ),
  },
  {
    path: ROUTES_URL.SIGN_IN,
    element: (
      <AuthLayout title="Welcome back!" subtitle="Sign in to your account">
        <SignInForm />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES_URL.SIGN_UP,
    element: (
      <AuthLayout title="Sign Up" subtitle="Create your account">
        <SignUpForm />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES_URL.FORGOT_PASSWORD,
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
    path: ROUTES_URL.FORGOT_PASSWORD_REQUEST_PAGE,
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
    path: ROUTES_URL.CREATE_PASSWORD,
    element: (
      <AuthLayout title="Reset Password" subtitle="Create a new password">
        <CreatePasswordForm></CreatePasswordForm>
      </AuthLayout>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_VERIFICATION,
    element: <EmailVerificationLayout />,
  },
  {
    path: ROUTES_URL.HOME,
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
    path: ROUTES_URL.GET_COMPANY_USERS,
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

  {
    path : ROUTES_URL.GET_LEAD_MANAGEMENT,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <LeadManagement />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  }
]);
export default router;
