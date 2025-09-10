import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../user/LoggedInUserContext";
import BusinessType from "../../@types/account/BusinessType";



type BusinessTypeContextProps = {
  businessTypeData: BusinessType[] | null;
  loading: boolean;
  setBusinessTypeData: React.Dispatch<React.SetStateAction<BusinessType[] | null>>;
};

const BusinessTypeDataContext = createContext<BusinessTypeContextProps | undefined>(undefined);

export const BusinessTypeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {loginStatus} = useLoggedInUserContext();
  const [businessTypeData, setBusinessTypeData] = useState<BusinessType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessType = async () => {
      const postData = {
        company_id: loginStatus.companyId,
        id: null,
        isactive: null,
        name: null,
        requestedby: loginStatus.id,
      };

      try {
        const response = await axios.post(POST_API.GET_BUSINESS_TYPE, postData, {
          withCredentials: true,
        });

        if (response.status === STATUS_CODE.OK) {
          setBusinessTypeData(response.data);
        } else {
          throw new Error("Failed to fetch industry type");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: fetchBusinessType,
          });

          if (refreshTokenStatus) {
            fetchBusinessType();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (!businessTypeData) {
      fetchBusinessType(); // fetch only once
    }
  }, [businessTypeData]);

  return (
    <BusinessTypeDataContext.Provider value={{ businessTypeData, setBusinessTypeData, loading }}>
      {children}
    </BusinessTypeDataContext.Provider>
  );
};

//  Custom hook for easy usage
export const useBusinessTypeData = () => {
  const context = useContext(BusinessTypeDataContext);
  if (!context) {
    throw new Error("useIndustryTypeData must be used inside IndustryTypeDataProvider");
  }
  return context;
};
