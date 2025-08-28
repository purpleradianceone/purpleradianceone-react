/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import POST_API from "../../../../constants/PostApi";
import { useUserPreference } from "../../../../context/user/UserPreference";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import LeadImportDataType from "../../../../@types/lead-management/LeadImportData";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import LeadImportPreSaveDataAgGrid from "../../../ag-grid/LeadImportPreSaveDataAgGrid";
import Pagination from "../../../ag-grid/Pagination";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import { NUMBER_VALUES, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import FinalConfirmationModal from "./FinalConfirmationalModal";
import { Search } from "lucide-react";

const LeadImportData = ({ 
    selectedLeadTag, 
    getLeadImportTags
 }: { 
    selectedLeadTag: string
    getLeadImportTags : () => Promise<void>
 }) => {
  const { userPreference } = useUserPreference();
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const [leadImportData, setLeadImportData] = useState<LeadImportDataType[]>(
    []
  );
  const [pageSize, setPageSize] = useState<number>(
    userPreference.rowsInGrid || 25
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [responseCame, setResponeCame] = useState<boolean>(true);
  const [showLoadingSpinner , setShowLoadingSpinner] = useState<boolean>(false);
  const [openFinalPopup, setOpenFinalPopup] = useState<boolean>(false);
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
    setLeadImportData([]);
    const offset = (pageNumber - 1) * pageSize;

    const postDataToGetLeadImportData = {
      import_tag: selectedLeadTag,
      requestedby: loginStatus.id,
      company_id: loginStatus.companyId,
      search_company_specific_date_range_id: null,
      search_parameter: searchInput.trim() !== "" ? searchInput : null,
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

      const data = response.data;
      setLeadImportData(data);
      setResponeCame(false);
      if (data.length > 0 && data[0].count !== undefined) {
        setTotalCount(data[0].count);
      } else {
        setTotalCount(0);
      }
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
    setPageNumber(page);
  };

  const handleOnPageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1); // Reset to first page on size change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPageNumber(1); // Reset to first page on search
  };

  useEffect(() => {
    setLeadImportData([]);
    getLeadImportData();
  }, [selectedLeadTag, pageSize, pageNumber, searchInput]);

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
      .then((reposne) => {
        if (reposne.data.status) {
          showMessageSnackbar({
            message: reposne.data.message,
            type: "success",
          });
          getLeadImportTags()
          setOpenFinalPopup(false);
        // making aggrid table null
          setLeadImportData([])
        } else {
          showMessageSnackbar({
            message: reposne.data.message,
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
    setSearchInput("");
    setSelectedIds([]);
  }, [selectedLeadTag]);

  // return (
  //   <div className="p-2 border border-gray-100 bg-zinc-300 rounded-md">
  //     <span className="text-sm  flex gap-2 text-gray-800 block font-medium  bg-white border rounded-md px-3  mb-2">
  //       <span>These are the leads from selected tag.</span> 
  //       <span className="text-blue-500 border px-1 rounded-lg">{selectedLeadTag}</span>
  //     </span>

  //     <div className="flex flex-col  mt-2">
  //       <div className="flex items-center gap-3 justify-between">
  //         <div className="flex items-center gap-3">
  //           <button

  //             disabled={!userHasAccessToUpdateLead }
  //             onClick={() => {
  //               if (userHasAccessToUpdateLead) {
  //                 if (selectedIds.length !== 0) {
  //                   updateLeadImport();
  //                 }else{
  //                   showMessageSnackbar({
  //                       message : "Please select at least one lead to delete.",
  //                       type : "error"
  //                   })
  //                 }
  //               }
  //             }}
  //             className="bg-red-600 text-white rounded-md px-2 text-sm p-1"
  //           >
  //             Delete Record
  //           </button>

  //           <div className="flex items-center justify-center">
  //             <input
  //               type="text"
  //               placeholder="Search by Name, Email, Mobilenumber..."
  //               value={searchInput}
  //               onChange={handleSearchChange}
  //               className="border px-2 py-1 text-sm rounded-md w-80"
  //             />

  //             {responseCame && (
  //               <div className=" flex items-center justify-center ">
  //                 <LoadingSpinner />
  //               </div>
  //             )}
  //           </div>
  //         </div>

  //         <div className="flex items-center justify-center">
  //           <button
  //           title="by clicking all Leads From Selected Tag will be moved to the LEADS Table."
  //             onClick={() => {
  //               setOpenFinalPopup(true);
  //             }}
  //             className="bg-blue-700 px-3 md:text-sm sm:text-xs  py-1 rounded-md text-white"
  //           >
  //             Move all leads to lead table
  //           </button>
  //         </div>
  //       </div>

  //       <div className="h-[80svh] w-svh mt-2">
  //         <LeadImportPreSaveDataAgGrid
  //           leadImportData={leadImportData}
  //           onSelectedRow={handleSelectRow}
  //           selectedIds={selectedIds}
  //         />
  //       </div>
  //       <div className="flex justify-end ">
  //         <Pagination
  //           currentPage={pageNumber}
  //           onPageChange={handleOnPageChange}
  //           onPageSizeChange={handleOnPageSizeChange}
  //           pageSize={pageSize}
  //           totalPages={Math.ceil(totalCount / pageSize)}
  //         />
  //       </div>
  //     </div>
  //     <MessageSnackBar
  //       isOpen={messageSnackbar.open}
  //       message={messageSnackbar.message}
  //       type={messageSnackbar.type}
  //       onClose={handleCloseSnackbar}
  //       duration={NUMBER_VALUES.SNACKBAR_DURATION}
  //     />
  //     <FinalConfirmationModal
  //     showLoadingSpinner ={showLoadingSpinner}
  //       importTag={selectedLeadTag}
  //       isOpen={openFinalPopup}
  //       message={`This is the final confirmation. All lead data from the selected import tag will be PERMANANTLY moved to the Lead table and this action cannot be undone.`}
  //       onCancel={() => {
  //         setOpenFinalPopup(false);
  //       }}
  //       onSave={handleCreateMoveLeadsToLeadTable}
  //     />
      
  //   </div>
  // );


  return (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
    {/* Header */}
    <div className="flex items-center justify-between mb-4 bg-white px-2 py-1 rounded-lg shadow-sm">
      <span className="text-sm flex items-center gap-2 text-gray-800 font-medium">
        These are the leads from selected tag:
        <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs">
          {selectedLeadTag}
        </span>
      </span>

      {/* Move All Button */}
      <button
        title="By clicking, all leads from this tag will be moved to the Leads Table."
        onClick={() => setOpenFinalPopup(true)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-white text-sm font-medium shadow-md transition-all"
      >
        Move all Leads To lead data
      </button>
    </div>

    {/* Actions Row */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        {/* Delete Button */}
        <button
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
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
            !userHasAccessToUpdateLead
              ? "bg-red-300 cursor-not-allowed text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          Delete Selected
        </button>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Name, Email, or Mobile..."
            value={searchInput}
            onChange={handleSearchChange}
            className="border border-gray-300 pl-9 pr-3 py-1.5 text-sm rounded-lg w-80 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <Pagination
        currentPage={pageNumber}
        onPageChange={handleOnPageChange}
        onPageSizeChange={handleOnPageSizeChange}
        pageSize={pageSize}
        totalPages={Math.ceil(totalCount / pageSize)}
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
      message={`⚠️ This is the final confirmation. All leads from "${selectedLeadTag}" will be PERMANENTLY moved to the Lead table. This action cannot be undone.`}
      onCancel={() => setOpenFinalPopup(false)}
      onSave={handleCreateMoveLeadsToLeadTable}
    />
  </div>
);

};

export default LeadImportData;
