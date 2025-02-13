import { useState, useEffect } from "react";
import { BOOLEAN_VALUES } from "../../constants/AppConstants";

const useScreenSize = () => {
  const [isLargeScreen, setIsLaptopView] = useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [isMediumScreen, setIsTabletView] = useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [isSmallScreen, setIsMobileView] = useState<boolean>(BOOLEAN_VALUES.FALSE);

  useEffect(() => {
    const handleScreenResize = () => {
      setIsLaptopView(window.innerWidth > 1024);
      setIsTabletView(window.innerWidth > 768 && window.innerWidth <= 1024);
      setIsMobileView(window.innerWidth <= 768);
    };

    handleScreenResize();

    window.addEventListener("resize", handleScreenResize);
    return () => window.removeEventListener("resize", handleScreenResize);
  }, []);

  return { isLargeScreen, isMediumScreen, isSmallScreen };
};

export default useScreenSize;
