/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import LeadImportTagData from "../../../../@types/lead-management/LeadImportTagData";
import LeadImportData from "./LeadImportData";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";

const LeadImportTagView = () => {
  const { loginStatus } = useLoggedInUserContext();
  const [leadImportTagData, setLeadImportTagData] = useState<
    LeadImportTagData[]
  >([]);
  const [selectedLeadTag, setSelectedLeadTag] = useState<string>();
  const[leadimportTagDataCame , setLeadImportTagDataCame]= useState<boolean>(true);



  const getLeadImportTags = async () => {
    const postDataToGetLeadImportTags = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_LEAD_IMPORT_IMPORT_TAG, postDataToGetLeadImportTags, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
       
          setLeadImportTagDataCame(false);
          setLeadImportTagData(data);
        
      })
      .catch( async (error :any) => {
         if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getLeadImportTags,
          });
          if (refreshTokenStatus) {
            getLeadImportTags();
          }
        }
      });
  };


  useEffect(() => {
    getLeadImportTags();
  }, []);

  useEffect(() => {
    console.log(selectedLeadTag);
  }, [selectedLeadTag]);
  return (
    <div className="bg-gray-100 rounded-md   shadow-sm p-1 pt-4">
      <h2 className="text-md font-semibold bg-white p-2 rounded-lg text-gray-800 mb-4 border-b pb-2">
        Lead Import Tags
      </h2>

      { leadimportTagDataCame && (
        <div className="flex justify-center items-center h-20">
          <LoadingSpinner />
        </div>
      )}
      {
        leadImportTagData.length ===0 && !leadimportTagDataCame &&(
          <div className="flex justify-center">
            <span className="text-gray-600 text-sm">
              No tags found.
            </span>
          </div>
        )
      }

      <div className="flex flex-wrap gap-3">
        {leadImportTagData.length > 0 && leadImportTagData.map((data, index) => (
          <button
            key={index}
            onClick={() => setSelectedLeadTag(data.import_tag)}
            className={`px-1.5 py-1 rounded-md text-xs font-medium border shadow-sm transition-all duration-200 
            ${
              selectedLeadTag === data.import_tag
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 hover:bg-blue-50 hover:border-blue-300"
            }`}
          >
            {data.import_tag}
          </button>
        ))}
      </div>

      {selectedLeadTag && (
        <div className="">
          <div className=" pt-4">
            <LeadImportData 
             selectedLeadTag={selectedLeadTag}
             getLeadImportTags ={getLeadImportTags}
             />
            
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadImportTagView;
