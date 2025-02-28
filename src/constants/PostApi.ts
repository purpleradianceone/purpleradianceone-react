
const POST_API = {
    CREATE_FORGOT_PASSWORD : "http://localhost:8080/api/authentication/purple-crm-api/forgotpassword/verifyotp",
    CHANGE_FORGOT_PASSWORD : "http://localhost:8080/api/authentication/purple-crm-api/forgotpassword/otp",
    GET_CRM_MODULE_ACCESS : "http://localhost:8080/api/main/purple-crm-api/get/crmmodules/access",
    SIGN_UP : "http://localhost:8080/api/authentication/purple-crm-api/signup",
    UPDATE_CRM_MODULE_ACCESS : "http://localhost:8080/api/main/purple-crm-api/update/crmmodules/access",
    UPDATE_COMPANY_USER : "http://localhost:8080/api/main/purple-crm-api/update/company/users",
    GET_COMPANY_USERS : "http://localhost:8080/api/main/purple-crm-api/getcompanyuser",
    VERIFIY_CAPTCHA : "http://localhost:8080/api/authentication/purple-crm-api/cpatcha/verify",
    SIGN_IN : "http://localhost:8080/api/authentication/purple-crm-api/authenticate",
    COMPANY_SPECIFIC_CRITERIA_DATE_RANGE : "http://localhost:8080/api/main/purple-crm-api/get/companyspecificcriteria/daterange",
    CREATE_USER : "http://localhost:8080/api/main/purple-crm-api/createuser",
    SIGN_UP_EMAIL_VERIFICATION : "http://localhost:8080/api/authentication/purple-crm-api/emailverfication/verify?token=",
    REFRESH_TOKEN : "http://localhost:8080/api/authentication/purple-crm-api/refresh-token",
    ADD_PRODUCT : "http://localhost:8080/api/main/purple-crm-api/create/company-product",
    GET_PRODUCTS : "http://localhost:8080/api/main/purple-crm-api/get/company-product",
    UPDATE_PRODUCT : "http://localhost:8080/api/main/purple-crm-api/update/company-product",
    CREATE_PRODUCT_TAX : "http://localhost:8080/api/main/purple-crm-api/create/company-product-tax",
    GET_PRODUCT_TAX : "http://localhost:8080/api/main/purple-crm-api/get/company-product-tax",
    DELETE_COMPANY_PRODUCT_TAX : "http://localhost:8080/api/main/purple-crm-api/delete/company-product-tax",
}

export default POST_API;