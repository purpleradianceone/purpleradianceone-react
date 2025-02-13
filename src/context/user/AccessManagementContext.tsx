/* eslint-disable react-refresh/only-export-components */
import{
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import { AccessManagementContextProps, AccessManagementType } from "../../@types/company-users/AccessManagementContextType";
import { BOOLEAN_VALUES, DATA_TYPE } from "../../constants/AppConstants";
  
const AccessManagementContext = createContext<AccessManagementContextProps | undefined>(undefined);
  
  export const AccessManagementContextProvider: React.FC<{ children: ReactNode }> = ({
      children,
    }) => {
    const [accessModules, setAccessModules] = useState<AccessManagementType[]>(() => {
      const savedAccessModules = localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
      return savedAccessModules ? JSON.parse(savedAccessModules) : [{
        add : BOOLEAN_VALUES.FALSE,
        company_user_id : 0,
        createdon : "",
        crm_module_id : 0,
        id : 0,
        module_name: "",
        update : BOOLEAN_VALUES.FALSE,
        updatedby : 0,
        updatedby_user : "",
        view : BOOLEAN_VALUES.FALSE
  }]
    });

  
    useEffect(() => {
      localStorage.setItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT, JSON.stringify(accessModules));
    }, [accessModules]);
  
    return (
      <AccessManagementContext.Provider value={{accessModules , setAccessModules }}>
        {children}
      </AccessManagementContext.Provider>
    );
  };
  
  export const useAccessManagementContext = () => {
    const context = useContext(AccessManagementContext);
    if (context === DATA_TYPE.UNDEFINED) {
      throw new Error("useLoggedInUserContext must be used within an useLoggedInUserContextProvider");
    }
    return context;
  };
  export default AccessManagementContext;
  