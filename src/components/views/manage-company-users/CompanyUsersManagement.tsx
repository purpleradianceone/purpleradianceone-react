import { useEffect, useState } from "react";
import companyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import GetCompanyUsersList from "../../lists/CompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import PAGINATION from "../../../constants/Pagination";
import POST_API from "../../../constants/PostApi";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import {
  BOOLEAN_VALUES,
  NUMBER_VALUES,
  STATUS_CODE,
  STRING_VALUES,
} from "../../../constants/AppConstants";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import ROUTES_URL from "../../../constants/Routes";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";

function GetCompanyUsers() {
  const [userUpdateCount, setUserUpdateCount] = useState(0);
  const [companyUsers, setCompanyUsers] = useState<companyUsersSearchProps[]>(
    []
  );
  const { loginStatus } = useLoggedInUserContext();
  const [pageSize, setPageSize] = useState<number>(
    PAGINATION.PAGINATION_COMPANY_USER_DEFAULT_SIZE
  );
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    BOOLEAN_VALUES.FALSE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [dateRangeId, setDateRangeId] = useState(0);
  const [searchParameter, setSearchParameter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [concatDate, setConcatDate] = useState("");

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );

  const { userHasAccessToViewUser } = useUserAccessModules();

  // Date formatting helpers
  const getDefaultStartDateOfYear = (): string => {
    const today = new Date();
    return `01-January-${today.getFullYear()}`;
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleString("en-US", { month: "long" });
    return `${day}-${month}-${today.getFullYear()}`;
  };

  const formatDate = (date: Date): string => {
    if (!date || date.toString() === STRING_VALUES.INVALID_DATE) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Pagination handlers
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Date range handlers
  const handleStartDateChange = (date: Date | null) => {
    if (!date) {
      setStartDate("");
      if (!endDate) {
        setDateRangeId(0);
        setConcatDate("");
      }
      return;
    }
    const formattedDate = formatDate(date);
    setStartDate(formattedDate);
    setDateRangeId(8);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) {
      setEndDate("");
      if (!startDate) {
        setDateRangeId(0);
        setConcatDate("");
      }
      return;
    }
    const formattedDate = formatDate(date);
    setEndDate(formattedDate);
    setDateRangeId(8);
  };

  // Search and filter handlers
  const handleDatePageIdChange = (newDateRangeId?: number) => {
    const id = newDateRangeId || 0;
    setCurrentPage(1);
    setDateRangeId(id);

    if (id !== 8) {
      setStartDate("");
      setEndDate("");
      setConcatDate("");
    }
  };

  const handleSearchParameterChange = (inputSearchParam?: string) => {
    setCurrentPage(1);
    setSearchParameter(inputSearchParam || "");
  };

  const handleCompanyUserChangeOnEdit = (user: CompanyUser) => {
    const userMatches = companyUsers.some(
      (users) => users.id === user.id && users.company_id === user.company_id
    );
    if (userMatches) {
      setUserUpdateCount((prev) => prev + 1);
    }
  };

  // Update concatenated date string
  useEffect(() => {
    if (dateRangeId === NUMBER_VALUES.EIGHT) {
      if (!startDate && !endDate) {
        setConcatDate("");
        setDateRangeId(0);
      } else {
        let effectiveStartDate = startDate;
        const effectiveEndDate = endDate || getCurrentDate();

        // If only end date is provided, use January 1st of current year
        if (!startDate && endDate) {
          effectiveStartDate = getDefaultStartDateOfYear();
        } else if (!endDate && startDate) {
          // If only start date is provided, use current date as end date
          effectiveStartDate = startDate;
        }

        setConcatDate(`${effectiveStartDate}@${effectiveEndDate}`);
      }
    }
  }, [startDate, endDate, dateRangeId]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Fetch data function
  const fetchCompanyUsers = async () => {
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === NUMBER_VALUES.EIGHT && !concatDate
        ? NUMBER_VALUES.ZERO
        : dateRangeId;

    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
    };

    try {
      const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, {
        withCredentials: BOOLEAN_VALUES.TRUE,
      });

      setCompanyUsers(response.data);
      if (response.data[0]?.count) {
        setTotalPages(
          Math.ceil(response.data[NUMBER_VALUES.ZERO].count / pageSize)
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({callFunction : fetchCompanyUsers});
        if(refreshTokenStatus){
          setIsDialogueOpen(BOOLEAN_VALUES.FALSE)
        }
        else{
          setIsDialogueOpen(BOOLEAN_VALUES.TRUE)
        }
      }
    }
  };

  

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCompanyUsers();
    }, 100); // Small delay to allow state updates to settle

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    userUpdateCount,
  ]);

  useEffect(() => {
    if(userHasAccessToViewUser === BOOLEAN_VALUES.FALSE) {
      setAccessDeniedPopUpOpen(BOOLEAN_VALUES.TRUE)
    }
  }, [userHasAccessToViewUser]);

  return (
    <div className="w-full">
      {userHasAccessToViewUser ? (
        <>
          <div>
            <GetCompanyUsersList
              handleCompanyUserChangeOnEdit={handleCompanyUserChangeOnEdit}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
              handleSearchOption={{
                handleSearchParameterChange,
                handleDateIdChange: handleDatePageIdChange,
              }}
              paginationData={{
                selectedPageSize: handlePageSizeChange,
                currentPage,
                handlePageChange,
                totalPages,
                pageSize,
              }}
              users={companyUsers}
            />
          </div>
          <DialogueBox
            isOpen={isDialogueOpen}
            onClose={() => setIsDialogueOpen(BOOLEAN_VALUES.FALSE)}
            onConfirm={handleDialogueConfirm}
            title="Session Expired !"
            message="Session Expired. Please login again."
          />
        </>
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(BOOLEAN_VALUES.FALSE);
              window.history.back();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default GetCompanyUsers;
