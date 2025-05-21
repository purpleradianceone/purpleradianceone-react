const  REGEX= {
    EMAIL : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    MOBILE_NUMBER : /^[0-9]{10,15}$/,
    MOBILE_NUMBER_NEW : /^[6-9]\d{9}$/,
    OTP : /^\d+$/,
}

export default REGEX;