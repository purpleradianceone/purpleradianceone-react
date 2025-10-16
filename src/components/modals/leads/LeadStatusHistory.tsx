/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import LeadStatusHistoryProp from "../../../@types/lead-management/LeadStatusHistoryProp";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import LeadStatusHistoryData from "../../../@types/lead-management/LeadStatusHistoryData";
import LeadStatusHistoryAgGrid from "../../ag-grid/LeadStatusHistoryAgGrid";
import RefreshToken from "../../../config/validations/RefreshToken";
import { History} from "lucide-react";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";

const LeadStatusHistory: React.FC<LeadStatusHistoryProp> = ({
  isOpen,
  onClose,
  selectedLeadData,
}) => {
  const [leadStatusHistoryData, setLeadStatusHistoryData] = useState<
    LeadStatusHistoryData[]
  >([
    {
      id: 0,
      createdBy: "",
      createdOn: "",
      leadId: 0,
      leadStatus: "",
      leadStatusId: 0,
      reason: "",
    },
  ]);
  const { loginStatus } = useLoggedInUserContext();
  const getLeadHistory = async () => {
    const PostDataToGetLeadStatusHistory = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      requestedby: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.GET_LEAD_STATUS_HISTORY,
        PostDataToGetLeadStatusHistory,
        { withCredentials: true }
      );
      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        const transformedData: LeadStatusHistoryData[] = responseData.map(
          (item: any) => ({
            id: item.id,
            createdBy: item.createdby,
            createdOn: item.createdon,
            leadId: item.lead_id,
            leadStatus: item["Lead Status"],
            leadStatusId: item.lead_status_id,
            reason: item.reason,
          })
        );
        setLeadStatusHistoryData(transformedData);
      }
    }catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadHistory,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getLeadHistory();
        }
      }
    }
  };
  useEffect(() => {
    if (isOpen) {
      getLeadHistory();
    }
  }, [isOpen]);


  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-5 z-50">
      <div className="bg-white border p-1 rounded-lg shadow-lg w-1/2 h-1/2 flex flex-col ">

        <div className="m-0.5  p-0.5">
          <FormHeader
          icon={History}
          preText="Lead status history"
          description="Track changes made to the lead’s status over time."
          onClose={onClose}
        />
        </div>

        <div 
         style={{ height: "100%", width: "100%" }}
        >
          <LeadStatusHistoryAgGrid
            leadStatusHistoryData={leadStatusHistoryData}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
export default LeadStatusHistory;
