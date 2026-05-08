import { useEffect, useState } from "react";
import { ConversationSkeleton, mapLeadWhatsappConversation, renderMessage } from "../../leads/lead-whatsapp-conversation/LeadWhatsappConversation";
import { handleApiError } from "../../../../config/error/handleApiError";
import toast from "react-hot-toast";
import { getSupportTicketWhatsappConversation } from "../../../../config/apis/IntegrationApis";
import { LeadWhatsappConversationType } from "../../../../@types/lead-management/LeadWhatsappConversation";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

export const SupportWhatsappConversation =({
selectedSupportTicketId
}:{
    selectedSupportTicketId : number
})=>{

    const { loginStatus } = useLoggedInUserContext();

  const [conversation, setConversation] =
    useState<LeadWhatsappConversationType>();
  const [loading, setLoading] = useState<boolean>(false);

  const getSuppotyTicketWhatsappConversationApi = () => {
    setLoading(true);

    getSupportTicketWhatsappConversation({
      company_id: loginStatus.companyId,
      lead_id: selectedSupportTicketId,
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
    getSuppotyTicketWhatsappConversationApi();
  }, []);

  return (
    <div className="p-2">
      {loading ? (
        <ConversationSkeleton />
      ) : (
        <div className="max-h-72 overflow-scroll custom-scrollbar">
          {renderMessage(conversation?.email)}
          {renderMessage(conversation?.intent)}
          {renderMessage(conversation?.mobileNumber)}

          {renderMessage(conversation?.accountCompanyProductName)}
          {renderMessage(conversation?.issue)}
        </div>
      )}
    </div>
  );
}
