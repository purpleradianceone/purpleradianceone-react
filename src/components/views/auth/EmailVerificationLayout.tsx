import  { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import POST_API from '../../../constants/PostApi';
import ROUTES_URL from '../../../constants/Routes';
import EmailVerificationType from '../../../@types/auth/views/EmailVerificationType';


function EmailVerificationLayout() {

  const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const verificationCode = searchParams.get('token');
  const [verificationState, setVerificationState] = useState<EmailVerificationType>({
    status: 'idle',
    message: '',
  });

  
  // Function to decode Base64 string
const decodeEmail = (encodedString : string) => {
  // Decode the Base64 string
  // const decodedString = atob(encodedString);
  
  // // Convert the decoded string to a UTF-8 string
  // try {
  //     return decodeURIComponent(decodedString);
  // } catch (e) {
  //     console.error("Decoding error:", e);
  //     return null;
  // }

  const decoded = encodedString.replace(/3D/g, '');
  const finalDecoded = decoded.replace(/=/g,"");
  return finalDecoded;
}

  
  const handleVerification = () => {
    setVerificationState({ status: 'loading', message: 'Verifying your email...' });

    axios.get(POST_API.SIGN_UP_EMAIL_VERIFICATION + verificationCode)
    .then(response => {
      console.log(response);
      
      if (response.data.status === true) {
        setVerificationState({ status: 'success', message: 'Email verified successfully' });
        setTimeout(()=>{
          window.location.href = ROUTES_URL.SIGN_IN;
        },2000)
      }
      else if (response.data.message === "User is already verified. Please log in.") {
        setVerificationState({ status: 'success', message: 'User Already Verified. Please Log in' });
        setTimeout(()=>{
          window.location.href = ROUTES_URL.SIGN_IN;
        },2000)
      }
    }).catch((error) => {
      console.error(error);
      setVerificationState({ status: 'error', message: 'Error verifying your email' });
      setTimeout(()=>{
        setVerificationState({status:"idle",message:""});
      },3000)

    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-600">
            Please verify your email address to complete your registration
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Email"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Verification Email Sent</p>
              <p className="text-sm text-gray-500 truncate">{decodeEmail(email!) || ""}</p>
            </div>
          </div>

          {verificationState.status === 'idle' && (
            <button
              onClick={handleVerification}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>Verify Email</span>
            </button>
          )}

          {verificationState.status === 'loading' && (
            <div className="flex items-center justify-center space-x-2 text-indigo-600">
              <Loader2 className="animate-spin" size={20} />
              <span>{verificationState.message}</span>
            </div>
          )}

          {verificationState.status === 'success' && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle2 size={20} />
              <span>{verificationState.message}</span>
            </div>
          )}

          {verificationState.status === 'error' && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle size={20} />
              <span>{verificationState.message}</span>
            </div>
          )}
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Verify your account to continue!
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationLayout;