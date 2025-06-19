
const ROUTES_URL = {
    NOT_FOUND : "*",
    LANDING_PAGE : "/",
    SIGN_IN : "/signin",
    SIGN_UP : "/signup",
    FORGOT_PASSWORD : "/forgotpassword",
    FORGOT_PASSWORD_REQUEST_PAGE : "/forgotpasswordrequestpage",
    CREATE_PASSWORD : "/createpassword",
    EMAIL_VERIFICATION : "/emailverfication/verify",
    HOME : "/home",
    GET_COMPANY_USERS : "/home/manage-users/users",
    GET_LEAD_MANAGEMENT : "/home/manage-leads/leads",
    GET_LEAD_MANAGEMENT_DETAILS : "/home/manage-leads/leads",
    PRODUCT_MANAGEMENT : "/home/manage-products/products",
    LEAD_SETTINGS : "/settings/lead",
    LEAD_IMPORT_CSV : "/home/manage-leads/leads/import",


    TEAM_MANAGEMENT : "/home/manage-teams/teams",
    PRODUCT_TEAM_MANAGEMENT : "/home/manage-products/teams",
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


    
}
export default ROUTES_URL;