import REGEX from "../../constants/Regex";

const validateUrl = (url: string): boolean => {
    const emailRegex = REGEX.URL;
    return emailRegex.test(url);
  };

  export default validateUrl;