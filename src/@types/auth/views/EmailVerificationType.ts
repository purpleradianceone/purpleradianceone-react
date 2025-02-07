type EmailVerificationType =  {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }

export default EmailVerificationType;