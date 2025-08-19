
const MESSAGE = {
    ERROR: {
        ENTER_COMPLETE_OTP: "Please enter the complete OTP",
        ENTER_NEW_PAWSSWORD: "Please enter a new password",
        EIGHT_CHARACTER_PASSWORD: "Password must be at least 8 characters long",
        PASSWORD_NOT_MATCH: "Passwords do not match",
        UNABLE_TO_SEND_OTP: "Unable to Send Otp ! something went wrong",
        EMAIL_REQUIRED: "Please enter the Email",
        PASSWORD_REQUIRED: "Password is required",
        COMPLETE_CAPTCHA: "Please Complete The Captcha",
        WRONG_CREDENTIALS: "Wrong Credentials ! Please try again",
        SOMETHING_WENT_WRONG: "Something Went Wrong!",
        INVALID_CAPTCHA: "Invalid Captcha",
        REQUIRED_FIELDS: "Fill required fields",
        NO_CHANGES: "No changes to save",
        NAME_REQUIRED: "Name is required",
        NOT_ATHORISED: "Your are not authorized",
        SUBSCRIPTION_MIN_ONE_USER_REQUIRED: "Minimum 1 user required.",
        SUBSCRIPTION_MONTH: "Minimum 1 or Max 48 month .",
        SUBSCRIPTION_CREATION_ERROR: "Error creating subscription",
        SUBSCRIPTION_PLAN_ERROR: "Subscription Needs Upgrade/inActive Users.",
        PRIMARY_LEAD_CONTACT_UPDATE_ERROR_MESSAGE: "Updating name, email, or phone number is not permitted for the primary lead contact from this section.",

    },
    SUCCESS: {
        LOGGED_IN: "Logged In",
        LOGIN_SUCCESSFUL: "Login successful!",
        ACCOUNT_ALREADY_REGISTERED: "Your email is already verified. You can now log in and start using your account.",
        SAVED: "Saved!",
    },
    INPROCESS: {
        LOGGING_IN: "Logging In",
        SAVING: "Saving...",
    },
    MODULE_ACCESS: {
        LEAD_MODULE: {
            UPDATE_LEAD_ACCESS_DENIED_message: "You do not have permission to update this lead."
        }, COMPANY_USER: {
            DENIED_ADD_ACCESS_COMPANY_USER: "You do not have permission to Add user.",
            DENIED_UPDATE_ACCESS_COMPANY_USER: "You do not have permission to update user."
        }, DASHBOARD: {
            DENIED_UPDATE_ACCESS_DASHBOARD: "You do not have permission to update dashboard settings.",
            DENIED_VIEW_ACCESS_DASHBOARD: "You do not have permission to view dashboard setting of a user."
        }, MODULE_ACCESS: {
            DENIED_VIEW_ACCESS_MODULE_ACCESS: "You do not have permission to view access."
        }, GENERAL_SETTING: {
            DENIED_UPDATE_ACCESS: "You do not have permission to update general settings."
        }, PRODUCT_MANAGEMENT: {
            DENIED_ADD_ACCESS: "You do not have permission to add new product.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update product information."
        }, PRODUCT_TEAM_MANAGEMENT: {
            DENIED_UPDATE_ACCESS: "You do not have permission to update product team/users."
        }
    }
}


export default MESSAGE;