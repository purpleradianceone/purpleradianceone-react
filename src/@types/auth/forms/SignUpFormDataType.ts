/**
 * created type defination for credentialSingUp data , 
 * which will be used for validation.
 */
type SignUpFormDataType= {
    name? : string,
    email : string,
    mobileNumber?: string
    password : string,
    confirmPassword:string
}

export default SignUpFormDataType;