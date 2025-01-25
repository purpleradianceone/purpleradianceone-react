import { useEffect, useState } from "react";
import companyUsersProps from "../../../@types/company-users/CompanyUserProps";
import { GetCompanyUsersList } from "../../lists/GetCompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {isTokenExpired} from "../../../config/validations/JwtTokenExpirationValidation";

function GetCompanyUsers() {
  const [companyUsers, setCompanyUsers] = useState<companyUsersProps[]>([]);
  const { loginStatus } = useLoggedInUserContext();
  const {setLoginStatus} = useLoggedInUserContext();

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
      axios.defaults.headers.common["Authorization"] =
      "Bearer " + loginStatus.token;
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.userId,
    };
    axios
      .post("/api/main/purple-crm-api/getcompanyuser", postData)
      .then((response) => {
        setCompanyUsers(response.data);
        console.log(response.data);
        
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, []);
    
  return (
    <div className="w-full">
      <GetCompanyUsersList users={companyUsers}></GetCompanyUsersList>
    </div>
  );
}

export default GetCompanyUsers;
