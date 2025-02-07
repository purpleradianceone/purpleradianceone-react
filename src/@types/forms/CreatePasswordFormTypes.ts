export type CreatePasswordFormData = {
    otp: string[];
    newPassword: string;
    confirmPassword: string;
  }

  
  export type CreatePasswordFormErrors =  {
    otp?: string;
    password?: string;
  }
  