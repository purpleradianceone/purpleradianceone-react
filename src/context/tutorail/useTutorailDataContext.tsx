/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import { DATA_TYPE } from "../../constants/AppConstants";
import {
  TutorailDataType,
  TutorailsDataContextProps,
} from "../../@types/tutorail/TutorailDataType";

const TutorailDataContext = createContext<
  TutorailsDataContextProps | undefined
>(undefined);

export const TutorailDataContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tutorailData, setTutorailData] = useState<TutorailDataType>(() => {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEYS.TUTORAIL);
    return savedData
      ? JSON.parse(savedData)
      : {
          id: 0,
          companyUserId: 0,
          isNavbarSeen: false,
          isDashboardSeen: false,
          isCrmDashboardSeen: false,
          isCompanyUserSeen: false,
          isCompanyUserActionsSeen : false,
          isLeadSeen: false,
          isAccountSeen: false,
          isProductSeen: false,
          isTeamSeen: false,
          isSettingCompanySeen: false,
          isSettingEmailTemplateSeen: false,
          isSettingIntegrationSeen: false,
          createdBy: "",
          updatedBy: "",
          createdOn: "",
          updatedOn: "",
        };
  });

  useEffect(() => {
    localStorage.setItem(
      LOCALSTORAGE_KEYS.TUTORAIL,
      JSON.stringify(tutorailData)
    );
  }, [tutorailData]);

  return (
    <TutorailDataContext.Provider value={{ tutorailData, setTutorailData }}>
      {children}
    </TutorailDataContext.Provider>
  );
};

export const useTutorailDataContext = () => {
  const context = useContext(TutorailDataContext);
  if (context === DATA_TYPE.UNDEFINED) {
    throw new Error(
      "useTutorailDataContext must be used within an useTutorailDataContextProvider"
    );
  }
  return context;
};
export default TutorailDataContext;
