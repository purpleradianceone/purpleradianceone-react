/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle2, Edit, Save, Text, Users, X, XCircle } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import {
  STATUS_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import { useFormChange } from "../../../config/hooks/useFormChange";
import TextAreaInput from "../../ui/TextAreaInput";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import Button from "../../ui/Button";
import { useEffect, useRef, useState } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import CompanyTeamUsersAgGrid from "../../ag-grid/CompanyTeamUsersAgGrid";
import MESSAGE from "../../../constants/Messages";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import EditCompanyTeamModalProps from "../../../@types/modal/EditCompanyTeamModalProps";
import CompanyTeamUsers from "../../../@types/team-management/CompanyTeamUsers";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";

function EditCompanyTeamModal({
  isOpen,
  onClose,
  companyTeam,
  handleCompanyTeamChangeOnUpdate,
}: EditCompanyTeamModalProps) {
  const {
    userHasAccessToUpdateTeamManagement,
    userHasAccessToViewTeamManagement,
  } = useUserAccessModules();

  const intialUpdateCompanyTeamFormData = {
    name: companyTeam.name,
    description: companyTeam.description,
  };


  const { loginStatus } = useLoggedInUserContext();

  const {
    formData: updateCompanyTeamFormData,
    handleChange: handleUpdateCompanyFormDataChange,
  } = useFormChange(intialUpdateCompanyTeamFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    updateCompanyTeamFormData,
    "registration"
  );

  const [isTeamActive,setIsTeamActive] = useState<boolean>(companyTeam.isActive) 
  const [companyTeamUsersList, setCompanyTeamUsersList] = useState<
    CompanyTeamUsers[]
  >([]);

  const [addCompanyTeamUserArray, setAddCompanyTeamUserArray] = useState<
    number[]
  >([]);

  const [
    isCompanyTeamUsersFetchedForFirstTime,
    setssCompanyTeamUsersFetchedForFirstTime,
  ] = useState<boolean>(true);

  const [isCompanyTeamUsersFetchedCount, setIsCompanyTeamUsersFetchedCount] =
    useState<number>(0);
  const [companyTeamUsersUpdateCount, setCompanyTeamUsersUpdateCount] =
    useState<number>(0);
  const [
    isCompanyUserNotAssignedReadyToFetch,
    setIsCompanyUserNotAssignedReadyToFetch,
  ] = useState<boolean>(false);
  const [isCompanyTeamUsersAddCompleted, setIsCompanyTeamUsersAddCompleted] =
    useState<boolean>(false);

  const [isCompanyTeamUsersLoading, setIsCompanyTeamUsersLoading] =
    useState<boolean>(false);
  const [companyTeamUserHasMore, setCompanyTeamUserHasMore] =
    useState<boolean>(true);
  const companyTeamUsersFetchingRef = useRef<boolean>(false);
  const companyTeamUsersGridApiRef = useRef<GridApi | null>(null);
  const companyTeamUsersLastScrollPositionRef = useRef<number>(0);
  const companyTeamUsersSearchParameterRef = useRef<string>("");

  const handleCompanyTeamUsersSearchParmaterChange = (searchValue: string) => {
    if(searchValue.length > 0){
      setCompanyTeamUsersList([]);
      setCompanyTeamUserHasMore(true);
      setIsCompanyTeamUsersFetchedCount(0);
      setIsCompanyTeamUsersLoading(false);
      companyTeamUsersFetchingRef.current = false;
      companyTeamUsersGridApiRef.current = null;
      companyTeamUsersLastScrollPositionRef.current = 0;
      fetchCompanyTeamUsers(searchValue);
    }
    else if (searchValue.length === 0) {
      setCompanyTeamUsersList([]);
      setCompanyTeamUserHasMore(true);
      setIsCompanyTeamUsersFetchedCount(0);
      setIsCompanyTeamUsersLoading(false);
      companyTeamUsersFetchingRef.current = false;
      companyTeamUsersGridApiRef.current = null;
      companyTeamUsersLastScrollPositionRef.current = 0;
      fetchCompanyTeamUsers("");
    }
  };
  const handleCompanyUserCheckBoxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // alert("added " + params.id)
      setAddCompanyTeamUserArray((prev) => [...prev, params.id]);
    } else if (!event.target.checked) {
      // alert("removed " + params.id)
      setAddCompanyTeamUserArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
    }
  };
  const companyTeamUserOnGridReady = (params: { api: GridApi }) => {
    companyTeamUsersGridApiRef.current = params.api;
  };

  const handleCompanyTeamUsersUpdateChange = () => {
    setCompanyTeamUsersUpdateCount(companyTeamUsersUpdateCount + 1);
  };

  const handleAddCompanyTeamUsers = async () => {
    if (userHasAccessToUpdateTeamManagement) {
      const createCompanyTeamCompanyUser = {
        company_id: loginStatus.companyId,
        company_team_id: companyTeam!.id,
        company_user_array: addCompanyTeamUserArray,
        createdby: loginStatus.id,
      };
      axios
        .post(
          POST_API.CREATE_COMPANY_TEAM_USERS,
          createCompanyTeamCompanyUser,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message);
            setIsCompanyTeamUsersAddCompleted(true);
            handleCompanyTeamUsersUpdateChange();
            setCompanyTeamUsersList([]);
            setCompanyTeamUserHasMore(true);
            setIsCompanyTeamUsersLoading(false);
            companyTeamUsersFetchingRef.current = false;
            companyTeamUsersGridApiRef.current = null;
            companyTeamUsersLastScrollPositionRef.current = 0;
            setIsCompanyTeamUsersFetchedCount(0);
            setAddCompanyTeamUserArray([]);
          }else{
            toast.error(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: handleAddCompanyTeamUsers,
            });
            if (refreshTokenResponse) {
              handleAddCompanyTeamUsers();
            }
          }
        });
    }
  };

  const fetchCompanyTeamUsers = async (
    companyTeamsUserSearchParameter: string
  ) => {
    if (
      !userHasAccessToViewTeamManagement ||
      isCompanyTeamUsersLoading ||
      (!companyTeamUserHasMore &&
        companyTeamsUserSearchParameter.length === 0) ||
      companyTeamUsersFetchingRef.current
    )
      return;
    try {
      companyTeamUsersSearchParameterRef.current =
        companyTeamsUserSearchParameter;
      companyTeamUsersFetchingRef.current = true;
      setIsCompanyTeamUsersLoading(true);

      // Save current scroll position before fetching
      if (companyTeamUsersGridApiRef.current) {
        const rowIndex =
          companyTeamUsersGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyTeamUsersLastScrollPositionRef.current = rowIndex;
        }
      }

      const getCompanyTeamUserPostData = {
        company_id: loginStatus.companyId,
        company_team_id: companyTeam!.id,
        company_user_id: 0,
        // isactive: true,
        search_company_specific_date_range_id: 0,
        search_parameter: companyTeamsUserSearchParameter,
        search_parameter_date: "",
        offset:
          companyTeamsUserSearchParameter.length > 0
            ? 0
            : 40 * isCompanyTeamUsersFetchedCount,
        limit: companyTeamsUserSearchParameter.length > 0 ? 0 : 40,
        requestedby: loginStatus.id,
      };
      const response = await axios.post(
        POST_API.GET_COMPANY_TEAM_USERS,
        getCompanyTeamUserPostData,
        {
          withCredentials: true,
        }
      );
      if (response.data && response.status === STATUS_CODE.OK) {
        const newCompanyTeamUsers = response.data;
        if (isCompanyTeamUsersFetchedForFirstTime) {
          setIsCompanyUserNotAssignedReadyToFetch(true);
        }
        if (companyTeamsUserSearchParameter.length === 0) {
          setIsCompanyTeamUsersFetchedCount(isCompanyTeamUsersFetchedCount + 1);
        }
        setssCompanyTeamUsersFetchedForFirstTime(false);
        setIsCompanyTeamUsersAddCompleted(false);
        if (response.data.length === 0) {
          setCompanyTeamUserHasMore(false);

          return;
        }
        if (companyTeamsUserSearchParameter.length === 0) {
          newCompanyTeamUsers.map((res: any) => {
            setCompanyTeamUsersList((prev) => [
              ...prev,
              {
                count: res.count,
                companyTeamId: res.company_team_id,
                companyUserId: res.company_user_id,
                id: res.id,
                createdBy: res.createdby,
                createdOn: res.createdon,
                teamName: res["Team Name"],
                isActive: res.isactive,
                userName: res["User Name"],
              },
            ]);
          });
        } else if (companyTeamsUserSearchParameter.length > 0) {
          const transformedData: CompanyTeamUsers[] = newCompanyTeamUsers.map(
            (item: any) => ({
              count: item.count,
              id: item.id,
              companyTeamId: item.company_team_id,
              teamName: item["Team Name"],
              companyUserId: item.company_user_id,
              userName: item["User Name"],
              isActive: item.isactive,
              createdBy: item.createdby,
              createdOn: item.createdon,
            })
          );

          setCompanyTeamUsersList(transformedData);
        }

        if (
          companyTeamUsersGridApiRef.current &&
          companyTeamUsersLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyTeamUsersGridApiRef.current) {
              companyTeamUsersGridApiRef.current.ensureIndexVisible(
                companyTeamUsersLastScrollPositionRef.current - 11
              );
            }
          }, 150);
        }
        if (
          newCompanyTeamUsers[0]?.count &&
          companyTeamUsersList.length + response.data.length >=
            newCompanyTeamUsers[0].count
        ) {
          setCompanyTeamUserHasMore(false);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyTeamUsers
        });
        if (refreshTokenResponse) {
          companyTeamUsersFetchingRef.current = false;
          fetchCompanyTeamUsers(companyTeamsUserSearchParameter);
        }
      }
    } finally {
      if (companyTeamsUserSearchParameter.length > 0) {
        setCompanyTeamUserHasMore(true);
        setIsCompanyTeamUsersLoading(false);
        companyTeamUsersFetchingRef.current = false;
        if (companyTeamUsersSearchParameterRef.current.length === 1) {
          companyTeamUsersGridApiRef.current = null;
          companyTeamUsersLastScrollPositionRef.current = 0;
          setIsCompanyTeamUsersFetchedCount(0);
        }
      } else if (companyTeamsUserSearchParameter.length === 0) {
        setIsCompanyTeamUsersLoading(false);
        companyTeamUsersFetchingRef.current = false;
      }
    }
  };

  const handleCompanyTeamUserViewPortChange = (
    params: ViewportChangedEvent
  ) => {
    if (!companyTeamUsersList.length || !companyTeamUserHasMore) return;

    if (!companyTeamUsersGridApiRef.current && params.api) {
      companyTeamUsersGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount =
      companyTeamUsersList[companyTeamUsersList.length - 1]?.count;
    if (
      totalRowCount &&
      lastVisibleRow >= companyTeamUsersList.length - 5 &&
      companyTeamUsersSearchParameterRef.current.length === 0
    ) {
      fetchCompanyTeamUsers("");
    }
  };

  const handleComapnyTeamToggle = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked} = event.target;
    if(userHasAccessToUpdateTeamManagement){
      const updateCompanyTeamPostData = {
          id: companyTeam.id,
          company_id: loginStatus.companyId,
          name: updateCompanyTeamFormData.name,
          description: updateCompanyTeamFormData.description,
          isactive: checked,
          updatedby: loginStatus.id,
        };
        axios
          .post(POST_API.UPDATE_COMPANY_TEAM, updateCompanyTeamPostData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.status) {
              // showMessageSnackbar({
              //   message: response.data.message,
              //   type: "success",
              // });
              toast.success(response.data.message);
              handleCompanyTeamChangeOnUpdate(companyTeam.id);
              setIsTeamActive(checked);
            }else{
              toast.error(response.data.message);
            }
          })
          .catch(async (error: ApiError | any) => {
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenResponse = await RefreshToken({
                callFunctionWithEvent: handleComapnyTeamToggle,
              });
              if (refreshTokenResponse) {
                handleComapnyTeamToggle(event);
              }
            }
          });
    }else{
      toast.error(MESSAGE.ERROR.NOT_ATHORISED)
    }
  }
  const { isSmallScreen } = useScreenSize();


  const handleUpdateCompanyTeam = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (userHasAccessToUpdateTeamManagement) {
      if (
        intialUpdateCompanyTeamFormData.description !==
          updateCompanyTeamFormData.description ||
        intialUpdateCompanyTeamFormData.name !==
          updateCompanyTeamFormData.name
      ) {
        const updateCompanyTeamPostData = {
          id: companyTeam.id,
          company_id: loginStatus.companyId,
          name: updateCompanyTeamFormData.name,
          description: updateCompanyTeamFormData.description,
          isactive: isTeamActive,
          updatedby: loginStatus.id,
        };
        axios
          .post(POST_API.UPDATE_COMPANY_TEAM, updateCompanyTeamPostData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.status) {
              // showMessageSnackbar({
              //   message: response.data.message,
              //   type: "success",
              // });
              toast.success(response.data.message);
              handleCompanyTeamChangeOnUpdate(companyTeam.id);
              setTimeout(() => {
                onClose();
              }, 3000);
            }else{
              toast.error(response.data.message);
            }
          })
          .catch(async (error: ApiError | any) => {
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenResponse = await RefreshToken({
                callFunctionWithEvent: handleUpdateCompanyTeam,
              });
              if (refreshTokenResponse) {
                handleUpdateCompanyTeam(event);
              }
            }
          });
      } else {
        toast.error(MESSAGE.ERROR.NO_CHANGES)
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setErrors({
        name: "",
        description: "",
      });

      setCompanyTeamUsersList([]);
      setAddCompanyTeamUserArray([]);
      setssCompanyTeamUsersFetchedForFirstTime(true);
      setIsCompanyTeamUsersFetchedCount(0);
      setCompanyTeamUsersUpdateCount(0);
      setIsCompanyUserNotAssignedReadyToFetch(false);
      setIsCompanyTeamUsersAddCompleted(false);
      setIsCompanyTeamUsersLoading(false);
      setCompanyTeamUserHasMore(true);
      companyTeamUsersFetchingRef.current = false;
      companyTeamUsersGridApiRef.current = null;
      companyTeamUsersLastScrollPositionRef.current = 0;
    } else if (isOpen) {
      fetchCompanyTeamUsers("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, companyTeamUsersUpdateCount]);

  useEffect(() => {
    setIsTeamActive(companyTeam.isActive);
  },[companyTeam])

  if (!isOpen) return null;
  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-5"
          : "fixed inset-0 z-50 p-7 overflow-hidden bg-black bg-opacity-5"
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
            {/* <div className="flex items-center gap-3 mb-6">
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
            </div> */}
            <FormHeader
            icon={Edit}
            onClose={onClose}
            preText="Edit team  - "
            userName={companyTeam.name}
            description="Modify the details of an existing company team."
            />

            <form className="space-y-2" onSubmit={handleUpdateCompanyTeam}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-stretch">
                <FormInput
                logo={Users}
                  label="Team Name : "
                  type="text"
                  name="name"
                  defaultValue={intialUpdateCompanyTeamFormData.name}
                  placeholder="Team Name"
                  onBlur={handleBlur}
                  // required={true}
                  error={errors.name}
                  onChange={handleUpdateCompanyFormDataChange}
                />

                {/* <RadioButtons
                  label="IsActive : "
                  onChange={handleUpdateCompanyFormDataChange}
                  options={CompanyTeamIsActiveRadioButtonOptions}
                /> */}
                 <div className="flex items-center mt-6 gap-4 justify-start">
                  <label
                    htmlFor="isActive"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {isTeamActive ? (
                      <div>
                        <CheckCircle2 className=" text-green-500 w-4 h-4 inline-block" />{" "}
                        <span className="input-label-custom">Active</span>
                      </div>
                    ) : (
                      <div>
                        <XCircle className="text-gray-300 w-4 h-4 inline-block" />{" "}
                        <span className="input-label-custom">Inactive</span>
                      </div>
                    )}
                  </label>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isTeamActive}
                      id="isActive"
                      name="isActive"
                      onChange={handleComapnyTeamToggle}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
                  </label>
                </div>
              </div>

              <TextAreaInput
              logo={Text}
                label="Description : "
                name="description"
                placeholder="Team Description"
                defaultValue={intialUpdateCompanyTeamFormData.description}
                cols={5}
                rows={3}
                maxLength={256}
                required={true}
               
                onChange={handleUpdateCompanyFormDataChange}
              />

              {userHasAccessToUpdateTeamManagement ? (
                <div className="flex justify-self-end m-2 min-w-70 gap-2">
                <Button onClick={onClose}>
                  <div className="flex items-center justify-center gap-0.5">
                    <X size={16} />
                    Cancel
                  </div>
                </Button>
                <Button type="submit">
                  <div className="flex items-center justify-center gap-1">
                    <Save size={16} />
                    Save
                  </div>
                </Button>
              </div>
              ) : (
                <div className="flex justify-self-end max-w-36 m-3">
                  <Button type="submit" onClick={() => {}} disabled>
                    Save
                  </Button>
                </div>
              )}
            </form>
            <CompanyTeamUsersAgGrid
              companyTeam={companyTeam}
              isOpen={isOpen}
              isGridForProductUser={false}
              companyTeamUsersList={companyTeamUsersList}
              handleAddCompanyTeamUsers={handleAddCompanyTeamUsers}
              handleViewPortChanged={handleCompanyTeamUserViewPortChange}
              onGridReady={companyTeamUserOnGridReady}
              handleCompanyUserCheckBoxChange={handleCompanyUserCheckBoxChange}
              isCompanyUserNotAssignedReadyToFetch={
                isCompanyUserNotAssignedReadyToFetch
              }
              addCompanyTeamAndProductUserArray={addCompanyTeamUserArray}
              handleSearchParameterChange={
                handleCompanyTeamUsersSearchParmaterChange
              }
              isAddUsersCompleted={isCompanyTeamUsersAddCompleted}
              usersUpdateCount={companyTeamUsersUpdateCount}
            ></CompanyTeamUsersAgGrid>
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
export default EditCompanyTeamModal;
