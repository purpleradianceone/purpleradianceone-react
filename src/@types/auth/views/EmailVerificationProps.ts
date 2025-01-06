type EmailVerificationProps =  {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }

export default EmailVerificationProps;