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
import { NotificationCountContextProps } from "../../@types/notification/NotificationCountContext";
  
const NotificationCountContext = createContext<NotificationCountContextProps | undefined>(undefined);
  
  export const NotificationCountContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [notificationCount, setNotificationCount] = useState<number>(() => {
    
         console.log(localStorage.getItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT));
      const savedNotificationCount = localStorage.getItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
      return savedNotificationCount ? parseInt(savedNotificationCount) : 
         0
        
    });
  
    useEffect(() => {
        console.log("add count to notification  : " + notificationCount)
      localStorage.setItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT, notificationCount.toString());
    }, [notificationCount]);
  
    return (
      <NotificationCountContext.Provider value={{notificationCount , setNotificationCount }}>
        {children}
      </NotificationCountContext.Provider>
    );
  };
  
  export const useNotificationCountContext = () => {
    const context = useContext(NotificationCountContext);
    if (context === DATA_TYPE.UNDEFINED) {
      throw new Error("useNotificationCountContext must be used within an useNotificationCountContextProvider");
    }
    return context;
  };
  export default NotificationCountContext;
  