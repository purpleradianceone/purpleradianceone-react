/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
import { ManageCompanyType, ManageCompanyUserContextProps } from "../../@types/company-users/ManageCompanyUserContextType";
// import {LoggedInUserType, LoggedInUserContextProps } from "../../@types/company-users/LoggedInUserType";

  
const ManageCompanyUserContext = createContext<ManageCompanyUserContextProps | undefined>(undefined);
  
  export const ManageCompanyUserContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [companyUserAddedStatus, setcompanyUserAddedStatus] = useState<ManageCompanyType>(() => {
      const savedCompanyUserStatus = sessionStorage.getItem("companyUserAddedStatus");
      return savedCompanyUserStatus ? JSON.parse(savedCompanyUserStatus) : {
      message : '',
      status : false,
  }
    });
  
    useEffect(() => {
      sessionStorage.setItem("loginStatus", JSON.stringify(companyUserAddedStatus));
    }, [companyUserAddedStatus]);
  
    return (
      <ManageCompanyUserContext.Provider value={{companyUserAddedStatus , setcompanyUserAddedStatus }}>
        {children}
        
      </ManageCompanyUserContext.Provider>
    );
  };
  
  export const useAddedCompanyUserContext = () => {
    const context = useContext(ManageCompanyUserContext);
    if (context === undefined) {
      throw new Error("useLoggedInUserContext must be used within an useLoggedInUserContextProvider");
    }
    return context;
  };
  export default ManageCompanyUserContext;
  