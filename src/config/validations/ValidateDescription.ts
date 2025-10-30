import REGEX from "../../constants/Regex";

const validateDescription = (description: string): boolean => {
  // Allow empty description (optional field)
  if (!description || description.trim() === "") return true;

  const desc = description.trim();

  // Validate using regex
  return REGEX.DESCRIPTION.test(desc);
};

export default validateDescription;
