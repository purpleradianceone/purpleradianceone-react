/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Network, Save, Text, Users, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import {
  NUMBER_VALUES,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import TextAreaInput from "../../ui/TextAreaInput";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import Button from "../../ui/Button";
import { useEffect, useState, useRef } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import AddTeamFormDataState from "../../../@types/team-management/AddTeamFormDataState";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import RefreshToken from "../../../config/validations/RefreshToken";

import MESSAGE from "../../../constants/Messages";
import SearchInput from "../../ui/SearchInput";
import AddCompanyTeamUsersAgGrid from "../../ag-grid/AddCompanyTeamUsersAgGrid";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import AddTeamModalProps from "../../../@types/modal/AddTeamModalProps";
import ApiError from "../../../@types/error/ApiError";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";

function AddTeamModal({
  isOpen,
  onClose,
  handleCompanyTeamChangeOnAdd,
}: AddTeamModalProps) {
  const { userHasAccessToAddTeamManagement, userHasAccessToViewUser } =
    useUserAccessModules();
  const { isSmallScreen } = useScreenSize();

  const [intialAddTeamFormData, setIntialAddTeamFormData] =
    useState<AddTeamFormDataState>({
      name: "",
      description: "",
    });

  const { loginStatus } = useLoggedInUserContext();
  const {
    formData: AddTeamFormData,
    handleChange: handleAddTeamFormDataChange,
    setFormData: setAddTeamFormData,
  } = useFormChange(intialAddTeamFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    AddTeamFormData,
    "registration"
  );

  const [addCompanyTeamUserArray, setAddCompanyTeamUserArray] = useState<
    number[]
  >([]);
  const [companyUsers, setCompanyUsers] = useState<CompanyUsersSearchProps[]>(
    []
  );
  const [isCompanyUsersLoading, setIsCompanyUsersLoading] = useState(false);
  const [companyUsersHasMore, setCompanyUsersHasMore] = useState(true);
  const [isCompanyUsersFetchedCount, setIsCompanyUsersFetchedCount] =
    useState<number>(0);
  const companyUsersFetchingRef = useRef(false);
  const companyUsersGridApiRef = useRef<GridApi | null>(null);
  const companyUsersLastScrollPositionRef = useRef<number>(0);
  const companyUserSearchParameterRef = useRef<string>("");

  const onGridReady = (params: { api: GridApi }) => {
    companyUsersGridApiRef.current = params.api;
  };

  const handleCompanyUserCheckBoxChange = (params : CompanyUsersSearchProps ,event :React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked){
      
      setAddCompanyTeamUserArray((prev) => [...prev, params.id]);
    } else {
      setAddCompanyTeamUserArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
    }
  };

  const handleAddTeamFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (userHasAccessToAddTeamManagement) {
      if (AddTeamFormData.name !== "" || AddTeamFormData.description !== "") {
        const addTeamPostData = {
          company_id: loginStatus.companyId,
          name: AddTeamFormData.name,
          description: AddTeamFormData.description,
          company_user_array: addCompanyTeamUserArray,
          createdbyid: loginStatus.id,
        };

        try {
          const response = await axios.post(
            POST_API.CREATE_COMPANY_TEAM,
            addTeamPostData,
            {
              withCredentials: true,
            }
          );

          if (response.data.status && response.status === STATUS_CODE.OK) {
            toast.success(response.data.message)
            handleCompanyTeamChangeOnAdd();
            setTimeout(() => {
              onClose();
            }, NUMBER_VALUES.SNACKBAR_DURATION);
          }
          else if(!response.data.status){
            toast.error(response.data.message)
          }
        } catch (error: ApiError | any) {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunctionWithEvent: handleAddTeamFormSubmit,
            });
            if (refreshTokenResponse) {
              handleAddTeamFormSubmit(event);
            }
          } else {
            toast.error(error.response.data);
          }
        }
      } else {
        toast.error(MESSAGE.ERROR.REQUIRED_FIELDS)
      }
    } else {
      toast.error( MESSAGE.ERROR.NOT_ATHORISED)
    }
  };

  const fetchCompanyUsers = async (companyUsersSearchParameter: string) => {
    if (
      !userHasAccessToViewUser ||
      isCompanyUsersLoading ||
      (!companyUsersHasMore && companyUsersSearchParameter.length === 0) ||
      companyUsersFetchingRef.current
    )
      return;

    try {
      if (companyUsersSearchParameter.length > 0) {
        setCompanyUsers([]);
      }
      companyUserSearchParameterRef.current = companyUsersSearchParameter;
      companyUsersFetchingRef.current = true;
      setIsCompanyUsersLoading(true);

      // Save current scroll position before fetching
      if (companyUsersGridApiRef.current) {
        const rowIndex =
          companyUsersGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyUsersLastScrollPositionRef.current = rowIndex;
        }
      }

      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: companyUsersSearchParameter.length > 0 ? 0 : 50,
        offset:
          companyUsersSearchParameter.length > 0
            ? 0
            : 50 * isCompanyUsersFetchedCount,
        isactive: true,
        search_company_specific_date_range_id: 0,
        search_parameter: companyUsersSearchParameter,
        search_parameter_date: "",
      };

      const response = await axios.post(
        POST_API.GET_COMPANY_USERS,
        getCompanyUserPostData,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        const newUsers = response.data;
        if (newUsers.length === 0) {
          setCompanyUsersHasMore(false);
          return;
        }

        if (companyUsersSearchParameter.length === 0) {
          newUsers.map((user: any) => {
            setCompanyUsers((prev) => [...prev, user]);
          });
          setIsCompanyUsersFetchedCount(isCompanyUsersFetchedCount + 1);
        } else if (companyUsersSearchParameter.length > 0) {
          setCompanyUsers(newUsers);
        }

        // Restore scroll position after data update
        if (
          companyUsersGridApiRef.current &&
          companyUsersLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyUsersGridApiRef.current) {
              companyUsersGridApiRef.current.ensureIndexVisible(
                companyUsersLastScrollPositionRef.current - 11
              );
              //companyUsersGridApiRef.current.setFirstDisplayedRow(companyUsersLastScrollPositionRef.current); Removed this line.
            }
          }, 150);
        }

        if (
          newUsers[0]?.count &&
          companyUsers.length + newUsers.length >= newUsers[0].count &&
          companyUsersSearchParameter.length === 0
        ) {
          setCompanyUsersHasMore(false);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyUsers,
        });
        if (refreshTokenResponse) {
          companyUsersFetchingRef.current = false;
          fetchCompanyUsers(companyUsersSearchParameter);
        }
      }
    } finally {
      if (companyUsersSearchParameter.length === 0) {
        setIsCompanyUsersLoading(false);
        companyUsersFetchingRef.current = false;
      } else if (companyUsersSearchParameter.length > 0) {
        setIsCompanyUsersLoading(false);
        companyUsersFetchingRef.current = false;
        setCompanyUsersHasMore(true);
        if (companyUserSearchParameterRef.current.length === 1) {
          companyUsersGridApiRef.current = null;
          companyUsersLastScrollPositionRef.current = 0;
          setIsCompanyUsersFetchedCount(0);
        }
      }
    }
  };

  const handleViewPortChanged = (params: ViewportChangedEvent) => {
    if (!companyUsers.length || !companyUsersHasMore) return;

    // Store the grid API reference
    if (!companyUsersGridApiRef.current && params.api) {
      companyUsersGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount = companyUsers[0]?.count;

    if (
      totalRowCount &&
      lastVisibleRow >= companyUsers.length - 5 &&
      companyUserSearchParameterRef.current.length === 0
    ) {
      fetchCompanyUsers("");
    }
  };

  const handleCompanyUsersSearchBoxChange = (searchValue: string) => {
    if (searchValue.length > 0) {
      setCompanyUsers([]);
      setIsCompanyUsersLoading(false);
      setIsCompanyUsersFetchedCount(0);
      setCompanyUsersHasMore(true);
      companyUsersGridApiRef.current = null;
      companyUsersLastScrollPositionRef.current = 0;
      companyUsersFetchingRef.current = false;
      fetchCompanyUsers(searchValue);
    } else if (searchValue.length === 0) {
      setCompanyUsers([]);
      setIsCompanyUsersLoading(false);
      setIsCompanyUsersFetchedCount(0);
      setCompanyUsersHasMore(true);
      companyUsersGridApiRef.current = null;
      companyUsersLastScrollPositionRef.current = 0;
      companyUsersFetchingRef.current = false;
      fetchCompanyUsers(searchValue);
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
      setCompanyUsersHasMore(true);
      companyUsersFetchingRef.current = false;
      companyUsersGridApiRef.current = null;
      companyUsersLastScrollPositionRef.current = 0;
      companyUserSearchParameterRef.current = "";
      setIsCompanyUsersFetchedCount(0);
      setAddTeamFormData({
        name: "",
        description: "",
      });
      // handleMessageSnackbarClose();
    } else if (isOpen && companyUsers.length === 0) {
      fetchCompanyUsers("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-5"
          : "fixed inset-0 z-50 p-6 overflow-hidden bg-black bg-opacity-5"
      }
    >
      <div className="flex min-h-screen  items-center justify-center">
        <div
          className="relative w-full max-w-6xl max-h-[85vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-4">
            {/* Form header */}
            <FormHeader
              preText="Create new team"
              icon={Network}
              onClose={onClose}
              description="Set up a new team to manage tasks and responsibilities efficiently."
            />

            <form className="space-y-3" onSubmit={handleAddTeamFormSubmit}>

              <FormInput
              logo={Users}
                label="Name : "
                maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                minLength={VALIDATIONS.MIN_NAME_LENGTH}
                type="text"
                name="name"
                required={true}
                value={AddTeamFormData.name}
                placeholder="Enter team name"
                onBlur={handleBlur}
                error={errors.name}
                onChange={handleAddTeamFormDataChange}
              />

              <TextAreaInput
              logo={Text}
                label="Description : "
                name="description"
                placeholder="Enter team description"
                value={AddTeamFormData.description}
                cols={5}
                rows={3}
                maxLength={256}
                onBlur={handleBlur}
                error={errors.description}
                onChange={handleAddTeamFormDataChange}
              />
              <div
                style={{ height: "350px", width: "100%", marginBottom: "60px" }}
              >
                <div className="flex w-full items-center gap-5 mb-1 ">
                  <div className="place-content-center">
                    <div>
                      <span className="table-header-custom">Company Members</span>
                    <div className="caption-custom">Select the company user that needs to be in the team</div>
                    </div>
                  </div>
                  <div className="w-56">
                    <SearchInput
                      onChange={(event) => {
                        handleCompanyUsersSearchBoxChange(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <AddCompanyTeamUsersAgGrid
                  companyUsers={companyUsers}
                  handleViewPortChanged={handleViewPortChanged}
                  onGridReady={onGridReady}
                  handleCompanyUserCheckBoxChange={
                    handleCompanyUserCheckBoxChange
                  }
                  addCompanyTeamUserArray={addCompanyTeamUserArray}
                  isGridForSubscription={false}
                />
              </div>

              {userHasAccessToAddTeamManagement ? (
                <div className="flex justify-self-end  gap-3">
                  <div className="min-w-28">
                    <Button type="button" onClick={()=>{onClose()}}>
                      <div className="flex gap-1 items-center ">
                        <X size={18} />
                        <span>Cancel</span>
                      </div>
                    </Button>
                  </div>
                  <div className="min-w-28">
                    <Button type="submit">
                      <div className="flex gap-1 items-center">
                        <Save size={18} />
                        <span>Save</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-self-end max-w-36 ">
                  <div></div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddTeamModal;
