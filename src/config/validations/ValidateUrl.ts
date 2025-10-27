import REGEX from "../../constants/Regex";

const validateUrl = (url: string): boolean => {
    const urlRegex = REGEX.URL;
    return urlRegex.test(url);
  };

  export default validateUrl;