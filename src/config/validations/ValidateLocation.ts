import REGEX from "../../constants/Regex";

const validateLocation = (location: string): boolean => {
  // Allow empty description (optional field)
  if (!location || location.trim() === "") return true;

  // Validate using regex
  return REGEX.LOCATION.test(location.trim());
};

export default validateLocation;
