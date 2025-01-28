import { useEffect, useState } from "react";
import companyUsersProps from "../../../@types/company-users/CompanyUserProps";
import { GetCompanyUsersList } from "../../lists/GetCompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {isTokenExpired} from "../../../config/validations/JwtTokenExpirationValidation";
import { useAccessManagementContext } from "../../../context/user/AccessManagementContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
function GetCompanyUsers() {
  const [companyUsers, setCompanyUsers] = useState<companyUsersProps[]>([]);
  const { loginStatus } = useLoggedInUserContext();
  const {setLoginStatus} = useLoggedInUserContext();
  const [pageSize,setPageSize] = useState<number>(15);

  const[accessDeniedPopUpOpen,setAccessDeniedPopUpOpen] = useState(false);
 
  const {accessModules,setAccessModules} = useAccessManagementContext();

  const handlePageSizeChange = (size: number) => {
          setPageSize(size);
          setCurrentPage(1); // Reset to page 1 when page size changes
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState<number>(0);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getTotalPageNumberAsPerPageSize = (count : number) => {
      return Math.ceil(count / pageSize);
  }
  useEffect(() => {

    if(isTokenExpired(loginStatus.token)){
      window.location.href = '/signin';
      setLoginStatus({
        userId : 0,
        companyId : 0,
        status: false,
        message: "",
        token: "",
        email: "",
        fullname:"",
      });
    }
    else{
      const getCrmModuleAccessData = {
        company_id : loginStatus.companyId,
        company_user_id: loginStatus.userId,
      };

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginStatus.token;
      axios
        .post(
          "/api/main/purple-crm-api/get/crmmodules/access",
          getCrmModuleAccessData
        )
        .then((response) => {
          setAccessModules(response.data)
        })
        .catch((error) => {
          console.error(error);
        });

      axios.defaults.headers.common["Authorization"] =
      "Bearer " + loginStatus.token;
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.userId,
      limit: pageSize,
      offset: (currentPage*pageSize)-pageSize,
    };
    axios
      .post("/api/main/purple-crm-api/getcompanyuser", postData)
      .then((response) => {
        setCompanyUsers(response.data);
        setTotalPages(Number(getTotalPageNumberAsPerPageSize(response.data[0].count)));
        
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [pageSize,currentPage]);

  
  useEffect(() => {
    const hasAccess = accessModules.some(module => module.crm_module_id === 1 && module.view);
    setAccessDeniedPopUpOpen(!hasAccess);
  }, []);


  return (
    <div className="w-full">
    {accessModules.map((module) => {
      if (module.crm_module_id === 1 && module.view) {
        return (
          <GetCompanyUsersList
            key={module.id} // Ensure to add a unique key for each module
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
