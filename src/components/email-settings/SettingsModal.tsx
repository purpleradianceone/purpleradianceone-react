/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { STATUS_CODE } from "../../constants/AppConstants";
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
  isactive: boolean;
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
  initialData?: EmailSettings;
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
        isactive: true,
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
        isactive: true,
        createdby: "Owner",
        updatedby: "Owner",
        createdon: "1 May 2025",
        updatedon: "1 May 2025",
      };

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settingType,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EmailSettings>(
    getDefaultSettings(settingType)
  );
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const { loginStatus } = useLoggedInUserContext();

  useEffect(() => {
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
    const isEdit = Boolean(initialData);
    const isCompany = settingType === "company";
    const apiEndpoint = isEdit
      ? isCompany
        ? POST_API.UPDATE_EMAIL_SETTING_COMPANY
        : POST_API.UPDATE_EMAIL_SETTING_COMPANY_USER
      : isCompany
      ? POST_API.CREATE_EMAIL_SETTING_COMPANY
      : POST_API.CREATE_EMAIL_SETTING_COMPANY_USER;

    const payload: any = {
      ...formData,
      company_id: loginStatus.companyId,
      email: formData.email,
      email_password: formData.email_password,
      smtp_host: formData.smtp_host,
      smtp_port: formData.smtp_port,
      email_security_type_id: formData.email_security_type_id,
      authatication_required: formData.authentication_required,
      ...(isEdit
        ? { updatedby_id: loginStatus.id }
        : { createdby_id: loginStatus.id }),
    };

    if (!isCompany) payload.company_user_id = loginStatus.id;

    try {
      setLoading(true); // <-- Start loading
      const response = await axios.post(apiEndpoint, payload, {
        withCredentials: true,
      });
      window.alert(response.data.message);
    } catch (error) {
      console.error("Email settings error:", error);
      window.alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // <-- Stop loading
    }
  };

  const handleSubmit = async () => {
    onSubmit(formData);
    await handleApiCall();
    onClose();
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
            {initialData ? "Edit" : "Create"} {settingType} Email Setting
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
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{initialData ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              <span>{initialData ? "Update" : "Create"}</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default SettingsModal;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect, useState } from "react";
// import Button from "../ui/Button";
// import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
// import { STATUS_CODE } from "../../constants/AppConstants";
// import axios from "axios";
// import POST_API from "../../constants/PostApi";

// type SettingType = "company" | "user";

// // Temporary minimal dialog stubs to avoid import errors
// const Dialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }> = ({
//   open,
//   onOpenChange,
//   children,
// }) => {
//   if (!open) return null;
//   return (
//     <div
//       className="fixed w-full inset-0 bg-black bg-opacity-30 flex justify-center items-center"
//       onClick={() => onOpenChange(false)}
//     >
//       <div onClick={(e) => e.stopPropagation()}>{children}</div>
//     </div>
//   );
// };

// const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <div className="bg-white p-4 rounded shadow max-w-lg ">{children}</div>
// );

// const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mb-4 ">{children}</div>;

// const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <h2 className="text-lg font-bold">{children}</h2>
// );

// interface CompanyEmailSettings {
//   id: number;
//   company_id: number;
//   email: string;
//   email_password: string;
//   smtp_host: string;
//   smtp_port: number;
//   email_security_type_id: number;
//   authentication_required: boolean;
//   isactive: boolean;
//   createdby: string;
//   updatedby: string;
//   createdon: string;
//   updatedon: string;
// }

// interface UserEmailSettings {
//   id: number;
//   company_id: number;
//   company_user_id:number;
//   email: string;
//   email_password: string;
//   smtp_host: string;
//   smtp_port: number;
//   email_security_type_id: number;
//   authentication_required: boolean;
//   isactive: boolean;
//   createdby: string;
//   updatedby: string;
//   createdon: string;
//   updatedon: string;
// }

// type EmailSettings = CompanyEmailSettings | UserEmailSettings;

// interface SettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   settingType: SettingType;
//   initialData?: EmailSettings;
//   onSubmit: (data: EmailSettings) => void;
// }

// const defaultCompanySettings: CompanyEmailSettings = {
//   id: 0,
//   company_id: 0,
//   email: "",
//   email_password: "",
//   smtp_host: "",
//   smtp_port: 587,
//   email_security_type_id: 1,
//   authentication_required: false,
//   isactive: true,
//   createdby: "Owner",
//   updatedby: "Owner",
//   createdon: "1 May 2025",
//   updatedon: "1 May 2025",
// };

// const defaultUserSettings: UserEmailSettings = {
//   id: 0,
//   company_id: 0,
//   company_user_id: 0,
//   email: "",
//   email_password: "",
//   smtp_host: "",
//   smtp_port: 465,
//   email_security_type_id: 1,
//   authentication_required: false,
//   isactive: true,
//   createdby: "Owner",
//   updatedby: "Owner",
//   createdon: "1 May 2025",
//   updatedon: "1 May 2025",
// };

// const SettingsModal: React.FC<SettingsModalProps> = ({
//   isOpen,
//   onClose,
//   settingType,
//   initialData,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = useState<EmailSettings>(
//     settingType === "company" ? defaultCompanySettings : defaultUserSettings
//   );
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { loginStatus } = useLoggedInUserContext();

// const createEmailSettingCompany = async () => {
//   try {
//     //
//     const responseCompanyEmailSettingCreate = await axios.post(
//       POST_API.CREATE_EMAIL_SETTING_COMPANY,
//       {
//         company_id: loginStatus.companyId,

//         email: formData.email,
//         email_password: formData.email_password,
//         smtp_host: formData.smtp_host,
//         smtp_port: formData.smtp_port,
//         email_security_type_id: formData.email_security_type_id,
//         authatication_required: formData.authentication_required,

//         createdby_id: loginStatus.id,
//       },
//       { withCredentials: true }
//     );
//     if (responseCompanyEmailSettingCreate.status === STATUS_CODE.OK) {
//       window.alert(responseCompanyEmailSettingCreate.data.message);
//     } else {
//       window.alert(responseCompanyEmailSettingCreate.data.message);
//     }
//   } catch (error) {
//     console.error("Error Creating email setting:", error);
//   } finally {
//     //
//   }
// }

// const createEmailSettingCompanyUser = async () => {
//   try {
//     //
//     const responseCompanyUserEmailSettingCreate = await axios.post(
//       POST_API.CREATE_EMAIL_SETTING_COMPANY_USER,
//       {
//         company_id: loginStatus.companyId,
//         company_user_id: loginStatus.id,
//         email: formData.email,
//         email_password: formData.email_password,
//         smtp_host: formData.smtp_host,
//         smtp_port: formData.smtp_port,
//         email_security_type_id: formData.email_security_type_id,
//         authatication_required: formData.authentication_required,

//         createdby_id: loginStatus.id,
//       },
//       { withCredentials: true }
//     );
//     if (responseCompanyUserEmailSettingCreate.status === STATUS_CODE.OK) {
//       window.alert(responseCompanyUserEmailSettingCreate.data.message);
//     } else {
//       window.alert(responseCompanyUserEmailSettingCreate.data.message);
//     }
//   } catch (error) {
//     console.error("Error Creating email setting :", error);
//   } finally {
//     //
//   }
// }

// const updateEmailSettingCompany = async () => {
//   try {
//     //
//     const responseCompanyEmailSettingCreate = await axios.post(
//       POST_API.UPDATE_EMAIL_SETTING_COMPANY,
//       {
//         company_id: loginStatus.companyId,
//         id:formData.id,
//         email: formData.email,
//         email_password: formData.email_password,
//         smtp_host: formData.smtp_host,
//         smtp_port: formData.smtp_port,
//         email_security_type_id: formData.email_security_type_id,
//         authatication_required: formData.authentication_required,
//         isactive:formData.isactive,
//         updatedby_id: loginStatus.id,
//       },
//       { withCredentials: true }
//     );
//     if (responseCompanyEmailSettingCreate.status === STATUS_CODE.OK) {
//       window.alert(responseCompanyEmailSettingCreate.data.message);
//     } else {
//       window.alert(responseCompanyEmailSettingCreate.data.message);
//     }
//   } catch (error) {
//     console.error("Error Updating email setting:", error);
//   } finally {
//     //
//   }
// }

// const updateEmailSettingCompanyUser = async () => {
//   try {
//     //
//     const responseCompanyEmailSettingCreate = await axios.post(
//       POST_API.UPDATE_EMAIL_SETTING_COMPANY_USER,
//       {
//         company_id: loginStatus.companyId,
//         id:formData.id,
//         email: formData.email,
//         email_password: formData.email_password,
//         smtp_host: formData.smtp_host,
//         smtp_port: formData.smtp_port,
//         email_security_type_id: formData.email_security_type_id,
//         authatication_required: formData.authentication_required,
//         isactive:formData.isactive,
//         updatedby_id: loginStatus.id,
//       },
//       { withCredentials: true }
//     );
//     if (responseCompanyEmailSettingCreate.status === STATUS_CODE.OK) {
//       window.alert(responseCompanyEmailSettingCreate.data.message);
//     } else {
//       window.alert(responseCompanyEmailSettingCreate.data.message);
//     }
//   } catch (error) {
//     console.error("Error Updating email setting:", error);
//   } finally {
//     //
//   }
// }

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     } else {
//       setFormData(settingType === "company" ? defaultCompanySettings : defaultUserSettings);
//     }
//   }, [initialData, settingType]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;

//     let newValue: string | number | boolean;

//     if (type === "checkbox") {
//       // Narrow to HTMLInputElement to access checked safely
//       const target = e.target as HTMLInputElement;
//       newValue = target.checked;
//     } else if (type === "number") {
//       newValue = Number(value);
//     } else {
//       newValue = value;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));
//   };

//   const handleSubmit = async () => {
//     onSubmit(formData);
//     onClose();

//     if(settingType ==="company"){
//       if (initialData) {
//         console.log("++++++++++++++++++++ Company Update Email Setting +++++++++++++++");
//         await updateEmailSettingCompany();
//       } else {
//         console.log("++++++++++++++++++++ Company Create Email Setting+++++++++++++");
//         await createEmailSettingCompany();
//       }
//     }else{
//          if (initialData) {
//         console.log("++++++++++++++++++++ User Update Email Setting +++++++++++++++");
//        await updateEmailSettingCompanyUser();
//       } else {
//         console.log("++++++++++++++++++++ User Create Email Setting +++++++++++++");
//         await createEmailSettingCompanyUser();
//       }
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {initialData ? "Edit" : "Create"} {settingType} Email Setting
//           </DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           {settingType === "company" ? (
//             <>
//               <label className="block text-sm font-medium">Company Email</label>
//               <input
//                 type="email"
//                 name="company_email"
//                 value={(formData as CompanyEmailSettings).email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">Email Password</label>
//               <input
//                 type="password"
//                 name="email_password"
//                 value={formData.email_password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">SMTP Host</label>
//               <input
//                 type="text"
//                 name="smtp_host"
//                 value={formData.smtp_host}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">SMTP Port</label>
//               <input
//                 type="number"
//                 name="smtp_port"
//                 value={formData.smtp_port}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">Security Type</label>
//               <select
//                 name="email_security_type_id"
//                 value={formData.email_security_type_id}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               >
//                 <option value={1}>SSL</option>
//                 <option value={2}>TLS</option>
//               </select>
//               <label className="inline-flex items-center mt-2">
//                 <input
//                   type="checkbox"
//                   name="authentication_required"
//                   checked={formData.authentication_required}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 Authentication Required
//               </label>
//             </>
//           ) : (
//             <>
//               <label className="block text-sm font-medium">User Email</label>
//               <input
//                 type="email"
//                 name="user_email"
//                 value={(formData as UserEmailSettings).email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">Email Password</label>
//               <input
//                 type="password"
//                 name="email_password"
//                 value={formData.email_password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">SMTP Host</label>
//               <input
//                 type="text"
//                 name="smtp_host"
//                 value={formData.smtp_host}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">SMTP Port</label>
//               <input
//                 type="number"
//                 name="smtp_port"
//                 value={formData.smtp_port}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <label className="block text-sm font-medium">Security Type</label>
//               <select
//                 name="email_security_type_id"
//                 value={formData.email_security_type_id}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//               >
//                 <option value={1}>SSL</option>
//                 <option value={2}>TLS</option>
//               </select>
//               <label className="inline-flex items-center mt-2">
//                 <input
//                   type="checkbox"
//                   name="authentication_required"
//                   checked={formData.authentication_required}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 Authentication Required
//               </label>
//             </>
//           )}
//         </div>
//         <div className="flex justify-end space-x-2 mt-4">
//           <Button  onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>
//             {initialData ? "Update" : "Create"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SettingsModal;
