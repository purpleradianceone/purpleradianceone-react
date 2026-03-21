const ROUTES_URL = {

  NOT_FOUND: "*",
  LANDING_PAGE: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  FORGOT_PASSWORD: "/forgotpassword",
  FORGOT_PASSWORD_REQUEST_PAGE: "/forgotpasswordrequestpage",
  CREATE_PASSWORD: "/createpassword",
  EMAIL_VERIFICATION: "/emailverfication/verify",
  HOME: "/home-dashboard",
  GET_COMPANY_USERS: "/home/manage-users/users",
  GET_LEAD_MANAGEMENT: "/home/manage-leads/leads",
  GET_LEAD_MANAGEMENT_DETAILS: "/home/manage-leads/leads",
  PRODUCT_MANAGEMENT: "/home/manage-products/products",
  LEAD_SETTINGS: "/settings/lead",
  LEAD_IMPORT_CSV: "/home/manage-leads/leads/import",
  NOTIFICATION: "/home/notifications",

  TEAM_MANAGEMENT: "/home/manage-teams/teams",
  // PRODUCT_TEAM_MANAGEMENT : "/home/manage-products/teams",
  USER_PROFILE_SETTING: "/settings/userprofile",
  //for subscription
  CREATE_SUBSCRIPTION: "/create/subscription",
  GET_SUBSCRIPTION: "/subscription",
  PANEL_CUSTOMIZER: "/panel-customizer",
  LEAD_DETAILS: "/home/manage-leads/leads/lead/view",
  SCHEDULE_MEETING: "/meetings/schedule",
  //for email template
  EMAIL_TEMPLATE: "/settings/email-template",
  EMAIL_TEMPLATE_CREATE: "/settings/email-template/create",
  EMAIL_TEMPLATE_UPDATE: "/settings/email-template/update",

  //for meetings
  GOOGLE_OAUTH: "/authenticate/google",
  ZOOM_OAUTH: "/authenticate/zoom",
  GOOGLE_OAUTH_ANDROID: "/authenticate/google/android",
  ZOOM_OAUTH_ANDROID: "/authenticate/zoom/android",
  MEETINGS: "/meetings",

  //for email settings
  EMAIL_SETTING: "/email-setting",

  COMPANY_SETTING: "/settings/company-settings",
  CREATE_LEAD: "/create/lead",
  CREATE_COMPANY_USER: "/create/company-user",
  CREATE_PRODUCT: "/create/product",
  CREATE_TEAM: "/create/team",
  DOWNLOAD_APP: "/download/app",
  PRIVACY_POLICY: "/policy/privacy-policy",
  TERMS_OF_SERVICE: "/policy/terms-of-service",
  COOKIE_POLICY: "/policy/cookie-policy",
  CAREERS: "/careers",
  ABOUT_US: "/#aboutUs",
  CONTACT_US: "/#contactUs",
  FEATURES: "/#features",
  PRICING: "/pricing",
  NOT_AUTHORIZED: "/not-authorized",
  SETTINGS_ALREADY_EXISTS: "/meeting/settings/already-exists",

  FACEBOOK_OAUTH: "/authenticate/facebook",
  INTEGRATIONS_SETTINGS: "/settings/integrations",

  // Quotation module
  QUOTATION_SETTINGS: "/settings/quotations",
  QUOTATION_SETTINGS_CREATE_TEMPLATE: "/settings/quotations/create",
  QUOTATION_SETTINGS_UPDATE_TEMPLATE: "/settings/quotations/update",

  // Account module
  ACCOUNT_MANAGEMENT: "/home/manage-accounts/accounts",
  ACCOUNT_DETAILS: "/home/manage-accounts/accounts",
  ACCOUNT_IMPORT_CSV: "/home/manage-accounts/accounts/import",
  ACCOUNT_COMPANY_PRODUCT_DETAILS:
    "/home/manage-accounts/accounts/acc-com-prod-details",
  ACCOUNT_COMPANY_PRODUCT_AMC_DETAILS:
    "/home/manage-accounts/accounts/prod-details-amc/:accountCompanyProductId",
  ACCOUNT_MULTIPLE_COMPANY_PRODUCT: "assign-products",
  ACCOUNT_SERVICE_DETAILS: "account-service-details",
  ACCOUNT_SUBSCRIPTION_DETAILS: "account-subscription-details",
  // Stock
  STOCK_MANAGEMENT: "/home/manage-stock/stock",
  STOCK_LIVE_FOR_COMPANY_PRODUCT:
    "/home/manage-stock/stock/live-stock-for-company-product/",
  WAREHOUSE_WISE_STOCK: "warehouse-wise-stock",
  STOCK_LEDGER: "stock-ledger",
  STOCK_AGEING: "stock-ageing",

  //Support Tickets
  SUPPORT_TICKET_MANAGEMENT: "/home/manage-support-ticket/support-tickets",
  SUPPORT_TICKET_DETAILS:
    "/home/manage-support-ticket/support-tickets/support-ticket/details",

  // setting
  SETTING_EMAIL: "email",
  SETTING_MEETINGS: "meetings",
  SETTING_ACCOUNT_TYPE: "account-type",
  SETTING_NOTIFICATIONS: "notification",
  SETTING_REMINDER: "reminder",
  SETTING_GENERAL: "general",
  SETTING_SUPPORT_TICKET_CATEGORY: "support-ticket-category",
  SETTING_COMPANY_WAREHOUSE: "company-warehouse",

  // setting-integration
  SETTING_META_APP: "meta-app",
  SETTING_INDIAMART: "indiamart",
  SETTING_LINKEDIN: "linkedin",
  SETTING_GOOGLE_ADS: "google-ads",

  //TASKS
  TASKS_MANAGEMENT: "/home/manage-tasks/tasks",
  MY_TASKS: "my-tasks",
  GENERAL_TASK: "/home/manage-tasks/general-task/:taskId/:masterId",
  MASTER_TASK_DETAILS: "/home/master-task/details/:taskId",
    
     //META APP INTEGRATIONS
   SETTING_META_APP_INTEGRATION_FACEBOOK: "/settings/facebook",
   SETTING_META_APP_INTEGRATION_FACEBOOK_PAGE_ADDITION : "integrate-meta-app",

      SETTING_META_APP_INTEGRATION_WHATSAPP: "/settings/integrate-whatsapp",
};
export default ROUTES_URL;
