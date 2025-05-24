import { X } from 'lucide-react';
import Button from '../ui/Button';
import { createPortal } from 'react-dom';
import { STATUS_CODE, STRING_VALUES } from '../../constants/AppConstants';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../constants/PostApi';
import { useEffect } from 'react';
import LOCALSTORAGE_KEYS from '../../constants/LocalStorage';
import { useSearchParams } from 'react-router-dom';
import { useZoomMeetingContext } from '../../context/meeting/ZoomMeetingContext';


function ZoomMeetingsOAuthConsentAndroid() {


  const {loginStatus} = useLoggedInUserContext();
  const {zoomMeetingStatus,setZoomMeetingStatus} = useZoomMeetingContext();

  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");


    const handleClose = (isFlowCompleted : boolean) => {
      console.log(window.history)
        if(isFlowCompleted){
            window.location.href = "com.purpleradiance.crm://oauth";
        }
        window.history.back();
    }

    const handleConfirm = () =>{
      localStorage.setItem(LOCALSTORAGE_KEYS.REDIRECT_PLATFORM,STRING_VALUES.ZOOM_MEETINGS)
        const baseUrl =
      "http://localhost:8080/api/main/purple-crm-api/authentication/zoom";
    const params = new URLSearchParams();
    params.append("company_id", loginStatus.companyId.toString());
    params.append("company_user_id", loginStatus.id.toString());
    params.append("createdby", loginStatus.id.toString());
    params.append("redirect_url" , window.location.origin + window.location.pathname )
    // console.log(window.location.origin + window.location.pathname);
    window.location.href = `${baseUrl}?${params}`;
    }


     const handleZoomMeetingOAuthCallback = (codeString : string, stateString : string) => {
      const zoomMeetingCallbackPostData = {
      company_id: loginStatus.companyId,
      code: codeString,
      state: stateString,
      redirect_url: window.location.origin + window.location.pathname,
      company_user_id: loginStatus.id,
    };

    axios
      .post(POST_API.ZOOM_MEETINGS_CALLBACK, zoomMeetingCallbackPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if(response.status === STATUS_CODE.OK){
       setZoomMeetingStatus({
        isConnected : true
       })
        
        const newUrl = window.location.pathname;
        window.history.replaceState(null, "", newUrl);
        }
        handleClose(true);
      })
      .catch((error) => {
        console.log(error);
      });
    }

   useEffect(() => {
      if (code && state){
        const redirectPlatform = localStorage.getItem(LOCALSTORAGE_KEYS.REDIRECT_PLATFORM);
      
        if (!zoomMeetingStatus.isConnected && redirectPlatform === STRING_VALUES.ZOOM_MEETINGS) {
          handleZoomMeetingOAuthCallback(code, state);
        }
      }
    }, []);

  return (createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={()=> {
          handleClose(false);
        }}
      />
      

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <button
           onClick={()=> {
          handleClose(false);
        }}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In With Google</h2>
          <p className="text-gray-600">Do you want to signin with your google account for managing meetings</p>
        </div>

        <div className="flex justify-end gap-3">
          <div className='flex'>
          <button
             onClick={()=> {
          handleClose(false);
        }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {STRING_VALUES.CANCEL}
          </button>
          </div>
         

         <div className="flex">
         <Button
            onClick={() => {
              handleConfirm();
              // handleClose(true);
            }}
          >
            {STRING_VALUES.CONFIRM}
          </Button>
         </div>
          
        </div>
      </div>
    </div>,
    document.body
  ));
}

export default ZoomMeetingsOAuthConsentAndroid;