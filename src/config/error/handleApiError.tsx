import { AxiosError } from "axios";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";

export function handleApiError(error: unknown) {
  if (!(error instanceof AxiosError)) {
    console.error(error);
    toast.error("Unexpected error occurred.");
    return;
  }

  // Network-level error (server not reachable, CORS, etc.)
  if (error.code === "ERR_NETWORK") {
    toast.error("Network error. Please check your internet connection.");
    return;
  }

  const status = error.response?.status; //  CORRECT  
  console.log("this is the res error " + status);
  
  const message =
    error.response?.data?.message?.trim() ||
    error.response?.data?.error?.trim() ||
    MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN;

  switch (status) {
    case 400:
      toast.error("Bad request! Something went wrong.");
      break;

    case 401:
      toast.error("Unauthorized. Please login again.");
      break;

    case 403:
      toast.error("You do not have permission to perform this action.");
      break;

    case 404:
      toast.error("Requested resource not found.");
      break;

    case 409:
      toast.error(message);
      break;

    case 500:
      toast.error("Server error. Please try again later.");
      break;

    default:
      toast.error(message);
  }
}
