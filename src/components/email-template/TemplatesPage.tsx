/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../constants/Routes';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import POST_API from '../../constants/PostApi';
import { STATUS_CODE } from '../../constants/AppConstants';
import { Eye, Edit2, Trash2, CheckCircle, XCircle, Star, Loader2, LucideMail } from 'lucide-react';
import { useComapanySpecificSearchDateRange } from '../../config/hooks/useCompanySpecificDateRange'; // fix import spelling if possible
// import { useSearchFilterPaginationDateHandlers } from '../../config/hooks/usePaginationHandler'; // This hook is not used in the provided snippet, so keeping it commented.

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
  const [offset, setOffset] = useState<number>(0);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false); // For individual template fetching
  const [loadingTemplatePage, setLoadingTemplatesPage] = useState<boolean>(false); // For initial page load
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const limit = 9; // Number of templates to fetch per request
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0); // Store ID of the active template type

  const handleTemplateCreate = (typeId: string) => {
    setShowModal(false);
    navigate(`${ROUTES_URL.EMAIL_TEMPLATE_CREATE}?type=${typeId}`);
  };

  const getTemplateTypes = async () => {
    setLoadingTemplatesPage(true); // Indicate overall page loading
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
        const activeTypes = response.data.filter((type: TemplateType) => type.isactive); // Ensure only active types
        setTemplateTypes(activeTypes);
        if (activeTypes.length > 0) {
          // Set initial active tab and load templates for it
          setActiveTab(activeTypes[0].name);
          setSelectedTypeId(activeTypes[0].id);
          setOffset(0); // Always reset offset for initial load of a type
          setTemplates([]); // Clear previous templates
          setHasMoreTemplates(true); // Assume there are more templates for the first type
          getTemplatesOfCompany({ typeId: activeTypes[0].id, reset: true }); // Fetch first batch
        } else {
          // If no active types, ensure states are reset
          setActiveTab('');
          setSelectedTypeId(0);
          setOffset(0);
          setTemplates([]);
          setHasMoreTemplates(false);
        }
      }
    } catch (error) {
      console.error("Error fetching template types:", error);
    } finally {
      setLoadingTemplatesPage(false); // Page loading complete
    }
  };

  // Memoize this function using useCallback
  const getTemplatesOfCompany = useCallback(async ({
    typeId,
    reset = false, // 'reset' indicates if we should clear existing templates and start from offset 0
  }: {
    typeId: number;
    reset?: boolean;
  }) => {
    // Prevent fetching if already loading or no more templates and not a reset action
    if (loadingTemplates || (!hasMoreTemplates && !reset)) {
      console.log(`Skipping fetch. Loading: ${loadingTemplates}, Has More: ${hasMoreTemplates}, Reset: ${reset}`);
      return;
    }

    setLoadingTemplates(true); // Set loading state for templates

    try {
      const currentOffset = reset ? 0 : offset; // Determine the offset for the current fetch
      console.log(`Workspaceing templates for typeId: ${typeId}, offset: ${currentOffset}, limit: ${limit}, reset: ${reset}`);

      const response = await axios.post(
        POST_API.GET_EMAIL_TEMPLATE,
        {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.id,
          id: null, // Not fetching a specific ID
          email_type_id: typeId,
          search_company_specific_date_range_id: null,
          search_parameter: null,
          search_parameter_date: null,
          offset: currentOffset,
          limit,
        },
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const newTemplates = response.data;
        console.log(`Workspaceed ${newTemplates.length} new templates.`);

        if (newTemplates.length < limit) {
          setHasMoreTemplates(false); 
        } else {
          setHasMoreTemplates(true); 
        }

        setTemplates((prev) => (reset ? newTemplates : [...prev, ...newTemplates]));
        setOffset(currentOffset + newTemplates.length); 
      } else {
        console.warn("API response not OK:", response.status);
        setHasMoreTemplates(false); 
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setHasMoreTemplates(false); 
    } finally {
      setLoadingTemplates(false); 
    }
  }, [offset, hasMoreTemplates, loadingTemplates, loginStatus.companyId, loginStatus.id, limit]); // Dependencies for useCallback


  const handleTabChange = (tab: string) => {
    const selectedType = templateTypes.find((type) => type.name === tab);
    if (selectedType) {
      console.log(`Changing tab to: ${tab}, typeId: ${selectedType.id}`);
      setActiveTab(tab);
      setSelectedTypeId(selectedType.id);
      setOffset(0); 
      setTemplates([]); 
      setHasMoreTemplates(true); 
      getTemplatesOfCompany({ typeId: selectedType.id, reset: true });
    }
  };

  useEffect(() => {
    getTemplateTypes();
  }, []); 

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollBottom = scrollTop + clientHeight;
      const threshold = 200; 
      if (
        scrollBottom >= scrollHeight - threshold && 
        !loadingTemplates && 
        hasMoreTemplates && 
        selectedTypeId !== 0 
      ) {
        console.log("Scroll conditions met. Initiating fetch for more templates.");
        getTemplatesOfCompany({ typeId: selectedTypeId, reset: false }); 
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadingTemplates, hasMoreTemplates, selectedTypeId, getTemplatesOfCompany]);

  return (
    <div className="w-full pt-1 pl-5 pr-1 gap-1 h-screen flex flex-col"> 
      {/* Header */}
      <div className="sticky z-10 top-12 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm mb-1 w-full "> 
        <div className="flex justify-between w-full h-10 items-center">
          <div className="flex gap-2">
            <LucideMail className="w-7 h-7 text-blue-600 mt-2" />
            <span className="text-xl font-bold mt-2">Email Templates</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loadingTemplatePage ? (
        <div className="flex justify-center items-center flex-1"> 
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <>
          <Sidebar onCreate={() => setShowModal(true)} />
          <div className="flex-1 p-4 overflow-y-auto" ref={containerRef}> 
            <Tabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              templateTypes={templateTypes}
            />

            <TemplateList templates={templates} loading={loadingTemplates} hasmore={hasMoreTemplates} />
          </div>
          {showModal && (
            <TemplateTypeModal
              onClose={() => setShowModal(false)}
              onCreate={handleTemplateCreate}
            />
          )}
        </>
      )}
    </div>
  );
};


