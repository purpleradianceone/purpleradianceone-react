/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Network, Save, X } from "lucide-react";
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

  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success",
  // });

  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleMessageSnackbarClose = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

  const handleCompanyUserCheckBoxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
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
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "success",
            // });
            toast.success(response.data.message);
            handleCompanyTeamChangeOnAdd();
            setTimeout(() => {
              onClose();
            }, NUMBER_VALUES.SNACKBAR_DURATION);
          } else if (!response.data.status) {
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "error",
            // });
            toast.error(response.data.message);
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
        // showMessageSnackbar({
        //   message: MESSAGE.ERROR.REQUIRED_FIELDS,
        //   type: "error",
        // });
        toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
      }
    } else {
      // showMessageSnackbar({
      //   message: MESSAGE.ERROR.NOT_ATHORISED,
      //   type: "error",
      // });
      toast.error(MESSAGE.ERROR.NOT_ATHORISED);
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
            {/* <div className="flex items-center gap-3 mb-6">
              <Network className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Team
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div> */}

            <FormHeader
              icon={Network}
              onClose={onClose}
              preText="Create New Team"
              description="Create a new team and define its essential details"
            />

            <form className="space-y-8" onSubmit={handleAddTeamFormSubmit}>
              <FormInput
                label="Team Name : "
                maxLength={30}
                type="text"
                name="name"
                required={true}
                value={AddTeamFormData.name}
                placeholder="Team Name"
                onBlur={handleBlur}
                error={errors.name}
                onChange={handleAddTeamFormDataChange}
              />

              <TextAreaInput
                label="Description : "
                name="description"
                placeholder="Team Description"
                value={AddTeamFormData.description}
                cols={5}
                rows={3}
                maxLength={256}
                onBlur={handleBlur}
                error={errors.description}
                onChange={handleAddTeamFormDataChange}
              />
              <div
                // className="ag-theme-balham"
                style={{ height: "350px", width: "100%", marginBottom: "60px" }}
              >
                <div className="flex gap-2 mb-2 justify-between">
                  <div className="place-content-center">
                    <span className="table-header-custom">Company Members</span>
                  </div>
                  <div>
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
                <div className="flex justify-self-end gap-3 mt-16 pb-14">
                  <div className="min-w-28">
                    <Button type="button" onClick={()=>{onClose()}}>
                      <div className="flex gap-1 text-center">
                        <X size={18} />
                        <span>Cancel</span>
                      </div>
                    </Button>
                  </div>
                  <div className="min-w-28">
                    <Button type="submit">
                      <div className="flex gap-1 text-center">
                        <Save size={18} />
                        <span>Save</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-self-end max-w-36 m-3">
                  <div></div>
                </div>
              )}
            </form>
          </div>
        </div>
        {/* <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        /> */}
      </div>
    </div>
  );
}

export default AddTeamModal;
