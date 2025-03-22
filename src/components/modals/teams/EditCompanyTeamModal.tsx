/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import CompanyTeamSearchProps from "../../../@types/team-management/CompanyTeamListProps";
import { useFormChange } from "../../../config/hooks/useFormChange";
import TextAreaInput from "../../ui/TextAreaInput";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import Button from "../../ui/Button";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { useEffect, useState } from "react";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import CompanyUserCompanyTeamAgGrid from "../../ag-grid/CompanyTeamUsersAgGrid";
import RadioButtons from "../../ui/RadioButton";
import MESSAGE from "../../../constants/Messages";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";

function EditCompanyTeamModal({
  isOpen,
  onClose,
  companyTeam,
  handleCompanyTeamChangeOnUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  companyTeam: CompanyTeamSearchProps;
  handleCompanyTeamChangeOnUpdate : (teamId : number) => void;
}) {
  const { userHasAccessToUpdateTeamManagement } = useUserAccessModules();

  const intialUpdateCompanyTeamFormData = {
    name: companyTeam.name,
    description: companyTeam.description,
    isActive : companyTeam.isActive
  };

  const CompanyTeamIsActiveRadioButtonOptions = [
    {
      label: "Active",
      value: "true",
      id: "active",
      name: "isActive",
      checked: companyTeam.isActive,
    },
    {
      label: "Inactive",
      value: "false",
      id: "inActive",
      name: "isActive",
      checked: !companyTeam.isActive,
    },
  ];

  const {loginStatus} = useLoggedInUserContext();


  const {
    formData: updateCompanyTeamFormData,
    handleChange: handleUpdateCompanyFormDataChange,
  } = useFormChange(intialUpdateCompanyTeamFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    updateCompanyTeamFormData,
    "registration"
  );

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };
  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
  );

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const { isSmallScreen } = useScreenSize();
  const handleUpdateCompanyTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(userHasAccessToUpdateTeamManagement){
        if(intialUpdateCompanyTeamFormData.description !== updateCompanyTeamFormData.description
          || intialUpdateCompanyTeamFormData.name !== updateCompanyTeamFormData.name
          || updateCompanyTeamFormData.isActive !== intialUpdateCompanyTeamFormData.isActive
        ){

          const updateCompanyTeamPostData = {
            id : companyTeam.id,
            company_id : loginStatus.companyId,
            name : updateCompanyTeamFormData.name,
            description : updateCompanyTeamFormData.description,
            isactive : updateCompanyTeamFormData.isActive,
            updatedby : loginStatus.id

          }
          axios.post(POST_API.UPDATE_COMPANY_TEAM,updateCompanyTeamPostData,{
            withCredentials : true
          })
          .then((response) => {
            if(response.data.status){
              showMessageSnackbar({message: response.data.message, type: "success"})
              handleCompanyTeamChangeOnUpdate(companyTeam.id);
              setTimeout(()=>{
                onClose();
              },3000)
            }
          })
          .catch(async(error : ApiError |any) => {
            console.log(error);
            if(error.status === STATUS_CODE.UNATHORISED){
              const refreshTokenResponse = await RefreshToken({callFunctionWithEvent:handleUpdateCompanyTeam})
              if(refreshTokenResponse){
                handleUpdateCompanyTeam(event);
                setIsDialogueOpen(false);                
              }
            }
            else if(error.status === STATUS_CODE.FORBIDDEN){
              setIsDialogueOpen(true);
            }
          })
    }
    else{
      showMessageSnackbar({message : MESSAGE.ERROR.NO_CHANGES,type: "error"})
    }
  }

  }

  useEffect(() => {
    if (!isOpen) {
      setErrors({
        name: "",
        description: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOpen) return null;
  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-45"
          : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-45"
      }
    >
      <div className="flex min-h-screen mb-5 items-center justify-center">
        <div
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:bg-gray-400
         [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Edit className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Team {companyTeam.name}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            <form className="space-y-1" onSubmit={handleUpdateCompanyTeam}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-stretch">
                <FormInput
                  label="Team Name : "
                  type="text"
                  name="name"
                  defaultValue={intialUpdateCompanyTeamFormData.name}
                  placeholder="Product Name"
                  onBlur={handleBlur}
                  error={errors.name}
                  onChange={handleUpdateCompanyFormDataChange}
                />

                <RadioButtons
                  label="IsActive : "
                  onChange={handleUpdateCompanyFormDataChange}
                  options={CompanyTeamIsActiveRadioButtonOptions}
                />
              </div>

              <TextAreaInput
                label="Description : "
                name="description"
                placeholder="Product Description"
                defaultValue={intialUpdateCompanyTeamFormData.description}
                cols={5}
                rows={3}
                maxLength={256}
                onBlur={handleBlur}
                error={errors.description}
                onChange={handleUpdateCompanyFormDataChange}
              />

              {userHasAccessToUpdateTeamManagement ? (
                <div className="flex justify-self-center max-w-60 m-3 pb-14">
                  <Button type="submit">Update Team</Button>
                </div>
              ) : (
                <div className="flex justify-self-end max-w-36 m-3">
                  <Button type="submit" onClick={() => {}} disabled>
                    Edit Team
                  </Button>
                </div>
              )}
            </form>
            <CompanyUserCompanyTeamAgGrid
              companyTeam={companyTeam}
              isOpen={isOpen}
              isGridForProductUser={false}
            ></CompanyUserCompanyTeamAgGrid>
          </div>


        </div>
        <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
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
}
export default EditCompanyTeamModal;
