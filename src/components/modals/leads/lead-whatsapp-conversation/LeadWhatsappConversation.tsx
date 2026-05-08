import toast from "react-hot-toast";
import { getLeadWhatsappConversation } from "../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useEffect, useState } from "react";
import { LeadWhatsappConversationType } from "../../../../@types/lead-management/LeadWhatsappConversation";
import { handleApiError } from "../../../../config/error/handleApiError";

export const LeadWhatsappConversation = ({
  selectedLeadData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLeadData: any;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [conversation, setConversation] =
    useState<LeadWhatsappConversationType>();
  const [loading, setLoading] = useState<boolean>(false);

  const getLeadWhatsappConversationApi = () => {
    setLoading(true);

    getLeadWhatsappConversation({
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      requestedby_id: loginStatus.id,
    })
      .then((response) => {
        setConversation(mapLeadWhatsappConversation(response.data));
      })
      .catch((error) => {
        handleApiError(error);
        toast.error("Failed to fetch WhatsApp conversation");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getLeadWhatsappConversationApi();
  }, []);

  return (
    <div className="p-2">
      {loading ? (
        <ConversationSkeleton />
      ) : (
        <>
          {renderMessage(conversation?.email)}
          {renderMessage(conversation?.intent)}
          {renderMessage(conversation?.companyProductName)}
          {renderMessage(conversation?.issue)}
        </>
      )}
    </div>
  );
};

export const mapLeadWhatsappConversation = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
): LeadWhatsappConversationType => ({
  id: data.id,
  companyId: data.company_id,
  pageOffset: data.page_offset ?? null,

  phoneNumberId: data.phone_number_id ?? null,

  accountCompanyProductId: data.account_company_product_id ?? null,
  accountCompanyProductName: data.account_company_product_name ?? null,

  companyProductId: data.company_product_id ?? null,
  companyProductName: data.company_product_name ?? null,

  leadId: data.lead_id ?? null,
  supportTicketId: data.support_ticket_id ?? null,

  senderPhone: data.sender_phone ?? null,
  senderName: data.sender_name ?? null,

  currentStep: data.current_step ?? null,
  email: data.email ?? null,
  intent: data.intent ?? null,
  mobileNumber: data.mobile_number ?? null,
  issue: data.issue ?? null,

  createdOn: data.created_on,
  updatedOn: data.updated_on,

  requestedById: data.requestedby_id,
  isCompleted: data.is_completed ?? false,
});

export const renderMessage = (value?: string | null) => {
  if (!value) return null;

  const parts = value.split("&&&");

  return (
    <div className="input-label-custom">
      {/* System message (Left) */}
      {parts[0] && (
        <div className="flex justify-start mb-1">
          <div className="bg-gray-100 px-4 py-1 rounded-lg max-w-xs">
            {parts[0].trim()}
          </div>
        </div>
      )}

      {/* User reply (Right) */}
      {parts[1] && (
        <div className="flex justify-end mb-1">
          <div className="bg-green-100 px-4 py-1 rounded-lg max-w-xs">
            {parts[1].trim()}
          </div>
        </div>
      )}
    </div>
  );
};

export const ConversationSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => {
        const isSystem = index % 2 === 0;

        return (
          <div
            key={index}
            className={`flex ${isSystem ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-lg px-4 py-1 ${
                isSystem ? "bg-gray-200 w-60 h-8" : "bg-gray-300 w-40 h-8"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};
