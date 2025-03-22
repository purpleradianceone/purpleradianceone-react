import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [isLargeScreen, setIsLaptopView] = useState<boolean>(false);
  const [isMediumScreen, setIsTabletView] = useState<boolean>(false);
  const [isSmallScreen, setIsMobileView] = useState<boolean>(false);

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
