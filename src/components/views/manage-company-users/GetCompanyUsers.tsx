import { useEffect, useState } from "react";
import companyUsersProps from "../../../@types/company-users/CompanyUserProps";
import { GetCompanyUsersList } from "../../lists/GetCompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { isTokenExpired } from "../../../config/validations/JwtTokenExpirationValidation";
import { useAccessManagementContext } from "../../../context/user/AccessManagementContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import User from "../../../@types/company-users/User";

function GetCompanyUsers() {
  const [companyUsers, setCompanyUsers] = useState<companyUsersProps[]>([]);
  const { loginStatus } = useLoggedInUserContext();
  const { setLoginStatus } = useLoggedInUserContext();
  const [pageSize, setPageSize] = useState<number>(15);

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const { accessModules, setAccessModules } = useAccessManagementContext();

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [dateRangeId, setDateRangeId] = useState(0);
  const [searchParameter, setSearchParameter] = useState("");
  const [criteriaId, setCriteriaId] = useState(0);

  const [userUpdateCount,setUserUpdateCount] = useState(0);


  // const [isStartDateEmpty, setIsStartDateEmpty]= useState(false);

   // Function to get default date in "01-January-2025" format
   const getDefaultStartDateOfYear = (): string => {
    const today = new Date();
    const defaultYear = today.getFullYear();
    return `01-January-${defaultYear}`;
  };

   // Function to get current date in "DD-MMMM-YYYY" format
   const getCurrentDate = (): string => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0"); // Ensures 2-digit day
    const month = today.toLocaleString("en-US", { month: "long" }); // Full month name
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [concatDate, setConcatDate] = useState("");
  const [radioButtonClicked, setRadioButtonClicked] = useState<
    "Column" | "Date"
  >();

  const handleStartDateChange = (startDate: Date) => {
  
    // setStartDate(startDate.toLocaleDateString())
   
   if(startDate.toLocaleDateString().toString()==="Invalid Date"){
    setStartDate("");
    return;
   } 
    if(startDate.toLocaleDateString().toString().length<1 || startDate.toLocaleDateString().toString()==="Invalid Date"){
      setStartDate(getDefaultStartDateOfYear());
    }else{
      const day = startDate.getDate().toString().padStart(2, "0");
      const month = startDate.toLocaleString("en-US", { month: "long" });
      const year = startDate.getFullYear();

      setStartDate(`${day}-${month}-${year}`);
    }
  };

  const handleEndDateChange = (endDate: Date) => {
    if(endDate.toLocaleDateString().toString()==="Invalid Date"){
      setEndDate("");
      return;
     } 
   
    if(endDate.toLocaleDateString().toString().length<1   || endDate.toLocaleDateString().toString()==="Invalid Date"){
      setEndDate(getCurrentDate());
    }else{
      const day = endDate.getDate().toString().padStart(2, "0");
      const month = endDate.toLocaleString("en-US", { month: "long" });
      const year = endDate.getFullYear();
      setEndDate(`${day}-${month}-${year}`);
    }
    console.log(typeof endDate+" type of end date" );
    console.log(endDate);
    
    
  };

  useEffect(()=>{
    if(endDate.toString()==="" && startDate.toString()===""){
      setConcatDate("")
      return
    }
   
     if(startDate==""  && endDate.length>1 ){
      setConcatDate(getDefaultStartDateOfYear() +'@'+ endDate)

    }else if(startDate.length>1 && endDate==""){
      setConcatDate(startDate +'@'+ getCurrentDate())
    }else{
      setConcatDate(startDate + "@" + endDate);
    }
    console.log(concatDate);
  },[startDate,endDate])



  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDatePageIdChange = (dateRangeId?: number) => {
    if (dateRangeId !==8) {
      setSearchParameter("")
    }
    setDateRangeId(dateRangeId || 0);
  };

  const handleSearchPageCriteriaIdChange = (criteriaId?: number) => {
    setCriteriaId(criteriaId || 0);
  };

  const handleSearchParameterChange = (inputSearchParam?: string) => {
    setSearchParameter(inputSearchParam || "");
  };
  const getTotalPageNumberAsPerPageSize = (count: number) => {
    return Math.ceil(count / pageSize);
  };

  const handleRadioButtonClick = (radioButtonValue: string) => {
    if (radioButtonValue === "Column") {
      setRadioButtonClicked(radioButtonValue);
    } else if (radioButtonValue === "Date") {
      setRadioButtonClicked(radioButtonValue);
    }
  };

  // to go to first page of ag-grid
  useEffect(() => {
    setCurrentPage(1);
  }, [criteriaId, dateRangeId, concatDate,searchParameter]);

  useEffect(() => {
    if (radioButtonClicked === "Column") {
      setDateRangeId(0);
      setConcatDate("");
     
    } else {
      
      setCriteriaId(0);
    }
  }, [radioButtonClicked]);

  useEffect(() => {
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
    } else {
      const getCrmModuleAccessData = {
        company_id: loginStatus.companyId,
        company_user_id: loginStatus.userId,
        requestedby: loginStatus.userId,
      };

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginStatus.token;
      
      axios
        .post(
          "/api/main/purple-crm-api/get/crmmodules/access",
          getCrmModuleAccessData
        )
        .then((response) => {
          setAccessModules(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginStatus.token;
      
      if((dateRangeId ==8 && searchParameter == "" && concatDate.length<11 )){
       const postData = {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.userId,
          limit: pageSize,
          search_company_specific_date_range_id: 0,
          search_parameter: "",
          search_company_specific_criteria_id: 0,
          offset: currentPage * pageSize - pageSize,
        };

        axios
        .post("/api/main/purple-crm-api/getcompanyuser", postData)
        .then((response) => {
          setCompanyUsers(response.data);
          console.log("from 1st");
          
          if (response.data[0].count) {
            setTotalPages(
              Number(getTotalPageNumberAsPerPageSize(response.data[0].count))
            );
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          console.log(concatDate);
        });
      }else {

        
        const postData = {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.userId,
          limit: pageSize,
          search_company_specific_date_range_id: dateRangeId,
          search_parameter: searchParameter || concatDate === "@" ? searchParameter : concatDate.charAt(concatDate.length - 1) === "@" ? searchParameter : concatDate,
          search_company_specific_criteria_id: criteriaId,
          offset: currentPage * pageSize - pageSize,
        };

        axios
        .post("/api/main/purple-crm-api/getcompanyuser", postData)
        .then((response) => {
          setCompanyUsers(response.data);
          console.log("from 2nd");
          
          if (response.data[0].count) {
            setTotalPages(
              Number(getTotalPageNumberAsPerPageSize(response.data[0].count))
            );
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          console.log(concatDate);
        });
      }
      
    }
  }, [
    criteriaId,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    userUpdateCount
  ]);

  const handleCompanyUserChangeOnEdit = (user : User) => {
    const userMatches = companyUsers.some(
      (users) => users.id === user.id && users.company_id === user.company_id
    );
    if (userMatches) {
      setUserUpdateCount(userUpdateCount+1);
    }
        
  } 

  useEffect(() => {
    const hasAccess = accessModules.some(
      (module) => module.crm_module_id === 1 && module.view
    );
    setAccessDeniedPopUpOpen(!hasAccess);
  }, []);

  return (
    <div className="w-full">
      {accessModules.map((module) => {
        if (module.crm_module_id === 1 && module.view) {
          return (
            <GetCompanyUsersList
            handleCompanyUserChangeOnEdit={handleCompanyUserChangeOnEdit}
            key = {module.id}
              // onSubmitButtonDateRangePickerClick={
              //   onSubmitButtonDateRangePickerClick
              // }
              onRadioButtonClick={handleRadioButtonClick}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
              handleSearchOption={{
                handleSearchParameterChange: handleSearchParameterChange,
                handleDateIdChange: handleDatePageIdChange,
                handleSearchPageCriteriaIdChange:
                  handleSearchPageCriteriaIdChange,
              }}
              paginationData={{
                selectedPageSize: handlePageSizeChange,
                currentPage: currentPage,
                handlePageChange: handlePageChange,
                totalPages: totalPages,
                pageSize: pageSize,
              }}
              users={companyUsers}
            />
          );
        }
        return null; // Return null if no valid module is found
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
