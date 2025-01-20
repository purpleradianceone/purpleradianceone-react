type MessageSnackbarProps = {
      message: string;
      type: 'success' | 'error' ;
      isOpen: boolean;
      onClose: () => void;
      duration?: number;
    }

export default MessageSnackbarProps;