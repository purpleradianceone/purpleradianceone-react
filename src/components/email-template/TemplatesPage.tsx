/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES_URL from '../../constants/Routes';

type Template = {
  id: number;
  name: string;
  category: string;
  description: string;
};

type TemplateForm = {
  name: string;
  subject: string;
  description: string;
  typeId: number;
};

type TemplateType = {
  id: number;
  name: string;
  isActive: boolean;
};

const TEMPLATE_TYPES: TemplateType[] = [
  { id: 1, name: 'Welcome company user', isActive: true },
  { id: 2, name: 'New lead created', isActive: true },
  { id: 3, name: 'Lead assigned', isActive: true },
  { id: 4, name: 'Lead status changed', isActive: true },
];

const findTemplateById = (id: number): TemplateType => {
  const template = TEMPLATE_TYPES.find((template) => template.id === id);
  return template ?? { id: 1, name: 'Welcome company user', isActive: true };
};

const templates: Template[] = [
  { id: 1, name: 'Welcome Template', category: findTemplateById(1).name, description: 'Welcome to the company...!' },
  { id: 2, name: 'Lead Assign 1', category: findTemplateById(3).name, description: 'Lead Assign to you...!' },
];

export const TemplatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Email' | 'Inventory' | 'Mail Merge'>('Email');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleTemplateCreate = (typeId: number) => {
    setShowModal(false);
    navigate(`${ROUTES_URL.EMAIL_TEMPLATE_CREATE}?type=${typeId}`);
  };

  return (
    <div className="flex h-screen font-sans text-gray-800">
      <Sidebar onCreate={() => setShowModal(true)} />
      <div className="flex-1 p-4">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <TemplateList templates={templates} />
      </div>
      {showModal && <TemplateTypeModal onClose={() => setShowModal(false)} onCreate={handleTemplateCreate} />}
    </div>
  );
};

const Sidebar: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="w-64 border-r p-4">
    <button className="bg-blue-500 text-white w-full py-2 rounded mb-4" onClick={onCreate}>
      + Create New Template
    </button>
    <nav className="space-y-2 text-sm">
      <a href="" className="text-blue-600 font-semibold block">All Templates</a>
      <a href="">Favorites</a>
      <a href="">Associated Templates</a>
      <a href="">Created by me</a>
      <a href="">Shared with me</a>
      <a href="">Public Email Templates</a>
    </nav>
  </div>
);

type TabsProps = {
  activeTab: string;
  onTabChange: (tab: 'Email' | 'Inventory' | 'Mail Merge') => void;
};

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex space-x-4 border-b mb-4">
    {['Email', 'Inventory', 'Mail Merge'].map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab as any)}
        className={`py-2 px-4 border-b-2 ${activeTab === tab ? 'border-black font-semibold' : 'border-transparent'}`}
      >
        {tab}
      </button>
    ))}
  </div>
);

type TemplateListProps = {
  templates: Template[];
};

const TemplateList: React.FC<TemplateListProps> = ({ templates }) => (
  <div className="border rounded">
    <div className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b">TEMPLATE NAME</div>
    {templates.map((template) => (
      <div key={template.id} className="flex items-center px-4 py-3 border-b hover:bg-gray-50">
        <input type="checkbox" className="mr-4" />
        <div>
          <div className="font-medium">{template.name}</div>
          <div className="text-sm text-gray-600">
            <span className="bg-gray-200 text-xs px-2 py-1 rounded mr-2">{template.category}</span>
            {template.description}
          </div>
        </div>
      </div>
    ))}
  </div>
);

type ModalProps = {
  onClose: () => void;
  onCreate: (typeId: number) => void;
};

const TemplateTypeModal: React.FC<ModalProps> = ({ onClose, onCreate }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

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
          onChange={(e) => setSelectedTypeId(Number(e.target.value))}
          className="w-full mb-3 border px-3 py-2 rounded"
        >
          <option value="" disabled>Select template type</option>
          {TEMPLATE_TYPES.filter(t => t.isActive).map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
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
