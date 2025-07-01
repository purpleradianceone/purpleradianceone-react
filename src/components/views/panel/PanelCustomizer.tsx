import React, { useEffect } from "react";
import { usePanel } from "../../../context/panel/usePanel";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { useUserPreference } from "../../../context/user/UserPreference";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";

const PanelCustomizer: React.FC = () => {

  const {loginStatus} = useLoggedInUserContext();
  const {position, setPosition}= usePanel();
  const prevPositionRef = React.useRef(position);
  const {userPreference , setUserPreference}= useUserPreference();
  const navigate = useNavigate();

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };
  const [isDialogueOpen, setIsDialogueOpen] = React.useState<boolean>(false);

   const handleUserPreferenceChange = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: userPreference.id,
      is_left_menu: position === "left" ? true : false,
      is_hamburger_menu_collapsed: userPreference.isHamburgerMenuCollapsed,
      master_rows_in_grid_id: null,
      timezone_id: userPreference.timezoneId,
      updatedby: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_USER_PREFERENCE,
        postData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        setUserPreference({
          ...userPreference,
          isLeftMenu : position==='left' ? true : false ,
        });
        prevPositionRef.current=position;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: handleUserPreferenceChange,
        });
        if (refreshTokenStatus) {
          handleUserPreferenceChange();
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  useEffect(()=>{
    if(prevPositionRef.current !== position && position!== null){
      handleUserPreferenceChange();
    }
  },[position])

  return (
    <div className="w-full  min-h-screen relative max-h-full bg-gradient-to-br from-blue-50 to-purple-50  flex flex-col items-center">
      <h1 className="text-xl font-bold text-indigo-700 mb-10 text-center">
        Choose Your Panel Layout
      </h1>

      {/* Cards Container */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* Top Panel Card */}
        <div
          className={`w-full lg:w-1/2 bg-white rounded-xl shadow-lg border-4 transition-all duration-300 ${
            position === "top"
              ? "border-indigo-500"
              : "border-transparent"
          }`}
        >
          <div className="relative w-full h-64 bg-gray-50 rounded-t-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-14 bg-indigo-600 text-white flex items-center justify-center font-semibold shadow">
              Panel (Top)
            </div>
          </div>
          <div className="p-4 flex justify-center">
            <label className="flex items-center gap-2 text-lg font-medium">
              <input
                type="radio"
                name="panel"
                value="top"
                checked={position === "top"}
                onChange={() => setPosition("top")}
                className="accent-indigo-600"
              />
              Select Top Panel
            </label>
          </div>
        </div>

        {/* Left Panel Card */}
        <div
          className={`w-full lg:w-1/2 bg-white rounded-xl shadow-lg border-4 transition-all duration-300 ${
            position === "left"
              ? "border-indigo-500"
              : "border-transparent"
          }`}
        >
          <div className="relative w-full h-64 bg-gray-50 rounded-t-xl overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-20 bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-md">
             <div className="grid">
             Panel 
             <span>(Left)</span>
             </div>
            </div>
          </div>
          <div className="p-4 flex justify-center">
            <label className="flex items-center gap-2 text-lg font-medium">
              <input
                type="radio"
                name="panel"
                value="left"
                checked={position === "left"}
                onChange={() => setPosition("left")}
                className="accent-indigo-600"
              />
              Select Left Panel
            </label>
          </div>
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

export default PanelCustomizer;
