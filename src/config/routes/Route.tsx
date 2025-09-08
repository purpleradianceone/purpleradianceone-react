/* eslint-disable @typescript-eslint/no-unused-vars */
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
import TeamManagement from "../../components/views/team-management/TeamManagement";
import ProductTeamManagement from "../../components/views/product-team-management/ProductTeamManagement";
import CreateSubscription from "../../components/subscription-module/CreateSubscription";
import SubscriptionManagement from "../../components/subscription-module/Subscription";
import PanelCustomizer from "../../components/views/panel/PanelCustomizer";
import ViewLeadManagement from "../../components/modals/leads/ViewLeadManagement";
import MeetingScheduler from "../../components/modals/meetings/MeetingScheduler";
import { EditorCanvas } from "../../components/email-template/template-editors/EditorCanvas";
import { TemplatesPage } from "../../components/email-template/TemplatesPage";
import UserPrerefenceManagement from "../../components/user-profile/UserPreferenceManagement";
import GoogleOAuthConsent from "../../components/dialogue-box/GoogleOAuthConsent";
import ZoomMeetingsOAuthConsent from "../../components/dialogue-box/ZoomOAuthConsent";
import GoogleOAuthConsentAndroid from "../../components/android-page/GoogleOAuthConsentAndroid";
import Meetings from "../../components/views/meeting/Meetings";
import EmailSetting from "../../components/views/settings/email-settings/EmailSetting";
import ZoomMeetingsOAuthConsentAndroid from "../../components/android-page/ZoomOAuthConsentAndrod";
import { EditorCanvasWithJson } from "../../components/email-template/template-editors/EditorCanvasWithJson";
import SettingsPage from "../../components/views/settings/company-settings/SettingsPage";
import LeadImportCsvManagement from "../../components/modals/leads/import-leads/LeadImportCsvManagement";
import CreateLeadModal from "../../components/modals/leads/CreateLeadModal";
import AddCompanyUserModal from "../../components/modals/company-user/AddCompanyUserModal";
import AddProductModal from "../../components/modals/products/AddProductModal";
import AddTeamModal from "../../components/modals/teams/AddTeamModal";
import NotificationManagement from "../../components/views/notification/NotificationManagement";
import MobileRedirectWrapper from "./MobileRedirectWrapper";
import DownloadAppPage from "../../components/views/mobile/DownloadApp";
import Footer from "../../components/views/home/landing-page/Footer";
import PrivacyPolicy from "../../components/views/home/landing-page/PrivacyPolicy";
import TermsOfService from "../../components/views/home/landing-page/TermsOfService";
import CookiePolicy from "../../components/views/home/landing-page/CookiePolicy";
import AboutUs from "../../components/views/home/landing-page/AboutUs";
import Pricing from "../../components/views/home/landing-page/Pricing";
import CareersPage from "../../components/views/home/landing-page/Carrers";
import LoginRequiredRouteNoContent from "./LoginRequiredRouteNoContent";
import NotAuthorized from "../../components/views/not-authorized/NotAuthorized";
import SettingsAlreadyExists from "../../components/views/not-authorized/SettingsAlreadyExists";
import Home from "../../components/views/home/Home";
import GetAccounts from "../../components/views/account/AccountManagement";

