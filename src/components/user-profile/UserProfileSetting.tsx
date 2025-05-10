/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import UserProfileSettingManagement from "./UserProfileSettingManagement";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { STATUS_CODE } from "../../constants/AppConstants";
import UserProfile from "../../@types/user-profile/UserProfile";
import { useEffect, useState } from "react";
import AccessDeniedPopup from "../views/not-found/AccessDeniedPage";
import ROUTES_URL from "../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import { DialogueBox } from "../dialogue-box/Dialogue";

const UserProfileSetting = () => {
  const navigate = useNavigate();
  const { userHasAccessToViewUser } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    companyUserId: 0,
    companyUserProfile: 0,
    createdBy: "",
    createdOn: "",
    id: 0,
    timezoneId: 0,
    updatedBy: "",
    updatedOn: "",
  });

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  // API call to get company user profile
  const getCompanyUserProfile = async () => {
    try {
      const response = await axios.get(POST_API.GET_COMPANY_USER_PROFILE, {
        params: {
          companyId: loginStatus.companyId,
          companyUserId: loginStatus.id,
          requestedBy: loginStatus.id,
        },
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        setUserProfile(response.data);
      }
    } catch (error: ApiError | any) {
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getCompanyUserProfile,
        });
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  useEffect(() => {
    getCompanyUserProfile();
  }, []);

  useEffect(() => {
    if (!userHasAccessToViewUser) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewUser]);

  useEffect(() => {
    console.log(userProfile);
  }, [userProfile]);

  return (
    <div className="w-full h-full" >
      {userHasAccessToViewUser ? (
        <>
          <div className="min-h-screen min-w-full bg-gray-100 flex items-center justify-center">
            <UserProfileSettingManagement
              gmail="johndoe@gmail.com"
              timezone="GMT+5:30"
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
export default UserProfileSetting;
