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
  const [leadimportTagDataCame, setLeadImportTagDataCame] =
    useState<boolean>(true);

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
      .catch(async (error: any) => {
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

  // return (
  //   <div className="bg-gray-100 rounded-md   shadow-sm p-1 pt-4">
  //     <h2 className="text-md font-semibold bg-white p-2 rounded-lg text-gray-800 mb-4 border-b pb-2">
  //       Lead Import Tags
  //       <p>
  //         These are your tags. By clicking on a tag, you can view all the leads
  //         associated with it. To delete specific leads, select the leads you
  //         want to remove and click the Delete button. The selected leads will be
  //         deleted from that tag. To move all leads from a tag to the main lead
  //         table, select the tag and click Move All Leads to Lead Table. ⚠️
  //         Please note: Once leads are moved to the main table, this action
  //         cannot be undone
  //       </p>
  //     </h2>

  //     {leadimportTagDataCame && (
  //       <div className="flex justify-center items-center h-20">
  //         <LoadingSpinner />
  //       </div>
  //     )}
  //     {leadImportTagData.length === 0 && !leadimportTagDataCame && (
  //       <div className="flex justify-center">
  //         <span className="text-gray-600 text-sm">No tags found.</span>
  //       </div>
  //     )}

  //     <div className="flex flex-wrap gap-3">
  //       {leadImportTagData.length > 0 &&
  //         leadImportTagData.map((data, index) => (
  //           <button
  //             key={index}
  //             onClick={() => setSelectedLeadTag(data.import_tag)}
  //             className={`px-1.5 py-1 rounded-md text-xs font-medium border shadow-sm transition-all duration-200
  //           ${
  //             selectedLeadTag === data.import_tag
  //               ? "bg-blue-600 text-white border-blue-600"
  //               : "bg-white text-gray-800 hover:bg-blue-50 hover:border-blue-300"
  //           }`}
  //           >
  //             {data.import_tag}
  //           </button>
  //         ))}
  //     </div>

  //     {selectedLeadTag && (
  //       <div className="">
  //         <div className=" pt-4">
  //           <LeadImportData
  //             selectedLeadTag={selectedLeadTag}
  //             getLeadImportTags={getLeadImportTags}
  //           />
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="bg-gray-50 rounded-xl shadow-md p-2 space-y-4 border border-gray-100">
      {/* Header */}
      {leadImportTagData.length > 0 && (
        <div className="bg-white p-2 rounded-lg shadow-sm border-b">
          <h2 className="table-header-custom mt-1">
            Lead Import Tags : 
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed space-y-0 mt-4">
            <p className="table-header-custom">📌 How Tags Work:</p>

            <ul className="input-label-custom list-disc pl-6 space-y-1">
               <li>
                Tags are created automatically , when we import the leads and currently leads are not merged into lead table.
              </li>
              <li>
                By clicking on a tag, you can view all the leads associated with
                it.
              </li>
              <li>
                To delete specific leads from tag, select them and click
                <span className="font-semibold text-red-600 ml-1">Delete </span> button.
              </li>
              <li>
                To move all leads from a tag to the main lead data, select the
                tag and click
                <span className="font-semibold text-blue-600 ml-1">
                  Move all Leads to Lead data
                </span>
                . 
              </li>
            </ul>

            <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              ⚠️{" "}
              <span className="caption-custom">
                Once moved, this action cannot be undone.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {leadimportTagDataCame && (
        <div className="flex justify-center items-center h-20">
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {leadImportTagData.length === 0 && !leadimportTagDataCame && (
        <div className="flex justify-center py-6">
          <span className="caption-custom">No tags found.</span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {leadImportTagData.length > 0 &&
          leadImportTagData.map((data, index) => (
            <button
              key={index}
              onClick={() => setSelectedLeadTag(data.import_tag)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 border shadow-sm
              ${
                selectedLeadTag === data.import_tag
                  ? "bg-blue-300 text-white border-blue-600 shadow-md table-header-custom"
                  : "bg-white hover:bg-blue-50 hover:border-blue-300 table-header-custom"
              }`}
            >
              {data.import_tag}
            </button>
          ))}
      </div>

      {/* Selected Tag Leads */}
      {selectedLeadTag && (
        <div className="pt-4">
          <LeadImportData
          CancelSelectedLeadTag={()=>{
            setSelectedLeadTag("")
          }}
            selectedLeadTag={selectedLeadTag}
            getLeadImportTags={getLeadImportTags}
          />
        </div>
      )}
    </div>
  );
};

export default LeadImportTagView;
