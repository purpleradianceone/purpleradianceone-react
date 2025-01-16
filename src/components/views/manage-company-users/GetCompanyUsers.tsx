import { useEffect, useState } from "react";
import companyUsersProps from "../../../@types/company-users/CompanyUserProps";
import { GetCompanyUsersList } from "../../lists/GetCompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";


function GetCompanyUsers(){

    const [companyUsers, setCompanyUsers] = useState<companyUsersProps[]>([]);
    const{loginStatus} = useLoggedInUserContext();
    
    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer "+ loginStatus.token;
        const postData = {
            company_id : loginStatus.companyId,
            requestedby:loginStatus.userId
        }
        axios.post("/api/main/purple-crm-api/getcompanyuser",postData)
        .then((response) => {
            setCompanyUsers(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

    }, []);
    
    

    return (
        <main>
            <GetCompanyUsersList users={companyUsers}></GetCompanyUsersList>
        </main>
    )
}

export default GetCompanyUsers;