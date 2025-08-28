// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Check, Copy, RefreshCcw } from "lucide-react";
// import { useState } from "react";
// import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
// import CompanySecret from "../../../../@types/settings/CompanySecret";
// import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
// import axios from "axios";
// import toast from "react-hot-toast";
// import POST_API from "../../../../constants/PostApi";
// import ApiError from "../../../../@types/error/ApiError";
// import RefreshToken from "../../../../config/validations/RefreshToken";
// import MESSAGE from "../../../../constants/Messages";
// import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

// function WebFormEmbed({
//   companySecretList,
//   integrationFor,
//   handleCompanySecretChange,
// }: {
//   companySecretList: CompanySecret[];
//   integrationFor: "lead" | "product";
//   handleCompanySecretChange : () => void;
// }) {
//   const clientId = "your_generated_client_id";
//   const [copied, setCopied] = useState<boolean>(false);
//   const [refresh, setRefresh] = useState<boolean>(false);
//   const comingSoon = false;
//   const { loginStatus } = useLoggedInUserContext();
//   const {userHasAccessToUpdateSettingGeneral} = useUserAccessModules();

//   const getIframeCode =() => {
//     if (integrationFor === "lead") {
//       const secret = companySecretList.find(
//         (secret) => secret.companyFormID === 1
//       );
//       const secretCode = secret ? secret.secretCode : clientId;
//       return `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${secretCode}" width="50%" height="700px" frameborder="0"></iframe>`;
//     }
//     if (integrationFor === "product") {
//       const secret = companySecretList.find(
//         (secret) => secret.companyFormID === 2
//       );
//       const secretCode = secret ? secret.secretCode : clientId;
//       return `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${secretCode}" width="50%" height="700px" frameborder="0"></iframe>`;
//     }

//     return `<iframe src="https://web-lead.netlify.app/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(getIframeCode());
//     setCopied(true);
//     setTimeout(() => setCopied(false), 10000);
//   };

//   const getId = () => {
//     if (integrationFor === "lead") {
//       const secret = companySecretList.find(
//         (secret) => secret.companyFormID === 1
//       );
//       const id = secret ? secret.id : null;
//       return id;
//     }
//     if (integrationFor === "product") {
//       const secret = companySecretList.find(
//         (secret) => secret.companyFormID === 2
//       );
//       const id = secret ? secret.id : null;
//       return id;
//     }
//   };

//   const getDomains = () => {
//     if (integrationFor === "lead") {
//       const secret = companySecretList.find(
//         (secret) => secret.companyFormID === 1
//       );
//       const domains = secret ? secret.allowedDomains : null;
//       return domains;
//     }
//     if (integrationFor === "product") {
//       const secret = companySecretList.find(
//         (secret) => secret.companyFormID === 2
//       );
//       const domains = secret ? secret.allowedDomains : null;
//       return domains;
//     }
//   };
//   const refreshCompanySecret = async () => {
//     if(!userHasAccessToUpdateSettingGeneral){
//   toast.error(MESSAGE.ERROR.NOT_ATHORISED);
//   return;
//  }


//     const refreshCompanySecretPostData = {
//       company_id: loginStatus.companyId,
//       id: getId(),
//       allowed_domains: getDomains(),
//       is_refresh_secret_code: true,
//       updatedby_id: loginStatus.id,
//     };

//     await axios
//       .post(POST_API.UPDATE_COMPANY_SECRET, refreshCompanySecretPostData, {
//         withCredentials: true,
//       })
//       .then((response) => {
//         if (response.status === STATUS_CODE.OK) {
//           if (response.data.status) {
//             toast.success(response.data.message);
//             handleCompanySecretChange();
//             setRefresh(true);
//             setTimeout(() => setRefresh(false), 10000);
//           } else {
//             toast.error(response.data.message);
//           }
//         }
//       })
//       .catch(async (error: ApiError | any) => {
//         if (error.status === STATUS_CODE.UNATHORISED) {
//           const refreshTokenStatus = await RefreshToken({
//             callFunction: refreshCompanySecret,
//           });
//           if (refreshTokenStatus) {
//             refreshCompanySecret();
//           }
//         }
//       });
//   };

