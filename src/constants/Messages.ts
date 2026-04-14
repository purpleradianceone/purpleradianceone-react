
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
        SOMETHING_WENT_WRONG_TRY_AGAIN: "Something went wrong! Please try again.",
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
        NAME_SPACE_AND_DOT_ERROR: "Name must contain only alphanumeric characters, spaces, and dots.",
        EMAIL_NOT_VALID_ERROR: "Please enter valid email id.",
        PASSWORD_VALIDATION_ERROR: "Password must be 8–20 characters long and include at least 1 uppercase , 1 lowercase, 1 number, and 1 special character.",
        YOU_ARE_NOT_ON_YOUR_DASHBOARD: "You are not on your Dashboard.",

        // ACCOUNT PRODUCT MAPPING  / DETAILS 
        SELECT_PRODUCT_FIRST: "Select Product first.",
        QUANTITY_EXCEEDS: "Entered quantity exceeds available stock.",
        DUPLICATE_PRODUCT: "This product is already selected in another row!",
        STOCK_NOT_AVAILABLE_FOR_PRODUCT: "Selected Product doesn't have stock.",
        FAILED_TO_LOAD_PRODUCT_DATA: "Failed to load product data",
        SELECT_DIFFERENT_USER: "Select different user.",

        MODULE_ACCESS_UPDATE: "You do not have permission to update details.",
        SAME_PRODUCT_SELECTED : "Same product selected.",
        DENIED_FACEBOOK_INTEGRATION_MESSAGE:"Facebook account is already connected. you can integrate pages."
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
            DENIED_VIEW_ACCESS: "You do not have permission to view lead.",
            DENIED_ADD_ACCESS: "You do not have permission to create lead.",
            DENIED_ADD_LEAD_IMPORT_ACCESS: "You do not have permission to import leads.",
            UPDATE_LEAD_ACCESS_DENIED_message: "You do not have permission to update lead details."
        }, COMPANY_USER: {
            DENIED_VIEW_ACCESS: "You do not have permission to view Company user.",
            DENIED_ADD_ACCESS_COMPANY_USER: "You do not have permission to Add user.",
            DENIED_UPDATE_ACCESS_COMPANY_USER: "You do not have permission to update user details."
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
        }, ACCOUNT_TYPE_ACCESS: {
            DENIED_ADD_ACCESS: "You do not have permission to add account type.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account type.",
        }, ACCOUNT_ACCESS: {
            DENIED_ADD_ACCESS: "You do not have permission to add new account.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account details.",
            DENIED_ADD_ACCOUNT_IMPORT_ACCESS: "You do not have permission to import accounts.",

        }, SUPPORT_TICKET_CATEGORY: {
            DENIED_VIEW_ACCESS: "You do not have permission to view support ticket category.",
            DENIED_ADD_ACCESS: "You do not have permission to add new support ticket category.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update support ticket category.",

        }, COMPANY_WAREHOUSE: {
            DENIED_VIEW_ACCESS: "You do not have permission to view Company Warehouse.",
            DENIED_ADD_ACCESS: "You do not have permission to add new Company Warehouse.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update Company Warehouse.",
        }, STOCK: {
            STOCK :{
            DENIED_VIEW_ACCESS: "You do not have permission to view Stock.",
            DENIED_ADD_ACCESS: "You do not have permission to add new Stock.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update Stock.",
            },
            PRODUCT_WISE_STOCK :{
                DENIED_VIEW_ACCESS: "You do not have permission to view Product wise Company Stock.",
                DENIED_ADD_ACCESS: "You do not have permission to add Product wise Company Stock.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update Product wise Company Stock.",
            },
            WAREHOUSE_WISE_STOCK :{
                DENIED_VIEW_ACCESS: "You do not have permission to view Warehouse wise Company Stock.",
                DENIED_ADD_ACCESS: "You do not have permission to add Warehouse wise Company Stock.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update Warehouse wise Company Stock.",
            },
            STOCK_LEDGER :{
                DENIED_VIEW_ACCESS: "You do not have permission to view Stock Ledger.",
                DENIED_ADD_ACCESS: "You do not have permission to add Stock Ledger.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update Stock Ledger.",
            },
            STOCK_AGEING :{
                DENIED_VIEW_ACCESS: "You do not have permission to view Stock Ageing.",
                DENIED_ADD_ACCESS: "You do not have permission to add Stock Ageing.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update Stock Ageing.",
            }

        }, SUPPORT_MODULE: {
            DENIED_VIEW_ACCESS: "You do not have permission to view support ticket.",
            DENIED_ADD_ACCESS: "You do not have permission to create support ticket.",
            UPDATE_ACCESS_DENIED_MESSAGE: "You do not have permission to update support ticket details.",
            DENIED_ADD_TASK_ACCESS: "You do not have permission to create support ticket task.",
            DENIED_UPDATE_TASK_ACCESS: "You do not have permission to update support ticket task.",
            DENIED_VIEW_TASK_ACCESS: "You do not have permission to view support ticket tasks.",

        },
        ACCOUNT_COMPANY_PRODUCT_WARRANTY: {
            DENIED_VIEW_ACCESS: "You do not have permission to view warranty details.",
            DENIED_ADD_ACCESS: "You do not have permission to add warranty.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update warranty details.",
        },
        ACCOUNT_COMPANY_PRODUCT_AMC: {
            DENIED_VIEW_ACCESS: "You do not have permission to view Amc details.",
            DENIED_ADD_ACCESS: "You do not have permission to add Amc.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update Amc details.",
        },
        ACCOUNT_COMPANY_PRODUCT: {
            DENIED_VIEW_ACCESS: "You do not have permission to view assigned product.",
            DENIED_ADD_ACCESS: "You do not have permission to assign product to account.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update product details.",
        },

        ACCOUNT_TYPES: {
            DENIED_VIEW_ACCESS: "You do not have permission to view account company type.",
            DENIED_ADD_ACCESS: "You do not have permission to add account company type.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account company type.",
        },
        ACCOUNT_LEADS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view account leads.",
            DENIED_ADD_ACCESS: "You do not have permission to add account leads.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account leads.",
        },
        ACCOUNT_CONTACT: {
            DENIED_VIEW_ACCESS: "You do not have permission to view account contacts.",
            DENIED_ADD_ACCESS: "You do not have permission to add account contact.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account contact",
        },
        ACCOUNT_SERVICE: {
            DENIED_VIEW_ACCESS: "You do not have permission to view account service.",
            DENIED_ADD_ACCESS: "You do not have permission to add account service.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account service",
        },
        ACCOUNT_SUBSCRIPTION: {
            DENIED_VIEW_ACCESS: "You do not have permission to view account subscription.",
            DENIED_ADD_ACCESS: "You do not have permission to add account subscription.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update account subscription",
        },
        LEADS_SETTINGS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead settings.",
            DENIED_ADD_ACCESS: "You do not have permission to add.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead settings.",
        },
        LEAD_CONTACT: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead contacts.",
            DENIED_ADD_ACCESS: "You do not have permission to add lead contacts.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead contact.",
        },
        LEAD_PRODUCT: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead assigned product.",
            DENIED_ADD_ACCESS: "You do not have permission to assign product to lead.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead product details.",
        },
        LEAD_TEAMS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead assigned teams.",
            DENIED_ADD_ACCESS: "You do not have permission to assign teams to lead.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead teams details.",
        },
        LEAD_DETAILS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead details.",
            DENIED_ADD_ACCESS: "You do not have permission add to lead details.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead details.",
        }, LEAD_TASKS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead tasks.",
            DENIED_ADD_ACCESS: "You do not have permission to create lead tasks.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead tasks.",
        }, LEAD_QUOTATION: {
            DENIED_VIEW_ACCESS: "You do not have permission to view lead quotation.",
            DENIED_ADD_ACCESS: "You do not have permission to create lead quotation.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update lead quotation.",
        },TEAM_USERS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view team users.",
            DENIED_ADD_ACCESS: "You do not have permission to add users to team.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update team users.",
        },TEAMS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view team.",
            DENIED_ADD_ACCESS: "You do not have permission to create team.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update team.",
        }, PRODUCT_USERS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view product users.",
            DENIED_ADD_ACCESS: "You do not have permission to add users to product.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update product users.",
        }, PRODUCT_TEAMS: {
            DENIED_VIEW_ACCESS: "You do not have permission to view product teams.",
            DENIED_ADD_ACCESS: "You do not have permission to assign team to product.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update product team.",
        },
        SUBSCRIPTION:{
            DENIED_ADD_ACCESS:"You do not have permission to purchase subscription."
        },
        SETTING: {

            ACCOUNT_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view account type setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create account type setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update account type setting .",
            },
            LEAD_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view lead setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create lead setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update lead setting .",
            },
            MEETING_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view meeting setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create meeting setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update meeting setting .",
            },
            EMAIL_TYPE_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view email type setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create email type setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update email type setting .",
            },
            COMPANY_EMAIL_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view company email setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create company email setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update company email setting .",
            },
            PERSONAL_EMAIL_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view user email setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create user email setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update user email setting .",
            },
             COMPANY_PREFERENCE_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view company preference setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create company preference setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update company preference setting .",
            },
            SUPPORT_TICKET_CATEGORY_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view support ticket category setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create support ticket category setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update support ticket category setting .",
            },
             COMPANY_WAREHOUSE_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view company warehouse setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create company warehouse setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update company warehouse setting .",
            },GENERAL_USER_SETTING: {
                DENIED_VIEW_ACCESS: "You do not have permission to view general setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create general setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update general setting .",
            },
            INTEGRATION : {
               DENIED_VIEW_ACCESS: "You do not have permission to view integration setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create integration setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update integration setting .",  
            },
            REMINDER : {
                DENIED_VIEW_ACCESS: "You do not have permission to view reminder setting.",
                DENIED_ADD_ACCESS: "You do not have permission to create reminder setting.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update reminder setting .",  
            }

        },
        MY_TASK : {

            TASK : {
            DENIED_VIEW_ACCESS: "You do not have permission to view product users.",
            DENIED_ADD_ACCESS: "You do not have permission to add users to product.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update product users.",
            },
            MY_TASK :{
                DENIED_VIEW_ACCESS: "You do not have permission to view my tasks.",
                DENIED_ADD_ACCESS: "You do not have permission to create my tasks.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update my tasks.",
            },
            MASTER_TASK :{
                DENIED_VIEW_ACCESS: "You do not have permission to view master tasks.", 
                DENIED_ADD_ACCESS: "You do not have permission to create master tasks.",
                DENIED_UPDATE_ACCESS: "You do not have permission to update master tasks.",
            },
        },
        COMPANY_INVOICE: {
            DENIED_VIEW_ACCESS: "You do not have permission to view invoices.",
            DENIED_ADD_ACCESS: "You do not have permission to add invoice.",
            DENIED_UPDATE_ACCESS: "You do not have permission to update invoice.",
        }

    }
}


export default MESSAGE;