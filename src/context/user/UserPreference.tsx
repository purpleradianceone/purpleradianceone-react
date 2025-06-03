import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import UserPreference from "../../@types/user-profile/UserProfile";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";

interface UserPreferenceContextProps {
    userPreference : UserPreference;
    setUserPreference : (userPreference : UserPreference) =>void;
}

const UserPreferenceContext = createContext<UserPreferenceContextProps| undefined>(undefined);
export const UserPreferenceContextProvider : React.FC<{children : ReactNode}>=({
    children
})=>{
    
    const [userPreference , setUserPreference] = useState<UserPreference> (() =>{
        const savedUserPreference = localStorage.getItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
        return savedUserPreference ? JSON.parse(savedUserPreference) : 
        {
        companyUserId : 0,
        createdBy : "",
        createdOn : "",
        id : 0,
        isHamburgerMenuCollapsed : false,
        isLeftMenu : false,
        rowsInGrid : 0,
        timezone : "",
        timezoneId : 0,
        timezoneName : "",
        timezoneUTCOffset : "",
        updatedBy : "",
        updatedOn : "",
    }});
 useEffect(() => {
      localStorage.setItem(LOCALSTORAGE_KEYS.USER_PREFERENCE, JSON.stringify(userPreference));
    }, [userPreference]);
    return (
        <UserPreferenceContext.Provider value={{userPreference , setUserPreference}}>
            {children}
            </UserPreferenceContext.Provider>
    )
}

export const useUserPreference = () =>{
    const context = useContext(UserPreferenceContext);

    if(!context){
        throw new Error("useUserPreference must be used within UserPreferenceContextProvider");
    }
    return context;
}