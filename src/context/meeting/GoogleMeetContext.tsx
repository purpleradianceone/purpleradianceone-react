/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  // useEffect,
} from "react";
// import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import { DATA_TYPE } from "../../constants/AppConstants";
import GoogleMeetContextProps, {
  GoogleMeetContextState,
} from "../../@types/meeting/GoogleMeetContextProps";

const GoogleMeetContext = createContext<GoogleMeetContextProps | undefined>(
  undefined,
);

export const GoogleMeetContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const [googleMeetStatus, setGoogleMeetStatus] =
  //   useState<GoogleMeetContextState>(() => {
  //     const savedGoogleMeetStatus = localStorage.getItem(
  //       LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS,
  //     );
  //     return savedGoogleMeetStatus
  //       ? JSON.parse(savedGoogleMeetStatus)
  //       : {
  //           isConnected: false,
  //           email: undefined,
  //         };
  //   });
  const [googleMeetStatus, setGoogleMeetStatus] =
    useState<GoogleMeetContextState>({
      isConnected: false, // 👈 important (loading state)
      email: undefined,
    });

  // useEffect(() => {
  //   localStorage.setItem(
  //     LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS,
  //     JSON.stringify(googleMeetStatus),
  //   );
  // }, [googleMeetStatus, setGoogleMeetStatus]);

  return (
    <GoogleMeetContext.Provider
      value={{ googleMeetStatus, setGoogleMeetStatus }}
    >
      {children}
    </GoogleMeetContext.Provider>
  );
};

export const useGoogleMeetContext = () => {
  const context = useContext(GoogleMeetContext);
  if (context === DATA_TYPE.UNDEFINED) {
    throw new Error(
      "useGoogleMeetContext must be used within an useLoggedInUserContextProvider",
    );
  }
  return context;
};
export default GoogleMeetContext;