//   return (
//     <div className="p-8 max-w-full mx-auto min-h-full bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
//       {comingSoon && (
//         <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
//           <p className="text-green-600 text-3xl font-bold hover:text-green-700">
//             Coming Soon!
//           </p>
//         </div>
//       )}

//       <div className={`${comingSoon ? "opacity-95 pointer-events-none" : ""}`}>
//         <h2 className="text-base font-bold mb-2 text-gray-800 text-center">
//           Integrate Your Contact Form For
//           {integrationFor === "lead"
//             ? " Leads"
//             : integrationFor === "product"
//             ? " Products"
//             : ""}
//           <div className="float-right">
//             <button
//               title="Regenerate Client Id"
//               onClick={refreshCompanySecret}
//               className={`p-2 rounded-full transition-colors duration-200 ${
//                 refresh
//                   ? "text-green-600 bg-green-100"
//                   : "text-blue-600 hover:bg-blue-100"
//               } focus:outline-none focus:ring-2 focus:ring-blue-300`}
//             >
//               {refresh ? (
//                 <Check size={SIZE.TWENTY} />
//               ) : (
//                 <RefreshCcw size={SIZE.TWENTY} />
//               )}
//             </button>
//           </div>
//         </h2>

//         <p className="mb-2 text-gray-600 leading-relaxed text-center">
//           Easily embed your unique contact form into your website by following
//           these simple steps:
//         </p>

//         <ol className="list-decimal text-xs space-y-4 mb-8 text-gray-700">
//           <li>
//             <p className="font-semibold mb-2">
//               Copy the following iframe code:
//             </p>
//             <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 relative">
//               <div className="absolute top-2 right-2">
//                 <button
//                   title="Copy Code"
//                   onClick={copyToClipboard}
//                   className={`p-2 rounded-full transition-colors duration-200 ${
//                     copied
//                       ? "text-green-600 bg-green-100"
//                       : "text-blue-600 hover:bg-blue-100"
//                   } focus:outline-none focus:ring-2 focus:ring-blue-300`}
//                 >
//                   {copied ? (
//                     <Check size={SIZE.TWENTY} />
//                   ) : (
//                     <Copy size={SIZE.TWENTY} />
//                   )}
//                 </button>
//               </div>
//               <pre className="overflow-x-auto pr-10">
//                 <code
//                   id="iframeCode"
//                   className="text-sm font-mono text-gray-800"
//                 >
//                   {getIframeCode()}
//                 </code>
//               </pre>
//             </div>
//           </li>
//           <li>
//             <p>
//               Paste the code snippet into your website's HTML where you want the
//               form to appear.
//             </p>
//           </li>
//           <li>
//             <p>
//               Adjust the `width` and `height` attributes within the iframe code
//               as needed to fit your website's layout.
//             </p>
//           </li>
//           <li>
//             <p>
//               To customize the form's colors, append the appropriate query
//               parameters to the URL. as follows :
//               <ol className="list-disc list-inside text-xs space-y-1 mb-1 text-gray-700">
//                 <li>
//                   <span className="font-semibold">"color" : </span>background
//                   color
//                 </li>
//                 <li>
//                   <span className="font-semibold">"header-color" : </span>
//                   heading text color
//                 </li>
//                 <li>
//                   <span className="font-semibold">"label-color" : </span>labels
//                   text color
//                 </li>
//                 <li>
//                   <span className="font-semibold">"button-color" : </span>button
//                   background color
//                 </li>
//                 <li>
//                   <span className="font-semibold">"button-text-color" : </span>
//                   button text color
//                 </li>
//               </ol>
//             </p>
//           </li>
//         </ol>

