const  REGEX= {
    EMAIL : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    MOBILE_NUMBER : /[0-9,_%+-]{10,15}$/,
    MOBILE_NUMBER_NEW : /^[6-9]\d{9}$/,
    OTP : /^\d+$/,
    NAME_SPACE_DOT_ALLOWED_ONLY : /^[A-Za-z0-9. $]+$/,
    PASSWORD :/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/


}

export default REGEX;