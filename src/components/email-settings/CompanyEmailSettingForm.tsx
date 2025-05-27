// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";

type FormData = {
  company_email: string;
  email_password: string;
  smtp_host: string;
  smtp_port: string;
  email_security_type_id: string;
  authentication_required: boolean;
};

export default function CompanyEmailSettingsForm() {
  const [formData, setFormData] = useState<FormData>({
    company_email: "",
    email_password: "",
    smtp_host: "",
    smtp_port: "",
    email_security_type_id: "",
    authentication_required: false,
  });

  const isFormEmpty = Object.values(formData).every(
    (value) => value === "" || value === false
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (isFormEmpty) {
      console.log("Saving new settings:", formData);
    } else {
      console.log("Updating existing settings:", formData);
    }
  };

  return (
    <div className="max-w-md p-4 border rounded space-y-4">
      <h2 className="text-lg font-semibold">Company Email Settings</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Company Email</label>
          <input
            type="email"
            name="company_email"
            value={formData.company_email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="example@company.com"
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            name="email_password"
            value={formData.email_password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Enter password"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          />
        </div>
        <div>
          <label className="block text-sm">SMTP Server</label>
          <input
            type="text"
            name="smtp_host"
            value={formData.smtp_host}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="smtp.company.com"
          />
        </div>
        <div>
          <label className="block text-sm">Port</label>
          <input
            type="number"
            name="smtp_port"
            value={formData.smtp_port}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="587"
          />
        </div>
        <div>
          <label className="block text-sm">Email Security Type</label>
          <select
            name="email_security_type_id"
            value={formData.email_security_type_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
          >
            <option value="">Select security type</option>
            <option value="1">SSL</option>
            <option value="2">TLS</option>
            <option value="3">None</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="authentication_required"
            checked={formData.authentication_required}
            onChange={handleChange}
          />
          <label className="text-sm">Authentication Required</label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isFormEmpty ? "Save" : "Update"}
      </button>
    </div>
  );
}
