/* eslint-disable no-useless-escape */


export const  STRING_VALUES = {
    TRUE : "true",
    FALSE : "false",
    INVALID_DATE : "Invalid Date",
    REGISTRATION : "registration",
    REGISTERED : "registered",
    CONFIRM : "Confirm",
    CANCEL : "Cancel",
    GOOGLE_MEET : "Google Meet",
    ZOOM_MEETINGS : "Zoom Meetings",
    
}

export const TAX_CODE = {
    HSN : "hsn",
    SAC : "sac",
    ALL : "all"
}

export const  SUBSCRIPTION = {
    RAZORPAY_KEY : "rzp_test_89ANnSe3ncNGe5",
    COMPANY_NAME : "PurpleRadiance Technologies Pvt Ltd.",
    RAZORPAY_CURRENCY : "INR",
}

export const  NUMBER_VALUES = {
    SNACKBAR_DURATION : 2000,
}

export const DATA_TYPE = {
    UNDEFINED : undefined,
}

// company captcha key
export const SITE_KEY = "6LcB-m0rAAAAAI46H69SXH_TnYONFtZxvbVE_mR6";

// vaibhav captcha key
// export const SITE_KEY = "6Lfk8W0rAAAAAOTUzGGWBnX9C0Jhta2zRZYt3fXf";
export const STATUS_CODE = {
    OK : 200,
    UNATHORISED : 401,
    FORBIDDEN : 403,
    PERMANENT_REDIRECT : 308,

}
export const JSX_CHILDREN_NAME = {
    ADD_SUBSCRIPTION: "Upfront Purchase",
    ACCESS : "Access",
    EDIT : "Edit",
    DASHBOARD: "Dashboard",
    ACTIONS : "Actions ▾",
    ADD_USER : "Add User",
    CREATE_LEAD : "Create",
    ADD_PRODUCTS : "Add Products",
    TAX : "Tax",
    ADD_TEAM: "Add Team",
    TEAM : "Team",
    USER : "User",
    UPDATE : "Update Plan",
    MEETINGS : "Meetings",

}

export const SIZE = {
    TWENTY : 20,
    EIGHT : 8,
    TWENTY_FOUR : 24,
}

export const INNERHTML = {
    // OVERLAY_NO_ROWS_TEMPLATE : '<div class="flex justify-center items-center h-full"><div class="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 animate-spin-once"></div></div>',
    OVERLAY_NO_ROWS_TEMPLATE : '<div class="flex justify-center items-center h-64 flex-col"><div class="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 animate-spin-once animate-hide-spinner"></div><div class="opacity-0 animate-show-text text-gray-500 mt-4 text-sm">No data to show</div></div>',
    // OVERLAY_NO_ROWS_TEMPLATE : '<div class="relative flex justify-center items-center h-64 flex-col"><div class="absolute rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 pointer-events-none"></div><div class="opacity-0 animate-fade-in-delay text-gray-500 text-sm">No data to show</div></div>',
    OVERLAY_NO_ROWS_TEMPLATE_PRODUCT_TAX : '<div class = "flex justify-center items-center h-full text-blue-600" >No tax Records to Show! Please Add Tax</div>'
}


export  const AGGRID = {
    THEME_ALPINE : 'themeAlpine', 
}

export const  MOBILE_NUMBER_VALIDATION ={
    MOBILE_NUMBER_PATTERN_INDIAN : /^[6-9][0-9]{9}$/,
    STRING_MOBILE_NUMBER_PATTERN_INDIAN : '/^[6-9][0-9]{9}$/',
    ERROR_MESSAGE_MOBILE_NUMBER_INDIAN : "Invalid contact number (must start with 6-9 and be 10 digits)"  
}

export const VALIDATIONS ={
    NUMBER : /^\d+$/,
    NUMBER_WITH_DECIMAL : /^\d+(\.\d+)?$/,
    NUMBER_WITH_DECIMAL_STRING : "/^\d+(\.\d+)?$/",
    EMAIL : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}




