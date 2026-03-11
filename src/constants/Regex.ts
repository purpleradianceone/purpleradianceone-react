const  REGEX= {
    EMAIL : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    URL : /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)?$/i,
    MOBILE_NUMBER : /[0-9,_%+-]{10,15}$/,
    MOBILE_NUMBER_NEW : /^[6-9]\d{9}$/,
    OTP : /^\d+$/,
    NAME_SPACE_DOT_ALLOWED_ONLY : /^[A-Za-z0-9. $]+$/,
    PASSWORD :/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/,
    NAME: /^[A-Za-z0-9 .&-]+$/,
    DESCRIPTION: /^[\s\S]+$/,
    LOCATION: /^[\p{L}\p{N}\s,.'#\-/()&@°:;]*$/u,
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,


}

export default REGEX;