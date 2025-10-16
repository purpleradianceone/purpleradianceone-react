/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import AllowedDomains from "./AllowedDomains";
// import WebFormEmbed from "./WebFormEmbed";

// function WebFormIntegration() {
//     return (
//         <div className="grid grid-cols-2 gap-2">
//               <div className="col-span-1 min-h-full">
//                 <div className = "w-full min-h-full">
//                   <AllowedDomains/>
//                 </div>
//               </div>

//               <div className="col-span-1">
//                 <WebFormEmbed></WebFormEmbed>
//               </div>
//             </div>
//     )
// }
// export default WebFormIntegration;

import { useUserPreference } from "../../../../context/user/UserPreference";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import WebFormIntegrationTabs from "../../../tabs/WebFormIntegrationTabs";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import CompanySecret from "../../../../@types/settings/CompanySecret";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";

function WebFormIntegration() {
  const { userPreference } = useUserPreference();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { loginStatus } = useLoggedInUserContext();
  const [companySecretList,setCompanySecretList] = useState<CompanySecret[]>([]);
  const [companySecretUpdateCount,setCompanySecretUpdateCount] = useState<number>(0);

  const handleCompanySecretChange = () => {
    setCompanySecretUpdateCount((prev) => prev + 1)
  }
  const getCompanySecret = async () => {
    const getCompanySecretPostData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_COMPANY_SECRET, getCompanySecretPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const formattedData: CompanySecret[] = response.data.map(
            (res: any) => ({
              id: res.id,
              companyId: res.company_id,
              companyFormID: res.company_form_id,
              companyFormName: res.company_form_name,
              secretCode: res.secret_code,
              allowedDomains: res.allowed_domains ? res.allowed_domains : [],
              createdBy: res.createdby,
              createdOn: res.createdon,
              updatedBy: res.updatedby,
              updatedOn: res.updatedon,
            })
          );
          setCompanySecretList(formattedData);
        }
      }).catch(async(error : ApiError | any) => {
        if(error.status === STATUS_CODE.UNATHORISED){
            const refreshTokenStatus = await RefreshToken({callFunction:getCompanySecret});
            if(refreshTokenStatus){
                getCompanySecret();
            }
        }
      });
  };

  useEffect(() => {
    getCompanySecret();
  }, [companySecretUpdateCount]);

  return (
    <div className="w-full text center">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className={`w-full${userPreference.isLeftMenu ? "" : ""}`}>
          <div className="bg-white rounded-lg shadow-sm">
            {companySecretList.length > 0 && (
            <WebFormIntegrationTabs 
            companySecretList={companySecretList} 
            handleCompanySecretChange={handleCompanySecretChange}
            />
            )}
            
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default WebFormIntegration;
