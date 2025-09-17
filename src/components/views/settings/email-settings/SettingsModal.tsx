/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Button from "../../../ui/Button";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import ApiError from "../../../../@types/error/ApiError";

type SettingType = "company" | "user";

const Dialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open, children }) =>
  !open ? null : (
    <div className="fixed pt-14  inset-0 bg-black bg-opacity-5  flex justify-center items-center overflow-y-auto ">
      <div
        className="h-10 min-w-[50%] max-w-xl min-h-fit max-h-fit z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="bg-white px-4 py-1 rounded min-w-xl shadow ">{children}</div>;

const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="my-4 border-b  ">{children}</div>;


const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="table-header-custom">{children}</h2>
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
        createdby: "",
        updatedby: "",
        createdon: "",
        updatedon: "",
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
        createdby: "",
        updatedby: "",
        createdon: "",
        updatedon: "",
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
    if ("authatication_required" in payload) {
      payload.authentication_required = payload.authatication_required;
      delete payload.authatication_required;
    }

    if (!isCompany) payload.company_user_id = loginStatus.id;

    try {
      setLoading(true);
      await axios
        .post(apiEndpoint, payload, {
          withCredentials: true,
        })
        .then((result) => {
          if (result.status === STATUS_CODE.OK) {
            if (result.data.status) {
              toast.success(result.data.message);
            } else {
              toast.error(result.data.message);
            }
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunction: handleApiCall,
            });
            if (refreshTokenStatus) {
              handleApiCall();
            }
          }
        });
    } catch (error: any) {
      // Catching 'any' for error to access properties
      console.error("Email settings error:", error);
      toast.error(
        `Something went wrong. Please try again. ${
          error.response?.data?.message || ""
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleApiCall();
    onClose();
    onSubmit(formData); // Call onSubmit with current form data
  };

  const renderField = (
    label: string,
    name: keyof EmailSettings,
    type: "text" | "email" | "password" | "number" | "checkbox" | "select",
    options?: { value: number; label: string }[]
  ) => (
    <div className="mb-2">
      {type !== "checkbox" && (
        <label className="block input-label-custom">{label}</label>
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
      <div className="bg-pink-300 w-full">
<DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Create"} {settingType} Email Setting
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2  gap-4 py-4">
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
          <div className="mt-4">

          {renderField(
            "Authentication Required",
            "authentication_required",
            "checkbox"
          )}
          </div>
          {/* Conditional rendering for isactive checkbox */}
          {/* {isEdit &&
            renderField(
              "Active", // Label for the checkbox
              "isactive",
              "checkbox"
            )} */}
        </div>
        <div className="flex justify-end  space-x-2 m-4">
          <div>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
          <div>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEdit ? "Updating..." : "Creating..."}</span>
                </div>
              ) : (
                <span>{isEdit ? "Save" : "Save"}</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
      </div>
      
    </Dialog>
  );
};

export default SettingsModal;
