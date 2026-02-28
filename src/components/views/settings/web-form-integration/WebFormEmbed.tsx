

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, Copy, Info, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import CompanySecret from "../../../../@types/settings/CompanySecret";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import toast from "react-hot-toast";
import POST_API, { BASE_URL_FOR_FORM_INTEGRATION } from "../../../../constants/PostApi";
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
  const comingSoon = integrationFor === "product" ? true : false;
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateSettingGeneral } = useUserAccessModules();

  const getIframeCode = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      const secretCode = secret ? secret.secretCode : clientId;
      return `<div style="display:flex; width:100%; height:50vh; justify-content:center; align-items:center;"><iframe id="contact-form-iframe" src="${BASE_URL_FOR_FORM_INTEGRATION}/embed/contact_us_form.html?client_id=${secretCode}" width="100%" height="500px"></iframe></div>`;
    }
    // For Product Form Integration
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      const secretCode = secret ? secret.secretCode : clientId;
      return `<div style="display:flex; width:100%; height:50vh; justify-content:center; align-items:center;"><iframe id="contact-form-iframe" src="${BASE_URL_FOR_FORM_INTEGRATION}/embed/contact_us_form.html?client_id=${secretCode}" width="100%" height="500px"></iframe></div>`;
    }

    return `<div style="display:flex; width:100%; height:50vh; justify-content:center; align-items:center;"><iframe id="contact-form-iframe" src="${BASE_URL_FOR_FORM_INTEGRATION}/embed/contact_us_form.html?client_id=${clientId}" width="100%" height="500px"></iframe></div>`;
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
            const iframeOrigin = "${BASE_URL_FOR_FORM_INTEGRATION}";
            
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
</html>`,
    },
    {
      id: "react",
      name: "React",
      language: "jsx",
      getCode: (
        iframeCode,
        integrationFor
      ) => `import React, { useEffect } from 'react';

