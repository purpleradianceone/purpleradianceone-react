import { useEffect } from "react";
import Account from "../../../../@types/account/Account";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import Button from "../../../ui/Button";

const CreateAccountLead = ({ account }: { account: Account }) => {
  const { loginStatus } = useLoggedInUserContext();


  useEffect(()=>{
    console.log(account);
    console.log(loginStatus);
    
    
  })
//   const CreateAccountLead = () => {
//     const postData = {
//       company_id: loginStatus.companyId,
//       account_id: account.id,
//       lead_id: null,
//       is_lead_converted: null,
//       createdby_id: loginStatus.id,
//     };
//   };

  return (
    <div className="  flex  justify-end ">
      {/* Header */}
      <div className="flex justify-end items-center text-xs gap-x-2 py-0.5 text-gray-500">
        <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-1 py-0.5 rounded-md flex items-center gap-1"
        >

          <span>+Add</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateAccountLead;
