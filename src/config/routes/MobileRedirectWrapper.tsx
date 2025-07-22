import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ROUTES_URL from '../../constants/Routes';

const useIsMobileOrTablet = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    const tabletRegex = /android|ipad|playbook|silk/i; 

    if (mobileRegex.test(userAgent) || tabletRegex.test(userAgent)) {
      setIsMobileOrTablet(true);
    } else {
      setIsMobileOrTablet(false);
    }
  }, []);

  return isMobileOrTablet;
};

const MobileRedirectWrapper = ({ children } : {children : React.ReactNode}) => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const location = useLocation();

  const excludedPaths = [
    ROUTES_URL.DOWNLOAD_APP,
    ROUTES_URL.SIGN_UP,
    ROUTES_URL.FORGOT_PASSWORD,
    ROUTES_URL.FORGOT_PASSWORD_REQUEST_PAGE,
    ROUTES_URL.CREATE_PASSWORD,
    ROUTES_URL.EMAIL_VERIFICATION,
    ROUTES_URL.GOOGLE_OAUTH_ANDROID,
    ROUTES_URL.ZOOM_OAUTH_ANDROID,
    ROUTES_URL.LANDING_PAGE,
    ROUTES_URL.PRIVACY_POLICY,
    ROUTES_URL.TERMS_OF_SERVICE,
    ROUTES_URL.COOKIE_POLICY
  ];

  if (isMobileOrTablet && !excludedPaths.includes(location.pathname)) {
    return <Navigate to={ROUTES_URL.DOWNLOAD_APP} replace />;
  }
  return <>{children}</>;
};

export default MobileRedirectWrapper;