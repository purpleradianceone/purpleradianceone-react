/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import CompanySecret from "../../../../@types/settings/CompanySecret";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import toast from "react-hot-toast";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import MESSAGE from "../../../../constants/Messages";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

function WebFormEmbed({
  companySecretList,
  integrationFor,
  handleCompanySecretChange,
}: {
  companySecretList: CompanySecret[];
  integrationFor: "lead" | "product";
  handleCompanySecretChange : () => void;
}) {
  const clientId = "your_generated_client_id";
  const [copied, setCopied] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const comingSoon = false;
  const { loginStatus } = useLoggedInUserContext();
  const {userHasAccessToUpdateSettingGeneral} = useUserAccessModules();

  const getIframeCode =() => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      const secretCode = secret ? secret.secretCode : clientId;
      return `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${secretCode}" width="50%" height="700px" frameborder="0"></iframe>`;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      const secretCode = secret ? secret.secretCode : clientId;
      return `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${secretCode}" width="50%" height="700px" frameborder="0"></iframe>`;
    }

    return `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getIframeCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 10000);
  };

  const getId = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      const id = secret ? secret.id : null;
      return id;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      const id = secret ? secret.id : null;
      return id;
    }
  };

  const getDomains = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      const domains = secret ? secret.allowedDomains : null;
      return domains;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      const domains = secret ? secret.allowedDomains : null;
      return domains;
    }
  };
  const refreshCompanySecret = async () => {
    if(!userHasAccessToUpdateSettingGeneral){
  toast.error(MESSAGE.ERROR.NOT_ATHORISED);
  return;
 }


    const refreshCompanySecretPostData = {
      company_id: loginStatus.companyId,
      id: getId(),
      allowed_domains: getDomains(),
      is_refresh_secret_code: true,
      updatedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.UPDATE_COMPANY_SECRET, refreshCompanySecretPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            handleCompanySecretChange();
            setRefresh(true);
            setTimeout(() => setRefresh(false), 10000);
          } else {
            toast.error(response.data.message);
          }
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: refreshCompanySecret,
          });
          if (refreshTokenStatus) {
            refreshCompanySecret();
          }
        }
      });
  };

  return (
    <div className="p-8 max-w-full mx-auto min-h-full bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
      {comingSoon && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
          <p className="text-green-600 text-3xl font-bold hover:text-green-700">
            Coming Soon!
          </p>
        </div>
      )}

      <div className={`${comingSoon ? "opacity-95 pointer-events-none" : ""}`}>
        <h2 className="text-base font-bold mb-2 text-gray-800 text-center">
          Integrate Your Contact Form For
          {integrationFor === "lead"
            ? " Leads"
            : integrationFor === "product"
            ? " Products"
            : ""}
          <div className="float-right">
            <button
              title="Regenerate Client Id"
              onClick={refreshCompanySecret}
              className={`p-2 rounded-full transition-colors duration-200 ${
                refresh
                  ? "text-green-600 bg-green-100"
                  : "text-blue-600 hover:bg-blue-100"
              } focus:outline-none focus:ring-2 focus:ring-blue-300`}
            >
              {refresh ? (
                <Check size={SIZE.TWENTY} />
              ) : (
                <RefreshCcw size={SIZE.TWENTY} />
              )}
            </button>
          </div>
        </h2>

        <p className="mb-2 text-gray-600 leading-relaxed text-center">
          Easily embed your unique contact form into your website by following
          these simple steps:
        </p>

        <ol className="list-decimal text-xs space-y-4 mb-8 text-gray-700">
          <li>
            <p className="font-semibold mb-2">
              Copy the following iframe code:
            </p>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 relative">
              <div className="absolute top-2 right-2">
                <button
                  title="Copy Code"
                  onClick={copyToClipboard}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    copied
                      ? "text-green-600 bg-green-100"
                      : "text-blue-600 hover:bg-blue-100"
                  } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                >
                  {copied ? (
                    <Check size={SIZE.TWENTY} />
                  ) : (
                    <Copy size={SIZE.TWENTY} />
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto pr-10">
                <code
                  id="iframeCode"
                  className="text-sm font-mono text-gray-800"
                >
                  {getIframeCode()}
                </code>
              </pre>
            </div>
          </li>
          <li>
            <p>
              Paste the code snippet into your website's HTML where you want the
              form to appear.
            </p>
          </li>
          <li>
            <p>
              Adjust the `width` and `height` attributes within the iframe code
              as needed to fit your website's layout.
            </p>
          </li>
          <li>
            <p>
              To customize the form's colors, append the appropriate query
              parameters to the URL. as follows :
              <ol className="list-disc list-inside text-xs space-y-1 mb-1 text-gray-700">
                <li>
                  <span className="font-semibold">"color" : </span>background
                  color
                </li>
                <li>
                  <span className="font-semibold">"header-color" : </span>
                  heading text color
                </li>
                <li>
                  <span className="font-semibold">"label-color" : </span>labels
                  text color
                </li>
                <li>
                  <span className="font-semibold">"button-color" : </span>button
                  background color
                </li>
                <li>
                  <span className="font-semibold">"button-text-color" : </span>
                  button text color
                </li>
              </ol>
            </p>
          </li>
        </ol>

        <p className="mb-1 font-bold text-gray-800 text-xs">Important Notes:</p>
        <ol className="list-disc space-y-1 text-xs text-gray-600">
          <li>
            Ensure your website page uses **HTTPS** for secure form submissions.
          </li>
          <li>
            **Do not share your Client ID** with unauthorized individuals.
          </li>
          <li>
            When specifying a color, always use the **hex code format without
            the starting #**. For example, if the hex code is `#ffffff`, pass
            the color as `color=ffffff`.
          </li>
          <li>
            Always **thoroughly test the form** on your website after embedding
            it.
          </li>
          <li>
            Consider implementing **responsive design** principles for optimal
            viewing across all devices.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default WebFormEmbed;
