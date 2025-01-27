type MessageSnackbarProps = {
      message: string;
      type: 'success' | 'error' | 'warning' | 'info';
      isOpen: boolean;
      onClose: () => void;
      duration?: number;
    }

export default MessageSnackbarProps;