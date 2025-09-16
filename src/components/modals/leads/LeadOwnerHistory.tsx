/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import LeadOwnerHistoryProp from "../../../@types/lead-management/LeadOwnerHistoryProp";
import LeadOwnerHistoryData from "../../../@types/lead-management/LeadOwnerHistoryData";
import LeadOwnerHistoryAgGrid from "../../ag-grid/LeadOwnerHistoryAgGrid";
import { X } from "lucide-react";

const LeadOwnerHistory: React.FC<LeadOwnerHistoryProp> = ({
  isOpen,
  onClose,
  selectedLeadData,
}) => {
  const [leadOwnerHistoryData, setLeadOwnerHistoryData] = useState<
    LeadOwnerHistoryData[]
  >([
    {
      id: 0,
      leadOwner: "",
      createdOn: "",
      leadId: 0,
      reason: "",
    },
  ]);
  const { loginStatus } = useLoggedInUserContext();
  const getLeadOwnerHistory = async () => {
    const PostDataToGetLeadOwnerHistory = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      requestedby: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.GET_LEAD_OWNER_HISTORY,
        PostDataToGetLeadOwnerHistory,
        { withCredentials: true }
      );
      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        const transformedData: LeadOwnerHistoryData[] = responseData.map(
          (item: any) => ({
            id: item.id,
            createdOn: item.createdon,
            leadId: item.lead_id,
            leadOwner: item["Lead Owner"],
            reason: item.reason,
          })
        );
        setLeadOwnerHistoryData(transformedData);
      }
    }catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadOwnerHistory,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getLeadOwnerHistory();
        }
      }
    }
  };
  useEffect(() => {
    if (isOpen) {
        getLeadOwnerHistory();
    }
  }, [isOpen]);


  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-0 z-50">
      <div className="bg-slate-50 p-1 rounded-lg shadow-lg w-1/2 h-1/2 flex flex-col items-center">
        <button
          onClick={onClose} 
          title="Close"
          className="self-end  text-xs text-gray-600 hover:text-gray-900 hover:underline"
        >
           <X size={18}/>
        </button>
        <h1 className="text-base font-semibold">Lead Owner history</h1>

        <div 
         style={{ height: "100%", width: "100%" }}
        >
          <LeadOwnerHistoryAgGrid
          leadOwnerHistoryData={leadOwnerHistoryData}
          />
        </div>
      </div>
    </div>
  );
};
export default LeadOwnerHistory;