export const router = createBrowserRouter([
  {
    path: ROUTES_URL.NOT_FOUND,
    element: <NotFoundPage></NotFoundPage>,
  },
  {
    path: ROUTES_URL.DOWNLOAD_APP,
    element: <DownloadAppPage></DownloadAppPage>,
  },
   {
    path: ROUTES_URL.NOT_AUTHORIZED,
    element: <NotAuthorized></NotAuthorized>,
  },
  {
    path: ROUTES_URL.SETTINGS_ALREADY_EXISTS,
    element: <SettingsAlreadyExists></SettingsAlreadyExists>,
  },
  {
    path: ROUTES_URL.LANDING_PAGE,
    element: (
      <LoggedInRoute>
        <div className="min-h-screen">
          <Navbar>
            <Hero />
            <AboutUs/>
            <Features />
            <Testimonials />
            <ContactUs />
            <CallToAction />
            <Footer/>
          </Navbar>
        </div>
      </LoggedInRoute>
    ),
  },
  {
    path: ROUTES_URL.CAREERS,
    element: (
      <LoggedInRoute>
        <div className="min-h-screen">
          <Navbar>
            <CareersPage/>
            <Footer/>
          </Navbar>
        </div>
      </LoggedInRoute>
    ),
  },
  {
    path: ROUTES_URL.PRICING,
    element: (
      <LoggedInRoute>
        <div className="min-h-screen">
          <Navbar>
            <Pricing/>
            <Footer/>
          </Navbar>
        </div>
      </LoggedInRoute>
    ),
  },
  {
    path: ROUTES_URL.PRIVACY_POLICY,
    element: <PrivacyPolicy></PrivacyPolicy>,
  },
  {
    path: ROUTES_URL.TERMS_OF_SERVICE,
    element: <TermsOfService></TermsOfService>,
  },
  {
    path: ROUTES_URL.COOKIE_POLICY,
    element: <CookiePolicy></CookiePolicy>,
  },
  {
    path: ROUTES_URL.SIGN_IN,
    element: (
      <MobileRedirectWrapper>
        <AuthLayout title="Welcome back!" subtitle="Sign in to your account">
          <SignInForm />
        </AuthLayout>
      </MobileRedirectWrapper>
    ),
  },

  {
    path: ROUTES_URL.NOTIFICATION,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <NotificationManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
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
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div className="min-h-95vh">
            <Navbar>
              <Home/>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },

  {
    path: ROUTES_URL.GET_COMPANY_USERS,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <GetCompanyUsers />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },

  {
    path: ROUTES_URL.GET_LEAD_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <LeadManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },

  {
    path: ROUTES_URL.PRODUCT_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <ProductManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.COMPANY_SETTING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <SettingsPage />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.TEAM_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <TeamManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <ProductTeamManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_SUBSCRIPTION,
    element: (
      <MobileRedirectWrapper>
        <LoginRequiredRouteNoContent>

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
          </LoginRequiredRouteNoContent>
       
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.GET_SUBSCRIPTION,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <SubscriptionManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.PANEL_CUSTOMIZER,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <PanelCustomizer />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.LEAD_DETAILS,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <ViewLeadManagement />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.SCHEDULE_MEETING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <MeetingScheduler></MeetingScheduler>
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_TEMPLATE,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <TemplatesPage />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_TEMPLATE_CREATE,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <EditorCanvas />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_TEMPLATE_UPDATE,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <EditorCanvasWithJson />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_SETTING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <EmailSetting />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.USER_PROFILE_SETTING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <UserPrerefenceManagement />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.GOOGLE_OAUTH,
    element: (
      <MobileRedirectWrapper>
        <GoogleOAuthConsent></GoogleOAuthConsent>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.ZOOM_OAUTH,
    element: (
      <MobileRedirectWrapper>
        <ZoomMeetingsOAuthConsent></ZoomMeetingsOAuthConsent>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.GOOGLE_OAUTH_ANDROID,
    element: <GoogleOAuthConsentAndroid></GoogleOAuthConsentAndroid>,
  },
  {
    path: ROUTES_URL.ZOOM_OAUTH_ANDROID,
    element: (
      <ZoomMeetingsOAuthConsentAndroid></ZoomMeetingsOAuthConsentAndroid>
    ),
  },
  {
    path: ROUTES_URL.MEETINGS,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          <Meetings></Meetings>
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.LEAD_IMPORT_CSV,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          {/* <LeadImportCsv/> */}
          <LeadImportCsvManagement />
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_LEAD,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          <CreateLeadModal
            isOpen={true}
            onClose={() => {
              window.history.back();
            }}
          ></CreateLeadModal>
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_COMPANY_USER,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          <AddCompanyUserModal
            isOpen={true}
            onClose={() => {
              window.history.back();
            }}
          ></AddCompanyUserModal>
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_PRODUCT,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          <AddProductModal
            isOpen={true}
            onClose={() => {
              window.history.back();
            }}
            handleProductChangeOnAdd={() => {}}
          ></AddProductModal>
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_TEAM,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          <AddTeamModal
            isOpen={true}
            onClose={() => {
              window.history.back();
            }}
            handleCompanyTeamChangeOnAdd={() => {}}
          ></AddTeamModal>
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.ACCOUNT_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
      <PrivateRoute>
        <Navbar>
          <GetAccounts/>
        </Navbar>
      </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  }
]);
export default router;
