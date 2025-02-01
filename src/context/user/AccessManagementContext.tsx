/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
import { AccessManagementContextProps, AccessManagementProps } from "../../@types/company-users/AccessManagementProps";
  
const AccessManagementContext = createContext<AccessManagementContextProps | undefined>(undefined);
  
  export const AccessManagementContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [accessModules, setAccessModules] = useState<AccessManagementProps[]>(() => {
      const savedAccessModules = sessionStorage.getItem("AccessManagement");
      return savedAccessModules ? JSON.parse(savedAccessModules) : [{
        add : false,
        company_user_id : 0,
        createdon : "",
        crm_module_id : 0,
        id : 0,
        module_name: "",
        update : false,
        updatedby : 0,
        updatedby_user : "",
        view : false
  }]
    });

  
    useEffect(() => {
      sessionStorage.setItem("AccessManagement", JSON.stringify(accessModules));
    }, [accessModules]);
  
    return (
      <AccessManagementContext.Provider value={{accessModules , setAccessModules }}>
        {children}
      </AccessManagementContext.Provider>
    );
  };
  
  export const useAccessManagementContext = () => {
    const context = useContext(AccessManagementContext);
    if (context === undefined) {
      throw new Error("useLoggedInUserContext must be used within an useLoggedInUserContextProvider");
    }
    return context;
  };
  export default AccessManagementContext;
  