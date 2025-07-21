import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SIZE } from "../../constants/AppConstants";

function LeadFormEmbed() {
  const clientId = "12344522";
  const [copied, setCopied] = useState<boolean>(false);
  // Add a state variable to control the "Coming Soon" visibility
  const comingSoon = true; // Set to true to show "Coming Soon" by default

  const iframeCode = `<iframe src="contact-us-form/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode);
    console.log(navigator.geolocation);
    setCopied(true);
    setTimeout(() => setCopied(false), 10000); // Reset after 10 seconds
  };

  return (
    <div className="p-8 max-w-full mx-auto max-h-screen bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
      {/* Coming Soon Overlay */}
      {comingSoon && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
          <p className="text-green-600 text-3xl font-bold hover:text-green-700">Coming Soon!</p>
        </div>
      )}

      {/* Original Content (conditionally hidden) */}
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
        </ol>

        <p className="mb-1 font-bold text-gray-800 text-xs">
          Important Notes:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
          <li>Ensure your website page uses **HTTPS** for secure form submission.</li>
          <li>**Do not share your Client ID** with unauthorized individuals.</li>
          <li>Always **test the form thoroughly** on your website after embedding.</li>
          <li>Consider implementing **responsive design** principles for optimal viewing across devices.</li>
        </ul>
      </div>
    </div>
  );
}

export default LeadFormEmbed;