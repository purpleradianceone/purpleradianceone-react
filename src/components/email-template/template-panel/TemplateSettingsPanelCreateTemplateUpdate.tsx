import React, { useState, useRef } from "react";
import { useDynamicFields } from "../DynamicFieldsContext";
import { useEditor } from "@craftjs/core";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { STATUS_CODE } from "../../../constants/AppConstants";
import { useNavigate } from "react-router-dom";
import { craftJsonToHtml } from "../template-util/CraftJsonToHtml";
import ROUTES_URL from "../../../constants/Routes";
import toast from "react-hot-toast";

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
        } else {
          toast.error(response.data.message);
        }
          navigate(
            `${ROUTES_URL.EMAIL_TEMPLATE}`
          );
        }
      })
      .catch((error) => {
        console.error(error.toString());
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
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "3px 8px",
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Save Template
      </button>

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
            width: "350px",
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsOpen(false);
              const resultHtml = await getHtmlEmailBody();
              updateEmailTemplate(resultHtml);
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Update Template Settings
              </h3>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {/* Template Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Email Subject with Dynamic Fields */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Email Subject
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
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                    maxHeight: "120px",
                    overflowY: "auto",
                  }}
                >
                  <option value="">Insert Dynamic Field In Subject</option>
                  {dynamicFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              {/* <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    minHeight: "80px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                  placeholder="Template description..."
                />
              </div> */}
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
                <label
                  htmlFor="isDefault"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
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
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
