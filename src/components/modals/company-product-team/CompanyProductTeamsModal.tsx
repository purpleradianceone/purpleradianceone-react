/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditIcon, Network, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import { NUMBER_VALUES, SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import { Product } from "../../../@types/products/ProductsManagementProps";
import CompanyProductTeamsAgGrid from "../../ag-grid/CompanyProductTeamsAgGrid";
import TeamManagementAgGrid from "../../ag-grid/TeamManagementAgGrid";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import CompanyProductTeam from "../../../@types/product-teams-management/CompanyProductTeam";
import { useEffect, useRef, useState } from "react";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import CompanyTeamSearchProps from "../../../@types/team-management/CompanyTeamListProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import Button from "../../ui/Button";
import { CLASS_NAMES } from "../../../constants/ClassNames";

function CompanyProductTeamsModal({
  isOpen,
  onClose,
  companyProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyProduct: Product;
}) {
  const { isSmallScreen } = useScreenSize();
  const { userHasAccessToViewProductTeam, userHasAccessToViewTeamManagement ,userHasAccessToAddProductTeam} =
    useUserAccessModules();

  const [companyProductTeamsList, setCompanyProductsTeamsList] = useState<
    CompanyProductTeam[]
  >([]);
  const [companyTeamList, setCompanyTeamList] = useState<
    CompanyTeamSearchProps[]
  >([]);
  const [isCompanyTeamsReadyToFetch, setIsCompanyTeamsReadyToFetch] =
    useState<boolean>(false);
      const [isLoading, setIsLoading] = useState(false);
        const [hasMore, setHasMore] = useState(true);
        const fetchingRef = useRef(false);
        const gridApiRef = useRef<GridApi | null>(null);
        const lastScrollPositionRef = useRef<number>(0);

        const [companyTeamsFetchedCount,setCompanyTeamsFetchedCount] = useState<number>(0);

  const { loginStatus } = useLoggedInUserContext();

  const [addCompanyProductTeamArray, setAddCompanyProductTeamArray] = useState<
    number[]
  >([]);

  const [companyProductTeamUpdateCount,setCompanyProductTeamUpdateCount] = useState<number>(0);
  const [companyProdustTeamAddCount,setCompanyProductTeamAddCount] = useState<number>(0);

  
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

  const handleCompanyTeamCheckboxChange = (
    params: CompanyTeamSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // alert("added : " + params.id);
      setAddCompanyProductTeamArray((prev) => [...prev, params.id]);
    } else if (!event.target.checked) {
      // alert("removed : " + params.id);
      setAddCompanyProductTeamArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
    }
  };

const handleAddCompanyProductTeam = async() => {
  if(userHasAccessToAddProductTeam){
    const createCompanyProductTeamPostData = {
      company_id : loginStatus.companyId,
      company_product_id : companyProduct.id,
      company_team_array : addCompanyProductTeamArray,
      createdby : loginStatus.id,
    }
    await axios.post(POST_API.CREATE_COMPANY_PRODUCT_TEAM,createCompanyProductTeamPostData,{
      withCredentials : true
    })
    .then((response) => {
      if(response.data.status && response.data){
        setCompanyProductTeamAddCount(companyProdustTeamAddCount + 1);
        showMessageSnackbar({message : response.data.message,type : "success"});
        const updatedCompanyTeams = companyTeamList.filter((team) => !addCompanyProductTeamArray.includes(team.id));
        setCompanyTeamList(updatedCompanyTeams);
      }
    })
    .catch(async (error : ApiError | any) => {
      if(error.status === STATUS_CODE.UNATHORISED){
        const refreshTokenResponse = await RefreshToken({callFunction:handleAddCompanyProductTeam});

        if(refreshTokenResponse){
          handleAddCompanyProductTeam();
        }
      }
    })
  }
}

  const fetchCompanyProductTeams = async () => {
    if (userHasAccessToViewProductTeam) {
      setCompanyProductsTeamsList([]);
      const getCompanyProductTeamsPostData = {
        company_id: loginStatus.companyId,
        company_product_id: companyProduct.id,
        requestedby: loginStatus.id,
      };
      axios
        .post(
          POST_API.GET_COMPANY_PRODUCT_TEAMS,
          getCompanyProductTeamsPostData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            setIsCompanyTeamsReadyToFetch(true);
            response.data.map((res: any) => {
              setCompanyProductsTeamsList((prev) => [
                ...prev,
                {
                  id: res.id,
                  companyProductId: res.company_product_id,
                  productName: res["Product Name"],
                  productCode: res["Product Code"],
                  companyTeamId: res.company_team_id,
                  teamName: res["Team Name"],
                  isActive: res.isactive,
                  createdBy: res.createdby,
                  createdOn: res.createdon,
                },
              ]);
            });
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: fetchCompanyProductTeams,
            });
            if (refreshTokenResponse) {
              fetchCompanyProductTeams();
            }
          }
        });
    }
  };

  const fetchCompanyTeams = async () => {
    if (!userHasAccessToViewTeamManagement || isLoading || !hasMore || fetchingRef.current) return;

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

   
      const getCompanyTeamsPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: 20,
        offset : 20 * companyTeamsFetchedCount,
        searcsearch_company_specific_date_range_id: 0,
        search_parameter: "",
        search_parameter_date: "",
      };
      const response = await axios.post(POST_API.GET_COMPANY_TEAM, getCompanyTeamsPostData, {
          withCredentials: true,
        })
        if(response.data) {
          setCompanyTeamsFetchedCount(companyTeamsFetchedCount+1);
          const newcompanyTeams = response.data;

          if (newcompanyTeams.length === 0) {
              setHasMore(false);
              return;
          }
          
          const uniqueCompanyTeams = [...companyTeamList, ...newcompanyTeams]; // Corrected concatenation
          const filteredCompanyTeams = uniqueCompanyTeams.filter(
              (team) => {
                  return companyProductTeamsList.every(
                      (productTeam) => productTeam.companyTeamId !== team.id
                  );
              }
          );
          setCompanyTeamList(filteredCompanyTeams);
            
          

                // Restore scroll position after data update
        if (gridApiRef.current && lastScrollPositionRef.current > 0) {
          
          setTimeout(() => {
           
              if(gridApiRef.current){
                  gridApiRef.current.ensureIndexVisible(lastScrollPositionRef.current-11);
              }
          }, 150);
      }
      if (newcompanyTeams[0]?.count && companyTeamList.length + newcompanyTeams.length >= newcompanyTeams[0].count) {
        setHasMore(false);
      }
        }
       
    }
    catch(error : ApiError | any){
      if(error.status === STATUS_CODE.UNATHORISED){
        const refreshTokenResponse = await RefreshToken({callFunction:fetchCompanyTeams});

        if(refreshTokenResponse){
          fetchCompanyTeams();
        }
      }
    }
    finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

   const handleViewPortChanged = (params: ViewportChangedEvent) => {
        if (!companyTeamList.length || !hasMore) return;
    
        // Store the grid API reference
        if (!gridApiRef.current && params.api) {
          gridApiRef.current = params.api;
        }
    
        const lastVisibleRow = params.lastRow;
        const totalRowCount = companyTeamList[0]?.count;
        
        if (totalRowCount && lastVisibleRow >= companyTeamList.length -1) {
          
          fetchCompanyTeams();
        }
      };
 const onGridReady = (params: { api: GridApi }) => {
      gridApiRef.current = params.api;
  };

  const handleCompanyProductTeamUpdate = (message : string) => {
    setCompanyProductTeamUpdateCount(companyProductTeamUpdateCount + 1);
    showMessageSnackbar({message : message,type:"success"});
  }

  useEffect(() => {
    if (isOpen) {
      fetchCompanyProductTeams();
    } 
  }, [isOpen,companyProductTeamUpdateCount,companyProdustTeamAddCount]);

  useEffect(() => {
    if (
      isOpen &&
      companyTeamList.length === 0 &&
      (companyProductTeamsList.length > 0 || isCompanyTeamsReadyToFetch)
    ) {
      fetchCompanyTeams();
    }else if (!isOpen) {
      setCompanyTeamList([]);
      setAddCompanyProductTeamArray([]);
      setHasMore(true);
      fetchingRef.current = false;
      gridApiRef.current = null;
      lastScrollPositionRef.current = 0;
      setCompanyTeamsFetchedCount(0);
      setIsCompanyTeamsReadyToFetch(false);
      handleMessageSnackbarClose();
      // setIsLoading(false);
    }
  }, [isCompanyTeamsReadyToFetch, companyProductTeamsList.length, isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-45"
          : "fixed inset-0 z-50 justify-content-center pl-28 p-16 pt-2 overflow-hidden bg-black bg-opacity-45"
      }
    >
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="relative w-full max-w-6xl min-w-full max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 sticky bg-white py-2">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Edit product {companyProduct.name} Teams
              </h2>
              <button
                onClick={() => {
                  onClose();
                }}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>
            {/*Aggrid logic here */}
            <div className="flex justify-around gap-3 mb-16 pb-4">
              <div
                className="ag-theme-alpine"
                style={{ height: "300px", width: "45%" }}
              >
                <div className="flex gap-2 mb-10 justify-between">
                  <div className="place-content-center">
                    <span className="text-lg font-semibold text-gray-700">
                      Assigned Teams for {companyProduct.name}
                    </span>
                  </div>
                </div>
                <CompanyProductTeamsAgGrid
                  companyProductTeams={companyProductTeamsList}
                  handleCompanyProductTeamUpdate={handleCompanyProductTeamUpdate}
                ></CompanyProductTeamsAgGrid>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: "300px", width: "45%" }}
              >
                <div className="flex gap-2 mb-6 justify-between">
                  <div className="place-content-center">
                    <span className="text-lg font-semibold text-gray-700">
                      Unassigned Teams for {companyProduct.name}
                    </span>
                   
                  </div>
                  <div> <Button
                  onClick={handleAddCompanyProductTeam}>
                    <Network className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}></Network>
                    Assign Teams</Button></div>
                </div>
                <TeamManagementAgGrid
                  companyTeamList={companyTeamList}
                  isGridForProductTeam={true}
                  handleCompanyTeamCheckboxChange={
                    handleCompanyTeamCheckboxChange
                  }
                  addCompanyProductTeamArray={addCompanyProductTeamArray}
                  handleViewPortChanged={handleViewPortChanged}
                  onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
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
  );
}

export default CompanyProductTeamsModal;
