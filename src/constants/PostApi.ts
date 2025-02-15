
const POST_API = {
    CREATE_FORGOT_PASSWORD : "/api/authentication/purple-crm-api/forgotpassword/verifyotp",
    CHANGE_FORGOT_PASSWORD : "/api/authentication/purple-crm-api/forgotpassword/otp",
    GET_CRM_MODULE_ACCESS : "/api/main/purple-crm-api/get/crmmodules/access",
    SIGN_UP : "/api/authentication/purple-crm-api/signup",
    UPDATE_CRM_MODULE_ACCESS : "/api/main/purple-crm-api/update/crmmodules/access",
    UPDATE_COMPANY_USER : "/api/main/purple-crm-api/update/company/users",
    GET_COMPANY_USERS : "/api/main/purple-crm-api/getcompanyuser",
    VERIFIY_CAPTCHA : "/api/authentication/purple-crm-api/cpatcha/verify",
    SIGN_IN : "/api/authentication/purple-crm-api/authenticate",
    COMPANY_SPECIFIC_CRITERIA_DATE_RANGE : "/api/main/purple-crm-api/get/companyspecificcriteria/daterange",
    CREATE_USER : "/api/main/purple-crm-api/createuser",
    SIGN_UP_EMAIL_VERIFICATION : "/api/authentication/purple-crm-api/emailverfication/verify?token=",
    REFRESH_TOKEN : "/api/authentication/purple-crm-api/refresh-token",
}

export default POST_API;