import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import LeadFormIntegration from "../views/settings/web-form-integration/LeadFormIntegration";
import ProductFormIntegration from "../views/settings/web-form-integration/ProductFormIntegration";
import CompanySecret from "../../@types/settings/CompanySecret";

function WebFormIntegrationTabs({
    companySecretList,
    handleCompanySecretChange
} : {
    companySecretList : CompanySecret[];
    handleCompanySecretChange : () => void;
}) {
  const [activeTab, setActiveTab] = useState("lead");
  const data = [{
      label: "Lead",
      value: "lead",
      desc: (
        <LeadFormIntegration 
        companySecretList={companySecretList}
        handleCompanySecretChange={handleCompanySecretChange}
        />
      ),
    },
    {
      label: "Product",
      value: "product",
      desc: (
        <ProductFormIntegration
        companySecretList={companySecretList}
        handleCompanySecretChange={handleCompanySecretChange}
        />
      ),
    },
  ];

  return (
    <div className="relative">
      <Tabs value={activeTab}>
        <div className="sticky top-0 bg-white pb-2">
          <TabsHeader
            placeholder="All Tasks"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            className="rounded-none border-b border-blue-gray-50  bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {data.map(({ label, value }) => (
              <Tab
                placeholder="All Tasks"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                key={value}
                value={value}
                onClick={() => {
                  setActiveTab(value);
                }}
                className={
                  activeTab === value ? "text-gray-900 text-sm" : "text-sm"
                }
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
          <TabsBody
            placeholder="Online Lead"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {companySecretList && 
            data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
            
            
          </TabsBody>
        </div>
      </Tabs>
    </div>
  );
}

export default WebFormIntegrationTabs;
