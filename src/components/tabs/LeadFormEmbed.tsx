import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SIZE } from "../../constants/AppConstants";

function LeadFormEmbed (){

const clientId = "12344522";
  const [copied, setCopied] = useState<boolean>(false);

  const iframeCode = `<iframe src="http://127.0.0.1:5500/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode)
    console.log(navigator.geolocation)
    setCopied(true);
    setTimeout(() => setCopied(false), 10000); // Reset after 2 seconds
  };

    return (
        <div className="p-8 max-w-full mx-auto max-h-screen bg-white rounded-xl shadow-lg border border-gray-200"> {/* Increased padding, more rounded, subtle shadow, border */}
  <h2 className="text-base font-bold mb-2 text-gray-800 text-center"> {/* Larger, bolder title, centered */}
    Integrate Your Contact Form
  </h2>

  <p className="mb-2 text-gray-600 leading-relaxed text-center"> {/* Slightly darker text, improved line-height, centered */}
    Easily embed your unique Contact Us form into your website by following these simple steps:
  </p>

  <ol className="list-decimal text-xs space-y-4 mb-8 text-gray-700"> {/* Increased space, darker text for list items */}
    <li>
      <p className="font-semibold mb-2">Copy the following iframe code:</p> {/* Bolder text for instructions */}
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 relative"> {/* Lighter background, more padding, border, relative for button positioning */}
        <div className="absolute top-2 right-2"> {/* Positioning the copy button absolutely */}
          <button
            title="Copy Code"
            onClick={copyToClipboard}
            className={`p-2 rounded-full transition-colors duration-200 ${
              copied
                ? 'text-green-600 bg-green-100' // Green background when copied
                : 'text-blue-600 hover:bg-blue-100' // Blue with hover effect
            } focus:outline-none focus:ring-2 focus:ring-blue-300`} // Focus ring
          >
            {copied ? <Check size={SIZE.TWENTY} /> : <Copy size={SIZE.TWENTY} />}
          </button>
        </div>
        <pre className="overflow-x-auto pr-10"> {/* Added right padding to prevent code from going under button */}
          <code id="iframeCode" className="text-sm font-mono text-gray-800"> {/* Monospace font, slightly darker code text */}
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

  <p className="mb-1 font-bold text-gray-800 text-xs"> {/* Bolder and slightly larger "Important Notes" */}
    Important Notes:
  </p>
  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600"> {/* Increased space, slightly darker text */}
    <li>Ensure your website page uses **HTTPS** for secure form submission.</li>
    <li>**Do not share your Client ID** with unauthorized individuals.</li>
    <li>Always **test the form thoroughly** on your website after embedding.</li>
    <li>Consider implementing **responsive design** principles for optimal viewing across devices.</li>
  </ul>
</div>
    );
}

export default LeadFormEmbed;