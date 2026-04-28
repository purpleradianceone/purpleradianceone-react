import {
  Outlet,
  Link,
  useLocation,
  useParams,
  useMatch,
} from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import { PageLayout } from "../../../ui/PageLayout";
import { useEffect, useState } from "react";
import { getAccountCompanyProductDetails } from "../../../../config/apis/api";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { handleApiError } from "../../../../config/error/handleApiError";

export default function AccountNavbarBreadcrumb() {
  const location = useLocation();
  const { loginStatus } = useLoggedInUserContext();
  const { accountId, productId } = useParams<{
    accountId: string;
    productId: string;
  }>();

  // Data passed via navigation state
  const { assignProducts } = location.state || {};

  const [accountName, setAccountName] = useState<string>("");

  useEffect(() => {
    if (location.state?.accountName) {
      setAccountName(location.state?.accountName);
    }
  }, [location.state]);

  const [productNameState, setProductNameState] = useState<string>("");

  const productNameFromState = location.state?.productName;

  const parsedAccountId = Number(accountId);
  const parsedProductId = Number(productId);

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
  return (
    <div className="custom-scrollbar">
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

              {productId && (
                <>
                  <ChevronRight size={16} className="text-gray-500" />
                  <span
                    className={`max-w-fit ${
                      isProductDetailsPage
                        ? "table-header-custom"
                        : "caption-custom"
                    } truncate flex gap-2`}
                  >
                    Assigned Product Details
                    <span className="caption-custom">
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
            </div>
          </div>

          {/* Page Content */}
              
          <Outlet />
        </PageLayout>
    </div>
  );
}