//         <p className="mb-1 font-bold text-gray-800 text-xs">Important Notes:</p>
//         <ol className="list-disc space-y-1 text-xs text-gray-600">
//           <li>
//             Ensure your website page uses **HTTPS** for secure form submissions.
//           </li>
//           <li>
//             **Do not share your Client ID** with unauthorized individuals.
//           </li>
//           <li>
//             When specifying a color, always use the **hex code format without
//             the starting #**. For example, if the hex code is `#ffffff`, pass
//             the color as `color=ffffff`.
//           </li>
//           <li>
//             Always **thoroughly test the form** on your website after embedding
//             it.
//           </li>
//           <li>
//             Consider implementing **responsive design** principles for optimal
//             viewing across all devices.
//           </li>
//         </ol>
//       </div>
//     </div>
//   );
// }

// export default WebFormEmbed;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import CompanySecret from "../../../../@types/settings/CompanySecret";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import toast from "react-hot-toast";
import POST_API from "../../../../constants/PostApi";
import RefreshToken from "../../../../config/validations/RefreshToken";
import MESSAGE from "../../../../constants/Messages";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

type FrameworkTab = {
  id: string;
  name: string;
  language: string;
  getCode: (iframeCode: string, integrationFor: string) => string;
};

function WebFormEmbed({
  companySecretList,
  integrationFor,
  handleCompanySecretChange,
}: {
  companySecretList: CompanySecret[];
  integrationFor: "lead" | "product";
  handleCompanySecretChange: () => void;
}) {
  const clientId = "your_generated_client_id";
  const [copied, setCopied] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("html");
  const comingSoon = false;
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateSettingGeneral } = useUserAccessModules();

  const getIframeCode = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      const secretCode = secret ? secret.secretCode : clientId;
      return `<iframe id="contact-form-iframe" src="https://web-lead.netlify.app/contact-us-form.html?client_id=${secretCode}" width="50%" height="700px" frameborder="0"></iframe>`;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      const secretCode = secret ? secret.secretCode : clientId;
      return `<iframe id="contact-form-iframe" src="https://web-lead.netlify.app/contact-us-form.html?client_id=${secretCode}" width="50%" height="700px" frameborder="0"></iframe>`;
    }

    return `<iframe id="contact-form-iframe" src="https://web-lead.netlify.app/contact-us-form.html?client_id=${clientId}" width="50%" height="700px" frameborder="0"></iframe>`;
  };

  const frameworks: FrameworkTab[] = [
    {
      id: "html",
      name: "HTML/JavaScript",
      language: "html",
      getCode: (iframeCode, integrationFor) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Integration</title>
</head>
<body>
    <!-- Your ${integrationFor} form integration -->
    ${iframeCode}

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const iframe = document.getElementById('contact-form-iframe');
            const iframeOrigin = "https://web-lead.netlify.app";
            
            if (iframe && iframe.contentWindow) {
                iframe.onload = function() {
                    console.log(iframe.contentWindow);
                    iframe.contentWindow.postMessage(
                        window.location.origin,
                        iframeOrigin
                    );
                };
            }
        });
    </script>
</body>
</html>`
    },
    {
      id: "react",
      name: "React",
      language: "jsx",
      getCode: (iframeCode, integrationFor) => `import React, { useEffect } from 'react';

