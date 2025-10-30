import REGEX from "../../constants/Regex";

const validateName = (name: string) : boolean=>{

    const nameRegex = REGEX.NAME;

    if (!name || name.trim() === "") return true;
    return nameRegex.test(name);
}

export default validateName;