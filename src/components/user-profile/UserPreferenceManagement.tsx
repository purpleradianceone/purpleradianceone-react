/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import AccessDeniedPopup from "../views/not-found/AccessDeniedPage";
import ROUTES_URL from "../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { DialogueBox } from "../dialogue-box/Dialogue";
import UserPreference from "./UserPreference";

const UserPrerefenceManagement = () => {
  const navigate = useNavigate();
  const { userHasAccessToViewUser } = useUserAccessModules();



  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  useEffect(() => {
    if (!userHasAccessToViewUser) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewUser]);

  return (
    <div className="w-full h-full">
      {userHasAccessToViewUser ? (
        <>
          <div className="min-h-screen min-w-full bg-gray-100 flex items-center justify-center">
            <UserPreference
           
            />
          </div>
          <DialogueBox
            isOpen={isDialogueOpen}
            onClose={() => setIsDialogueOpen(false)}
            onConfirm={handleDialogueConfirm}
            title="Session Expired !"
            message="Session Expired. Please login again."
          />
        </>
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
};
export default UserPrerefenceManagement;