function ContactForm() {
    useEffect(() => {
        const iframe = document.getElementById('contact-form-iframe');
        const iframeOrigin = "https://web-lead.netlify.app";

        if (iframe && iframe.contentWindow) {
            iframe.onload = () => {
                console.log(iframe.contentWindow);
                iframe.contentWindow.postMessage(
                    window.location.origin,
                    iframeOrigin
                );
            };
        }
    }, []);

    return (
        <div className="contact-form-container">
            <h2>Contact Form - ${integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)}</h2>
            <div dangerouslySetInnerHTML={{
                __html: \`${iframeCode}\`
            }} />
        </div>
    );
}

export default ContactForm;`
    },
    {
      id: "vue",
      name: "Vue.js",
      language: "vue",
      getCode: (iframeCode, integrationFor) => `<template>
  <div class="contact-form-container">
    <h2>Contact Form - ${integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)}</h2>
    <div v-html="iframeCode"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'ContactForm',
  setup() {
    const iframeCode = ref(\`${iframeCode}\`);

    onMounted(() => {
      const iframe = document.getElementById('contact-form-iframe');
      const iframeOrigin = "https://web-lead.netlify.app";

      if (iframe && iframe.contentWindow) {
        iframe.onload = () => {
          console.log(iframe.contentWindow);
          iframe.contentWindow.postMessage(
            window.location.origin,
            iframeOrigin
          );
        };
      }
    });

    return {
      iframeCode
    };
  }
};
</script>`
    },
    {
      id: "angular",
      name: "Angular",
      language: "typescript",
      getCode: (iframeCode, integrationFor) => `import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-form',
  template: \`
    <div class="contact-form-container">
      <h2>Contact Form - ${integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)}</h2>
      <div [innerHTML]="safeIframeCode"></div>
    </div>
  \`
})
export class ContactFormComponent implements OnInit {
  safeIframeCode: SafeHtml;
  private iframeCode = \`${iframeCode}\`;

  constructor(private sanitizer: DomSanitizer) {
    this.safeIframeCode = this.sanitizer.bypassSecurityTrustHtml(this.iframeCode);
  }

  ngOnInit(): void {
    setTimeout(() => {
      const iframe = document.getElementById('contact-form-iframe') as HTMLIFrameElement;
      const iframeOrigin = "https://web-lead.netlify.app";

      if (iframe && iframe.contentWindow) {
        iframe.onload = () => {
          console.log(iframe.contentWindow);
          iframe.contentWindow.postMessage(
            window.location.origin,
            iframeOrigin
          );
        };
      }
    }, 100);
  }
}`
    },
    {
      id: "svelte",
      name: "Svelte",
      language: "svelte",
      getCode: (iframeCode, integrationFor) => `<script>
  import { onMount } from 'svelte';

  const iframeCode = \`${iframeCode}\`;

  onMount(() => {
    const iframe = document.getElementById('contact-form-iframe');
    const iframeOrigin = "https://web-lead.netlify.app";

    if (iframe && iframe.contentWindow) {
      iframe.onload = () => {
        console.log(iframe.contentWindow);
        iframe.contentWindow.postMessage(
          window.location.origin,
          iframeOrigin
        );
      };
    }
  });
</script>

<div class="contact-form-container">
  <h2>Contact Form - ${integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)}</h2>
  {@html iframeCode}
</div>

<style>
  .contact-form-container {
    padding: 2rem;
  }
</style>`
    },
    {
      id: "nextjs",
      name: "Next.js",
      language: "jsx",
      getCode: (iframeCode, integrationFor) => `'use client';

import { useEffect } from 'react';

export default function ContactForm() {
  useEffect(() => {
    const iframe = document.getElementById('contact-form-iframe');
    const iframeOrigin = "https://web-lead.netlify.app";

    if (iframe && iframe.contentWindow) {
      iframe.onload = () => {
        console.log(iframe.contentWindow);
        iframe.contentWindow.postMessage(
          window.location.origin,
          iframeOrigin
        );
      };
    }
  }, []);

  return (
    <div className="contact-form-container">
      <h2>Contact Form - ${integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: \`${iframeCode}\`
        }}
      />
    </div>
  );
}`
    }
  ];

  const copyToClipboard = (code: string, tabId: string) => {
    navigator.clipboard.writeText(code);
    setCopied(tabId);
    setTimeout(() => setCopied(""), 3000);
  };

  const getId = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      return secret ? secret.id : null;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      return secret ? secret.id : null;
    }
  };

  const getDomains = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      return secret ? secret.allowedDomains : null;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      return secret ? secret.allowedDomains : null;
    }
  };

  const refreshCompanySecret = async () => {
    if (!userHasAccessToUpdateSettingGeneral) {
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

    try {
      const response = await axios.post(POST_API.UPDATE_COMPANY_SECRET, refreshCompanySecretPostData,{
        withCredentials : true
      });
      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          toast.success(response.data.message);
          handleCompanySecretChange();
          setRefresh(true);
          setTimeout(() => setRefresh(false), 3000);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({callFunction : refreshCompanySecret});
        if (refreshTokenStatus) {
          refreshCompanySecret();
        }
      }
    }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Integrate Your Contact Form For
            {integrationFor === "lead"
              ? " Leads"
              : integrationFor === "product"
              ? " Products"
              : ""}
          </h2>
          <button
            title="Regenerate Client Id"
            onClick={refreshCompanySecret}
            className={`p-3 rounded-full transition-all duration-200 ${
              refresh
                ? "text-green-600 bg-green-100 scale-110"
                : "text-blue-600 hover:bg-blue-100 hover:scale-110"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          >
            {refresh ? (
              <Check size={SIZE.TWENTY} />
            ) : (
              <RefreshCcw size={SIZE.TWENTY} />
            )}
          </button>
        </div>

        <p className="mb-8 text-gray-600 leading-relaxed text-center text-lg">
          Choose your frontend framework and copy the integration code
        </p>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex flex-wrap gap-2" aria-label="Framework Tabs">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setActiveTab(framework.id)}
                className={`relative px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                  activeTab === framework.id
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {framework.name}
                {activeTab === framework.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {frameworks.map((framework) => (
            <div
              key={framework.id}
              className={`transition-all duration-300 ${
                activeTab === framework.id 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-95 absolute pointer-events-none"
              }`}
            >
              {activeTab === framework.id && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden">
                  {/* Code Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {framework.name} Integration
                      </span>
                    </div>
                    <button
                      title={`Copy ${framework.name} Code`}
                      onClick={() => copyToClipboard(framework.getCode(getIframeCode(), integrationFor), framework.id)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        copied === framework.id
                          ? "text-green-600 bg-green-100 scale-110"
                          : "text-blue-600 hover:bg-blue-100 hover:scale-110"
                      } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                    >
                      {copied === framework.id ? (
                        <Check size={SIZE.TWENTY} />
                      ) : (
                        <Copy size={SIZE.TWENTY} />
                      )}
                    </button>
                  </div>

                  {/* Code Content */}
                  <div className="p-6">
                    <pre className="overflow-x-auto text-sm leading-relaxed">
                      <code className="language-javascript text-gray-800 whitespace-pre-wrap">
                        {framework.getCode(getIframeCode(), integrationFor)}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Implementation Steps</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Copy the code for your chosen frontend framework</li>
            <li>Paste the code into your project</li>
            <li>Ensure your website uses HTTPS for secure form submissions</li>
            <li>Test the form integration thoroughly</li>
            <li>Customize colors by appending query parameters to the iframe URL</li>
          </ol>
        </div>

        {/* Color Customization Guide */}
        <div className="mt-8 bg-amber-50 rounded-lg p-6 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Color Customization</h3>
          <p className="text-gray-700 mb-4">
            Customize the form's appearance by adding these query parameters to the iframe URL:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><span className="font-semibold">color</span> - Background color</div>
              <div><span className="font-semibold">header-color</span> - Heading text color</div>
              <div><span className="font-semibold">label-color</span> - Labels text color</div>
            </div>
            <div className="space-y-2">
              <div><span className="font-semibold">button-color</span> - Button background</div>
              <div><span className="font-semibold">button-text-color</span> - Button text</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            <strong>Note:</strong> Use hex codes without the # symbol (e.g., ffffff for white)
          </p>
        </div>

        {/* Security Notes */}
        <div className="mt-8 bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Important Security Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>Always use HTTPS for secure form submissions</li>
            <li>Never share your Client ID with unauthorized individuals</li>
            <li>Test the form thoroughly before going live</li>
            <li>Implement responsive design for optimal mobile experience</li>
            <li>Monitor form submissions regularly for security</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WebFormEmbed;