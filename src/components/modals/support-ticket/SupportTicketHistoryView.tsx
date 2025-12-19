/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";

import RefreshToken from "../../../config/validations/RefreshToken";
import { History } from "lucide-react";
import FormHeader from "../../ui/FormHeader";
import SupportTicketHistoryAgGrid from "../../ag-grid/SupportTicketHistoryAgGrid";
import SupportTicketHistory from "../../../@types/support-ticket-management/SupportTicketHistory";
import axiosClient from "../../../axios-client/AxiosClient";
import SupportTicketHistoryProp from "../../../@types/support-ticket-management/SupportTicketHistoryProp";
import { createPortal } from "react-dom";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";

const SupportTicketHistoryView: React.FC<SupportTicketHistoryProp> = ({
  isOpen,
  onClose,
  selectedSupportTicket,
}) => {
  const [
    isLoadingForSupportTicketHistory,
    setIsLoadingForSupportTicketHistory,
  ] = useState<boolean>(true);
  const [supportTicketHistoryData, setSupportTicketHistoryData] = useState<
    SupportTicketHistory[]
  >([
    {
      count: 0,
      id: 0,
      support_ticket_category_id: 0,
      support_ticket_category_name: "",
      support_ticket_escalation_level_id: 0,
      support_ticket_escalation_level_name: "",
      support_ticket_lifecycle_id: 0,
      support_ticket_lifecycle_name: "",
      company_product_sla_id: 0,
      company_product_sla_name: "",
      support_ticket_source_id: 0,
      support_ticket_source_name: "",
      query_description: "",
      public_notes: "",
      resolution_applied: "",
      assignedto: 0,
      assignedto_name: "",
      resolvedby: 0,
      resolvedby_name: "",
      createdby: "",
      updatedby: "",
      createdon: "",
      updatedon: "",
    },
  ]);
  const { loginStatus } = useLoggedInUserContext();
  const getSupportTicketHistory = async () => {
    setIsLoadingForSupportTicketHistory(true);
    const PostDataToGetSupportTicketHistory = {
      company_id: loginStatus.companyId,
      support_ticket_id: selectedSupportTicket.id,
      requestedby: loginStatus.id,
    };
    try {
      const response = await axiosClient.post(
        POST_API.GET_SUPPORT_TICKET_HISTORY,
        PostDataToGetSupportTicketHistory,
        { withCredentials: true }
      );
      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        const transformedData: SupportTicketHistory[] = responseData.map(
          (item: any) => ({
            count: 0,
            id: item.id,
            support_ticket_category_id: item.support_ticket_category_id,
            support_ticket_category_name: item.support_ticket_category_name,
            support_ticket_escalation_level_id:
              item.support_ticket_escalation_level_id,
            support_ticket_escalation_level_name:
              item.support_ticket_escalation_level_name,
            support_ticket_lifecycle_id: item.support_ticket_lifecycle_id,
            support_ticket_lifecycle_name: item.support_ticket_lifecycle_name,
            company_product_sla_id: item.company_product_sla_id,
            company_product_sla_name: item.company_product_sla_name,
            support_ticket_source_id: item.support_ticket_source_id,
            support_ticket_source_name: item.support_ticket_source_name,
            query_description: item.query_description,
            public_notes: item.public_notes,
            resolution_applied: item.resolution_applied,
            assignedto: item.assignedto,
            assignedto_name: item.assignedto_name,
            resolvedby: item.resolvedby,
            resolvedby_name: item.resolvedby_name,
            createdby: item.createdby,
            updatedby: item.updatedby,
            createdon: item.createdon,
            updatedon: item.updatedon,
          })
        );
        setSupportTicketHistoryData(transformedData);
        setIsLoadingForSupportTicketHistory(false);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getSupportTicketHistory,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getSupportTicketHistory();
        }
      }
    }
  };
  useEffect(() => {
    if (isOpen) {
      getSupportTicketHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-5 z-50">
      <div className="bg-white border p-1 rounded-lg shadow-lg w-[80%] h-1/2 flex flex-col ">
        <div className="m-0.5  p-0.5">
          <FormHeader
            icon={History}
            preText="Support ticket history"
            description="Track changes made to the support ticket over time."
            onClose={onClose}
          />
        </div>
        {!isLoadingForSupportTicketHistory? (
          <div style={{ height: "100%", width: "100%" }}>
            <SupportTicketHistoryAgGrid
              supportTicketHistoryData={supportTicketHistoryData}
            />
          </div>
        ):(<div className="flex h-full justify-center items-center">
          <LoadingSpinner/>
        </div>)}
      </div>
    </div>,
    document.body
  );
};
export default SupportTicketHistoryView;
