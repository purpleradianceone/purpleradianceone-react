/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import POST_API from "../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import LeadImportDataType from "../../../../@types/lead-management/LeadImportData";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import LeadImportPreSaveDataAgGrid from "../../../ag-grid/LeadImportPreSaveDataAgGrid";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import { NUMBER_VALUES, SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import FinalConfirmationModal from "./FinalConfirmationalModal";
import { LucideImport, Search, X } from "lucide-react";
import Button from "../../../ui/Button";
import toast from "react-hot-toast";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import PaginationWithoutCount from "../../../ag-grid/PaginationWithoutCount";

const LeadImportData = ({ 
    selectedLeadTag, 
    getLeadImportTags,
    CancelSelectedLeadTag
 }: { 
    selectedLeadTag: string
    getLeadImportTags : () => Promise<void>
    CancelSelectedLeadTag : ()=> void
 }) => {
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const [leadImportData, setLeadImportData] = useState<LeadImportDataType[]>(
    []
  );

  const [responseCame, setResponeCame] = useState<boolean>(true);
  const [showLoadingSpinner , setShowLoadingSpinner] = useState<boolean>(false);
  const [openFinalPopup, setOpenFinalPopup] = useState<boolean>(false);
  const {
    pageSize,
    currentPage,
    currentPageData,
    searchParameter,
    setCurrentPageData,
    handleSearchParameterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchFilterPaginationDateHandlers();
  //note : Message Snackbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getLeadImportData = async () => {
    const offset = (currentPage - 1) * pageSize;

    const postDataToGetLeadImportData = {
      import_tag: selectedLeadTag,
      requestedby: loginStatus.id,
      company_id: loginStatus.companyId,
      search_company_specific_date_range_id: null,
      search_parameter: searchParameter.trim() !== "" ? searchParameter : null,
      search_parameter_date: null,
      offset,
      limit: pageSize,
    };

    try {
      setResponeCame(true);
      const response = await axios.post(
        POST_API.GET_LEAD_IMPORT_DATA,
        postDataToGetLeadImportData,
        { withCredentials: true }
      );
      setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});

      const data = response.data;
      setLeadImportData(data);
      setResponeCame(false);
     
    } catch (error: any) {
      setResponeCame(false);

      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadImportData,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getLeadImportData();
        }
      }
    }
  };

  const handleOnPageChange = (page: number) => {
    handlePageChange(page);
  };

  const handleOnPageSizeChange = (size: number) => {
    handlePageSizeChange(size);
    handlePageChange(1); // Reset to first page on size change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchParameterChange(e.target.value);
    handlePageChange(1); // Reset to first page on search
  };

  useEffect(() => {
    getLeadImportData();
  }, [selectedLeadTag, pageSize, currentPage, searchParameter]);

  //   Note : for persistance data
  //   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  //   const handleSelectRow = (id: number, checked: boolean) => {
  //     // setSelectedIds((prev) => {
  //     //   const newSet = new Set(prev);
  //     //   checked ? newSet.add(id) : newSet.delete(id);
  //     //   return newSet;
  //     // });
  //   };

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        // Add the ID only if it's not already present
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      } else {
        // Remove the ID
        return prev.filter((item) => item !== id);
      }
    });
  };

  const updateLeadImport = async () => {
    const postDataToUpdateLeadImport = {
      company_id: loginStatus.companyId,
      id: selectedIds,
      updatedby: loginStatus.id,
    };

    await axios
      .post(POST_API.UPDATE_LEAD_IMPORT_DATA, postDataToUpdateLeadImport, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
        } else {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getLeadImportData,
          });
          if (refreshTokenStatus) {
            getLeadImportData();
          }
        }
      })
      .finally(() => {
        setSelectedIds([]);
        getLeadImportData();
      });
  };

  const handleCreateMoveLeadsToLeadTable =async () => {
    
    const postData = {
      company_id: loginStatus.companyId,
      import_tag: selectedLeadTag,
      createdby: loginStatus.id,
    };
    setShowLoadingSpinner(true);
    await axios
      .post(POST_API.CREATE_LEAD_IMPORT_FROM_IMPORT_TAG, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === true) {
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "success",
          // });
          toast.success(response.data.message)
          getLeadImportTags()
          setOpenFinalPopup(false);
        // making aggrid table null
          setLeadImportData([])
          CancelSelectedLeadTag()
        } else {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
       
      })
      .catch(async (error :any)=>{        
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getLeadImportData,
          });
          if (refreshTokenStatus) {
            handleCreateMoveLeadsToLeadTable();
          }
        }else if (error.status === 500){
            showMessageSnackbar({
                message : error.response.data,
                type : "error"
            })
            setOpenFinalPopup(false);
        }
      })
      .finally(()=>{
        setShowLoadingSpinner(false);
      });
  };

  useEffect(() => {
    handleSearchParameterChange("");
    setSelectedIds([]);
  }, [selectedLeadTag]);


  return (
  <div className="p-4 bg-gray-300 border border-gray-200 rounded-xl shadow-sm">
    {/* Header */}
    <div className="flex items-center justify-between mb-4  px-2 py-1 ">
      <span className="flex items-center gap-2 table-header-custom">
        These are the leads from selected tag :
        <span className=" flex gap-1 items-center justify-center input-label-custom-blue bg-blue-0  -blue-00 px-1 py-0.5 rounded-md">
          {selectedLeadTag}
         <div className="">
            <Button className="h-fit w-fit flex items-center justify-center text-gray-700 hover:text-black rounded-sm p-0.5  " onClick={CancelSelectedLeadTag} >
            <X size={16}/>
          </Button>
           
         </div>
        </span>
      </span>

      {/* Move All Button */}
      <div>
 <Button
        type="submit"
        title="By clicking, all leads from this tag will be moved to the Leads Table."
        onClick={(e) => {
          e.preventDefault();
          setOpenFinalPopup(true);
        }}
        className="flex items-center  gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-white text-sm font-medium shadow-md transition-all"
      >
        <LucideImport size={SIZE.SIXTEEN} />
        Move all Leads To lead data
      </Button>
      </div>
     
    </div>

    {/* Actions Row */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        {/* Delete Button */}
        <Button
          type="button"
          disabled={!userHasAccessToUpdateLead}
          onClick={() => {
            if (userHasAccessToUpdateLead) {
              if (selectedIds.length !== 0) {
                updateLeadImport();
              } else {
                showMessageSnackbar({
                  message: "Please select at least one lead to delete.",
                  type: "error",
                });
              }
            }
          }}
        >
          Delete Selected
        </Button>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Name, Email, or Mobile..."
            value={searchParameter}
            onChange={handleSearchChange}
            className="border border-gray-300 pl-9 pr-3 py-1.5 caption-custom rounded-lg w-80 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute left-2 top-2.5 text-gray-400">
            <Search size={16} />
          </span>
        </div>
        {responseCame && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>

    {/* Table */}
    <div className="h-[75vh] mt-2 border rounded-lg overflow-hidden bg-white shadow">
      <LeadImportPreSaveDataAgGrid
        leadImportData={leadImportData}
        onSelectedRow={handleSelectRow}
        selectedIds={selectedIds}
      />
    </div>

    {/* Pagination */}
    <div className="flex justify-end mt-3">
      <PaginationWithoutCount
        pageSize={pageSize}
        currentPage={currentPage}
        currentPageData={currentPageData}
        onPageChange={handleOnPageChange}
        onPageSizeChange={handleOnPageSizeChange}
      />
    </div>

    {/* Snackbar */}
    <MessageSnackBar
      isOpen={messageSnackbar.open}
      message={messageSnackbar.message}
      type={messageSnackbar.type}
      onClose={handleCloseSnackbar}
      duration={NUMBER_VALUES.SNACKBAR_DURATION}
    />

    {/* Confirmation Modal */}
    <FinalConfirmationModal
      showLoadingSpinner={showLoadingSpinner}
      importTag={selectedLeadTag}
      isOpen={openFinalPopup}
      message={`⚠️ This is the final confirmation message. All leads from "${selectedLeadTag}" will be PERMANENTLY moved to the Lead table. This action cannot be undone.`}
      onCancel={() => setOpenFinalPopup(false)}
      onSave={handleCreateMoveLeadsToLeadTable}
    />
  </div>
);

};

export default LeadImportData;
