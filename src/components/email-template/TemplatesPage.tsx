/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../constants/Routes';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../constants/PostApi';
import { STATUS_CODE } from '../../constants/AppConstants';
import { Eye, Edit2, Trash2, CheckCircle, XCircle, Star } from 'lucide-react';


type EmailTemplate = {
  count: number;
  id: number;
  company_id: number;
  email_type_id: number;
  name: string;
  email_subject: string;
  email_body_html: string;
  is_master: boolean;
  is_default: boolean;
  isactive: boolean;
  createdby: string;
  category: string;
  createdon: string;
};

type TemplateType = {
  id: number;
  name: string;
  is_host_email: boolean;
  isactive: boolean;
};

export const TemplatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const handleTemplateCreate = (type: string) => {
    setShowModal(false);
    navigate(`${ROUTES_URL.EMAIL_TEMPLATE_CREATE}?type=${type}`);
  };

  const getTemplateTypes = async () => {
    const postDataTemplateType = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      is_host_email: false,
    };

    try {
      const response = await axios.post(POST_API.GET_EMAIL_TYPE, postDataTemplateType, { withCredentials: true });
      if (response.status === STATUS_CODE.OK) {
        const activeTypes = response.data.filter((type: any) => type.isactive);
        setTemplateTypes(activeTypes);
        if (activeTypes.length > 0) {
          setActiveTab(activeTypes[0].name);
          getTemplatesOfCompany({ id: null, typeId: activeTypes[0].id });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTemplatesOfCompany = async ({ id, typeId }: { id: any; typeId: any }) => {
    const postDataTemplateGet = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      id,
      email_type_id: typeId,
      search_company_specific_date_range_id: null,
      search_parameter: null,
      search_parameter_date: null,
      offset: null,
      limit: null,
    };

    try {
      const response = await axios.post(POST_API.GET_EMAIL_TEMPLATE, postDataTemplateGet, { withCredentials: true });
      if (response.status === STATUS_CODE.OK) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const selectedType = templateTypes.find((type) => type.name === tab);
    if (selectedType) {
      getTemplatesOfCompany({ id: null, typeId: selectedType.id });
    }
  };

  useEffect(() => {
    getTemplateTypes();
  }, []);

  return (
    <div className="flex place-items-start min-w-full h-screen font-sans text-gray-800">
      <Sidebar onCreate={() => setShowModal(true)} />
      <div className="flex-1 p-4">
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} templateTypes={templateTypes} />
        <TemplateList templates={templates} />
      </div>
      {showModal && <TemplateTypeModal onClose={() => setShowModal(false)} onCreate={handleTemplateCreate} />}
    </div>
  );
};

const Sidebar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <button className="fixed top-14 right-4 bg-blue-500 text-white w-fit py-2 rounded mb-4 p-3" onClick={onCreate}>
    + Create New Template
  </button>
);

type TabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  templateTypes: TemplateType[];
};

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, templateTypes }) => (
  <div className="flex space-x-4 border-b mb-4">
    {templateTypes.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.name)}
        className={`py-2 px-4 border-b-2 ${activeTab === tab.name ? 'border-black font-semibold' : 'border-transparent'}`}
      >
        {tab.name}
      </button>
    ))}
  </div>
);

type TemplateListProps = {
  templates: EmailTemplate[];
};

const TemplateList: React.FC<TemplateListProps> = ({ templates }) => {
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const handleEdit = (templateId: number) => {
    console.log('Edit template:', templateId);
    // Navigate to edit route if needed
  };

  const handleDelete = (templateId: number) => {
    console.log('Delete template:', templateId);
    // Confirm and delete logic
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div key={template.id} className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
            <div className="flex gap-2">
              <button onClick={() => setPreviewTemplate(template)} className="text-blue-500 hover:text-blue-700">
                <Eye size={18} />
              </button>
              <button onClick={() => handleEdit(template.id)} className="text-green-500 hover:text-green-700">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(template.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            <strong>Subject:</strong> {template.email_subject || <em>No subject</em>}
          </p>

          <div className="flex flex-col space-y-1 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              {template.isactive ? <CheckCircle className="text-green-500" size={16} /> : <XCircle className="text-gray-400" size={16} />}
              <strong>Active:</strong> {template.isactive ? "Yes" : "No"}
            </span>
            <span className="flex items-center gap-1">
              {template.is_default ? <Star className="text-yellow-500" size={16} /> : <XCircle className="text-gray-400" size={16} />}
              <strong>Default:</strong> {template.is_default ? "Yes" : "No"}
            </span>
            <span className="flex items-center gap-1">
              {template.is_master ? <Star className="text-purple-500" size={16} /> : <XCircle className="text-gray-400" size={16} />}
              <strong>Master:</strong> {template.is_master ? "Yes" : "No"}
            </span>
            <span><strong>Created By:</strong> {template.createdby}</span>
            <span><strong>Created On:</strong> {template.createdon}</span>
          </div>
        </div>
      ))}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Preview: {previewTemplate.name}</h2>
            <div className="overflow-y-auto max-h-[70vh] border rounded p-4 text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: previewTemplate.email_body_html }} />
            <div className="text-right mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setPreviewTemplate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type ModalProps = {
  onClose: () => void;
  onCreate: (typeId: string) => void;
};

const TemplateTypeModal: React.FC<ModalProps> = ({ onClose, onCreate }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const { loginStatus } = useLoggedInUserContext();
  const [templateType, setTemplateType] = useState<TemplateType[]>([]);

  const getTemplateTypes = async () => {
    setTemplateType([]);
    const postDataTemplateType = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      is_host_email: false,
    };

    try {
      const response = await axios.post(POST_API.GET_EMAIL_TYPE, postDataTemplateType, {
        withCredentials: true,
      });
      if (response.status === STATUS_CODE.OK) {
        response.data.map((res: any) => {
          setTemplateType((prev) => [
            ...prev,
            {
              id: res.id,
              name: res.name,
              is_host_email: res.is_host_email,
              isactive: res.isactive,
            },
          ]);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTemplateTypes();
  }, []);

  const handleSubmit = () => {
    if (selectedTypeId !== null) {
      onCreate(selectedTypeId);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Select Template Type</h2>
        <select
          value={selectedTypeId ?? ''}
          onChange={(e) => setSelectedTypeId(e.target.value)}
          className="w-full mb-3 border px-3 py-2 rounded"
        >
          <option value="" disabled>Select template type</option>
          {templateType.filter((t) => t.isactive).map((type) => (
            <option key={type.id} value={JSON.stringify(type)}>{type.name}</option>
          ))}
        </select>
        <div className="flex justify-between mt-4">
          <button className="text-sm text-gray-600 hover:underline" onClick={onClose}>Cancel</button>
          <button
            className={`px-4 py-2 rounded text-white ${selectedTypeId !== null ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={selectedTypeId === null}
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
