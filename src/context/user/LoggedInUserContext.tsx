/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
import {LoggedInUserProps, LoggedInUserContextProps } from "../../@types/company-users/LoggedInUserProps";
  
  const LoggedInUserContext = createContext<LoggedInUserContextProps | undefined>(undefined);
  
  export const LoggedInUserContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [loginStatus, setLoginStatus] = useState<LoggedInUserProps>(() => {
      const savedLoginStatus = localStorage.getItem("loginStatus");
      return savedLoginStatus ? JSON.parse(savedLoginStatus) : {
      userId : 0,
      companyId : 0,
      message : '',
      token : '',
      status : false,
      email : '',
  }
    });
  
    useEffect(() => {
      localStorage.setItem("loginStatus", JSON.stringify(loginStatus));
    }, [loginStatus]);
  
    return (
      <LoggedInUserContext.Provider value={{loginStatus , setLoginStatus }}>
        {children}
      </LoggedInUserContext.Provider>
    );
  };
  
  export const useLoggedInUserContext = () => {
    const context = useContext(LoggedInUserContext);
    if (context === undefined) {
      throw new Error("useLoggedInUserContext must be used within an useLoggedInUserContextProvider");
    }
    return context;
  };
  export default LoggedInUserContext;
  