/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import POST_API from "../../../../constants/PostApi";
import { useUserPreference } from "../../../../context/user/UserPreference";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import Pagination from "../../../ag-grid/Pagination";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { LucideImport, Search, Trash2, XCircle } from "lucide-react";
import Button from "../../../ui/Button";
import AccountImportPreSaveDataAgGrid from "../../../ag-grid/AccountImportPreSaveDataAgGrid";
import { AccountImportDataType } from "../../../../@types/account/AccountImportDataType";
import COLORS from "../../../../constants/Colors";
import toast from "react-hot-toast";
import ConfirmationDialog from "../../../dialogue-box/ConfirmationDialogue";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
import axiosClient from "../../../../axios-client/AxiosClient";

const AccountImportData = ({
  onCloseOrUnselectTag,
  selectedAccountTag,
  getAccountImportTags,
}: {
  onCloseOrUnselectTag: () => void;
  selectedAccountTag: string;
  getAccountImportTags: () => Promise<void>;
}) => {
  const { userPreference } = useUserPreference();
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const [accountImportData, setAccountImportData] = useState<
    AccountImportDataType[]
  >([]);
  const [pageSize, setPageSize] = useState<number>(
    userPreference.rowsInGrid || 25
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [responseCame, setResponeCame] = useState<boolean>(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false);
  const [openFinalPopup, setOpenFinalPopup] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  //note : Message Snackbar

  const getAccountImportData = async () => {
    setAccountImportData([]);
    const offset = (pageNumber - 1) * pageSize;

    const postDataToGetAccountImportData = {
      import_tag: selectedAccountTag,
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
      const response = await axiosClient.post(
        POST_API.GET_ACCOUNT_IMPORT_DATA,
        postDataToGetAccountImportData,
        { withCredentials: true }
      );

      const data = response.data;
      setAccountImportData(data);
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
          callFunction: getAccountImportData,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getAccountImportData();
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
    setAccountImportData([]);
    getAccountImportData();
  }, [selectedAccountTag, pageSize, pageNumber, searchInput]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const updateAccountImport = async () => {
    const postDataToUpdateAccountImport = {
      company_id: loginStatus.companyId,
      account_import_ids: selectedIds,
      updatedby: loginStatus.id,
    };

    await axiosClient
      .post(
        POST_API.UPDATE_ACCOUNT_IMPORT_DATA,
        postDataToUpdateAccountImport,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getAccountImportData,
          });
          if (refreshTokenStatus) {
            getAccountImportData();
          }
        }
      })
      .finally(() => {
        setSelectedIds([]);
        getAccountImportData();
      });
  };

  const handleCreateMoveAccountsToAccountTable = async () => {
    // setIsLoading(true);
    const postData = {
      company_id: loginStatus.companyId,
      import_tag: selectedAccountTag,
      createdby: loginStatus.id,
    };
    setShowLoadingSpinner(true);
    await axiosClient
      .post(POST_API.CREATE_ACCOUNT_IMPORT_FROM_IMPORT_TAG, postData, {
        withCredentials: true,
      })
      .then((reposne) => {
        if (reposne.data.status) {
          toast.success(reposne.data.message);
          setShowLoadingSpinner(false);
          getAccountImportTags();
          setOpenFinalPopup(false);
          // making aggrid table null
          setAccountImportData([]);
        } else {
          toast.error(reposne.data.message);
        }
        // setIsLoading(false);
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getAccountImportData,
          });
          if (refreshTokenStatus) {
            handleCreateMoveAccountsToAccountTable();
          }
        } else if (error.status === 500) {
          toast.error(error.response.data);
          setOpenFinalPopup(false);
        }
      })
      .finally(() => {
        setShowLoadingSpinner(false);
        // setIsLoading(false);
        onCloseOrUnselectTag();

      });
  };

  useEffect(() => {
    setSearchInput("");
    setSelectedIds([]);
  }, [selectedAccountTag]);

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white px-2 py-1 rounded-lg shadow-sm">
        <span className="flex items-center gap-2 table-header-custom">
          These are the accounts from selected tag:
          <span className="input-label-custom-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            <div className="flex gap-1 items-center justify-between table-header-custom-blue">
              {selectedAccountTag}
              <XCircle
                className={`w-4 h-4 ${COLORS.CANCEL_BUTTON_TEXT_COLOR} cursor-pointer`}
                onClick={onCloseOrUnselectTag}
              />
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
          >
            <div className="flex items-center justify-center gap-0.5">
              <LucideImport size={SIZE.SIXTEEN} />
              Move all Accounts To account data
            </div>
          </Button>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            disabled={!userHasAccessToUpdateLead}
            onClick={() => {
              if (userHasAccessToUpdateLead) {
                if (selectedIds.length !== 0) {
                  updateAccountImport();
                } else {
                  toast.error("Please select at least one Account to delete.");
                }
              }
            }}
          >
            <div className="flex items-center justify-center gap-0.5">
              <Trash2 size={SIZE.SIXTEEN} />
              Delete Selected
            </div>
          </Button>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Name, Email, or Mobile..."
              value={searchInput}
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
      <div className="h-[65vh] mt-2 border rounded-lg overflow-hidden bg-white shadow">
        <AccountImportPreSaveDataAgGrid
          accountImportData={accountImportData}
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


      {/* Confirmation */}
      <ConfirmationDialog
        title="Final Confirmation!"
        description={`Import Tag: ${selectedAccountTag}`}
        message={`⚠️ This is the final confirmation. `}
        messageDescription={`All accounts from "${selectedAccountTag}" will be PERMANENTLY moved to the Account table. \nThis action cannot be undone.`}
        open={openFinalPopup || showLoadingSpinner}
        showLoadingSpinner={showLoadingSpinner}
        onConfirm={handleCreateMoveAccountsToAccountTable}
        onCancel={() => setOpenFinalPopup(false)}
      />
      {
        showLoadingSpinner&&<LoadingPopUpAnimation show={showLoadingSpinner} text="Final Account Importing..."/>
      }
    </div>
  );
};

export default AccountImportData;
