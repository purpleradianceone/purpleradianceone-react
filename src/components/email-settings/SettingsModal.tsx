/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";

type SettingType = "company" | "user";

const Dialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open, onOpenChange, children }) =>
  !open ? null : (
    <div
      className="fixed w-full inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      onClick={() => onOpenChange(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );

const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="bg-white p-4 rounded shadow max-w-lg">{children}</div>;
const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mb-4">{children}</div>;
const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);

interface BaseEmailSettings {
  id: number;
  company_id: number;
  email: string;
  email_password: string;
  smtp_host: string;
  smtp_port: number;
  email_security_type_id: number;
  authentication_required: boolean;
  isactive: boolean; // Add isactive to the base interface
  createdby: string;
  updatedby: string;
  createdon: string;
  updatedon: string;
}
interface CompanyEmailSettings extends BaseEmailSettings {}
interface UserEmailSettings extends BaseEmailSettings {
  company_user_id: number;
}
type EmailSettings = CompanyEmailSettings | UserEmailSettings;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingType: SettingType;
  initialData?: EmailSettings; // initialData will be present in edit mode
  onSubmit: (data: EmailSettings) => void;
}

const getDefaultSettings = (type: SettingType): EmailSettings =>
  type === "company"
    ? {
        id: 0,
        company_id: 0,
        email: "",
        email_password: "",
        smtp_host: "",
        smtp_port: 587,
        email_security_type_id: 1,
        authentication_required: false,
        isactive: true, // Default to true for new company settings
        createdby: "Owner",
        updatedby: "Owner",
        createdon: "1 May 2025",
        updatedon: "1 May 2025",
      }
    : {
        id: 0,
        company_id: 0,
        company_user_id: 0,
        email: "",
        email_password: "",
        smtp_host: "",
        smtp_port: 465,
        email_security_type_id: 1,
        authentication_required: false,
        isactive: true, // Default to true for new user settings
        createdby: "Owner",
        updatedby: "Owner",
        createdon: "1 May 2025",
        updatedon: "1 May 2025",
      };

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settingType,
  initialData, // This prop indicates if it's an edit operation
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EmailSettings>(
    getDefaultSettings(settingType)
  );
  const [loading, setLoading] = useState(false);
  const { loginStatus } = useLoggedInUserContext();

  // Determine if it's an edit operation based on initialData
  const isEdit = Boolean(initialData);

  useEffect(() => {
    // When initialData changes (or settingType), update formData
    setFormData(initialData ?? getDefaultSettings(settingType));
  }, [initialData, settingType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? Number(value)
        : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleApiCall = async () => {
    const isCompany = settingType === "company";
    const apiEndpoint = isEdit // Use the isEdit variable here
      ? isCompany
        ? POST_API.UPDATE_EMAIL_SETTING_COMPANY
        : POST_API.UPDATE_EMAIL_SETTING_COMPANY_USER
      : isCompany
      ? POST_API.CREATE_EMAIL_SETTING_COMPANY
      : POST_API.CREATE_EMAIL_SETTING_COMPANY_USER;

    const payload: any = {
      ...formData,
      company_id: loginStatus.companyId,
      // Ensure specific fields are correctly mapped if needed, though ...formData usually covers it
      email: formData.email,
      email_password: formData.email_password,
      smtp_host: formData.smtp_host,
      smtp_port: formData.smtp_port,
      email_security_type_id: formData.email_security_type_id,
      authatication_required: formData.authentication_required, // Typo: Should be authentication_required
      isactive: formData.isactive, // Include isactive in payload
      ...(isEdit
        ? { updatedby_id: loginStatus.id, id: formData.id } // Pass ID for update
        : { createdby_id: loginStatus.id }),
    };

    // Correct the typo for authentication_required if your API expects it correctly spelled
    if ('authatication_required' in payload) {
        payload.authentication_required = payload.authatication_required;
        delete payload.authatication_required;
    }


    if (!isCompany) payload.company_user_id = loginStatus.id;

    try {
      setLoading(true);
      const response = await axios.post(apiEndpoint, payload, {
        withCredentials: true,
      });
      window.alert(response.data.message);
    } catch (error: any) { // Catching 'any' for error to access properties
      console.error("Email settings error:", error);
      // More robust error message, checking for response.data
      window.alert(`Something went wrong. Please try again. ${error.response?.data?.message || ''}`);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleSubmit = async () => {
    // Optionally perform form validation here before calling onSubmit and API
    onSubmit(formData); // Call onSubmit with current form data
    await handleApiCall();
    // onClose() is called after API call in finally block which causes reload, so it's handled.
    // If you want modal to close without reload on success, move onClose into try block.
  };

  const renderField = (
    label: string,
    name: keyof EmailSettings,
    type: "text" | "email" | "password" | "number" | "checkbox" | "select",
    options?: { value: number; label: string }[]
  ) => (
    <div className="mb-2">
      {type !== "checkbox" && (
        <label className="block text-sm font-medium">{label}</label>
      )}
      {type === "select" ? (
        <select
          name={name}
          value={formData[name] as number}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            name={name}
            checked={formData[name] as boolean}
            onChange={handleChange}
            className="mr-2"
          />
          {label}
        </label>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] as string | number}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Create"} {settingType} Email Setting
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {renderField(
            `${settingType === "company" ? "Company" : "User"} Email`,
            "email",
            "email"
          )}
          {renderField("Email Password", "email_password", "password")}
          {renderField("SMTP Host", "smtp_host", "text")}
          {renderField("SMTP Port", "smtp_port", "number")}
          {renderField("Security Type", "email_security_type_id", "select", [
            { value: 1, label: "SSL" },
            { value: 2, label: "TLS" },
          ])}
          {renderField(
            "Authentication Required",
            "authentication_required",
            "checkbox"
          )}
          {/* Conditional rendering for isactive checkbox */}
          {isEdit && (
            renderField(
              "Active", // Label for the checkbox
              "isactive",
              "checkbox"
            )
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEdit ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              <span>{isEdit ? "Update" : "Create"}</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default SettingsModal;
