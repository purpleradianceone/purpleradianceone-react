

import { useEffect, useState } from "react";
import companyUsersProps from "../../../@types/company-users/CompanyUserProps";
import { GetCompanyUsersList } from "../../lists/GetCompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { isTokenExpired } from "../../../config/validations/JwtTokenExpirationValidation";
import { useAccessManagementContext } from "../../../context/user/AccessManagementContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import User from "../../../@types/company-users/User";
import MessageSnackBar from "../../ui/MessageSnackbar";

function GetCompanyUsers() {
  const [userUpdateCount, setUserUpdateCount] = useState(0);
  const [companyUsers, setCompanyUsers] = useState<companyUsersProps[]>([]);
  const { loginStatus, setLoginStatus } = useLoggedInUserContext();
  const [pageSize, setPageSize] = useState<number>(15);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const { accessModules } = useAccessManagementContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [dateRangeId, setDateRangeId] = useState(0);
  const [searchParameter, setSearchParameter] = useState("");
  const [criteriaId, setCriteriaId] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [concatDate, setConcatDate] = useState("");
  const [radioButtonClicked, setRadioButtonClicked] = useState<"Column" | "Date">();
 

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'success'
  });

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, type });
  };

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
    if (!date || date.toString() === "Invalid Date") return "";
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
  const handleStartDateChange = (date: Date) => {
    const formattedDate = formatDate(date);
    setStartDate(formattedDate || getDefaultStartDateOfYear());
  };

  const handleEndDateChange = (date: Date) => {
    const formattedDate = formatDate(date);
    setEndDate(formattedDate || getCurrentDate());
  };

  // Search and filter handlers
  const handleDatePageIdChange = (newDateRangeId?: number) => {
    // Reset page to 1 when date range changes
    setCurrentPage(1);
    
    if (newDateRangeId !== 8) {
      setSearchParameter("");
    }
    setDateRangeId(newDateRangeId || 0);
  };

  const handleSearchPageCriteriaIdChange = (newCriteriaId?: number) => {
    // Reset page to 1 when criteria changes
    setCurrentPage(1);
    setCriteriaId(newCriteriaId || 0);
  };

  useEffect(()=>{
    if(dateRangeId<8 ){
      setConcatDate("")
    }
  },[dateRangeId<8])

  const handleSearchParameterChange = (inputSearchParam?: string) => {
    // Reset page to 1 when search parameter changes
    setCurrentPage(1);
    setSearchParameter(inputSearchParam || "");
  };

  const handleRadioButtonClick = (radioButtonValue: string) => {
    if (radioButtonValue === "Column" || radioButtonValue === "Date") {
      // Reset page to 1 when switching between Column and Date
      setCurrentPage(1);
      setRadioButtonClicked(radioButtonValue);
    }
  };

  const handleCompanyUserChangeOnEdit = (user: User) => {
    const userMatches = companyUsers.some(
      (users) => users.id === user.id && users.company_id === user.company_id
    );
    if (userMatches) {
      setUserUpdateCount(prev => prev + 1);
    }
  };

  // Fetch data function
  const fetchCompanyUsers = async () => {
    if (isTokenExpired(loginStatus.token)) {
      window.location.href = "/signin";
      setLoginStatus({
        userId: 0,
        companyId: 0,
        status: false,
        message: "",
        token: "",
        email: "",
        fullname: "",
      });
      return;
    }

   
    const offset = (currentPage - 1) * pageSize;

    const shouldSkipSearch = dateRangeId === 8 && !searchParameter && concatDate.length < 11;
    
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.userId,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: shouldSkipSearch ? 0 : dateRangeId,
      search_parameter: shouldSkipSearch ? "" : (searchParameter || concatDate),
      search_company_specific_criteria_id: shouldSkipSearch ? 0 : criteriaId,
    };

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${loginStatus.token}`;
      const response = await axios.post("/api/main/purple-crm-api/getcompanyuser", postData);
      
      setCompanyUsers(response.data);
      if (response.data[0]?.count) {
        setTotalPages(Math.ceil(response.data[0].count / pageSize));
      }
      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showSnackbar("", 'info');
      handleClose();
    } 
  };

  // Effects
  useEffect(() => {
    if (!startDate && !endDate) {
      setConcatDate("");
      return;
    }

    const effectiveStartDate = startDate || getDefaultStartDateOfYear();
    const effectiveEndDate = endDate || getCurrentDate();
    setConcatDate(`${effectiveStartDate}@${effectiveEndDate}`);
  }, [startDate, endDate]);

  useEffect(() => {
    if (radioButtonClicked === "Column") {
      setDateRangeId(0);
      setConcatDate("");
    } else {
      setCriteriaId(0);
    }
  }, [radioButtonClicked]);

  useEffect(() => {
    fetchCompanyUsers();
  }, [
    criteriaId,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    userUpdateCount
  ]);

  useEffect(() => {
    const hasAccess = accessModules.some(
      (module) => module.crm_module_id === 1 && module.view
    );
    setAccessDeniedPopUpOpen(!hasAccess);
  }, [accessModules]);

  return (
    <div className="w-full">
      {accessModules.map((module) => {
        if (module.crm_module_id === 1 && module.view) {
          return (
            <div key={module.id}>
              <GetCompanyUsersList
                handleCompanyUserChangeOnEdit={handleCompanyUserChangeOnEdit}
                onRadioButtonClick={handleRadioButtonClick}
                onEndDateChange={handleEndDateChange}
                onStartDateChange={handleStartDateChange}
                handleSearchOption={{
                  handleSearchParameterChange,
                  handleDateIdChange: handleDatePageIdChange,
                  handleSearchPageCriteriaIdChange,
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
              <MessageSnackBar
                isOpen={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={handleClose}
                duration={500}
              />
            </div>
          );
        }
        return null;
      })}
      {accessDeniedPopUpOpen && (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default GetCompanyUsers;