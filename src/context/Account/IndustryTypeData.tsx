import React, { createContext, useEffect, useState, useContext } from "react";
import industryType from "../../@types/general/industryType";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../../config/validations/RefreshToken";

type IndustryTypeContextProps = {
  industryTypeData: industryType[] | null;
  loading: boolean;
  setIndustryTypeData: React.Dispatch<React.SetStateAction<industryType[] | null>>;
};

const IndustryTypeDataContext = createContext<IndustryTypeContextProps | undefined>(undefined);

export const IndustryTypeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [industryTypeData, setIndustryTypeData] = useState<industryType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustryType = async () => {
      const postData = {
        id: null,
        name: null,
        isactive: true,
      };

      try {
        const response = await axios.post(POST_API.GET_INDUSTRY_TYPE, postData, {
          withCredentials: true,
        });

        if (response.status === STATUS_CODE.OK) {
          setIndustryTypeData(response.data);
        } else {
          throw new Error("Failed to fetch industry type");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: fetchIndustryType,
          });

          if (refreshTokenStatus) {
            fetchIndustryType();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (!industryTypeData) {
      fetchIndustryType(); // fetch only once
    }
  }, [industryTypeData]);

  return (
    <IndustryTypeDataContext.Provider value={{ industryTypeData, setIndustryTypeData, loading }}>
      {children}
    </IndustryTypeDataContext.Provider>
  );
};

//  Custom hook for easy usage
export const useIndustryTypeData = () => {
  const context = useContext(IndustryTypeDataContext);
  if (!context) {
    throw new Error("useIndustryTypeData must be used inside IndustryTypeDataProvider");
  }
  return context;
};
