/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../constants/Routes';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../constants/PostApi';
import { STATUS_CODE } from '../../constants/AppConstants';
import { Eye, Edit2, Trash2, CheckCircle, XCircle, Star, Loader2, LucideMail } from 'lucide-react';
import { useComapanySpecificSearchDateRange } from '../../config/hooks/useCompanySpecificDateRange'; // fix import spelling if possible
import { useSearchFilterPaginationDateHandlers } from '../../config/hooks/usePaginationHandler';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [offset, setOffset] = useState<number>(0);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [loadingTemplatePage, setLoadingTemplatesPage] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const limit = null;
  const containerRef = useRef<HTMLDivElement>(null);





  const handleTemplateCreate = (typeId: string) => {
    // typeId is string (id as string)
    setShowModal(false);
    navigate(`${ROUTES_URL.EMAIL_TEMPLATE_CREATE}?type=${typeId}`);
  };

  const getTemplateTypes = async () => {
    setLoadingTemplatesPage(true);
    try {
      const response = await axios.post(
        POST_API.GET_EMAIL_TYPE,
        {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.id,
          is_host_email: false,
        },
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const activeTypes = response.data;
        setTemplateTypes(activeTypes);
        if (activeTypes.length > 0) {
          setActiveTab(activeTypes[0].name);
          setOffset(0);
          setTemplates([]);
          setHasMoreTemplates(true);
          getTemplatesOfCompany({ typeId: activeTypes[0].id, reset: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTemplatesPage(false);
    }
  };

  const getTemplatesOfCompany = async ({
    typeId,
    reset = false,
  }: {
    typeId: number;
    reset?: boolean;
  }) => {

    console.log("Loading : " + loadingTemplates +  "  hasMore : " + hasMoreTemplates);
    if (loadingTemplates || (!hasMoreTemplates&&!reset)) return;

    setLoadingTemplates(true);

    try {
      const response = await axios.post(
        POST_API.GET_EMAIL_TEMPLATE,
        {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.id,
          id: null,
          email_type_id: typeId,
          search_company_specific_date_range_id: null,
          search_parameter: null,
          search_parameter_date: null,
          // offset: reset ? 0 : offset,
          offset: null,

          limit,
        },
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const newTemplates = response.data;
        // if (newTemplates.length < limit) setHasMoreTemplates(false);
        setTemplates((prev) => (reset ? newTemplates : [...prev, ...newTemplates]));
        // setOffset((prev) => (reset ? limit : prev + limit));
        setLoadingTemplates(false);

      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTabChange = (tab: string) => {

    const selectedType = templateTypes.find((type) => type.name === tab);
    if (selectedType !== undefined) {
          console.log(selectedType);
      setActiveTab(tab);
      setOffset(0);
      setTemplates([]);
      setHasMoreTemplates(true);
      setLoadingTemplates(true);
      getTemplatesOfCompany({ typeId: selectedType.id, reset: true });
      setLoadingTemplates(false);

    }
  };

  useEffect(() => {
    getTemplateTypes();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop <=
          container.clientHeight + 200 &&
        !loadingTemplates &&
        hasMoreTemplates
      ) {
        const selectedType = templateTypes.find((type) => type.name === activeTab);
        if (selectedType) {
          getTemplatesOfCompany({ typeId: selectedType.id });
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadingTemplates, activeTab, hasMoreTemplates, templateTypes]);

  return (
    <div className="w-full pt-1 pl-5 pr-1 gap-1">
      <div className="sticky z-10 top-12 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm mb-1 w-full">
        <div className="flex justify-between w-full h-11">
          <div className="flex gap-2">
            <LucideMail className="w-7 h-7 text-blue-600 mt-2" />
            <span className="text-1xl font-bold mt-2">Email Templates</span>
          </div>
        </div>
      </div>

      {loadingTemplatePage ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div
          className="flex place-items-start min-w-full h-screen font-sans text-gray-800"
          ref={containerRef}
        >
          <Sidebar onCreate={() => setShowModal(true)} />
          <div className="flex-1 p-4 overflow-y-auto">
            <Tabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              templateTypes={templateTypes}
            />
            <TemplateList templates={templates} loading={loadingTemplates} />
          </div>
          {showModal && (
            <TemplateTypeModal
              onClose={() => setShowModal(false)}
              onCreate={handleTemplateCreate}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <button
    className="fixed top-14 right-4 z-50 bg-blue-500 text-white w-fit py-2 rounded mb-4 p-3"
    onClick={onCreate}
  >
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
        className={`py-2 px-4 border-b-2 ${
          activeTab === tab.name ? 'border-black font-semibold' : 'border-transparent'
        }`}
      >
        {tab.name}
      </button>
    ))}
  </div>
);

type TemplateListProps = {
  templates: EmailTemplate[];
  loading: boolean;
};

const TemplateList: React.FC<TemplateListProps> = ({ templates, loading }) => {
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  return (
    <>
      {templates.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-10">No templates found for this category.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label={`Preview ${template.name}`}
                >
                  <Eye size={18} />
                </button>
                <button
                  className="text-green-500 hover:text-green-700"
                  aria-label={`Edit ${template.name}`}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Delete ${template.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Subject:</strong> {template.email_subject || <em>No subject</em>}
            </p>
            <div className="flex flex-col space-y-1 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                {template.isactive ? (
                  <CheckCircle className="text-green-500" size={16} />
                ) : (
                  <XCircle className="text-gray-400" size={16} />
                )}
                <strong>Active:</strong> {template.isactive ? 'Yes' : 'No'}
              </span>
              <span className="flex items-center gap-1">
                {template.is_default ? (
                  <Star className="text-yellow-500" size={16} />
                ) : (
                  <XCircle className="text-gray-400" size={16} />
                )}
                <strong>Default:</strong> {template.is_default ? 'Yes' : 'No'}
              </span>
              <span className="flex items-center gap-1">
                {template.is_master ? (
                  <Star className="text-purple-500" size={16} />
                ) : (
                  <XCircle className="text-gray-400" size={16} />
                )}
                <strong>Master:</strong> {template.is_master ? 'Yes' : 'No'}
              </span>
              <span>
                <strong>Created By:</strong> {template.createdby}
              </span>
              <span>
                <strong>Created On:</strong> {template.createdon}
              </span>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      )}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">Preview: {previewTemplate.name}</h2>
            <div
              className="overflow-y-auto max-h-[70vh] border rounded p-4 text-sm text-gray-800"
              dangerouslySetInnerHTML={{ __html: previewTemplate.email_body_html }}
            />
            <div className="text-right mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type TemplateTypeModalProps = {
  onClose: () => void;
  onCreate: (typeId: string) => void;
};

const TemplateTypeModal: React.FC<TemplateTypeModalProps> = ({ onClose, onCreate }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const { loginStatus } = useLoggedInUserContext();
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          POST_API.GET_EMAIL_TYPE,
          {
            company_id: loginStatus.companyId,
            requestedby: loginStatus.id,
            is_host_email: false,
          },
          { withCredentials: true }
        );
        if (response.status === STATUS_CODE.OK) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const activeTypes = response.data.filter((type: any) => type.isactive);
          setTemplateTypes(activeTypes);
          if (activeTypes.length > 0) setSelectedTypeId(String(activeTypes[0].id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, [loginStatus.companyId, loginStatus.id]);

  const handleSubmit = () => {
    if (selectedTypeId) {
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
          <option value="" >Select template type</option>
          {templateTypes.filter((t) => t.isactive).map((type) => (
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
