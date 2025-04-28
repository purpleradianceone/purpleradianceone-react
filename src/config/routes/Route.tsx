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
import GetCompanyUsers from "../../components/views/manage-company-users/CompanyUsersManagement";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "../../components/views/not-found/NotFoundPage";
import ROUTES_URL from "../../constants/Routes";
import LoggedInRoute from "./LoggedInRoute";
import ContactUs from "../../components/views/home/landing-page/ContactUs";
import LeadManagement from "../../components/views/lead-management/LeadManagement";
import ProductManagement from "../../components/views/product-Management/ProductsManagement";
import LeadSettingsPage from "../../components/views/settings/lead-settings/LeadSettingsPage";
import TeamManagement from "../../components/views/team-management/TeamManagement";
import ProductTeamManagement from "../../components/views/product-team-management/ProductTeamManagement";
import Dashboard from "../../components/views/home/dashboard/Dashboard";
import CreateSubscription from "../../components/subscription-module/CreateSubscription";
import SubscriptionManagement from "../../components/subscription-module/Subscription";
import PanelCustomizer from "../../components/views/panel/PanelCustomizer";
import ViewLeadManagement from "../../components/modals/leads/ViewLeadManagement";


export const router = createBrowserRouter([
  {
    path: ROUTES_URL.NOT_FOUND,
    element: <NotFoundPage></NotFoundPage>,
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
            <ContactUs />
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
            <Dashboard></Dashboard>
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
    path: ROUTES_URL.GET_LEAD_MANAGEMENT,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <LeadManagement />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },

  {
    path: ROUTES_URL.PRODUCT_MANAGEMENT,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <ProductManagement />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES_URL.LEAD_SETTINGS,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <LeadSettingsPage />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES_URL.TEAM_MANAGEMENT,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <TeamManagement />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <ProductTeamManagement />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES_URL.CREATE_SUBSCRIPTION,
    element: (
      <PrivateRoute>
        <div>
          <AuthLayout
            title="Activate Subscription!"
            subtitle="Enter the number of users and subscription duration to proceed"
          >
            <CreateSubscription
              isOpen={true}
              isSubscrptionFromLoginPage={true}
            />
          </AuthLayout>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES_URL.GET_SUBSCRIPTION,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <SubscriptionManagement />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES_URL.PANEL_CUSTOMIZER,
    element: (
      <PrivateRoute>
        <div>
          <Navbar>
            <PanelCustomizer />
          </Navbar>
        </div>
      </PrivateRoute>
    ),
  },
  {
    path :ROUTES_URL.LEAD_DETAILS,
    element : (
      <PrivateRoute>
        <Navbar>
          
          {/* <LeadDetails/> */}
          <ViewLeadManagement/>
        </Navbar>
      </PrivateRoute>
    )
  },
]);
export default router;
