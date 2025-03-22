/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Network, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import TextAreaInput from "../../ui/TextAreaInput";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import Button from "../../ui/Button";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ROUTES_URL from "../../../constants/Routes";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import AddTeamFormDataState from "../../../@types/team-management/AddTeamFormDataState";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import MessageSnackBar from "../../ui/MessageSnackbar";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MESSAGE from "../../../constants/Messages";
import SearchInput from "../../ui/SearchInput";
import AddCompanyTeamUsersAgGrid from "../../ag-grid/AddCompanyTeamUsersAgGrid";
import companyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";

function AddTeamModal({
  isOpen,
  onClose,
  handleCompanyTeamChangeOnAdd
} : {
  isOpen: boolean;
  onClose: () => void;
  handleCompanyTeamChangeOnAdd : ()=> void;
}){
  const { userHasAccessToAddTeamManagement, userHasAccessToViewUser } = useUserAccessModules();
  const { isSmallScreen } = useScreenSize();

  const [intialAddTeamFormData, setIntialAddTeamFormData] = useState<AddTeamFormDataState>({
    name: "",
    description: "",
  });

  const { loginStatus } = useLoggedInUserContext();
  const {
    formData: AddTeamFormData,
    handleChange: handleAddTeamFormDataChange,
  } = useFormChange(intialAddTeamFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    AddTeamFormData,
    "registration"
  );

  const [addCompanyTeamUserArray, setAddCompanyTeamUserArray] = useState<number[]>([]);
  const [companyUsers, setCompanyUsers] = useState<companyUsersSearchProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);
  const gridApiRef = useRef<GridApi | null>(null);
  const lastScrollPositionRef = useRef<number>(0);

  const onGridReady = (params: { api: GridApi }) => {
    gridApiRef.current = params.api;
};

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

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

  const handleCompanyUserCheckBoxChange = (params : companyUsersSearchProps ,event :React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked){
      
      setAddCompanyTeamUserArray((prev) => [...prev, params.id]);
    }
    else{
      
      setAddCompanyTeamUserArray((prev) => prev.filter((id) => id !== params.id));
    }

  }

  useEffect(()=>{
    console.log(addCompanyTeamUserArray)
  },[addCompanyTeamUserArray]);

  const handleAddTeamFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userHasAccessToAddTeamManagement){
      if (
        AddTeamFormData.name !== "" ||
        AddTeamFormData.description !== ""
      ) {
        const addTeamPostData = {
          company_id: loginStatus.companyId,
          name: AddTeamFormData.name,
          description: AddTeamFormData.description,
          company_user_array: addCompanyTeamUserArray,
          createdby: loginStatus.id,
        };

        try {
          const response = await axios.post(POST_API.CREATE_COMPANY_TEAM, addTeamPostData, {
            withCredentials: true,
          });

          if (response.data.status && response.status === STATUS_CODE.OK) {
            showMessageSnackbar({
              message: response.data.message,
              type: "success",
            });
            handleCompanyTeamChangeOnAdd();
            setTimeout(() => {
              onClose();
            }, NUMBER_VALUES.SNACKBAR_DURATION);
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: ApiError | any) {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunctionWithEvent: handleAddTeamFormSubmit,
            });
            if (refreshTokenResponse) {
              setIsDialogueOpen(false);
            } else {
              setIsDialogueOpen(true);
            }
          } else if (error.status === STATUS_CODE.FORBIDDEN) {
            setIsDialogueOpen(true);
          }
        }
      } else {
        showMessageSnackbar({
          message: MESSAGE.ERROR.REQUIRED_FIELDS,
          type: "error",
        });
      }
    } else {
      showMessageSnackbar({
        message: MESSAGE.ERROR.NOT_ATHORISED,
        type: "error",
      });
    }
  };

  const fetchCompanyUsers = async () => {
    if (!userHasAccessToViewUser || isLoading || !hasMore || fetchingRef.current) return;
     
    try {
      fetchingRef.current = true;
      setIsLoading(true);

      // Save current scroll position before fetching
      if (gridApiRef.current) {
        const rowIndex = gridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          lastScrollPositionRef.current = rowIndex ;
        }
      }

      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: 25,
        offset: companyUsers.length,
        search_company_specific_date_range_id: 0,
        search_parameter: "",
        search_parameter_date: "",
      };

      const response = await axios.post(POST_API.GET_COMPANY_USERS, getCompanyUserPostData, {
        withCredentials: true,
      });

      if (response.data) {
        const newUsers = response.data;
        if (newUsers.length === 0) {
          setHasMore(false);
          return;
        }

        setCompanyUsers(prev => {
          const uniqueUsers = [...prev, ...newUsers].filter((user, index, self) =>
            index === self.findIndex(t => t.id === user.id)
          );
          return uniqueUsers;
        });

        // Restore scroll position after data update
        if (gridApiRef.current && lastScrollPositionRef.current > 0) {
          setTimeout(() => {
              if(gridApiRef.current){
                  gridApiRef.current.ensureIndexVisible(lastScrollPositionRef.current-11);
                  //gridApiRef.current.setFirstDisplayedRow(lastScrollPositionRef.current); Removed this line.
              }
          }, 150);
      }


        if (newUsers[0]?.count && companyUsers.length + newUsers.length >= newUsers[0].count) {
          setHasMore(false);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      console.error(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: fetchCompanyUsers,
        });
        if (!refreshTokenResponse) {
          setIsDialogueOpen(true);
        }
        else{
          setIsDialogueOpen(false);
          fetchCompanyUsers();
        }
      }
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleViewPortChanged = (params: ViewportChangedEvent) => {
    if (!companyUsers.length || !hasMore) return;

    // Store the grid API reference
    if (!gridApiRef.current && params.api) {
      gridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount = companyUsers[0]?.count;
    
    if (totalRowCount && lastVisibleRow >= companyUsers.length - 5) {
      fetchCompanyUsers();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIntialAddTeamFormData({
        name: "",
        description: "",
      });
      setErrors({
        name: "",
        description: "",
      });
      setAddCompanyTeamUserArray([]);
      setCompanyUsers([]);
      setHasMore(true);
      fetchingRef.current = false;
      gridApiRef.current = null;
      lastScrollPositionRef.current = 0;
    } else if (isOpen && companyUsers.length === 0) {
      fetchCompanyUsers();
    }
  }, [isOpen]);

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
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Network className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Product
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            <form className="space-y-8" onSubmit={handleAddTeamFormSubmit}>
              <FormInput
                label="Team Name : "
                type="text"
                name="name"
                value={AddTeamFormData.name}
                placeholder="Product Name"
                onBlur={handleBlur}
                error={errors.name}
                onChange={handleAddTeamFormDataChange}
              />

              <TextAreaInput
                label="Description : "
                name="description"
                placeholder="Product Description"
                value={AddTeamFormData.description}
                cols={5}
                rows={3}
                maxLength={256}
                onBlur={handleBlur}
                error={errors.description}
                onChange={handleAddTeamFormDataChange}
              />
              <div
                className="ag-theme-alpine"
                style={{ height: "350px", width: "100%", marginBottom: "60px" }}
              >
                <div className="flex gap-2 mb-2 justify-between">
                  <div className="place-content-center">
                    <span className="text-lg font-semibold text-gray-700">
                      Company Members
                    </span>
                  </div>
                  <div>
                    <SearchInput />
                  </div>
                </div>
                <AddCompanyTeamUsersAgGrid
                  companyUsers={companyUsers}
                  handleViewPortChanged={handleViewPortChanged}
                  onGridReady = {onGridReady}
                  handleCompanyUserCheckBoxChange={handleCompanyUserCheckBoxChange}
                  addCompanyTeamUserArray={addCompanyTeamUserArray}
                />
              </div>

              {userHasAccessToAddTeamManagement ? (
                <div className="flex justify-self-center max-w-60 mt-16 pb-14">
                  <Button type="submit">Create Team</Button>
                </div>
              ) : (
                <div className="flex justify-self-end max-w-36 m-3">
                  <Button type="submit" onClick={() => {}} disabled>
                    Create Team
                  </Button>
                </div>
              )}
            </form>
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

export default AddTeamModal;