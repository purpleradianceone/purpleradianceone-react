import React, { useState, useRef } from "react";
import { useDynamicFields } from "../DynamicFieldsContext";
import { useEditor } from "@craftjs/core";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import { useNavigate } from "react-router-dom";
import { craftJsonToHtml } from "../template-util/CraftJsonToHtml";
import ROUTES_URL from "../../../constants/Routes";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import Button from "../../ui/Button";
import { Edit, Save, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";

export type TemplateSettingsPanelUpdateProps = {
  id: number;
  templateTypeId: number;
  emailTemplateName: string;
  emailTemplateSubject: string;
  emailTemplateIsDefault: boolean;
};

export const TemplateSettingsPanelCreateTemplateUpdate: React.FC<
  TemplateSettingsPanelUpdateProps
> = ({
  id,
  templateTypeId,
  emailTemplateName,
  emailTemplateSubject,
  emailTemplateIsDefault,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState(emailTemplateName);
  const [subject, setSubject] = useState(emailTemplateSubject);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const [isDefault, setIsDefault] = useState(emailTemplateIsDefault);
  const navigate = useNavigate();

  const dynamicFields = useDynamicFields();

  const { query } = useEditor();

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
  function getHtmlEmailBody(): string {
    const canvasElement = document.getElementById("CANVAS");
    if (!canvasElement) return "";
    const json = query.serialize();
    const html = craftJsonToHtml(json).trim();
    return html;
  }

  const { loginStatus } = useLoggedInUserContext();
  const updateEmailTemplate = async (emailBody: string) => {
    const json = query.serialize();
    const postDataUpdateEmailTemplate = {
      company_id: loginStatus.companyId,
      updatedby_id: loginStatus.id,
      id: id,
      email_type_id: templateTypeId,
      name: templateName,
      email_subject: subject,
      email_body_html: emailBody,
      email_body_json: json,
      is_default: isDefault,
    };

    await axios
      .post(POST_API.UPDATE_EMAIL_TEMPLATE, postDataUpdateEmailTemplate, {
        withCredentials: true,
      })
      .then((response) => {
        navigate(`${ROUTES_URL.EMAIL_TEMPLATE}`);
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
            callFunctionWithParamsNotEvent: updateEmailTemplate,
          });
          if (refreshTokenStatus) {
            updateEmailTemplate(emailBody);
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
      {/* Fixed Button to Open Settings */}
      <div>
        <Button type="submit" onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
        }}>
          <div className="flex items-center justify-center gap-0.5">
            <Save size={SIZE.SIXTEEN} />
            Save Template
          </div>
        </Button>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 2,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 100,
            width: "fit-content",
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
        

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsOpen(false);
              const resultHtml = await getHtmlEmailBody();
              updateEmailTemplate(resultHtml);
            }}
          >
            <FormHeader
              icon={Edit}
              onClose={()=>setIsOpen(false)}
              preText="Update Template Settings"
              description="Provide the necessary fields to update your email template."
            />

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
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
                  placeholder={`e.g.,`}
                />
              </div>

              {/* Email Subject with Dynamic Fields */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "1px",
                  }}
                  className="input-label-custom"
                >
                  Email Subject<span className="text-red-500 align-top">*</span>
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
                    maxHeight: "120px",
                    overflowY: "auto",
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <div>
                  <Button type="button" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center justify-center gap-0.5">
                      <X size={SIZE.SIXTEEN} />
                      Cancel
                    </div>
                  </Button>
                </div>

                <div>
                  <Button type="submit">
                    <div className="flex items-center justify-center gap-0.5">
                      <Save size={SIZE.SIXTEEN} />
                      Save
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
