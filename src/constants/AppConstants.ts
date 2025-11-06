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

export const OPACITY = {
  POPUP_OPACITY_AND_BACKGROUNG_COLOR : "bg-black bg-opacity-5 ",
}

export const PADDING = {
  CONFIRMATION_DIALOG_PADDING : "p-4"
}

export const GAP = {
  POPUP_GAP_BETWEEN_BUTTONS : "gap-3"
}


export const TAX_CODE = {
    HSN : "hsn",
    SAC : "sac",
    ALL : "all"
}


 export const emailDescriptions = {
  active: {
    welcomeCompanyUser: "Sends an automatic welcome email to new users from the company's email.",
    newLeadCreated: "Sends an email to relevant users whenever a new lead is created, originating from the company's email.",
    leadAssigned: "Sends an email from the company's email to the user assigned to the lead.",
    leadStatusChanged: "Sends an email from the company's email to notify relevant users when the status of a lead changes.",
    companyUserAssignedToCompanyProduct: "Sends an email to a user from the company's email when they're assigned to a product.",
    companyUserAssignedToCompanyTeam: "Sends an email to a user from the company's email when they're assigned to a team.",
    newAccountCreated: "Sends an email to the customer from the company's email when a new account is created.",
  },
  inactive: {
    welcomeCompanyUser: "A welcome email is sent to new users from individual users email.",
    newLeadCreated: "An email is sent from individual users email when new leads are created.",
    leadAssigned: "An email is sent from individual users email when a lead is assigned.",
    leadStatusChanged: "Emails are sent from individual users email when lead statuses change.",
    companyUserAssignedToCompanyProduct: "An email is sent from individual users email to a user when they're assigned to a product.",
    companyUserAssignedToCompanyTeam: "An email is sent from individual users email to a user when they're assigned to a team.",
    newAccountCreated: "An email is sent from the individual user's email to notify customer of a newly created account.",
  }
};

export const leadSettingDescriptions = {
  active: {
    leadsAreVisibleToProductUsers: "This setting is automatically applied to new leads for the product users.",
    leadsAreVisibleToProductTeams: "This setting is automatically applied to new leads for the product team.",
    leadsAreVisibleToLeadTeams: "This setting is automatically applied to new leads for the lead team."
  },
  inactive: {
    leadsAreVisibleToProductUsers: "This setting is not applied to new leads by default.",
    leadsAreVisibleToProductTeams: "This setting is not applied to new leads by default.",
    leadsAreVisibleToLeadTeams: "This setting is not applied to new leads by default."
  }
};

export const notificationsDesription = {
  active: {
    emailNotifications: "Email notifications are enabled. All new email notifications will be sent to the configured email address.",
    webAppNotifications: "Web app notifications are enabled. You will receive real-time alerts within the web application.",
    mobileAppNotifications: "Mobile app notifications are enabled. You will receive push notifications on your mobile device."
  },
  inactive: {
    emailNotifications: "Email notifications are disabled. You will not receive any new email notifications via email.",
    webAppNotifications: "Web app notifications are disabled. You will not receive any new alerts within the application.",
    mobileAppNotifications: "Mobile app notifications are disabled. You will not receive any push notifications on your mobile device."
  }
};


export const  SUBSCRIPTION = {
    // RAZORPAY_KEY : "rzp_test_89ANnSe3ncNGe5",
    RAZORPAY_KEY : import.meta.env.VITE_RAZORPAY_API_ID_KEY,
    COMPANY_NAME : "PurpleRadiance Technologies Pvt Ltd.",
    RAZORPAY_CURRENCY : "INR",
}

export const  NUMBER_VALUES = {
    SNACKBAR_DURATION : 500,
}

export const DATA_TYPE = {
    UNDEFINED : undefined,
}
// company purpleradianceone captcha key
export const SITE_KEY = "6LeMDvMrAAAAAGIkcoyi3CG1F23jqvKuouUgUXNR";

// company captcha key
//export const SITE_KEY = "6Lcs7fIrAAAAAOp4c77x69ruZ5_KPKQuVGdL-PCY";

// vaibhav captcha key
// export const SITE_KEY = "6Lfk8W0rAAAAAOTUzGGWBnX9C0Jhta2zRZYt3fXf";
export const STATUS_CODE = {
    OK : 200,
    UNATHORISED : 401,
    FORBIDDEN : 403,
    PERMANENT_REDIRECT : 308,
    ACCEPTED : 202,

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
    UPDATE : "Update",
    MEETINGS : "Meetings",

}

export const SIZE = {
    TWENTY : 20,
    EIGHT : 8,
    TWENTY_FOUR : 24,
    TWELEVE : 12,
    FOURTEEN : 14,
    SIXTEEN : 16,
}

export const INNERHTML = {
    // OVERLAY_NO_ROWS_TEMPLATE : '<div class="flex justify-center items-center h-full"><div class="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 animate-spin-once"></div></div>',
    OVERLAY_NO_ROWS_TEMPLATE : '<div class="flex justify-center items-center h-64 flex-col"><div class="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 animate-spin-once"></div><div class="opacity-0 animate-show-text text-gray-500 mt-4 text-sm">No data to show</div></div>',
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
    EMAIL : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MOBILE_NUMBER_LENGTH : 10,
    MAX_NAME_LENGTH : 60,
    MIN_EMAIL_LENGTH :3,
    MIN_NAME_LENGTH : 6,
    MAX_PASSWORD_LENGTH: 20,
    MIN_PASSWORD_LENGTH: 8
}