const Sidebar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <button
    className="fixed top-14 right-4 z-10 bg-blue-500 text-white w-fit py-2 rounded mb-4 p-3 hover:bg-blue-600 transition"
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
  <div className="sticky top-0 flex space-x-4 border-b mb-4 bg-white">
    {templateTypes.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.name)}
        className={`py-2 px-4 border-b-2 ${
          activeTab === tab.name ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600 hover:text-gray-900'
        } transition-colors duration-200`}
      >
        {tab.name}
      </button>
    ))}
  </div>
);

type TemplateListProps = {
  templates: EmailTemplate[];
  loading: boolean;
  hasmore: boolean;
};

const TemplateList: React.FC<TemplateListProps> = ({ templates, loading, hasmore }) => {
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  return (
    <>
      {templates.length === 0 && !loading && !hasmore && (
        <div className="text-center text-gray-500 mt-10 p-4 border rounded-md bg-white shadow-sm">
          No templates found for this category.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition duration-200 ease-in-out"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-blue-500 hover:text-blue-700 transition"
                  aria-label={`Preview ${template.name}`}
                >
                  <Eye size={18} />
                </button>
                <button
                  className="text-green-500 hover:text-green-700 transition"
                  aria-label={`Edit ${template.name}`}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition"
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
                <strong>Created On:</strong> {new Date(template.createdon).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading && hasmore && (
        <div className="flex justify-center items-center py-4 mt-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Preview: {previewTemplate.name}</h2>
            <div
              className="overflow-y-auto flex-1 border rounded p-4 text-sm text-gray-800 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: previewTemplate.email_body_html }}
            />
            <div className="text-right mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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
          const activeTypes = response.data.filter((type: TemplateType) => type.isactive);
          setTemplateTypes(activeTypes);
          if (activeTypes.length > 0) setSelectedTypeId(String(activeTypes[0].id)); // Set default selected type
        }
      } catch (error) {
        console.error("Error fetching template types for modal:", error);
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





// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */

// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ROUTES_URL from '../../constants/Routes';
// import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
// import axios from 'axios';
// import POST_API from '../../constants/PostApi';
// import { STATUS_CODE } from '../../constants/AppConstants';
// import { Eye, Edit2, Trash2, CheckCircle, XCircle, Star, Loader2, LucideMail } from 'lucide-react';
// import { useComapanySpecificSearchDateRange } from '../../config/hooks/useCompanySpecificDateRange'; // fix import spelling if possible
// import { useSearchFilterPaginationDateHandlers } from '../../config/hooks/usePaginationHandler';

// type EmailTemplate = {
//   count: number;
//   id: number;
//   company_id: number;
//   email_type_id: number;
//   name: string;
//   email_subject: string;
//   email_body_html: string;
//   is_master: boolean;
//   is_default: boolean;
//   isactive: boolean;
//   createdby: string;
//   category: string;
//   createdon: string;
// };

// type TemplateType = {
//   id: number;
//   name: string;
//   is_host_email: boolean;
//   isactive: boolean;
// };

// export const TemplatesPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>('');
//   const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
//   const [templates, setTemplates] = useState<EmailTemplate[]>([]);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
//   const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
//   const [loadingTemplatePage, setLoadingTemplatesPage] = useState<boolean>(false);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();
//   const { loginStatus } = useLoggedInUserContext();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
//   const limit = 9;
//   const containerRef = useRef<HTMLDivElement>(null);
//   const screenDivRef = useRef<HTMLDivElement>(null);
//   const [selectedTypeId,setSelectedTypeId] = useState<number>(0);





//   const handleTemplateCreate = (typeId: string) => {
//     // typeId is string (id as string)
//     setShowModal(false);
//     navigate(`${ROUTES_URL.EMAIL_TEMPLATE_CREATE}?type=${typeId}`);
//   };

//   const getTemplateTypes = async () => {
//     setLoadingTemplatesPage(true);
//     try {
//       const response = await axios.post(
//         POST_API.GET_EMAIL_TYPE,
//         {
//           company_id: loginStatus.companyId,
//           requestedby: loginStatus.id,
//           is_host_email: false,
//         },
//         { withCredentials: true }
//       );

//       if (response.status === STATUS_CODE.OK) {
//         const activeTypes = response.data;
//         setTemplateTypes(activeTypes);
//         if (activeTypes.length > 0) {
//           setActiveTab(activeTypes[0].name);
//           setOffset(0);
//           setTemplates([]);
//           setHasMoreTemplates(true);
//           getTemplatesOfCompany({ typeId: activeTypes[0].id, reset: true });
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoadingTemplatesPage(false);
//     }
//   };

//   const getTemplatesOfCompany = async ({
//     typeId,
//     reset = false,
//   }: {
//     typeId: number;
//     reset?: boolean;
//   }) => {

//     console.log("Loading : " + loadingTemplates +  "  hasMore : " + hasMoreTemplates);
//     if (loadingTemplates || (!hasMoreTemplates&&!reset)) return;

//     setLoadingTemplates(true);

//     try {
//       const response = await axios.post(
//         POST_API.GET_EMAIL_TEMPLATE,
//         {
//           company_id: loginStatus.companyId,
//           requestedby: loginStatus.id,
//           id: null,
//           email_type_id: typeId,
//           search_company_specific_date_range_id: null,
//           search_parameter: null,
//           search_parameter_date: null,
//           offset: reset ? 0 : offset,
//           // offset: null,

//           limit,
//         },
//         { withCredentials: true }
//       );

//       if (response.status === STATUS_CODE.OK) {
//         const newTemplates = response.data;
//         if (newTemplates.length < limit) setHasMoreTemplates(false);
//         setTemplates((prev) => (reset ? newTemplates : [...prev, ...newTemplates]));
//         setOffset((prev) => (reset ? limit : prev + limit));
//         setLoadingTemplates(false);

//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoadingTemplates(false);
//     }
//   };

//   const handleTabChange = (tab: string) => {

//     const selectedType = templateTypes.find((type) => type.name === tab);
//     if (selectedType !== undefined) {
//           console.log(selectedType);
//       setActiveTab(tab);
//       setOffset(0);
//       setTemplates([]);
//       setHasMoreTemplates(true);
//       setLoadingTemplates(true);
//       setSelectedTypeId(selectedType.id);
//       getTemplatesOfCompany({ typeId: selectedType.id, reset: true });
//       setLoadingTemplates(false);

//     }
//   };

//   const handleScroll = () => {
//     const div = screenDivRef.current;
//     console.log(div);
//     if (div) {
//       const { scrollTop, scrollHeight, clientHeight } = div;
//       if (templates.length > 0 && scrollTop + clientHeight >= scrollHeight - 30 && hasMoreTemplates) {
//         getTemplatesOfCompany({typeId : selectedTypeId,reset: false})
//       }
//     }
//   };

//   useEffect(() => {
//     getTemplateTypes();
//   }, []);


//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       if (
//         container.scrollHeight - container.scrollTop <=
//           container.clientHeight + 200 &&
//         !loadingTemplates &&
//         hasMoreTemplates
//       ) {
//         const selectedType = templateTypes.find((type) => type.name === activeTab);
//         if (selectedType) {
//           getTemplatesOfCompany({ typeId: selectedType.id });
//         }
//       }
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => {
//       container.removeEventListener('scroll', handleScroll);
//     };
//   }, [loadingTemplates, activeTab, hasMoreTemplates, templateTypes]);

//   return (
//     <div className="w-full pt-1 pl-5 pr-1 gap-1">
//       <div className="sticky z-10 top-12 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm mb-1 w-full">
//         <div className="flex justify-between w-full h-11">
//           <div className="flex gap-2">
//             <LucideMail className="w-7 h-7 text-blue-600 mt-2" />
//             <span className="text-1xl font-bold mt-2">Email Templates</span>
//           </div>
//         </div>
//       </div>

//       {loadingTemplatePage ? (
//         <div className="flex justify-center items-center h-screen">
//           <Loader2 className="animate-spin text-blue-600" size={48} />
//         </div>
//       ) : (
//         <div
//           className="flex place-items-start min-w-full h-screen font-sans text-gray-800"
//           ref={containerRef}
//         >
//           <Sidebar onCreate={() => setShowModal(true)} />
//           <div className="flex-1 p-4 overflow-y-auto">
//             <Tabs
//               activeTab={activeTab}
//               onTabChange={handleTabChange}
//               templateTypes={templateTypes}
//             />

//             <TemplateList  templates={templates} loading={loadingTemplates} hasmore = {hasMoreTemplates} />
//           </div>
//           {showModal && (
//             <TemplateTypeModal
//               onClose={() => setShowModal(false)}
//               onCreate={handleTemplateCreate}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const Sidebar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
//   <button
//     className="fixed top-14 right-4 z-50 bg-blue-500 text-white w-fit py-2 rounded mb-4 p-3"
//     onClick={onCreate}
//   >
//     + Create New Template
//   </button>
// );

// type TabsProps = {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
//   templateTypes: TemplateType[];
// };

// const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, templateTypes }) => (
//   <div className="flex space-x-4 border-b mb-4">
//     {templateTypes.map((tab) => (
//       <button
//         key={tab.id}
//         onClick={() => onTabChange(tab.name)}
//         className={`py-2 px-4 border-b-2 ${
//           activeTab === tab.name ? 'border-black font-semibold' : 'border-transparent'
//         }`}
//       >
//         {tab.name}
//       </button>
//     ))}
//   </div>
// );

// type TemplateListProps = {
//   templates: EmailTemplate[];
//   loading: boolean;
//   hasmore: boolean;
// };

// const TemplateList: React.FC<TemplateListProps> = ({ templates, loading, hasmore }) => {
//   const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

//   return (
//     <>
//       {!loading && hasmore && (
//         <div className="flex justify-center items-center py-4">
//           <Loader2 className="animate-spin text-blue-600" size={40} />
//         </div>      )}
//       {templates.length === 0 && !loading && !hasmore && (
//         <div className="text-center text-gray-500 mt-10">No templates found for this category.</div>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {templates.map((template) => (
//           <div
//             key={template.id}
//             className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setPreviewTemplate(template)}
//                   className="text-blue-500 hover:text-blue-700"
//                   aria-label={`Preview ${template.name}`}
//                 >
//                   <Eye size={18} />
//                 </button>
//                 <button
//                   className="text-green-500 hover:text-green-700"
//                   aria-label={`Edit ${template.name}`}
//                 >
//                   <Edit2 size={18} />
//                 </button>
//                 <button
//                   className="text-red-500 hover:text-red-700"
//                   aria-label={`Delete ${template.name}`}
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-sm text-gray-500 mb-2">
//               <strong>Subject:</strong> {template.email_subject || <em>No subject</em>}
//             </p>
//             <div className="flex flex-col space-y-1 text-sm text-gray-700">
//               <span className="flex items-center gap-1">
//                 {template.isactive ? (
//                   <CheckCircle className="text-green-500" size={16} />
//                 ) : (
//                   <XCircle className="text-gray-400" size={16} />
//                 )}
//                 <strong>Active:</strong> {template.isactive ? 'Yes' : 'No'}
//               </span>
//               <span className="flex items-center gap-1">
//                 {template.is_default ? (
//                   <Star className="text-yellow-500" size={16} />
//                 ) : (
//                   <XCircle className="text-gray-400" size={16} />
//                 )}
//                 <strong>Default:</strong> {template.is_default ? 'Yes' : 'No'}
//               </span>
//               <span className="flex items-center gap-1">
//                 {template.is_master ? (
//                   <Star className="text-purple-500" size={16} />
//                 ) : (
//                   <XCircle className="text-gray-400" size={16} />
//                 )}
//                 <strong>Master:</strong> {template.is_master ? 'Yes' : 'No'}
//               </span>
//               <span>
//                 <strong>Created By:</strong> {template.createdby}
//               </span>
//               <span>
//                 <strong>Created On:</strong> {template.createdon}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//       {loading && (
//         <div className="flex justify-center items-center py-4">
//           <Loader2 className="animate-spin text-blue-600" size={40} />
//         </div>
//       )}
//       {previewTemplate && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
//             <h2 className="text-xl font-semibold mb-4">Preview: {previewTemplate.name}</h2>
//             <div
//               className="overflow-y-auto max-h-[70vh] border rounded p-4 text-sm text-gray-800"
//               dangerouslySetInnerHTML={{ __html: previewTemplate.email_body_html }}
//             />
//             <div className="text-right mt-4">
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={() => setPreviewTemplate(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// type TemplateTypeModalProps = {
//   onClose: () => void;
//   onCreate: (typeId: string) => void;
// };

// const TemplateTypeModal: React.FC<TemplateTypeModalProps> = ({ onClose, onCreate }) => {
//   const [selectedTypeId, setSelectedTypeId] = useState<string>('');
//   const { loginStatus } = useLoggedInUserContext();
//   const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchTypes = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           POST_API.GET_EMAIL_TYPE,
//           {
//             company_id: loginStatus.companyId,
//             requestedby: loginStatus.id,
//             is_host_email: false,
//           },
//           { withCredentials: true }
//         );
//         if (response.status === STATUS_CODE.OK) {
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           const activeTypes = response.data.filter((type: any) => type.isactive);
//           setTemplateTypes(activeTypes);
//           if (activeTypes.length > 0) setSelectedTypeId(String(activeTypes[0].id));
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTypes();
//   }, [loginStatus.companyId, loginStatus.id]);

//   const handleSubmit = () => {
//     if (selectedTypeId) {
//       onCreate(selectedTypeId);
//     }
//   };

//   return (
    // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    //   <div className="bg-white rounded-lg shadow-lg w-96 p-6">
    //     <h2 className="text-lg font-semibold mb-4">Select Template Type</h2>
    //     <select
    //       value={selectedTypeId ?? ''}
    //       onChange={(e) => setSelectedTypeId(e.target.value)}
    //       className="w-full mb-3 border px-3 py-2 rounded"
    //     >
    //       <option value="" >Select template type</option>
    //       {templateTypes.filter((t) => t.isactive).map((type) => (
    //         <option key={type.id} value={JSON.stringify(type)}>{type.name}</option>
    //       ))}
    //     </select>
    //     <div className="flex justify-between mt-4">
    //       <button className="text-sm text-gray-600 hover:underline" onClick={onClose}>Cancel</button>
    //       <button
    //         className={`px-4 py-2 rounded text-white ${selectedTypeId !== null ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
    //         disabled={selectedTypeId === null}
    //         onClick={handleSubmit}
    //       >
    //         Continue
    //       </button>
    //     </div>
    //   </div>
    // </div>
//   );
// };
