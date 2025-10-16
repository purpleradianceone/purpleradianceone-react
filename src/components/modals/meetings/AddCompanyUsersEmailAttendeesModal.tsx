/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserPlus } from "lucide-react";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { STATUS_CODE } from "../../../constants/AppConstants";
import AddCompanyTeamUsersAgGrid from "../../ag-grid/AddCompanyTeamUsersAgGrid";
import { useEffect, useRef, useState } from "react";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import { createPortal } from "react-dom";
import SearchInput from "../../ui/SearchInput";
import RefreshToken from "../../../config/validations/RefreshToken";
import FormHeader from "../../ui/FormHeader";


function AddCompanyUsersEmailAttendeesModal({
    isOpen,
    onClose,
    handleAddCompanyUserEmailCheckboxChange,
    addCompanyTeamUserArray,
    isModalForMeeting
} : {
    isOpen: boolean;
    onClose: () => void;
    handleAddCompanyUserEmailCheckboxChange?: (params: CompanyUsersSearchProps, event: React.ChangeEvent<HTMLInputElement>) => void;
    addCompanyTeamUserArray?: number[]; 
    isModalForMeeting : boolean;
}){
    
    const {loginStatus} = useLoggedInUserContext();

    const [companyUsersList, setCompanyUsersList] = useState<
    CompanyUsersSearchProps[]
  >([]);

    const [
        isCompanyUsersSearchParameterCleared,
        setIsCompanyUsersSearchParameterCleared,
      ] = useState<boolean>(true);
      const [companyUsersHasMore, setCompanyUsersHasMore] = useState<boolean>(true);
      const [isCompanyUsersLoading, setIsCompanyUsersLoading] =
        useState<boolean>(false);
      const companyUsersFetchingRef = useRef<boolean>(false);
      const [companyUsersFetchedCount, setCompanyUsersFetchedCount] =
      useState<number>(0);
    
      const companyUsersGridApiRef = useRef<GridApi | null>(null);
      const companyUserLastScrollPositionRef = useRef<number>(0);
    
      const companyUserSearchParameterRef = useRef<string>("");

    const fetchCompanyUsers = async (comapnyUserSearchParameter: string) => {
   
        if (isCompanyUsersLoading ||(!companyUsersHasMore && comapnyUserSearchParameter.length === 0) ||
          companyUsersFetchingRef.current
        )
          return;
    
        try {
          companyUserSearchParameterRef.current = comapnyUserSearchParameter;
          setIsCompanyUsersLoading(true);
          companyUsersFetchingRef.current = true;
    
          if (companyUsersGridApiRef.current) {
            const rowIndex =
              companyUsersGridApiRef.current.getLastDisplayedRowIndex();
            if (rowIndex !== null) {
              companyUserLastScrollPositionRef.current = rowIndex;
            }
          }
    
          const getCompanyUserPostData = {
            company_id: loginStatus.companyId,
            requestedby: loginStatus.id,
            limit: comapnyUserSearchParameter.length > 0 ? 0 : 50,
            offset:
              comapnyUserSearchParameter.length > 0
                ? 0
                : 50 * companyUsersFetchedCount,
            search_company_specific_date_range_id: 0,
            isactive : true,
            search_parameter: comapnyUserSearchParameter,
            search_parameter_date: "",
          };
    
          // alert("called from here ");
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
            if (comapnyUserSearchParameter.length === 0) {
              setCompanyUsersFetchedCount(companyUsersFetchedCount + 1);
            }
            newUsers.map((user: any) => {
              setCompanyUsersList((prev) => [
                ...prev,
                {
                  company_id: user.company_id,
                  createdby: user.createdby,
                  createdon: user.createdon,
                  email: user.email,
                  fullname: user.fullname,
                  isactive: user.isactive,
                  id: user.id,
                  mobilenumber: user.mobilenumber,
                  password: user.password,
                  updatedby: user.upadtedby,
                  updatedon: user.updatedon,
                  count: user.count,
                },
              ]);
            });
    
            if (
              companyUsersGridApiRef.current &&
              companyUserLastScrollPositionRef.current > 0
            ) {
              setTimeout(() => {
                if (companyUsersGridApiRef.current) {
                  companyUsersGridApiRef.current.ensureIndexVisible(
                    companyUserLastScrollPositionRef.current - 11
                  );
                }
              }, 150);
            }
    
            if (
              newUsers[0]?.count &&
              companyUsersList.length + newUsers.length >= newUsers[0].count &&
              !isCompanyUsersSearchParameterCleared
            ) {
              setCompanyUsersHasMore(false);
            }
          }
        } catch (error: ApiError | any) {
         if(error.status === STATUS_CODE.UNATHORISED){
          const refreshTokenResponse = await RefreshToken({callFunctionWithParamsNotEvent : fetchCompanyUsers});
          if(refreshTokenResponse){
            companyUsersFetchingRef.current=false;
            fetchCompanyUsers(comapnyUserSearchParameter);
          }
         }
        } finally {
          if (comapnyUserSearchParameter.length > 0) {
            setIsCompanyUsersLoading(false);
            companyUsersFetchingRef.current = false;
            setCompanyUsersHasMore(true);
            if (companyUserSearchParameterRef.current.length === 1) {
              setCompanyUsersFetchedCount(0);
              companyUsersGridApiRef.current = null;
              companyUserLastScrollPositionRef.current = 0;
            }
          } else if (comapnyUserSearchParameter.length === 0) {
            setIsCompanyUsersLoading(false);
            companyUsersFetchingRef.current = false;
          }
        }
      };
    
      const onCompanyUserGridReady = (params: { api: GridApi }) => {
        companyUsersGridApiRef.current = params.api;
      };
    
      const handleCompanyUserViewPortChange = (params: ViewportChangedEvent) => {
        if (!companyUsersHasMore && !companyUsersList.length) return;
    
        if (!companyUsersGridApiRef.current && params.api) {
          companyUsersGridApiRef.current = params.api;
        }
    
        const lastVisibleRow = params.lastRow;
        const totalRowCount = companyUsersList[0]?.count;
    
        if (
          totalRowCount &&
          lastVisibleRow >= companyUsersList.length - 5 &&
          companyUserSearchParameterRef.current.length === 0
        ) {
          fetchCompanyUsers("");
        }
      };

      const handleSearchParameterChange = (searchValue: string) => {
        if (searchValue.length > 0) {
          setCompanyUsersList([]);
          setIsCompanyUsersSearchParameterCleared(false);
          setCompanyUsersHasMore(true);
    
          companyUsersGridApiRef.current = null;
          companyUserLastScrollPositionRef.current = 0;
          companyUsersFetchingRef.current = false;
          setCompanyUsersFetchedCount(0);
          fetchCompanyUsers(searchValue);
        } else if (searchValue.length === 0) {
          setCompanyUsersList([]);
          setIsCompanyUsersSearchParameterCleared(true);
          setCompanyUsersHasMore(true);
          setIsCompanyUsersLoading(false);
          companyUsersGridApiRef.current = null;
          companyUserLastScrollPositionRef.current = 0;
          companyUsersFetchingRef.current = false;
          setCompanyUsersFetchedCount(0);
          fetchCompanyUsers("");
        }
      };

      useEffect(() => {
          if (isOpen) {
            fetchCompanyUsers("");
          } else if (!isOpen) {
            setCompanyUsersList([]);
            setCompanyUsersFetchedCount(0);
            setIsCompanyUsersSearchParameterCleared(true);
            setCompanyUsersHasMore(true);
            setIsCompanyUsersLoading(false);
            companyUsersFetchingRef.current = false;
            companyUsersGridApiRef.current = null;
            companyUserLastScrollPositionRef.current = 0;
            companyUserSearchParameterRef.current = "";
          }
        }, [isOpen]);

    if(!isOpen) return null;
    return(
        createPortal(<div className={"fixed inset-0 z-50 p-16 overflow-hidden bg-black bg-opacity-45"}>
            <div className="flex min-h-screen items-center justify-center">
              <div className="relative w-full max-w-5xl max-h-[100vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:bg-gray-400
         [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
    <div className="p-6">
                {/* <div className="flex items-center gap-3 mb-6 sticky bg-white z-10 py-2">
                  <UserPlus className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {isModalForMeeting ? "Add Users To Meeting" : "Assign Users" }
                  </h2>
                  <button
                onClick={() => {
                  onClose();
                }}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
              >
                <X size={SIZE.TWENTY} />
              </button>
                </div> */}
                <FormHeader
                icon={UserPlus}
                onClose={onClose}
                preText={isModalForMeeting ? "Add Users To Meeting" : "Assign Users" }
                description={isModalForMeeting ? "Include users from your company in meeting" : "Assign users as per your convinence" }
                />

                <div
              // className="ag-theme-balham"
              style={{ height: "300px", width: "100%" }}
            >
              <div className="flex gap-2 mb-2 justify-between mt-2">
                <div className="flex gap-28">
                  {/* <span className="font-semibold">Search the User</span> */}
                  <SearchInput
                    onChange={(event) => {
                      handleSearchParameterChange(event.target.value);
                    }}
                  ></SearchInput>
                </div>
              </div>
              <AddCompanyTeamUsersAgGrid
                    companyUsers={companyUsersList}
                    handleViewPortChanged={handleCompanyUserViewPortChange}
                    isGridForSubscription={false}
                    onGridReady={onCompanyUserGridReady}
                    addCompanyTeamUserArray={addCompanyTeamUserArray}
                    handleCompanyUserCheckBoxChange={handleAddCompanyUserEmailCheckboxChange}
                    isGridForUpdateCompanyUser = {false}
                    />
            </div>
    
                {/* <div className="inline-flex items-center justify-center w-full">
                    <AddCompanyTeamUsersAgGrid
                    companyUsers={companyUsersList}
                    handleViewPortChanged={handleCompanyUserViewPortChange}
                    isGridForSubscription={false}
                    onGridReady={onCompanyUserGridReady}
                    addCompanyTeamUserArray={addCompanyTeamUserArray}
                    handleCompanyUserCheckBoxChange={handleAddCompanyUserEmailCheckboxChange}
                    isGridForUpdateCompanyUser = {true}
                    />
                </div> */}
                </div>
                </div>
            </div>
            </div>,
            document.body)
        );
        
    
}

export default AddCompanyUsersEmailAttendeesModal;