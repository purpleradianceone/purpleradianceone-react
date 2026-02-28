import toast from "react-hot-toast";

// Note : copy functionality added 
// usage : call this function with data that needs to copy.
export const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  } catch (err ) {
    toast.error("Copy failed" + err);
  }
};



