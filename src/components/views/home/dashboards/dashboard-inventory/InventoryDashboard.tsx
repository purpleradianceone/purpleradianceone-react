/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import { useUserPreference } from "../../../../../context/user/UserPreference";
import axiosClient from "../../../../../axios-client/AxiosClient";
import POST_API from "../../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import { AccessManagementType } from "../../../../../@types/company-users/AccessManagementContextType";
import { handleApiError } from "../../../../../config/error/handleApiError";
import QuickActions from "../dashboards_components/QuickActions";
import { DashboardComponentJsxKey } from "../../../../../enums/dashboard/DashboardComponentJsxKey.enum";
import MetricCard from "../dashboards_components/MetricCard";
import { REFCURSOR_KEY } from "../../../../../constants/RefcursorConstants";
import {
  AlertOctagonIcon,
  LucideShoppingCart,
  PackageX,
  TruckIcon,
  Wallet,
  WarehouseIcon,
} from "lucide-react";
import { DashboardLoadingSpinner } from "../dashboards_components/DashboardLoadingSpinner";
type DashboardDataType = Record<string, Array<Record<string, any>>>;

interface DashboardInventoryProp {
  companyUserId: number | null;
}
const InventoryDashboard: React.FC<DashboardInventoryProp> = ({
  companyUserId,
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userPreference } = useUserPreference();
  const [accessModuleCompanyUser, setAccessModuleCompanyUser] = useState<
    AccessManagementType[]
  >([]);
  const [isDashboardDataLoading, setIsDashboardDataLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<DashboardDataType>({});

  const [dashboardLayout, setDashboardLayout] = useState<string[]>([]);
  const [dashboardVisiblity, setDasboardVisibility] = useState<
    { key: string; value: boolean; chartType: string }[]
  >([]);



  const getCrmModuleAccessOfCompanyUser = async () => {
    try {
      const response = await axiosClient.post(
        POST_API.GET_CRM_MODULE_ACCESS,
        {
          company_id: loginStatus.companyId,
          company_user_id: companyUserId,
          requestedby: loginStatus.id,
        },
        { withCredentials: true },
      );

      if (response.status === STATUS_CODE.OK) {
        setAccessModuleCompanyUser(response.data);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const getDashboardData = async () => {
    try {
      setIsDashboardDataLoading(true);
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_USER_DASHBOARD_INVENTORY,
        {
          company_id: loginStatus.companyId,
          assignto: companyUserId,
          requestedby_id: loginStatus.id,
        },
        { withCredentials: true },
      );

      if (response.status === STATUS_CODE.OK) {
        const data = response.data;
        console.log("inventory dashboard data:");
        console.log(data);
        setDashboardLayout(
          data.my_fixed_cursor_get_dashboard_widget?.map(
            (w: any) => w.dashboard_widget_name,
          ) ?? [],
        );

        setDasboardVisibility(
          data.my_fixed_cursor_get_dashboard_widget?.map((w: any) => ({
            key: w.dashboard_widget_name,
            value: true,
            chartType: w.chart_type_name,
          })) ?? [],
        );

        setDashboardData(data);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsDashboardDataLoading(false);
    }
  };

  const getVisibility = (key: string): boolean =>
    dashboardVisiblity.find((v) => v.key.trim() === key.trim())?.value ?? false;

  const TOTAL_TICKET_ROW_COMPONENT_KEYS = [
    "Total Products",
    "Total Stock Value",
    "Low Stock Products",
    "Out of Stock Products",
    "Today's Inward Value",
    "Today's Outward Value",
  ];

  const isAnyKeyVisible = (TOTAL_TICKET_KEYS: string[]): boolean => {
    return dashboardVisiblity.some(
      (v) => TOTAL_TICKET_KEYS.includes(v.key) && v.value === true,
    );
  };

  const componentMapDefault: Record<string, JSX.Element> = {
    [DashboardComponentJsxKey.Total_Products]: isAnyKeyVisible(
      TOTAL_TICKET_ROW_COMPONENT_KEYS,
    ) ? (
      <div
        key={TOTAL_TICKET_ROW_COMPONENT_KEYS[0]}
        className="flex col-span-2 w-full gap-4 justify-around"
      >
        <div
          className={`${userPreference.sidebarOpen && userPreference.isLeftMenu ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full items-stretch" : "flex grid-cols-6 sm:gap-1 md:gap-2 lg:gap-4 w-full"}`}
        >
          <MetricCard
            title={TOTAL_TICKET_ROW_COMPONENT_KEYS[0]}
            id="total_products"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_PRODUCTS
              ]?.[0]?.total_products ?? 0
            ).toString()}
            icon={WarehouseIcon}
            color="bg-gradient-to-r from-cyan-500 to-cyan-600"
            gradient="bg-gradient-to-r from-cyan-500 to-cyan-600"
            visibility={getVisibility(TOTAL_TICKET_ROW_COMPONENT_KEYS[0])}
          />
          <MetricCard
            title={TOTAL_TICKET_ROW_COMPONENT_KEYS[1]}
            id="total_stock_value"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TOTAL_STOCK_VALUE
              ]?.[0]?.total_stock_value ?? 0
            ).toString()}
            icon={Wallet}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
            visibility={getVisibility(TOTAL_TICKET_ROW_COMPONENT_KEYS[1])}
          />
          <MetricCard
            title={TOTAL_TICKET_ROW_COMPONENT_KEYS[2]}
            id="low_stock_products"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_LOW_STOCK_PRODUCTS
              ]?.[0]?.low_stock_products ?? 0
            ).toString()}
            icon={AlertOctagonIcon}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
            visibility={getVisibility(TOTAL_TICKET_ROW_COMPONENT_KEYS[2])}
          />
          <MetricCard
            title={TOTAL_TICKET_ROW_COMPONENT_KEYS[3]}
            id="outof_stock_products"
            value={(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_OUT_OF_STOCK_PRODUCTS
              ]?.[0]?.outof_stock_products ?? 0
            ).toString()}
            icon={PackageX}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            gradient="bg-gradient-to-r from-orange-500 to-orange-600"
            visibility={getVisibility(TOTAL_TICKET_ROW_COMPONENT_KEYS[3])}
          />
          <MetricCard
            title={TOTAL_TICKET_ROW_COMPONENT_KEYS[4]}
            id="today_inward_value_of_products"
            value={
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TODAYS_INWARD_VALUE
              ]?.[0]?.today_inward_value_of_products ?? 0
            }
            icon={LucideShoppingCart}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
            gradient="bg-gradient-to-r from-teal-500 to-teal-600"
            visibility={getVisibility(TOTAL_TICKET_ROW_COMPONENT_KEYS[4])}
          />

          <MetricCard
            title={TOTAL_TICKET_ROW_COMPONENT_KEYS[5]}
            id="today_outward_value_of_products"
            value={`${(
              dashboardData?.[
                REFCURSOR_KEY.MY_FIXED_CURSOR_TODAYS_OUTWARD_VALUE
              ]?.[0]?.today_outward_value_of_products ?? 0
            ).toString()}`}
            icon={TruckIcon}
            color="bg-gradient-to-r from-green-500 to-green-600"
            gradient="bg-gradient-to-r from-green-500 to-green-600"
            visibility={getVisibility(TOTAL_TICKET_ROW_COMPONENT_KEYS[5])}
          />
        </div>
      </div>
    ) : (
      <div />
    ),
    [DashboardComponentJsxKey.QUICK_ACTIONS]: (
      <div
        id="quickActions"
        key="Quick Actions"
        className="h-full col-span-1 overflow-y-auto max-h-[700px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <QuickActions
          companyUserId={companyUserId}
          moduleAccessCompanyUser={accessModuleCompanyUser}
        />
      </div>
    ),
  };

  useEffect(() => {
    if (companyUserId !== null) {
      getCrmModuleAccessOfCompanyUser();
    }
    getDashboardData();
  }, [companyUserId]);



  const renderDashboardSections = () => {
    let totalProductCountRowComponentRendered = false;
    return dashboardLayout.map((key) => {
      if (!getVisibility(key)) return null;
      if (TOTAL_TICKET_ROW_COMPONENT_KEYS.includes(key)) {
        if (!totalProductCountRowComponentRendered) {
          totalProductCountRowComponentRendered = true;
          return componentMapDefault[DashboardComponentJsxKey.Total_Products];
        } else return null;
      }

      return componentMapDefault[key] || null;
    });
  };

  return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {isDashboardDataLoading ? (
          <div className={`grid justify-center items-center min-h-[100vh] ${isDashboardDataLoading?"cursor-wait":"cursor-default"}`}>
            <DashboardLoadingSpinner/>
          </div>
        ) : (
          <div className="max-w-full p-6 mx-auto grid gap-3 grid-cols-2 space-y-5">
            {dashboardVisiblity.length > 0 && renderDashboardSections()}
          </div>
        )}
      </div>
    );

};

export default InventoryDashboard;
