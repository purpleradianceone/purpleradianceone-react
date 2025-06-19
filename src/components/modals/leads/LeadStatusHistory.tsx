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
import { DialogueBox } from "../../dialogue-box/Dialogue";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
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
        console.log(responseData);

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
          setIsDialogueOpen(false);
          getLeadHistory();
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };
  useEffect(() => {
    if (isOpen) {
      getLeadHistory();
    }
  }, [isOpen]);

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-0 z-50">
      <div className="bg-slate-50 p-1 rounded-lg shadow-lg w-1/2 h-1/2 flex flex-col items-center">
        <button
          onClick={onClose}
          className="self-end  text-xs text-gray-500 hover:underline"
        >
          Close
        </button>
        <h1 className="text-base font-semibold">Lead status history</h1>

        <div 
         style={{ height: "100%", width: "100%" }}
        >
          <LeadStatusHistoryAgGrid
            leadStatusHistoryData={leadStatusHistoryData}
          />
        </div>
      </div>
       <DialogueBox
              isOpen={isDialogueOpen}
              onClose={() => setIsDialogueOpen(false)}
              onConfirm={handleDialogueConfirm}
              title="Session Expired !"
              message="Session Expired. Please login again."
            />
    </div>
  );
};
export default LeadStatusHistory;
