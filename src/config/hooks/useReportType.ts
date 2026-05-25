/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import ReportType from "../../@types/report/ReportType";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { getReportType } from "../apis/ReportsApis";
import RefreshToken from "../validations/RefreshToken";

export const useReportType = () => {
  const [reportTypeData, setReportTypeData] = useState<
    ReportType[]
  >([]);
  const [loading , setLoading]= useState<boolean>(true);

  const { loginStatus } = useLoggedInUserContext();

  const getReportType1 = async () => {
    if(loginStatus.companyId === 0)return;
    
    setLoading(true)
    const PostData = {
      id: null,
      name: null,
      isactive: null,
    };

    try {
      const response = await getReportType(PostData);
      if (response.status == STATUS_CODE.OK) {
        setLoading(false)
        setReportTypeData(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getReportType1,
        });
        if (refreshTokenStatus) {
          getReportType1();
        }
      }
    }
  };
  useEffect(() => {
    getReportType1();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reportTypeData,
    loading
  };
};
