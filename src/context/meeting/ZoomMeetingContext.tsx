/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import {  DATA_TYPE } from "../../constants/AppConstants";
import ZoomMeetingContextProps, { ZoomMeetingContextState } from "../../@types/meeting/ZoomMeetingContextProps";
  
const ZoomMeetingContext = createContext<ZoomMeetingContextProps | undefined>(undefined);
  
  export const ZoomMeetingContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [zoomMeetingStatus, setZoomMeetingStatus] = useState<ZoomMeetingContextState>(() => {
      const savedZoomMeetingStatus = localStorage.getItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
      return savedZoomMeetingStatus ? JSON.parse(savedZoomMeetingStatus) : {
        isConnected : false,
        }
    });
  
    useEffect(() => {
      localStorage.setItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS, JSON.stringify(zoomMeetingStatus));
    }, [zoomMeetingStatus]);
  
    return (
      <ZoomMeetingContext.Provider value={{zoomMeetingStatus , setZoomMeetingStatus }}>
        {children}
      </ZoomMeetingContext.Provider>
    );
  };
  
  export const useZoomMeetingContext = () => {
    const context = useContext(ZoomMeetingContext);
    if (context === DATA_TYPE.UNDEFINED) {
      throw new Error("useZoomMeetingContext must be used within an useLoggedInUserContextProvider");
    }
    return context;
  };
  export default ZoomMeetingContext;
  