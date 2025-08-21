import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SIZE } from "../../constants/AppConstants";

function LeadFormEmbed() {
  const clientId = "12344522";
  const [copied, setCopied] = useState<boolean>(false);
  const comingSoon = false;

  const iframeCode = `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 10000);
  };

  return (
    <div className="p-8 max-w-full mx-auto min-h-full bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
      {comingSoon && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
          <p className="text-green-600 text-3xl font-bold hover:text-green-700">Coming Soon!</p>
        </div>
      )}

      <div className={`${comingSoon ? 'opacity-95 pointer-events-none' : ''}`}>
        <h2 className="text-base font-bold mb-2 text-gray-800 text-center">
          Integrate Your Contact Form
        </h2>

        <p className="mb-2 text-gray-600 leading-relaxed text-center">
          Easily embed your unique Contact Us form into your website by following these simple steps:
        </p>

        <ol className="list-decimal text-xs space-y-4 mb-8 text-gray-700">
          <li>
            <p className="font-semibold mb-2">Copy the following iframe code:</p>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 relative">
              <div className="absolute top-2 right-2">
                <button
                  title="Copy Code"
                  onClick={copyToClipboard}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    copied
                      ? 'text-green-600 bg-green-100'
                      : 'text-blue-600 hover:bg-blue-100'
                  } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                >
                  {copied ? <Check size={SIZE.TWENTY} /> : <Copy size={SIZE.TWENTY} />}
                </button>
              </div>
              <pre className="overflow-x-auto pr-10">
                <code id="iframeCode" className="text-sm font-mono text-gray-800">
                  {iframeCode}
                </code>
              </pre>
            </div>
          </li>
          <li>
            <p>
              Paste the copied code snippet into your website's HTML where you want the form to appear.
            </p>
          </li>
          <li>
            <p>
              Adjust the `width` and `height` attributes within the iframe code as needed to fit your website's layout.
            </p>
          </li>
          <li>
            <p>
              if want to adjust the colors of form please append following query parameters in the where you want to change the color
            </p>
          </li>
        </ol>

        <p className="mb-1 font-bold text-gray-800 text-xs">
          Important Notes:
        </p>
        <ol className="list-disc  space-y-1 text-xs text-gray-600">
          <li>Ensure your website page uses **HTTPS** for secure form submission.</li>
          <li><span className="font-semibold">**</span>Do not share your Client ID** with unauthorized individuals.</li>
          <li><span className="font-semibold">**</span> While giving the color always give in <span className="font-semibold">hex code</span> format but without starting # for e.g it the hex code is <span className="font-semibold">#ffffff</span> the pass the color to wuery parameter as <span className="font-semibold">color=ffffff</span></li>
          <li>Always <span className="font-semibold">**</span>test the form thoroughly<span className="font-semibold">**</span> on your website after embedding.</li>
          <li>Consider implementing **responsive design** principles for optimal viewing across devices.</li>
        </ol>
      </div>
    </div>
  );
}

export default LeadFormEmbed;