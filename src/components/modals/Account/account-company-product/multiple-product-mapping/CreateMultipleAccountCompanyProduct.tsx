import { Link, useParams } from "react-router-dom";
import  ROUTES_URL  from "../../../../../constants/Routes";

export const CreateMultipleAccountCompanyProduct =()=>{

    const { account_id : accountId} = useParams();

    return(
        <>
        <Link to={`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}`}>
            back
        </Link>
        <h1>
            {accountId}
            Multiple product mapping
        </h1>
        </>
    )
}

