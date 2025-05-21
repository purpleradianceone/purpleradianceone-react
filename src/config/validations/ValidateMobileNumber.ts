import REGEX from "../../constants/Regex";

const validateMobileNumber = (number: string): boolean => {
    const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
    return mobileRegex.test(number);
  };

  export default validateMobileNumber;