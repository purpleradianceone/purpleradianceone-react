/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import LeadOwnerHistoryProp from "../../../@types/lead-management/LeadOwnerHistoryProp";
import LeadOwnerHistoryData from "../../../@types/lead-management/LeadOwnerHistoryData";
import LeadOwnerHistoryAgGrid from "../../ag-grid/LeadOwnerHistoryAgGrid";
import { History } from "lucide-react";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";
import axiosClient from "../../../axios-client/AxiosClient";

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
      const response = await axiosClient.post(
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
  return createPortal(
    <div className="fixed inset-0  flex justify-center items-center bg-black bg-opacity-5 z-50">
      <div className=" bg-white border p-1 rounded-lg shadow-lg w-1/2 h-1/2 flex flex-col ">
        <div className="m-0.5  p-0.5">
          <FormHeader
          icon={History}
          preText="Lead owner history"
          description="Track changes made to the lead's owner over time."
          onClose={onClose}
        />
        </div>

        <div 
         style={{ height: "100%", width: "100%" }}
        >
          <LeadOwnerHistoryAgGrid
          leadOwnerHistoryData={leadOwnerHistoryData}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
export default LeadOwnerHistory;
