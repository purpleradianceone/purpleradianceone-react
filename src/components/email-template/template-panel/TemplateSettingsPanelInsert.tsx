import React, { useState, useRef } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDynamicFields } from "../DynamicFieldsContext";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import ROUTES_URL from "../../../constants/Routes";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { LucideMail, Save, X } from "lucide-react";
import FormHeader from "../../ui/FormHeader";

type TemplateSettingsPanelInsertProps = {
  htmlBody: string;
  htmlTemplateTypeSubjectPlaceholder: string;
};

export const TemplateSettingsPanelInsert: React.FC<
  TemplateSettingsPanelInsertProps
> = ({ htmlBody, htmlTemplateTypeSubjectPlaceholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const [isDefault, setIsDefault] = useState(false);
  const navigate = useNavigate();
  const dynamicFields = useDynamicFields();

  const insertDynamicField = (field: string) => {
    const placeholder = `${field}`;
    const input = subjectInputRef.current;

    if (!input) return;

    const start = input.selectionStart ?? subject.length;
    const end = input.selectionEnd ?? subject.length;

    const updated = subject.slice(0, start) + placeholder + subject.slice(end);
    setSubject(updated);

    // Move cursor after inserted text
    setTimeout(() => {
      input.setSelectionRange(
        start + placeholder.length,
        start + placeholder.length
      );
      input.focus();
    }, 0);
  };

  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();
  const params = searchParams.get("type");

  const createEmailTemplateInsert = async (emailBody: string) => {
    const postDataCreateEmailTemplate = {
      company_id: loginStatus.companyId,
      createdby_id: loginStatus.id,
      email_type_id: JSON.parse(params!).id,
      name: templateName,
      email_subject: subject,
      email_body_html: emailBody,
      email_body_json: null,
      is_default: isDefault,
    };

    await axios
      .post(POST_API.CREATE_EMAIL_TEMPLATE, postDataCreateEmailTemplate, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            navigate(`${ROUTES_URL.EMAIL_TEMPLATE}`);
          } else {
            toast.error(response.data.message);
          }
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithParamsNotEvent: createEmailTemplateInsert,
          });
          if (refreshTokenStatus) {
            createEmailTemplateInsert(emailBody);
          }
        }
      });
  };
  if (dynamicFields.length === 0) {
    return (
      <div style={{ padding: "8px", background: "#f0f0f0", color: "#666" }}>
        Loading dynamic fields...
      </div>
    );
  }
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "60px",
          right: 0,
          // backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {/* Fixed Button to Open Settings */}
        <Button onClick={() => setIsOpen(true)}>
          <div className="flex items-center justify-center gap-0.5">
            <Save size={16} />
            Save Template
          </div>
        </Button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 100,
              width: "360px",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              color: "black",
            }}
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsOpen(false);
                // TODO: API Call
                await createEmailTemplateInsert(htmlBody);
              }}
            >
              <FormHeader
                icon={LucideMail}
                onClose={() => setIsOpen(false)}
                preText="Template Settings"
                description="Provide the necessary fields to create your email template."
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {/* Template Name */}
                <div>
                  <FormInput
                    label="Template Name"
                    type="text"
                    required
                    value={templateName}
                    defaultValue={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder={`e.g., ${htmlTemplateTypeSubjectPlaceholder}`}
                  />
                </div>

                {/* Email Subject with Dynamic Fields */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                    }}
                    className="input-label-custom"
                  >
                    Email Subject
                    <span className="text-red-500 align-top">*</span>
                  </label>
                  <input
                    ref={subjectInputRef}
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                    placeholder="Subject line"
                  />
                  {/* Dynamic Field Insertion Dropdown */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        insertDynamicField(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                    }}
                    className="caption-custom"
                  >
                    <option value="">Insert Dynamic Field In Subject</option>
                    {dynamicFields.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Default Template Toggle */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={() => setIsDefault((prev) => !prev)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label htmlFor="isDefault" className="input-label-custom">
                    Set as default template
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <div>
                    <Button type="button" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center justify-center gap-0.5">
                        <X size={16} />
                        Cancel
                      </div>
                    </Button>
                  </div>
                  <div>
                    <Button type="submit">
                      <div className="flex items-center justify-center gap-0.5">
                        <Save size={16} />
                        Save
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
