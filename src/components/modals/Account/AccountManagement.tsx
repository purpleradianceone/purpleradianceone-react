import React, { useEffect, useState } from "react";

import AccountCompanyProduct from "./account-company-product/AccountCompanyProduct";
import { useAccountDetails } from "../../../config/hooks/useGetAccountDetails";
import ROUTES_URL from "../../../constants/Routes";
import { useNavigate, useParams } from "react-router-dom";
import { parseInt } from "lodash";
import AccountDetailsUpdated from "./AccountDetailsUpdated";
import AccountService from "./account-service/AccountService";
import AccountSubscription from "./account-subscription/AccountSubscription";
import AccountInvoice from "./account-invoice/AccountInvoice";
import Tabs from "../../ui/Tabs";
import { AccountContactLeadTypeConjuction } from "./AccountContactLeadTypeConjuctionComponent";
import AccountProformaInvoice from "./account-proforma-invoice/AccountProformaInvoice";
import { LocalStorageTabKeys } from "../../../enums/LocalStorageKeys";
import AccountQuotationDetails from "./account-quotation/AccountQuotationDetails";

const AccountManagement: React.FC = () => {
  const { accountId } = useParams();
  const { accountDetails: company, loading: accountDetailsLoading } =
    useAccountDetails(parseInt(accountId!));
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => {
    return (
      localStorage.getItem(LocalStorageTabKeys.TAB_STORAGE_KEY) || "product"
    );
  });
  const tabList = [
    { key: "product", label: "Product" },
    { key: "service", label: "Service" },
    { key: "subscription", label: "Subscription" },
    { key: "invoice", label: "Invoice" },
    { key: "proforma-invoice", label: "Proforma Invoice" },
    { key: "quotation", label: "Quotation" },
  ];
  const parsedAccountId = Number(accountId);

  useEffect(() => {
    localStorage.setItem(LocalStorageTabKeys.TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);
  useEffect(() => {
    if (!accountId || Number.isNaN(parsedAccountId)) {
      navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
    }
  }, [accountId, parsedAccountId, navigate]);

  useEffect(() => {
    if (!accountDetailsLoading && company === undefined) {
      navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
      return;
    }
  }, [accountDetailsLoading, company, navigate]);

  if (accountDetailsLoading) {
    return (
      <>
        <Skeleton />
      </>
    );
  }

  if (!company) {
    return null; // navigation will already trigger
  }
  return (
    // <>

    <div className="pb-3 mt-0.5  ">
      {/* Header Section */}
      {/* Main Content Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2    gap-1">
        <div className="bg-white rounded-md border p-1 border-slate-200">
          <AccountDetailsUpdated />
        </div>

        {/* Right Card - Empty for future use */}
        <div className="bg-white rounded-md border  border-slate-200">
          <AccountContactLeadTypeConjuction account={company} />
        </div>

        {/* Account Lead */}

        {/* <div className="bg-white rounded-md border p-1 border-slate-200">
         
          <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
            <span>Account Related Leads</span>
          </div>
          
        </div> */}

        {/* Account company type */}

        {/* <div className="bg-white rounded-md border p-1 border-slate-200">
          <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
            <span>Company Account Type</span>
          </div>
         
        </div> */}

        {/* Account company product */}
        {/* <div className="bg-white col-span-2 rounded-md border p-1 border-slate-200">
          <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
            Product Details
          </h3>
          <AccountCompanyProduct
            accountId={company!.id}
          />
        </div>

        <div className="bg-white col-span-2 rounded-md border p-1 border-slate-200">
          <AccountService accountId={company.id} />
        </div>
        <div className="bg-white col-span-2 rounded-md border p-1 border-slate-200">
          <AccountSubscription
            accountId={company!.id}
          />
        </div>
        <div className="bg-white col-span-2 rounded-md border p-1 border-slate-200">
          <AccountInvoice
            account={company}
          />
        </div> */}
      </div>
      <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} />
      <div className="bg-white col-span-2 rounded-md border p-1 border-slate-200">
        {activeTab === "product" && (
          <>
            {/* <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
              Product Details
            </h3> */}
            <AccountCompanyProduct accountId={company!.id} />
          </>
        )}

        {activeTab === "service" && <AccountService accountId={company!.id} />}

        {activeTab === "subscription" && (
          <AccountSubscription accountId={company!.id} />
        )}

        {activeTab === "invoice" && (
          <AccountInvoice isNavigateFrom="accountInvoice" account={company} />
        )}
        {activeTab === "proforma-invoice" && (
          <AccountProformaInvoice account={company} />
        )}

         {activeTab === "quotation" && (
          <AccountQuotationDetails account={company} />
        )}
      </div>
    </div>
  );
};

// Note : this is the form skeleton
const Skeleton: React.FC = () => {
  return (
    <div className="    bg-white animate-pulse">
      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex flex-col space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Tab and Content Section */}
      <div className="flex space-x-4 mb-6">
        <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
        <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
        <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side (Contact, Mobile, Website) */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        {/* Right Side (Account Contact) */}
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side (Contact, Mobile, Website) */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        {/* Right Side (Account Contact) */}
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
