type MessageSnackbarProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
};

export type MessageSnackbarState = {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
};

export type ShowMessageSnackbarProps = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

export default MessageSnackbarProps;
