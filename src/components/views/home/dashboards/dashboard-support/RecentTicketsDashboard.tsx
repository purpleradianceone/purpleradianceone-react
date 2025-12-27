/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Ticket } from "lucide-react";

import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import ROUTES_URL from "../../../../../constants/Routes";
import qs from "query-string";

import RecentTicketDashboardProps from "../../../../../@types/support-ticket-management/RecentTicketDashboardProps";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../../constants/PostApi";
import { handleApiError } from "../../../../../config/error/handleApiError";
import axiosClient from "../../../../../axios-client/AxiosClient";
import { STATUS_CODE } from "../../../../../constants/AppConstants";

interface Props {
  isLoading: boolean;
  recentTickets: RecentTicketDashboardProps[];
}

function RecentTicketsDashboard({ isLoading, recentTickets }: Props) {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const getSupportTicketDetails = async (supportTicketId: number) => {
    try {
      const response = await axiosClient.post(
        POST_API.GET_SUPPORT_TICKET,
        {
          company_id: loginStatus.companyId,
          id: supportTicketId,
          requestedby: loginStatus.id,
        },
        { withCredentials: true }
      );
      if (response.status === STATUS_CODE.OK) {
        const supportTicketData = response.data.map((item: any) => {
          const queryParams = qs.stringify({
            supportTicketData: JSON.stringify({
              count: item.count,
              id: item.id,
              ticketNumber: item.ticket_number,
              companyId: item.company_id,
              accountName: item.account_name,
              accountEmail: item.account_email,
              accountMobileNumber: item.account_mobilenumber,
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              accountCompanyProductId: item.account_company_product_id,
              supportTicketCategoryId: item.support_ticket_category_id,
              supportTicketCategoryName: item.support_ticket_category_name,
              supportTicketEscalationLevelId:
                item.support_ticket_escalation_level_id,
              supportTicketEscalationLevelName:
                item.support_ticket_escalation_level_name,
              supportTicketLifecycleId: item.support_ticket_lifecycle_id,
              supportTicketLifecycleName: item.support_ticket_lifecycle_name,
              companyProductSlaId: item.company_product_sla_id,
              companyProductSlaName: item.company_product_sla_name,
              supportTicketSourceId: item.support_ticket_source_id,
              supportTicketSourceName: item.support_ticket_source_name,
              queryDescription: item.query_description,
              publicNotes: item.public_notes,
              resolutionApplied: item.resolution_applied,
              assignedTo: item.assignedto,
              assignedToName: item.assignedto_name,
              resolvedBy: item.resolvedby,
              resolvedByName: item.resolvedby_name,
              dueDateTime: item.due_date_time,
              completedAtDateTime: item.completed_at_date_time,
              createdBy: item.createdby,
              createdOn: item.createdon,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            }),
          });
          return queryParams;
        });

        navigate(`${ROUTES_URL.SUPPORT_TICKET_DETAILS}?${supportTicketData}`);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return (
    <div className="bg-white p-8 min-h-28 max-h-[640px] w-full flex flex-col rounded-2xl">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h3 className="section-header-custom mb-1">Recent Tickets</h3>
            <p className="table-header-custom">
              Recently created or updated support tickets
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {isLoading && <LoadingSpinner />}

          {!isLoading && (
            <div className="space-y-4">
              {recentTickets.length === 0 && (
                <h3 className="input-label-custom">No Recent Tickets</h3>
              )}

              {recentTickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="flex items-start space-x-4 p-3 border-2 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => getSupportTicketDetails(ticket.id)}
                >
                  <div className="p-2 rounded-xl bg-blue-100 shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <Ticket className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="table-header-custom hover:text-blue-600">
                          Ticket Number: {ticket.ticket_number}
                        </h4>
                        <p className="caption-custom mt-1 line-clamp-2">
                          {ticket.query_description}
                        </p>
                      </div>

                      <span className="px-2 py-0.5 rounded-full input-label-custom border bg-gray-100 text-gray-800">
                        {ticket.support_ticket_lifecycle_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-4 input-label-custom  ">
                        <span className="table-header-custom ">Product:</span>
                        <span className="table-data-custom hover:text-blue-600">{ticket.company_product_name}</span>
                        <span>•</span>
                        <span className="table-header-custom">Category: </span>
                        <span className="table-data-custom hover:text-blue-600">{ticket.support_ticket_category_name}</span>
                        <span>•</span>
                        <span className="table-header-custom">SLA: </span>
                        <span className="table-data-custom hover:text-blue-600">{ticket.company_product_sla_name}</span>
                      </div>

                      <div className="flex items-center space-x-1 input-label-custom">
                        <Clock className="w-3 h-3" />
                        <span>{ticket.due_date_time}</span>
                      </div>
                    </div>

                    <div className="mt-1 caption-custom">
                      Assigned to: {ticket.assignedto_name || "Unassigned"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

export default RecentTicketsDashboard;
