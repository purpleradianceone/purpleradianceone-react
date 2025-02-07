/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import { AccessManagementContextProps, AccessManagementType } from "../../@types/company-users/AccessManagementContextType";
  
const AccessManagementContext = createContext<AccessManagementContextProps | undefined>(undefined);
  
  export const AccessManagementContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [accessModules, setAccessModules] = useState<AccessManagementType[]>(() => {
      const savedAccessModules = localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
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
      localStorage.setItem("AccessManagement", JSON.stringify(accessModules));
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
  