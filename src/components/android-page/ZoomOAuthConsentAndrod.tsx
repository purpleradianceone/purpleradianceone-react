import { Loader2,} from 'lucide-react';
import { createPortal } from 'react-dom';
import { STATUS_CODE } from '../../constants/AppConstants';
import axios from 'axios';
import POST_API from '../../constants/PostApi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useZoomMeetingContext } from '../../context/meeting/ZoomMeetingContext';


function ZoomMeetingsOAuthConsentAndroid() {


  const {setZoomMeetingStatus} = useZoomMeetingContext();

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


     const handleZoomMeetingOAuthCallback = (codeString : string, stateString : string) => {
      const zoomMeetingCallbackPostData = {
      code: codeString,
      state: stateString,
      redirect_url: window.location.origin + window.location.pathname,

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

    const initialText = 'Please wait Redirecting To PurpleCRM';
      const dotCount = 12; // ...... means 6 dots max
      const interval = 300;
      const [dots, setDots] = useState('.');
    
      useEffect(() => {
        // Set up an interval to update the dots
        const dotInterval = setInterval(() => {
          setDots(prevDots => {
            // Cycle through 0 to dotCount dots
            const nextDotCount = (prevDots.length + 1) % (dotCount + 1);
            return '.'.repeat(nextDotCount);
          });
        }, interval);
    
        // Clear the interval when the component unmounts
        return () => clearInterval(dotInterval);
      }, [dotCount, interval]);

   useEffect(() => {

      if (code && state){
        
          handleZoomMeetingOAuthCallback(code, state);    
          }
    },[]);


return (createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"/>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <div className="mb-6">
          <div className='justify-items-center'>
          <div className="w-20 h-20 bg-white rounded-lg flex justify-center">
                  <Loader2 className="w-14 h-14 text-indigo-600 animate-spin" />
                </div>
          </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {initialText}
      </h2>
       <div className="text-4xl justify-self-center text-blue-500 ">{dots}</div>
        </div>
      </div>
    </div>,
    document.body
  ));
}

export default ZoomMeetingsOAuthConsentAndroid;