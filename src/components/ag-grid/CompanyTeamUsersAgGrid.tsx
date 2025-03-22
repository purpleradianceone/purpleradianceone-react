/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, GridApi, themeAlpine, ViewportChangedEvent } from "ag-grid-community";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  INNERHTML,
  NUMBER_VALUES,
  STATUS_CODE,
} from "../../constants/AppConstants";
import { UserPlus2 } from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import CompanyTeamSearchProps from "../../@types/team-management/CompanyTeamListProps";
import CompanyTeamUsers from "../../@types/team-management/CompanyTeamUsers";
import { AgGridReact } from "ag-grid-react";
import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import Button from "../ui/Button";
import { CLASS_NAMES } from "../../constants/ClassNames";
import SearchInput from "../ui/SearchInput";
import AddCompanyTeamUsersAgGrid from "./AddCompanyTeamUsersAgGrid";
import MessageSnackBar from "../ui/MessageSnackbar";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../@types/ui/MessageSnackbarProps";
import { useSearchFilterPaginationDateHandlers } from "../../config/hooks/usePaginationHandler";
import { Product } from "../../@types/products/ProductsManagementProps";
import CompanyProductUser from "../../@types/product-users-management/CompanyProductUser";

function CompanyUserCompanyTeamAgGrid({
  companyTeam,
  isOpen,
  companyProduct,
  isGridForProductUser
}: {
  companyTeam?: CompanyTeamSearchProps;
  isOpen: boolean;
  companyProduct?: Product;
  isGridForProductUser : boolean;
}) {
  const { userHasAccessToViewTeamManagement, userHasAccessToViewUser,userHasAccessToUpdateTeamManagement,userHasAccessToViewProductTeam,userHasAccessToUpdateProductTeam } =
    useUserAccessModules();

  const [companyTeamUsersList, setCompanyTeamUsersList] = useState<
    CompanyTeamUsers[]
  >([]);

  const [companyProductUsersList,setCompanyProductUsersList] = useState<CompanyProductUser[]>([])
  const [companyUsers, setCompanyUsers] = useState<companyUsersSearchProps[]>(
    []
  );

  const [isCompanyUsersFetchedCount,setIsCompanyUsersFetched] = useState<number>(0);
  const { loginStatus } = useLoggedInUserContext();

  const [companyTeamUpdateCount,setCompanyTeamUpdateCount] = useState<number>(0);
  const [companyProductUserUpdateCount,setCompanyProductUserUpdateCount] = useState<number>(0);
  const [companyUserReadyToFetch,setCompanyUserReadyToFetch] = useState<boolean>(false);

  const [addCompanyTeamUserArray, setAddCompanyTeamUserArray] = useState<number[]>([]);
   const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const fetchingRef = useRef(false);
    const gridApiRef = useRef<GridApi | null>(null);
    const lastScrollPositionRef = useRef<number>(0);
  
    const onGridReady = (params: { api: GridApi }) => {
      gridApiRef.current = params.api;
  };
  const {searchParameter,handleSearchParameterChange} = useSearchFilterPaginationDateHandlers();

  
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
      // alert("added " + params.id)
      setAddCompanyTeamUserArray((prev) => [...prev, params.id]);
    }
    else if(!event.target.checked){
      // alert("removed " + params.id)
      setAddCompanyTeamUserArray((prev) => prev.filter((id) => id !== params.id));
    }

  }

  const handleCompanyProductUserUpdateChange = () => {
    setCompanyProductUserUpdateCount(companyProductUserUpdateCount + 1);
  }
  const handleCompanyTeamUserUpdate = ()=> {
    setCompanyTeamUpdateCount(companyTeamUpdateCount+1);
  }

  const handleAddCompanyTeamUsers = async()=>{
    if(userHasAccessToUpdateTeamManagement){

      const createCompanyTeamCompanyUser = {
        company_id : loginStatus.companyId,
        company_team_id : companyTeam!.id,
        company_user_array : addCompanyTeamUserArray,
        createdby : loginStatus.id,
      }
      axios.post(POST_API.CREATE_COMPANY_TEAM_USERS,createCompanyTeamCompanyUser,{
        withCredentials:true
      })
      .then((response) => {
        if(response.data.status){
          showMessageSnackbar({message : response.data.message,type : "success"});
          handleCompanyTeamUserUpdate();
          const updatedCompanyUsers = companyUsers.filter((user) => !addCompanyTeamUserArray.includes(user.id));
          setCompanyUsers(updatedCompanyUsers);
        }
        setAddCompanyTeamUserArray([]);
      })
      .catch(async(error : ApiError | any) => {
        console.log(error);
        if(error.status === STATUS_CODE.UNATHORISED){
              const refreshTokenResponse = await RefreshToken({callFunction: handleAddCompanyTeamUsers})
              if(refreshTokenResponse){
                handleAddCompanyTeamUsers();
              }
        }
      })
    }
  }

  const handleAddCompanyProductUsers = async() => {
      if(userHasAccessToUpdateProductTeam){
        const createCompanyProductUserPostData = {
          company_id : loginStatus.companyId,
          company_product_id : companyProduct!.id,
          company_user_array : addCompanyTeamUserArray,
          createdby : loginStatus.id,
        }
        axios.post(POST_API.CREATE_COMPANY_PRODUCT_USERS,createCompanyProductUserPostData,{
          withCredentials:true
        })
        .then((response) => {
          if(response.data.status){
            showMessageSnackbar({message:response.data.message,type:"success"})
            setCompanyProductUserUpdateCount(companyProductUserUpdateCount + 1);
            const updatedCompanyUsers = companyUsers.filter((user) => !addCompanyTeamUserArray.includes(user.id));
            setCompanyUsers(updatedCompanyUsers);
          }
          setAddCompanyTeamUserArray([]);
        })
        .catch(async(error : ApiError | any) => {
          console.log(error);
          if(error.status === STATUS_CODE.UNATHORISED){
                const refreshTokenResponse = await RefreshToken({callFunction: handleAddCompanyProductUsers})
                if(refreshTokenResponse){
                  handleAddCompanyProductUsers();
                }
          }
        })
      }
  }


  const fetchCompanyTeamUsers = async () => {
    
    if (userHasAccessToViewTeamManagement && !isGridForProductUser) {
    setCompanyTeamUsersList([]);
      const getCompanyTeamUserPostData = {
        company_id: loginStatus.companyId,
        company_team_id: companyTeam!.id,
        company_user_id: 0,
        requestedby: loginStatus.id,
      };
      await axios
        .post(POST_API.GET_COMPANY_TEAM_USERS, getCompanyTeamUserPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data && response.status === STATUS_CODE.OK) {
            setCompanyUserReadyToFetch(true);
           // @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            response.data.map((res: any) => {
              setCompanyTeamUsersList((prev) => [
                ...prev,
                {
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
            
          }
        })
        .catch(async(error : ApiError | any) => {
          console.log(error)
          if(error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({callFunction:fetchCompanyTeamUsers});
            if(refreshTokenResponse){
              fetchCompanyTeamUsers();
            }
          }
        })
        
    }

  };

  const fetchCompanyProductUsers = async() => {
    if(userHasAccessToViewProductTeam &&  isGridForProductUser){
      setCompanyProductUsersList([]);
        const getCompanyProductUsersPostData = {
            company_id : loginStatus.companyId,
            company_product_id : companyProduct!.id,
            company_user_id : 0,
            requestedby : loginStatus.id,
        }
        axios.post(POST_API.GET_COMPANY_PRODUCT_USERS,getCompanyProductUsersPostData,{
            withCredentials:true
        })
        .then((response) => {
          if (response.data && response.status === STATUS_CODE.OK) {
            setCompanyUserReadyToFetch(true);
            response.data.map((res : any) => {
              setCompanyProductUsersList((prev) => [
                ...prev,
                {
                    productCode : res["Product Code"],
                    productName : res["Product Name"],
                    userName : res["User Name"],
                    companyProductId : res.company_product_id,
                    companyUserId : res.company_user_id,
                    createdBy : res.createdby,
                    createdOn : res.createdon,
                    id : res.id,
                    isActive : res.isactive,
                }
                  ]
                )
                }
              )
            }
            })
        .catch(async(error : ApiError | any) => {
            console.log(error);
            if(error.status === STATUS_CODE.UNATHORISED){
                const refreshTokenResponse = await RefreshToken({callFunction: fetchCompanyProductUsers})

                if(refreshTokenResponse){
                    fetchCompanyProductUsers();
                }
            }
        })
    }
}

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
        limit: 50,
        offset:   50 * isCompanyUsersFetchedCount,
        search_company_specific_date_range_id: 0,
        search_parameter: "",
        search_parameter_date: "",
      }

      const response = await axios.post(POST_API.GET_COMPANY_USERS, getCompanyUserPostData, {
        withCredentials: true,
      });

      if (response.data) {
        setIsCompanyUsersFetched(isCompanyUsersFetchedCount+1);
        const newUsers = response.data;
                if (newUsers.length === 0) {
                  setHasMore(false);
                  
                  return;
                }
                if(!isGridForProductUser){
                  setCompanyUsers(prev => {
                    const uniqueUsers = [...prev, ...newUsers]
                      const companyTeamFilteredUsers = uniqueUsers.filter(user => {
                        return !companyTeamUsersList.some(teamMember => teamMember.companyUserId === user.id)
                      });
                      return companyTeamFilteredUsers;
                  });
                }
                
                else if(isGridForProductUser){
                  setCompanyUsers(prev => {
                    const uniqueUsers = [...prev, ...newUsers]
                      const companyProductfilteredUsers = uniqueUsers.filter(user => {
                        return !companyProductUsersList.some(teamMember => teamMember.companyUserId === user.id);
                      });
                      return companyProductfilteredUsers;
                  });
                }

               // Restore scroll position after data update
        if (gridApiRef.current && lastScrollPositionRef.current > 0) {
          
          setTimeout(() => {
           
              if(gridApiRef.current){
                  gridApiRef.current.ensureIndexVisible(lastScrollPositionRef.current-11);
              }
          }, 150);
      }


      if(!isGridForProductUser){
        if (newUsers[0]?.count && companyUsers.length + newUsers.length >= newUsers[0].count) {
          setHasMore(false);
        }
      }
      else if(isGridForProductUser){
        if (newUsers[0]?.count && companyUsers.length + newUsers.length >= newUsers[0].count) {
          setHasMore(false);
        }
      }
        
          
        
        

        
      }
    } catch (error: ApiError | any) {
      console.error(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: fetchCompanyUsers,
        });
        if (!refreshTokenResponse) {
          // setIsDialogueOpen(true);
        }
        else{
          // setIsDialogueOpen(false);
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
        setAddCompanyTeamUserArray([]);
        setCompanyUsers([]);
        setHasMore(true);
        fetchingRef.current = false;
        gridApiRef.current = null;
        lastScrollPositionRef.current = 0;
        setCompanyTeamUsersList([]);
        setCompanyProductUsersList([]);
        setCompanyUserReadyToFetch(false);
      } else if (isOpen && companyUsers.length === 0 && (companyTeamUsersList.length > 0 || companyUserReadyToFetch) && !isGridForProductUser) {
          fetchCompanyUsers(); 
      }
      else if (isOpen && companyUsers.length === 0 && (companyProductUsersList.length > 0 || companyUserReadyToFetch) && isGridForProductUser) {
          fetchCompanyUsers();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isOpen,companyTeamUsersList.length,searchParameter,companyProductUsersList.length,companyUserReadyToFetch]);
  

  useEffect(() => {
    if(!isGridForProductUser ){
      fetchCompanyTeamUsers();
    }
    else if(isGridForProductUser){
      fetchCompanyProductUsers()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen,companyTeamUpdateCount,companyProductUserUpdateCount]);

  const companyTeamColumnDefs = useMemo<ColDef[]>(
    () => [
      {
        filed : "id",
        sortable : true,
        hide : true,
      },
      {
        headerName: "name",
        field: "userName",
        flex:1,
        sortable: true,
        filter: true,
        
      },
      {
        headerName: "Action",
        sortable: true,
        filter: true,
        pinned: "right",
        width: 100,
        cellRenderer: (params: any) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [isActive,setIsActive] = useState<boolean>(params.data.isActive);
        
          
          const handleCompanyTeamUsersToggle = async (event : React.FormEvent<HTMLButtonElement>) => {
            setIsActive(params.data.isActive);
            if(userHasAccessToUpdateTeamManagement){
              const updateCompanyTeamUserPostData = {
                company_id : loginStatus.companyId,
                id:parseInt(event.currentTarget.id),
                isactive : !isActive,
                updatedby : loginStatus.id

              }
              await axios.post(POST_API.UPDATE_COMPANY_TEAM_USERS,updateCompanyTeamUserPostData,{
                withCredentials:true
              })
              .then((response) => {
                
                if(response.data.status){
                    setIsActive(!isActive)
                    showMessageSnackbar({message:response.data.message,type:"success"})
                }
                handleCompanyTeamUserUpdate();
              })
              .catch(async(error : ApiError | any) => {
                console.log(error);
                if(error.status === STATUS_CODE.UNATHORISED){
                      const refreshTokenResponse = await RefreshToken({callFunctionWithEvent : handleCompanyTeamUsersToggle})
                      if(refreshTokenResponse){
                       handleCompanyTeamUsersToggle(event);
                      }
                }
              })
            }

          }

          const handleCompanyProductUsersToggle = async (event : React.FormEvent<HTMLButtonElement>) => {
            setIsActive(params.data.isActive);
            if(userHasAccessToUpdateProductTeam){
              const updateCompanyProductUserPostData = {
                company_id : loginStatus.companyId,
                id:parseInt(event.currentTarget.id),
                isactive : !isActive,
                updatedby : loginStatus.id
              }

              axios.post(POST_API.UPDATE_COMPANY_PRODUCT_USERS,updateCompanyProductUserPostData,{
                withCredentials:true
              })
              .then((response) => {
                if(response.data.status){
                  setIsActive(!isActive)
                    showMessageSnackbar({message:response.data.message,type:"success"})
                }
                handleCompanyProductUserUpdateChange();
              })
              .catch(async(error : ApiError | any) => {
                if(error.status === STATUS_CODE.UNATHORISED){
                  const refreshTokenResponse = await RefreshToken({callFunctionWithEvent : handleCompanyProductUsersToggle});
                  if(refreshTokenResponse){
                    handleCompanyProductUsersToggle(event);
                  }
                }
                
              })
            }
          }
          return (
            <div className="flex flex-col items-center mt-3">
              <button
              id={params.data.id.toString()}
      className={`w-6 h-3 rounded-md transition-colors duration-200 ${
      isActive  ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-500'
      } text-white font-semibold`}
      onClick={(event) => {
        if(!isGridForProductUser){
          handleCompanyTeamUsersToggle(event);
        }
        else if(isGridForProductUser){
          handleCompanyProductUsersToggle(event);
        }
        
      }}
    >
      <div className={`bg-gray-200 h-2 w-2 transition-opacity rounded-full ${isActive ? 'float-end' : 'float-start'}`}></div>
    </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyTeamUpdateCount,companyProductUserUpdateCount]
  );
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 30,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
      
    };
  }, []);

  return (
    <div className="flex justify-around gap-3 mb-16 pb-4">
      <div
        className="ag-theme-alpine"
        style={{ height: "300px", width: "45%" }}
      >
        <div className="flex gap-2 mb-6 justify-between">
        <div className="place-content-center">
          <span className="text-lg font-semibold text-gray-700">
            Team Members
          </span>
        </div>
        
        </div>
        
        <AgGridReact
        rowData={isGridForProductUser ? companyProductUsersList : companyTeamUsersList}
        columnDefs={companyTeamColumnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeAlpine}
      />
        
        
        
        
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "300px", width: "45%" }}
      >
        <div className="flex gap-2 mb-2 justify-between">
        {/* <div className="place-content-center">
          <span className="text-lg font-semibold text-gray-700">
            
          </span>
          
        </div> */}
        <div>
          <SearchInput onChange={(event)=> {
            handleSearchParameterChange(event.target.value)
            }}></SearchInput>
        </div>
        <div className="justify-self-end">
            {!isGridForProductUser && 
            <Button onClick={handleAddCompanyTeamUsers}>
            <UserPlus2 className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}></UserPlus2>
            {" "} Add To Team
          </Button>
            }

            {isGridForProductUser &&
              <Button
              onClick={handleAddCompanyProductUsers}
              > <UserPlus2 className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}></UserPlus2>
              {" "} Assign Users
              </Button>
            }
          </div>
        </div>
        <AddCompanyTeamUsersAgGrid
        companyUsers={companyUsers}
        handleViewPortChanged ={handleViewPortChanged}
        onGridReady={onGridReady}
        addCompanyTeamUserArray={addCompanyTeamUserArray}
        handleCompanyUserCheckBoxChange={handleCompanyUserCheckBoxChange}
        />
      </div>
      <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
    </div>
  );
}

export default CompanyUserCompanyTeamAgGrid;
