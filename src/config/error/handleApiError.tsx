import { AxiosError } from "axios";
import { toast } from "react-toastify";
import MESSAGE from "../../constants/Messages";

export function handleApiError(error: unknown) {
  if (!(error instanceof AxiosError)) {
    console.error(error);
    toast.error("Unexpected error occurred.");
    return;
  }

  if (error.code === "ERR_NETWORK") {
    toast.error("Network error. Please check your internet connection.");
    return;
  }

  if (!error.response) {
    // request cancelled or no response received
    return;
  }

  const status = error.response.status;
  const message =
    error.response.data?.message?.trim() ||
    error.response.data?.error?.trim() ||
    MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN;

  switch (status) {
    case 400:
      toast.error(message);
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
