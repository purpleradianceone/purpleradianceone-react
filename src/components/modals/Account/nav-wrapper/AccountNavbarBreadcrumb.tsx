import {
  Outlet,
  Link,
  useLocation,
  useParams,
  useMatch,
  useSearchParams,
} from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import { PageLayout } from "../../../ui/PageLayout";
import { useEffect, useState } from "react";
import { getAccountCompanyProductDetails, getAccountSubscriptionDetails } from "../../../../config/apis/api";
import { getAccountServiceDetails } from "../../../../config/apis/api";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { handleApiError } from "../../../../config/error/handleApiError";

export default function AccountNavbarBreadcrumb() {
  const location = useLocation();
  const { loginStatus } = useLoggedInUserContext();
  const { accountId, productId, accountServiceId, accountSubscriptionId } = useParams<{
    accountId: string;
    productId?: string;
    accountServiceId?: string;
    accountSubscriptionId?: string;
  }>();
    const [searchParams] = useSearchParams();


  const [navigatingFromOtherPage, setNavigatingfromOtherPage] = useState<string|null>(null);


  // Data passed via navigation state
  const { assignProducts } = location.state || {};

  const [accountName, setAccountName] = useState<string>("");

  useEffect(() => {
    if (location.state?.accountName) {
      setAccountName(location.state?.accountName);
    }
    
    if(searchParams.has("navigatingFrom")){
      setNavigatingfromOtherPage(searchParams.get("navigatingFrom"));
    }else{
      setNavigatingfromOtherPage(null);
    }
  }, [location.state]);

  useEffect(()=>{
    if(searchParams.has("navigatingFrom")){
      setNavigatingfromOtherPage(searchParams.get("navigatingFrom"));
    }else{
      setNavigatingfromOtherPage(null);
    }
  },[searchParams]);

  const [productNameState, setProductNameState] = useState<string>("");

  const productNameFromState = location.state?.productName;

  const parsedAccountId = Number(accountId);
  const parsedProductId = Number(productId);

  const [serviceCode, setServiceCode] = useState<string>("");
  const serviceCodeFromState = location.state?.serviceCode;

  const [subscriptionCode, setSubscriptionCode] = useState<string>("");
  const subscriptionCodeFromState = location.state?.subscriptionCode;



  useEffect(() => {
    const apicall = async () => {
      if (productNameFromState) {
        setProductNameState(productNameFromState);
        return;
      }

      if (!productId || !loginStatus) {
        return;
      }

      try {
        const response = await getAccountCompanyProductDetails({
          company_id: loginStatus.companyId,
          id: parsedProductId,
          account_id: parsedAccountId,
          company_product_id: null,
          requestedby: loginStatus.id,
        });

        if (response.status) {
          if (response.data.length > 0) {
            setProductNameState(response.data[0].company_product_name);
          }
        }
      } catch (error) {
        handleApiError(error);
      }
    };
    apicall();
  }, [productId, loginStatus]);


  useEffect(() => {
  const fetchService = async () => {
 
    if (serviceCodeFromState) {
      setServiceCode(serviceCodeFromState);
      return;
    }

    if (!accountServiceId || !loginStatus) return;

    try {
      const response = await getAccountServiceDetails({
        company_id: loginStatus.companyId,
        account_service_id: Number(accountServiceId),
        requestedby_id: loginStatus.id,
      });

      if (response.status) {
        if (response.data.length > 0) {
          setServiceCode(response.data[0].account_service_code);
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  fetchService();
}, [accountServiceId, loginStatus, serviceCodeFromState]);



  useEffect(() => {
  const fetchSubscription = async () => {
 
    if (subscriptionCodeFromState) {
      setSubscriptionCode(subscriptionCodeFromState);
      return;
    }

    if (!accountSubscriptionId || !loginStatus) return;

    try {
      const response = await getAccountSubscriptionDetails({
        company_id: loginStatus.companyId,
        account_subscription_id: Number(accountSubscriptionId),
        requestedby_id: loginStatus.id,
      });

     const data = Array.isArray(response.data)
  ? response.data
  : response.data?.data;

if (data && data.length > 0) {
  const item = data.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (i: any) => i.id === Number(accountSubscriptionId)
  );

  if (item) {
    setSubscriptionCode(item.account_subscription_code);
  }
}
    } catch (error) {
      handleApiError(error);
    }
  };
  fetchSubscription();
}, [accountSubscriptionId, loginStatus, subscriptionCodeFromState]);

  const isAccountDetailsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId`
  );
  const isProductDetailsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId/products/:productId`
  );
  const isAssignProductsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId/${ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT}`
  );
  const [showName, setShowName] = useState<boolean>(false);

  const isServiceDetailsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId/${ROUTES_URL.ACCOUNT_SERVICE_DETAILS}/:accountServiceId`
  );

  const isSubscriptionDetailsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId/${ROUTES_URL.ACCOUNT_SUBSCRIPTION_DETAILS}/:accountSubscriptionId`
  );
  return (
    <>
        <PageLayout onScrollChange={setShowName}>
          {/* Sticky Navigation Header */}
          <div className="sticky top-0 z-20 bg-white py-0.5 border-b">
            <div className="flex items-center text-center  gap-3 mx-1">
              <Link to={ROUTES_URL.ACCOUNT_MANAGEMENT} className="">
                <span className="caption-custom  hover:text-gray-700 hover:font-medium">
                  Accounts
                </span>
              </Link>

              <ChevronRight size={16} className="text-gray-500" />
              <Link to={`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}`}>
                <h1
                  className={`${
                    isAccountDetailsPage &&
                    !isProductDetailsPage &&
                    !isAssignProductsPage
                      ? "table-header-custom"
                      : "caption-custom hover:text-gray-700 hover:font-medium"
                  }`}
                >
                  Account Details
                  {isAccountDetailsPage
                    ? accountName &&
                      showName && (
                        <span className="ml-2 max-w-[240px] truncate caption-custom">
                          ({accountName})
                        </span>
                      )
                    : accountName && (
                        <span className="ml-2 max-w-[240px] truncate caption-custom">
                          ({accountName})
                        </span>
                      )}
                </h1>
              </Link>

              {navigatingFromOtherPage&&(
                <>
                  <ChevronRight size={16} className="text-gray-500" />
                  <Link to={`${ROUTES_URL.COMPANY_PRODUCT_SALE_MANAGEMENT}`} className="">
                  <span className="max-w-fit caption-custom truncate flex gap-x-2 items-center hover:text-gray-700 hover:font-medium">
                    Sales
                  </span>
                  </Link>
                </>
              )
              
              }

              {productId && (
                <>
                  <ChevronRight size={16} className="text-gray-500" />
                  <span
                    className={`max-w-fit ${
                      isProductDetailsPage
                        ? "table-header-custom"
                        : "caption-custom"
                    } truncate flex gap-x-2 items-center`}
                  >
                    Assigned Product Details
                    <span className="caption-custom ">
                      ({productNameState || "loading..."})
                    </span>
                  </span>
                </>
              )}

              {assignProducts && (
                <>
                  <ChevronRight size={16} className="text-gray-500" />
                  <span
                    className={`max-w-fit ${
                      isAssignProductsPage
                        ? "table-header-custom"
                        : "caption-custom"
                    }  truncate `}
                  >
                    Assign-Products
                  </span>
                </>
              )}
              {accountServiceId && (
                <>
                  <ChevronRight size={16} className="text-gray-500" />
                  <span
                    className={`max-w-fit ${
                      isServiceDetailsPage
                        ? "table-header-custom"
                        : "caption-custom"
                    } truncate flex gap-x-2 items-center`}
                  >
                    Service Details
                    <span className="caption-custom">
                      ({serviceCode || "loading..."})
                    </span>
                  </span>
                </>
              )}

              {accountSubscriptionId && (
                <>
                  <ChevronRight size={16} className="text-gray-500" />
                  <span
                    className={`max-w-fit ${
                      isSubscriptionDetailsPage
                        ? "table-header-custom"
                        : "caption-custom"
                    } truncate flex gap-x-2 items-center`}
                  >
                    Subscription Details
                    <span className="caption-custom">
                      ({subscriptionCode || "loading..."})
                    </span>
                  </span>
                </>
              )}

            </div>
          </div>

          {/* Page Content */}

          <Outlet />
        </PageLayout>
    </>
  );
}
