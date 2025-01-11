/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import NavBarProps from "../../@types/home/navbar/NavBarProps";

const NavBarContext = createContext<NavBarProps | undefined>(undefined);

export const NavBarContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setLoginStatus] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue === "true" ? true : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <NavBarContext.Provider value={{ isLoggedIn, setLoginStatus }}>
      {children}
    </NavBarContext.Provider>
  );
};

export const useNavBarContext = () => {
  const context = useContext(NavBarContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default NavBarContext;
