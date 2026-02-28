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
import FacebookOAuthConsent from "../../components/dialogue-box/FacebookOAuthConsent";
import IntegrationsPage from "../../components/views/integrations/IntegrationsPage";
import AccountImportCsvManagement from "../../components/modals/Account/import-account/AccountImportCsvManagement";
// import StockManagement from "../../components/views/stock-management/StockManagement";
import SupportTicketManagement from "../../components/views/support-ticket-management/SupportTicketManagement";
import ViewSupportTicketManagement from "../../components/modals/support-ticket/ViewSupportTicketManagement";
import { CreateMultipleAccountCompanyProduct } from "../../components/modals/Account/account-company-product/multiple-product-mapping/CreateMultipleAccountCompanyProduct";
import { AccountCompanyProductDetails } from "../../components/modals/Account/account-company-product/account-company-product-details/AccountCompanyProductDetails";
import AccountNavbarBreadcrumb from "../../components/modals/Account/nav-wrapper/AccountNavbarBreadcrumb";
import { EditorCanvasForQuotation } from "../../components/quotation-builder/builder/editor-canvas/EditorCanvasForQuotation";
import LeadSetting from "../../components/views/settings/lead-settings/LeadSetting";
import MeetingSettings from "../../components/views/settings/meeting-settings/MeetingSetting";
import AccountTypeSetting from "../../components/views/settings/account-type/AccountTypeSetting";
import CompanyPreferenceSetting from "../../components/views/settings/company-preferences/CompanyPreferenceSetting";
import SupportTicketCategorySetting from "../../components/views/settings/support-ticket-category/SupportTicketCategorySetting";
import CompanyWarehouseSetting from "../../components/views/settings/company-warehouse/CompanyWarehouseSetting";
import { ModuleGuard } from "../guard/ModuleGuard";
import MESSAGE from "../../constants/Messages";
import MetaAppsIntegration from "../../components/views/settings/social-media-integration/MetaAppsIntegration";
import WebFormIntegration from "../../components/views/settings/web-form-integration/WebFormIntegration";
import MyTaskManagement from "../../components/views/my-task-management/MyTaskManegement";
import TaskPage from "../../components/views/my-task-management/TaskPage";
import MasterTaskManagement from "../../components/views/my-task-management/MasterTaskManagement";
import GeneralTask from "../../components/views/my-task-management/GeneralTask";
import MasterTaskUpdate from "../../components/modals/general-task-master/MasterTaskUpdate";
import { QuotationPage } from "../../components/quotation-builder/QuotationPage";
import AccountManagement from "../../components/modals/Account/AccountManagement";
import StockPage from "../../components/views/stock-management/StockPage";
import StockManagement from "../../components/views/stock-management/StockManagement";
import WareHouseWiseStock from "../../components/views/stock-management/WareHouseWiseStock";
import StockLedgerManagement from "../../components/views/stock-management/StockLedgerManagement";
import StockAgeingManagement from "../../components/views/stock-management/StockAgeingManagement";


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
            <AboutUs />
            <Features />
            <Testimonials />
            <ContactUs />
            <CallToAction />
            <Footer />
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
            <CareersPage />
            <Footer />
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
            <Pricing />
            <Footer />
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
              <Home />
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
              <GetCompanyUsers
                isUsedInAccountProductForAssingingInstalledBy={false}
              />
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
              <LeadManagement isUsedInLeadModule={true} />
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
              <ProductManagement isGridForAccountProduct={false} />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.GENERAL_TASK,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <GeneralTask />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.MASTER_TASK_DETAILS,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <MasterTaskUpdate />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },

  {
    path: ROUTES_URL.TASKS_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <TaskPage />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewAllTasks"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.MY_TASK.MY_TASK.DENIED_VIEW_ACCESS
            }
          >
            <MyTaskManagement isUsedInAllTasksModule={true} />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.MY_TASKS, // ✅ relative path
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewMasterTasks"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.MY_TASK.MASTER_TASK.DENIED_VIEW_ACCESS
            }
          >
            <MasterTaskManagement isUsedInAllTasksModule={true} />
          </ModuleGuard>
        ),
      },
    ],
  },
  // {
  //   path: ROUTES_URL.COMPANY_SETTING,
  //   element: (
  //     <MobileRedirectWrapper>
  //       <PrivateRoute>
  //         <div>
  //           <Navbar>
  //             <SettingsPage />
  //           </Navbar>
  //         </div>
  //       </PrivateRoute>
  //     </MobileRedirectWrapper>
  //   ),
  // },

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
    children: [
      {
        index: true,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewSettingLead"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.LEAD_SETTING.DENIED_VIEW_ACCESS
            }
          >
            <LeadSetting />
          </ModuleGuard>
        ),
      },
      { path: ROUTES_URL.SETTING_EMAIL, element: <EmailSetting /> },
      {
        path: ROUTES_URL.SETTING_MEETINGS,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewMeetingSetting"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.MEETING_SETTING.DENIED_VIEW_ACCESS
            }
          >
            <MeetingSettings />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_ACCOUNT_TYPE,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewCompanyAccountType"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.ACCOUNT_SETTING.DENIED_VIEW_ACCESS
            }
          >
            <AccountTypeSetting />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_NOTIFICATIONS,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewCompanyPreferences"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.COMPANY_PREFERENCE_SETTING
                .DENIED_VIEW_ACCESS
            }
          >
            <CompanyPreferenceSetting />,
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_GENERAL,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewSettingGeneral"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.GENERAL_USER_SETTING
                .DENIED_VIEW_ACCESS
            }
          >
            <UserPrerefenceManagement />,
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_SUPPORT_TICKET_CATEGORY,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewSettingSupposeTicketCategory"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.SUPPORT_TICKET_CATEGORY_SETTING
                .DENIED_VIEW_ACCESS
            }
          >
            <SupportTicketCategorySetting />,
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_COMPANY_WAREHOUSE,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewSettingCompanyWarehouse"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.COMPANY_WAREHOUSE_SETTING
                .DENIED_VIEW_ACCESS
            }
          >
            <CompanyWarehouseSetting />,
          </ModuleGuard>
        ),
      },
    ],
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
  // {
  //   path: ROUTES_URL.PRODUCT_TEAM_MANAGEMENT,
  //   element: (
  //     <MobileRedirectWrapper>
  //       <PrivateRoute>
  //         <div>
  //           <Navbar>
  //             <ProductTeamManagement />
  //           </Navbar>
  //         </div>
  //       </PrivateRoute>
  //     </MobileRedirectWrapper>
  //   ),
  // },
  {
    path: ROUTES_URL.CREATE_SUBSCRIPTION,
    element: (
      <MobileRedirectWrapper>
        <LoginRequiredRouteNoContent>
          <div>
            <AuthLayout
              title="Activate Subscription!"
              // subtitle="Enter the number of users and subscription duration to proceed"
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
          <div>
            <Navbar>
              <ViewLeadManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.SCHEDULE_MEETING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <MeetingScheduler></MeetingScheduler>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_TEMPLATE,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <TemplatesPage />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_TEMPLATE_CREATE,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <EditorCanvas />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_TEMPLATE_UPDATE,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <EditorCanvasWithJson />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.QUOTATION_SETTINGS,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <QuotationPage />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.QUOTATION_SETTINGS_CREATE_Template,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <EditorCanvasForQuotation />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.EMAIL_SETTING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <EmailSetting />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.USER_PROFILE_SETTING,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <UserPrerefenceManagement />
            </Navbar>
          </div>
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
          <div>
            <Navbar>
              <Meetings></Meetings>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.LEAD_IMPORT_CSV,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              {/* <LeadImportCsv/> */}
              <LeadImportCsvManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.ACCOUNT_IMPORT_CSV,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <AccountImportCsvManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_LEAD,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <CreateLeadModal
                isOpen={true}
                onClose={() => {
                  window.history.back();
                }}
              ></CreateLeadModal>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_COMPANY_USER,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <AddCompanyUserModal
                isOpen={true}
                onClose={() => {
                  window.history.back();
                }}
              ></AddCompanyUserModal>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_PRODUCT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <AddProductModal
                isOpen={true}
                onClose={() => {
                  window.history.back();
                }}
                handleProductChangeOnAdd={() => {}}
              ></AddProductModal>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.CREATE_TEAM,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <AddTeamModal
                isOpen={true}
                onClose={() => {
                  window.history.back();
                }}
                handleCompanyTeamChangeOnAdd={() => {}}
              ></AddTeamModal>
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.ACCOUNT_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <GetAccounts isUsedForAccountLead={false} />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId`,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <Navbar>
            <AccountNavbarBreadcrumb />
          </Navbar>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
    children: [
      {
        index: true,
        element: 
        // <AccountDetailsUpdated />
        <AccountManagement/>
        ,
      },
      {
        path: "products/:productId",
        element: <AccountCompanyProductDetails />,
      },
      {
        path: ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT,
        element: <CreateMultipleAccountCompanyProduct />,
      },
    ],
  },
  {
    path: ROUTES_URL.FACEBOOK_OAUTH,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <FacebookOAuthConsent />
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  {
    path: ROUTES_URL.INTEGRATIONS_SETTINGS,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <IntegrationsPage />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewIntegrationSetting"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_VIEW_ACCESS
            }
          >
            <WebFormIntegration />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_META_APP,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewIntegrationSetting"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_VIEW_ACCESS
            }
          >
            <MetaAppsIntegration />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_INDIAMART,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewIntegrationSetting"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_VIEW_ACCESS
            }
          >
            <>INDIA MART</>
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_LINKEDIN,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewIntegrationSetting"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_VIEW_ACCESS
            }
          >
            <>LINKEDIN</>
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.SETTING_GOOGLE_ADS,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewIntegrationSetting"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.SETTING.INTEGRATION.DENIED_VIEW_ACCESS
            }
          >
            <>GOOGLE ADS</>
          </ModuleGuard>
        ),
      },
    ],
  },
  // {
  //   path: ROUTES_URL.STOCK_MANAGEMENT,
  //   element: (
  //     <MobileRedirectWrapper>
  //       <PrivateRoute>
  //         <div>
  //           <Navbar>
  //             <StockManagement />
  //           </Navbar>
  //         </div>
  //       </PrivateRoute>
  //     </MobileRedirectWrapper>
  //   ),
  // },

  // stock management routes
  {
    path: ROUTES_URL.STOCK_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <StockPage />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewProductWiseStock"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.STOCK.PRODUCT_WISE_STOCK.DENIED_VIEW_ACCESS
            }
          >
            <StockManagement />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.WAREHOUSE_WISE_STOCK, // ✅ relative path
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewWarehouseWiseStock"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.STOCK.WAREHOUSE_WISE_STOCK
                .DENIED_VIEW_ACCESS
            }
          >
            <WareHouseWiseStock />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.STOCK_LEDGER, // ✅ relative path
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewMasterTasks"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.STOCK.STOCK_LEDGER.DENIED_VIEW_ACCESS
            }
          >
            <StockLedgerManagement />
          </ModuleGuard>
        ),
      },
      {
        path: ROUTES_URL.STOCK_AGEING, // ✅ relative path
        element: (
          <ModuleGuard
            permissionKey="userHasAccessToViewMasterTasks"
            deniedMessage={
              MESSAGE.MODULE_ACCESS.STOCK.STOCK_AGEING.DENIED_VIEW_ACCESS
            }
          >
            <StockAgeingManagement />
          </ModuleGuard>
        ),
      },
    ],
  },
  {
    path: ROUTES_URL.SUPPORT_TICKET_MANAGEMENT,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <SupportTicketManagement isUsedInSupportTicketModule={true} />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  // {
  //   path: ROUTES_URL.MY_TASKS,
  //   element: (
  //     <MobileRedirectWrapper>
  //       <PrivateRoute>
  //         <div>
  //           <Navbar>
  //             <MyTaskManagement isUsedInAllTasksModule={true} />
  //           </Navbar>
  //         </div>
  //       </PrivateRoute>
  //     </MobileRedirectWrapper>
  //   ),
  // },
  {
    path: ROUTES_URL.SUPPORT_TICKET_DETAILS,
    element: (
      <MobileRedirectWrapper>
        <PrivateRoute>
          <div>
            <Navbar>
              <ViewSupportTicketManagement />
            </Navbar>
          </div>
        </PrivateRoute>
      </MobileRedirectWrapper>
    ),
  },
  // {
  //   path: `${ROUTES_URL.STOCK_LIVE_FOR_COMPANY_PRODUCT}:companyProductId/:product_name/:q_live/:q_inward/:q_outward`,
  //   element: (
  //     <MobileRedirectWrapper>
  //       <PrivateRoute>
  //         <Navbar>
  //           <StockLiveForCompanyProduct
  //           />
  //         </Navbar>
  //       </PrivateRoute>
  //     </MobileRedirectWrapper>
  //   ),
  // },
]);
export default router;
