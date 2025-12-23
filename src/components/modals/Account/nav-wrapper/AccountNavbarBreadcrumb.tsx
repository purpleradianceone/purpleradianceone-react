import {
  Outlet,
  Link,
  useLocation,
  useParams,
  useMatch,
} from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ROUTES_URL from "../../../../constants/Routes";
import Navbar from "../../../views/home/navbar/Navbar";
import { PageLayout } from "../../../ui/PageLayout";
import { useEffect, useState } from "react";

export default function AccountNavbarBreadcrumb() {
  const location = useLocation();

  const { accountId } = useParams<{ accountId: string }>();

  // Data passed via navigation state
  const {  productName, assignProducts } = location.state || {};

  const [accountName , setAccountName ] = useState<string>("");

  useEffect(()=> {
    if(location.state?.accountName){
        setAccountName(location.state?.accountName);
    }
  }, [location.state])

  const isAccountDetailsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId`
  );
  const isProductDetailsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId/products/:productId`
  );
  const isAssignProductsPage = useMatch(
    `${ROUTES_URL.ACCOUNT_DETAILS}/:accountId/${ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT}`
  );
  return (
    <>
      <Navbar>
        <PageLayout >
          {/* Sticky Navigation Header */}
          <div className="sticky top-0 z-20 bg-white py-0.5 border-b">
            <div className="flex items-center text-center  gap-3 mx-1">
              <Link to={ROUTES_URL.ACCOUNT_MANAGEMENT} className="">
                <button className="caption-custom  hover:text-gray-700 hover:font-medium">Accounts</button>
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
                  {accountName && (
                    <span className="ml-2 max-w-[240px] truncate caption-custom">
                      ({accountName})
                    </span>
                  )}
                </h1>
              </Link>

              {productName && (
                <>
              <ChevronRight size={16} className="text-gray-500" />
                  <span className={`max-w-fit ${isProductDetailsPage ? "table-header-custom" :"caption-custom"}  truncate flex gap-2`}>
                    Assigned Product Details 
                    <span className="caption-custom"> ({productName})
                        </span>
                  </span>
                </>
              )}

              {assignProducts && (
                <>
              <ChevronRight size={16} className="text-gray-500" />
                  <span className={`max-w-fit ${isAssignProductsPage ? "table-header-custom" :"caption-custom"}  truncate `}>
                    Assign-Products
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Page Content */}

          <Outlet />
        </PageLayout>
      </Navbar>
    </>
  );
}
