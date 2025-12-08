import { ReactNode } from "react";
import { useUserPreference } from "../../context/user/UserPreference"

export const PageLayout=({children}:{children : ReactNode}) =>{

    const {userPreference} = useUserPreference();
    return(
         <div
      className={`fixed top-8 inset-0 z-10 bg-white ${
        userPreference.isLeftMenu ? "ml-[58px] mr-0.5 mt-4" : " mt-6 p-1"
      }  overflow-auto`}
    >
        {children}
    </div>
    )
}
