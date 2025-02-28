import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Check, Copy } from "lucide-react";
import { SIZE } from "../../constants/AppConstants";

function LeadSettingsTabs() {
  const [activeTab, setActiveTab] = useState("onlineLead");
  const clientId = "12344522";
  const [copied, setCopied] = useState(false);

  const iframeCode = `<iframe src="http://127.0.0.1:5500/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode)
    console.log(navigator.geolocation)
    setCopied(true);
    setTimeout(() => setCopied(false), 10000); // Reset after 2 seconds
  };

  const data = [
    {
      label: "Form embed",
      value: "onlineLead",
      desc: (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Contact Us Form Integration
          </h2>

          <p className="mb-4 text-gray-700">
            To embed your unique Contact Us form, follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>
              <p className="text-gray-700">Copy the following iframe code:</p>
              <p className="bg-gray-100 p-3 rounded-md">
              <div className="justify-self-end">
                  <button
                  title="copy"
                onClick={copyToClipboard}
                className={`rounded-md ${
                  copied
                    ? 'text-green-500'
                    : 'text-blue-500 hover:text-blue-600'
                } transition-colors duration-200`}
              >
                {copied ? <Check size={SIZE.TWENTY}></Check>
                : <Copy size={SIZE.TWENTY}></Copy>}
              </button>
                  </div>
              <pre className=" overflow-x-auto">
              
                <code id="iframeCode" className="text-sm">
                  
                 <div>
                 {iframeCode}
                 </div>
                  
                </code>
              </pre>
              </p>
              
              
            </li>
            <li>
              <p className="text-gray-700">
                Paste the modified code into your website's Code.
              </p>
            </li>
            <li>
              <p className="text-gray-700">Adjust width and height as needed.</p>
            </li>
          </ol>

          <p className="mb-2 font-semibold text-gray-800">
            Important Notes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Ensure your page uses HTTPS.</li>
            <li>Do not share your Client ID.</li>
            <li>Test the form after embedding.</li>
            <li>Consider responsiveness.</li>
          </ul>
        </div>
      ),
    },
    {
      label: "Reference Leads",
      value: "ReferenceLead",
      desc: (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Reference Leads Management
          </h2>
          <p className="mb-4 text-gray-700">
            Because it's about motivating the doers. Because I'm here
            to follow my dreams and inspire other people to follow their dreams, too.
          </p>
          {/* Add more content to make this tab scrollable */}
          {Array(10).fill(0).map((_, i) => (
            <p key={i} className="mb-4 text-gray-700">
              Additional content to demonstrate scrolling. This is paragraph {i + 1}.
            </p>
          ))}
        </div>
      ),
    },
    {
      label: "ERP Leads",
      value: "erpLead",
      desc: (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            ERP Leads Integration
          </h2>
          <p className="mb-4 text-gray-700">
            We're not always in the position that we want to be at.
            We're constantly growing. We're constantly making mistakes. We're
            constantly trying to express ourselves and actualize our dreams.
          </p>
          {/* Add more content to make this tab scrollable */}
          {Array(10).fill(0).map((_, i) => (
            <p key={i} className="mb-4 text-gray-700">
              Additional content to demonstrate scrolling. This is paragraph {i + 1}.
            </p>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Single Tabs component with fixed header and scrollable body */}
      <Tabs value={activeTab}>
        {/* Fixed header container */}
        <div className="sticky top-0 bg-white z-10 pb-2">
          <TabsHeader
          placeholder="Online Lead"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
              placeholder="Online Lead"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={activeTab === value ? "text-gray-900" : ""}
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
          onPointerLeaveCapture={undefined}>
            {data.map(({ value, desc }) => (
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

export default LeadSettingsTabs;