export const convertByteArrayToJson = (base64: string) => {
  try {
    const decoded = atob(base64); // decode base64
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
};