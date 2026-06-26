import { useState } from "react";
import AccountContact from "./account-contact-temp/AccountContact";
import Account from "../../../@types/account/Account";
import AccountLead from "./account-lead/AccountLead";
import AccountCompanyType from "./AccountCompanyType";

export const AccountContactLeadTypeConjuction = ({
  account,
}: {
  account: Account;
}) => {
  type ActiveCard = "accountRelatedLeads" | "contact" | "companyAccountType";
  const [activeTab, setActiveTab] = useState<ActiveCard>("contact");

  const handleClickCards = (event: React.MouseEvent<HTMLElement>) => {
    const id = event.currentTarget.id as ActiveCard;
    setActiveTab(id);
  };

  return (
    <div className=" "> 
      <div className="bg-slate-200 border-b-2 pl-1  flex caption-custom gap-4">
        <span
          id="contact"
          className={`cursor-pointer ${
            activeTab === "contact"
              ? "border-b-2 border-blue-500 caption-custom-blue"
              : "hover:text-blue-500"
          }`}
          onClick={handleClickCards}
        >
          Contacts
        </span>
        <span
          id="accountRelatedLeads"
          className={`cursor-pointer ${
            activeTab === "accountRelatedLeads"
              ? "border-b-2 border-blue-500 caption-custom-blue"
              : "hover:text-blue-500"
          }`}
          onClick={handleClickCards}
        >
          Account Related Leads
        </span>

        <span
          id="companyAccountType"
          className={`cursor-pointer ${
            activeTab === "companyAccountType"
              ? "border-b-2 border-blue-500 caption-custom-blue"
              : "hover:text-blue-500"
          }`}
          onClick={handleClickCards}
        >
          Company Account Type
        </span>
      </div>
      <div className="h-full max-h-[270px]  overflow-auto custom-scrollbar w-full ">

      {activeTab === "contact" && (
        <div className="h-full px-1"
        >
          {/* <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
                            Account Contacts
                          </h3> */}
          <AccountContact accountId={account.id} />
        </div>
      )}
      {activeTab === "accountRelatedLeads" && (
        <div className="h-full px-1">
          <AccountLead account={account} />
        </div>
      )}
      {activeTab === "companyAccountType" && (
        <div className="h-full px-1">
          <AccountCompanyType accountId={account.id} />
        </div>
      )}
      </div>
    </div>
  );
};
