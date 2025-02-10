import REGEX from "../../constants/Regex";

const validateEmail = (email: string): boolean => {
    const emailRegex = REGEX.EMAIL;
    return emailRegex.test(email);
  };

  export default validateEmail;