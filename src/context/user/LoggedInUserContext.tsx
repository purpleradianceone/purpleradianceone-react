/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import { LoggedInUserContextProps, LoggedInUserType } from "../../@types/company-users/LoggedInUserContextType";
import {  DATA_TYPE } from "../../constants/AppConstants";
  
const LoggedInUserContext = createContext<LoggedInUserContextProps | undefined>(undefined);
  
  export const LoggedInUserContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [loginStatus, setLoginStatus] = useState<LoggedInUserType>(() => {
      const savedLoginStatus = localStorage.getItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
      return savedLoginStatus ? JSON.parse(savedLoginStatus) : {
        companyId : 0,
        companyName : "",
        createdOn : "",
        email : "",
        fullName : "",
        id : 0,
        message : "",
        mobileNumber : "",
        status : false,
        token : "",
        }
    });
  
    useEffect(() => {
      localStorage.setItem(LOCALSTORAGE_KEYS.LOGIN_STATUS, JSON.stringify(loginStatus));
    }, [loginStatus]);
  
    return (
      <LoggedInUserContext.Provider value={{loginStatus , setLoginStatus }}>
        {children}
      </LoggedInUserContext.Provider>
    );
  };
  
  export const useLoggedInUserContext = () => {
    const context = useContext(LoggedInUserContext);
    if (context === DATA_TYPE.UNDEFINED) {
      throw new Error("useLoggedInUserContext must be used within an useLoggedInUserContextProvider");
    }
    return context;
  };
  export default LoggedInUserContext;
  