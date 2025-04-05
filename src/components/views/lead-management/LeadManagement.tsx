import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import LeadManagementList from "../../lists/LeadManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function LeadManagement() {
  const { userHasAccessToViewLead } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  useEffect(() => {
    if (!userHasAccessToViewLead) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewLead]);

  return (
    <div className="w-full">
      {userHasAccessToViewLead ? (
        <LeadManagementList />
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LeadManagement;