function ContactForm() {
    useEffect(() => {
        const iframe = document.getElementById('contact-form-iframe');
        const iframeOrigin = "${BASE_URL_FOR_FORM_INTEGRATION}";

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
            <h2>Contact Form - ${
              integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)
            }</h2>
            <div dangerouslySetInnerHTML={{
                __html: \`${iframeCode}\`
            }} />
        </div>
    );
}

export default ContactForm;`,
    },
    {
      id: "vue",
      name: "Vue.js",
      language: "vue",
      getCode: (iframeCode, integrationFor) => `<template>
  <div class="contact-form-container">
    <h2>Contact Form - ${
      integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)
    }</h2>
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
      const iframeOrigin = "${BASE_URL_FOR_FORM_INTEGRATION}";

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
</script>`,
    },
    {
      id: "angular",
      name: "Angular",
      language: "typescript",
      getCode: (
        iframeCode,
        integrationFor
      ) => `import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-form',
  template: \`
    <div class="contact-form-container">
      <h2>Contact Form - ${
        integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)
      }</h2>
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
      const iframeOrigin = "${BASE_URL_FOR_FORM_INTEGRATION}";

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
}`,
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
    const iframeOrigin = "${BASE_URL_FOR_FORM_INTEGRATION}";

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
  <h2>Contact Form - ${
    integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)
  }</h2>
  {@html iframeCode}
</div>

<style>
  .contact-form-container {
    padding: 2rem;
  }
</style>`,
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
    const iframeOrigin = "${BASE_URL_FOR_FORM_INTEGRATION}";

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
      <h2>Contact Form - ${
        integrationFor.charAt(0).toUpperCase() + integrationFor.slice(1)
      }</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: \`${iframeCode}\`
        }}
      />
    </div>
  );
}`,
    },
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

  const getUpdatedOn = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      return secret ? secret.updatedOn : null;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      return secret ? secret.updatedOn : null;
    }
  };

  const getUpdatedBy = () => {
    if (integrationFor === "lead") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 1
      );
      return secret ? secret.updatedBy : null;
    }
    if (integrationFor === "product") {
      const secret = companySecretList.find(
        (secret) => secret.companyFormID === 2
      );
      return secret ? secret.updatedBy : null;
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
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_SECRET,
        refreshCompanySecretPostData,
        {
          withCredentials: true,
        }
      );
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
        const refreshTokenStatus = await RefreshToken({
          callFunction: refreshCompanySecret,
        });
        if (refreshTokenStatus) {
          refreshCompanySecret();
        }
      }
    }
  };

  return (
    <div className="p-8 max-w-full mx-auto min-h-full bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-y-auto">
      {comingSoon && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex pt-16 justify-center z-10 rounded-xl">
          <p className="main-title-custom-green hover:text-green-700">
            Coming Soon!
          </p>
        </div>
      )}

      <div className={`${comingSoon ? "opacity-95 pointer-events-none" : ""}`}>
        <div className="flex items-center justify-between">
          <span
            title={`last updated on : ${getUpdatedOn()}`}
            className="caption-custom"
          >
            last updated on : {getUpdatedOn()}
          </span>
          <span
            title={`last updated on : ${getUpdatedBy()}`}
            className="caption-custom"
          >
            last updated by : {getUpdatedBy()}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-center section-header-custom ml-20">
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
            className={`p-2 rounded-full transition-all duration-200 ${
              refresh
                ? "caption-custom-active bg-green-100 scale-110"
                : "caption-custom-blue hover:bg-blue-100 hover:scale-110"
            } focus:outline-none focus:ring-2 focus:ring-blue-300`}
          >
            {refresh ? (
              <Check size={SIZE.FOURTEEN} />
            ) : (
              <RefreshCcw size={SIZE.FOURTEEN} />
            )}
          </button>
        </div>

        <p className="mb-2 input-label-custom leading-relaxed text-center">
          Choose your frontend framework and copy the integration code
        </p>

        <div className="border-b border-gray-200 mb-4">
          <nav className="flex flex-wrap gap-1" aria-label="Framework Tabs">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setActiveTab(framework.id)}
                className={`relative px-2 py-1  rounded-t-lg transition-all duration-200 ${
                  activeTab === framework.id
                    ? "caption-custom-teal bg-blue-50 border-b-1 border-teal-400"
                    : "caption-custom hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {framework.name}
                {activeTab === framework.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
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
                  <div className="flex items-center justify-between px-2 py-1 bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="input-label-custom">
                        {framework.name} Integration
                      </span>
                    </div>
                    <button
                      title={`Copy ${framework.name} Code`}
                      onClick={() =>
                        copyToClipboard(
                          framework.getCode(getIframeCode(), integrationFor),
                          framework.id
                        )
                      }
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        copied === framework.id
                          ? "caption-custom-active bg-green-100 scale-110"
                          : "caption-custom-blue hover:bg-blue-100 hover:scale-110"
                      } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                    >
                      {copied === framework.id ? (
                        <Check size={SIZE.FOURTEEN} />
                      ) : (
                        <Copy size={SIZE.FOURTEEN} />
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-white">
                    <pre className="overflow-x-auto  leading-relaxed">
                      <code className="language-javascript caption-custom-black whitespace-pre-wrap">
                        {framework.getCode(getIframeCode(), integrationFor)}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <h3 className="input-label-custom-blue mb-1">
            Implementation Steps
          </h3>
          <ol className="list-decimal list-inside space-y-1 caption-custom">
            <li>Copy the code for your chosen frontend framework</li>
            <li>Paste the code into your project</li>
            <li>Ensure your website uses HTTPS for secure form submissions</li>
            <li>Test the form integration thoroughly</li>
            <li>
              Customize colors by appending query parameters to the iframe URL
            </li>
          </ol>
        </div>

        <div className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-200">
          <h3 className="input-label-custom-orange mb-1">
            Color Customization
          </h3>
          <p className="caption-custom">
            Customize the form's appearance by adding these query parameters to
            the iframe URL:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 caption-custom">
            <div className="space-y-1">
              <div>
                <span className="input-label-custom">color</span> - Background color
              </div>
              <div>
                <span className="input-label-custom">header-color</span> - Heading
                text color
              </div>
              <div>
                <span className="input-label-custom">label-color</span> - Labels text
                color
              </div>
            </div>
            <div className="space-y-1">
              <div>
                <span className="input-label-custom">button-color</span> - Button
                background
              </div>
              <div>
                <span className="input-label-custom">button-text-color</span> -
                Button text
              </div>
            </div>
          </div>
          <p className="caption-custom mt-1">
            <strong className="caption-custom-blue">Note :</strong> Use hex codes without the # symbol (e.g.,
            ffffff for white)
          </p>
        </div>

        {/* Security Notes */}
        <div className="mt-6 bg-red-50 rounded-lg p-3 border border-red-200">
          <h3 className="input-label-custom-inactive mb-1">
             <span className="flex gap-2">
              <Info className="w-4 h-4 mt-0.5"/>
              <span>Important Security Notes</span>
             </span>
          </h3>
          <ul className="list-disc list-inside space-y-1 caption-custom">
            <li>Always use HTTPS for secure form submissions</li>
            <li>Never share your Client ID with unauthorized individuals</li>
            <li>Test the form thoroughly before going live</li>
            <li>Implement responsive design for optimal mobile experience</li>
            <li>Monitor form submissions regularly for security</li>
            <li>Check for Content-Security-Policy header of your domain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WebFormEmbed;
