import { useLocation, useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";

function StockTab() {
  const TABS = [
    {
      label: "Product wise stock view",
      value: "product-stock",
      path: "",
    },
    {
      label: "Warehouse wise stock view",
      value: "warehouse-stock",
      path: ROUTES_URL.WAREHOUSE_WISE_STOCK,
    },
    {
      label: "Stock Ledger",
      value: "stock-ledger",
      path: ROUTES_URL.STOCK_LEDGER,
    },
    {
      label: "Stock Ageing",
      value: "stock-ageing",
      path: ROUTES_URL.STOCK_AGEING,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const basePath = ROUTES_URL.STOCK_MANAGEMENT;

  // Active tab detection
  const activeTab =
    TABS.find((tab) =>
      tab.path
        ? location.pathname.includes(tab.path)
        : location.pathname === basePath,
    )?.value || "product-stock";

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 left-0 bg-white">
          <TabsHeader
            placeholder=""
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            indicatorProps={{
              className:
                "main-nav-custom-setting active-header-setting shadow-none",
            }}
            className="shadow-none"
          >
            {TABS.map(({ label, value, path }) => (
              <Tab
                key={value}
                value={value}
                onClick={() =>
                  navigate(path ? `${basePath}/${path}` : basePath)
                }
                className={
                  activeTab === value
                    ? "main-nav-custom-setting active-tab-setting "
                    : "main-nav-custom-setting"
                }
                placeholder=""
                onResize={undefined}
                onResizeCapture={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </div>
      </Tabs>
    </div>
  );
}

export default StockTab;
