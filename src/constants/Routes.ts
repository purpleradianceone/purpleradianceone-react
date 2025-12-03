
const ROUTES_URL = {
    NOT_FOUND : "*",
    LANDING_PAGE : "/",
    SIGN_IN : "/signin",
    SIGN_UP : "/signup",
    FORGOT_PASSWORD : "/forgotpassword",
    FORGOT_PASSWORD_REQUEST_PAGE : "/forgotpasswordrequestpage",
    CREATE_PASSWORD : "/createpassword",
    EMAIL_VERIFICATION : "/emailverfication/verify",
    HOME : "/home-dashboard",
    GET_COMPANY_USERS : "/home/manage-users/users",
    GET_LEAD_MANAGEMENT : "/home/manage-leads/leads",
    GET_LEAD_MANAGEMENT_DETAILS : "/home/manage-leads/leads",
    PRODUCT_MANAGEMENT : "/home/manage-products/products",
    LEAD_SETTINGS : "/settings/lead",
    LEAD_IMPORT_CSV : "/home/manage-leads/leads/import",
    NOTIFICATION: "/home/notifications",

    TEAM_MANAGEMENT : "/home/manage-teams/teams",
    // PRODUCT_TEAM_MANAGEMENT : "/home/manage-products/teams",
    USER_PROFILE_SETTING : "/settings/userprofile",
    //for subscription
    CREATE_SUBSCRIPTION : "/create/subscription",
    GET_SUBSCRIPTION : "/subscription",
    PANEL_CUSTOMIZER : "/panel-customizer",
    LEAD_DETAILS : "/lead/view",
    SCHEDULE_MEETING : "/meetings/schedule",
    //for email template
    EMAIL_TEMPLATE : "/email-template",
    EMAIL_TEMPLATE_CREATE : "/email-template/create",
    EMAIL_TEMPLATE_UPDATE : "/email-template/update",

    //for meetings
    GOOGLE_OAUTH : "/authenticate/google",
    ZOOM_OAUTH : "/authenticate/zoom",
    GOOGLE_OAUTH_ANDROID : "/authenticate/google/android",
    ZOOM_OAUTH_ANDROID : "/authenticate/zoom/android",
    MEETINGS : "/meetings",

    //for email settings
    EMAIL_SETTING : "/email-setting",

    COMPANY_SETTING: "/settings/company-settings",
    CREATE_LEAD : "/create/lead",
    CREATE_COMPANY_USER : "/create/company-user",
    CREATE_PRODUCT : "/create/product",
    CREATE_TEAM : "/create/team",
    DOWNLOAD_APP : "/download/app",
    PRIVACY_POLICY : "/policy/privacy-policy",
    TERMS_OF_SERVICE : "/policy/terms-of-service",
    COOKIE_POLICY : "/policy/cookie-policy",
    CAREERS : "/careers",
    ABOUT_US : "/#aboutUs",
    CONTACT_US : "/#contactUs",
    FEATURES : "/#features",
    PRICING : "/pricing",
    NOT_AUTHORIZED : "/not-authorized",
    SETTINGS_ALREADY_EXISTS : "/meeting/settings/already-exists",

    FACEBOOK_OAUTH : "/authenticate/facebook",
    INTEGRATIONS_SETTINGS : "/settings/integrations",

    ACCOUNT_MANAGEMENT : "/home/manage-accounts/accounts",
    ACCOUNT_IMPORT_CSV : "/home/manage-accounts/accounts/import",
    // Stock
    STOCK_MANAGEMENT : "/home/manage-stock/stock",
    STOCK_LIVE_FOR_COMPANY_PRODUCT : '/home/manage-stock/stock/live-stock-for-company-product/',

    //Support Tickets
    SUPPORT_TICKET_MANAGEMENT : "/home/manage-support-ticket/support-tickets",
    SUPPORT_TICKET_DETAILS : "/support-ticket/view",



}
export default ROUTES_URL;