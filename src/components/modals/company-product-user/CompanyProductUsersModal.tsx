/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditIcon } from "lucide-react";
import { STATUS_CODE } from "../../../constants/AppConstants";
import useScreenSize from "../../../config/hooks/useScreenSize";
import CompanyTeamUsersAgGrid from "../../ag-grid/CompanyTeamUsersAgGrid";
import CompanyProductUsersModalProps from "../../../@types/modal/CompanyProductUsersModalProps";
import CompanyProductUser from "../../../@types/product-users-management/CompanyProductUser";
import React, { useEffect, useRef, useState } from "react";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import axios from "axios";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";
import MESSAGE from "../../../constants/Messages";
function CompanyProductUsersModal({
  isOpen,
  onClose,
  companyProduct,
}: CompanyProductUsersModalProps) {
  const { isSmallScreen } = useScreenSize();
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToAddProductUsers, userHasAccessToViewProductTeam } =
    useUserAccessModules();

  const [companyProductUsersList, setCompanyProductUsersList] = useState<
    CompanyProductUser[]
  >([]);

  const [isDataLoadingForCompanyProductUser, setIsDataLoadingForCompanyProductUser] = useState<boolean>(false);
  const [
    isCompanyProductUsersFetchedForFirstTime,
    setIsCompanyProductUsersFetchedForFirstTime,
  ] = useState<boolean>(true);
  const [companyProductUserUpdateCount, setCompanyProductUserUpdateCount] =
    useState<number>(0);

  const [addCompanyProductUserArray, setAddCompanyProductUserArray] = useState<
    number[]
  >([]);
  const [
    isCompanyProductUsersFetchedCount,
    setIsCompanyProductUsersFetchedCount,
  ] = useState<number>(0);

  const [isCompanyProductUsersLoading, setIsCompanyProductUsersLoading] =
    useState<boolean>(false);
  const [companyProductUserHasMore, setCompanyProductUserHasMore] =
    useState<boolean>(true);
  const companyProductUsersFetchingRef = useRef<boolean>(false);
  const companyProductUsersGridApiRef = useRef<GridApi | null>(null);
  const companyProductUsersLastScrollPositionRef = useRef<number>(0);
  const companyProductUsersSearchParameterRef = useRef<string>("");

  const [isCompanyProductUsersAddCompleted,setIsCompanyProductUsersAddCompleted] = useState<boolean>(false);

  const companyProductUserOnGridReady = (params: { api: GridApi }) => {
    companyProductUsersGridApiRef.current = params.api;
  };

  const handleCompanyProductUserUpdateChange = () => {
    setCompanyProductUserUpdateCount(companyProductUserUpdateCount + 1);
  };

  const [
    isCompanyProductUserNotAssignedReadyToFetch,
    setIsCompanyUserNotAssignedReadyToFetch,
  ] = useState<boolean>(false);

  const handleCompanyProductUserCheckBoxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // alert("added " + params.id)
      setAddCompanyProductUserArray((prev) => [...prev, params.id]);
    } else if (!event.target.checked) {
      // alert("removed " + params.id)
      setAddCompanyProductUserArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
    }
  };
  const handleAddCompanyProductUsers = async (event : React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (userHasAccessToAddProductUsers) {
      const createCompanyProductUserPostData = {
        company_id: loginStatus.companyId,
        company_product_id: companyProduct!.id,
        company_user_array: addCompanyProductUserArray,
        createdby: loginStatus.id,
      };
      axios
        .post(
          POST_API.CREATE_COMPANY_PRODUCT_USERS,
          createCompanyProductUserPostData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.status) {
            setIsCompanyProductUsersAddCompleted(true);
            handleCompanyProductUserUpdateChange();
            setCompanyProductUsersList([]);
            setIsCompanyProductUsersLoading(false);
            setCompanyProductUserHasMore(true);
            companyProductUsersFetchingRef.current = false;
            companyProductUsersGridApiRef.current = null;
            companyProductUsersLastScrollPositionRef.current = 0;
            setIsCompanyProductUsersFetchedCount(0);
            
            toast.success(response.data.message)
          }else{
            toast.error(response.data.message)
          }
          setAddCompanyProductUserArray([]);
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunctionWithEvent: handleAddCompanyProductUsers,
            });
            if (refreshTokenResponse) {
              handleAddCompanyProductUsers(event);
            }
          }
        });
    }else{
      toast.error(MESSAGE.MODULE_ACCESS.PRODUCT_USERS.DENIED_ADD_ACCESS)
    }
  };

  const fetchCompanyProductUsers = async (
    companyProductUsersSearchParameter: string
  ) => {
    if (
      !userHasAccessToViewProductTeam ||
      isCompanyProductUsersLoading ||
      (!companyProductUserHasMore &&
        companyProductUsersSearchParameter.length === 0) ||
      companyProductUsersFetchingRef.current
    )
      return;

    try {
      companyProductUsersSearchParameterRef.current =
        companyProductUsersSearchParameter;
      companyProductUsersFetchingRef.current = true;
      setIsCompanyProductUsersLoading(true);

      // Save current scroll position before fetching
      if (companyProductUsersGridApiRef.current) {
        const rowIndex =
          companyProductUsersGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyProductUsersLastScrollPositionRef.current = rowIndex;
        }
      }
      setIsDataLoadingForCompanyProductUser(true)
      const getCompanyProductUsersPostData = {
        company_id: loginStatus.companyId,
        company_product_id: companyProduct!.id,
        company_user_id: 0,
        search_company_specific_date_range_id: 0,
        search_parameter: companyProductUsersSearchParameter,
        search_parameter_date: "",
        offset:
          companyProductUsersSearchParameter.length > 0
            ? 0
            : 40 * isCompanyProductUsersFetchedCount,
        limit: companyProductUsersSearchParameter.length > 0 ? 0 : 40,
        requestedby: loginStatus.id,
        isactive: null,
      };
      const response = await axios.post(
        POST_API.GET_COMPANY_PRODUCT_USERS,
        getCompanyProductUsersPostData,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.status === STATUS_CODE.OK) {
        const newCompanyProductUsers = response.data;
        if (isCompanyProductUsersFetchedForFirstTime) {
          setIsCompanyUserNotAssignedReadyToFetch(true);
        }
        if (companyProductUsersSearchParameter.length === 0) {
          setIsCompanyProductUsersFetchedCount(
            isCompanyProductUsersFetchedCount + 1
          );
        }
        setIsCompanyProductUsersFetchedForFirstTime(false);
        setIsCompanyProductUsersAddCompleted(false);

        if (newCompanyProductUsers.length === 0) 
          {
          setCompanyProductUserHasMore(false);
          return;
        }
        if(companyProductUsersSearchParameter.length === 0 ){
          newCompanyProductUsers.map((res: any) => {
            setCompanyProductUsersList((prev) => [
              ...prev,
              {
                count: res.count,
                productCode: res["Product Code"],
                productName: res["Product Name"],
                userName: res["User Name"],
                companyProductId: res.company_product_id,
                companyUserId: res.company_user_id,
                createdBy: res.createdby,
                createdOn: res.createdon,
                id: res.id,
                isActive: res.isactive,
              },
            ]);
          });
        }
        else if(companyProductUsersSearchParameter.length > 0){
         const transformedData : CompanyProductUser[]=  newCompanyProductUsers.map(
          (res: any) =>({
            count: res.count,
            productCode: res["Product Code"],
            productName: res["Product Name"],
            userName: res["User Name"],
            companyProductId: res.company_product_id,
            companyUserId: res.company_user_id,
            createdBy: res.createdby,
            createdOn: res.createdon,
            id: res.id,
            isActive: res.isactive,
          }));

          setCompanyProductUsersList(transformedData);
        }
        
        if (
          companyProductUsersGridApiRef.current &&
          companyProductUsersLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyProductUsersGridApiRef.current) {
              companyProductUsersGridApiRef.current.ensureIndexVisible(
                companyProductUsersLastScrollPositionRef.current - 11
              );
            }
          }, 150);
        }

        if (
          newCompanyProductUsers[0]?.count &&
          companyProductUsersList.length + newCompanyProductUsers.length >=
            newCompanyProductUsers[0].count
        ) {
          setCompanyProductUserHasMore(false);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyProductUsers,
        });
 

        if (refreshTokenResponse) {
          companyProductUsersFetchingRef.current = false;
          fetchCompanyProductUsers(companyProductUsersSearchParameter);
        }
      }
    } finally {
      if (companyProductUsersSearchParameter.length > 0) {
        setCompanyProductUserHasMore(true);
        setIsCompanyProductUsersLoading(false);
        companyProductUsersFetchingRef.current = false;
        if (companyProductUsersSearchParameterRef.current.length === 1) {
          companyProductUsersGridApiRef.current = null;
          companyProductUsersLastScrollPositionRef.current = 0;
          setIsCompanyProductUsersFetchedCount(0);
        }
      } else if (companyProductUsersSearchParameter.length === 0) {

        setIsCompanyProductUsersLoading(false);
        companyProductUsersFetchingRef.current = false;
      }
      setIsDataLoadingForCompanyProductUser(false)
    }
  };

  const handleCompanyProductUserViewPortChange = (
    params: ViewportChangedEvent
  ) => {
    if (!companyProductUsersList.length || !companyProductUserHasMore) return;

    if (!companyProductUsersGridApiRef.current && params.api) {
      companyProductUsersGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount =
      companyProductUsersList[companyProductUsersList.length - 1]?.count;

    if (
      totalRowCount &&
      lastVisibleRow >= companyProductUsersList.length - 5 &&
      companyProductUsersSearchParameterRef.current.length === 0
    ) {
      fetchCompanyProductUsers("");
    }
  };

  const handleCompanyProductUsersSearchParameterChange = (
    searchValue: string
  ) => {
    if(searchValue.length > 0){
      setCompanyProductUsersList([]);
      setIsCompanyProductUsersLoading(false);
      setIsCompanyProductUsersFetchedCount(0);
      setCompanyProductUserHasMore(true);
      companyProductUsersFetchingRef.current = false;
      companyProductUsersGridApiRef.current = null;
      companyProductUsersLastScrollPositionRef.current = 0;
      fetchCompanyProductUsers(searchValue);
    }
    else if(searchValue.length === 0){
      setCompanyProductUsersList([]);
      setIsCompanyProductUsersLoading(false);
      setIsCompanyProductUsersFetchedCount(0);
      setCompanyProductUserHasMore(true);
      companyProductUsersFetchingRef.current = false;
      companyProductUsersGridApiRef.current = null;
      companyProductUsersLastScrollPositionRef.current = 0;
      fetchCompanyProductUsers("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCompanyProductUsers("");
    } else if (!isOpen) {
      setCompanyProductUsersList([]);
      setIsCompanyProductUsersLoading(false);
      setIsCompanyProductUsersFetchedCount(0);
      setCompanyProductUserHasMore(true);
      companyProductUsersFetchingRef.current = false;
      companyProductUsersGridApiRef.current = null;
      companyProductUsersLastScrollPositionRef.current = 0;
      setIsCompanyProductUsersFetchedForFirstTime(true);
      setIsCompanyProductUsersAddCompleted(false);
    }
  }, [isOpen, companyProductUserUpdateCount]);

  if (!isOpen) return null;
  return createPortal(
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-5"
          : "fixed inset-0 z-50 justify-content-center pl-28 p-9  overflow-hidden bg-black bg-opacity-5"
      }
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="relative w-full max-w-6xl min-w-full max-h-[95vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-3">
            {/* <div className="flex items-center gap-2  border-b sticky bg-white ">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY} />
              <h2 className="text-lg font-semibold text-gray-800">
                Edit product {companyProduct.name} Users
              </h2>
              <button
                onClick={() => {
                  onClose();
                }}
                className="absolute right-1 top-2 text-gray-500 hover:text-gray-700"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div> */}
            <FormHeader
            icon={EditIcon}
            onClose={onClose}
            description="Manage the users assigned to product"
            preText="Edit product users of"
            userName={companyProduct.name}
            />
            {/*Aggrid logic here */}
            <CompanyTeamUsersAgGrid
              companyProduct={companyProduct}
              isOpen={isOpen}
              isGridForProductUser={true}
              addCompanyTeamAndProductUserArray={addCompanyProductUserArray}
              handleAddCompanyTeamUsers={handleAddCompanyProductUsers}
              handleCompanyUserCheckBoxChange={
                handleCompanyProductUserCheckBoxChange
              }
              handleViewPortChanged={handleCompanyProductUserViewPortChange}
              onGridReady={companyProductUserOnGridReady}
              isCompanyUserNotAssignedReadyToFetch={
                isCompanyProductUserNotAssignedReadyToFetch
              }
              companyProductUsersList={companyProductUsersList}
              handleSearchParameterChange={
                handleCompanyProductUsersSearchParameterChange
              }
              isAddUsersCompleted={isCompanyProductUsersAddCompleted}
              usersUpdateCount={companyProductUserUpdateCount}
              isDataLoadingForCompanyProductUser={isDataLoadingForCompanyProductUser}
            ></CompanyTeamUsersAgGrid>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CompanyProductUsersModal;
