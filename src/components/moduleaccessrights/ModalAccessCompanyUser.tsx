import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

type  Module= {
  id: number;
  name: string;
  add: boolean;
  view: boolean;
  update: boolean;
}

type  ModalProps= {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function ModalAccessCompanyUser({ isOpen, onClose, userName }: ModalProps) {
  const [modules, setModules] = React.useState<Module[]>([
    { id: 1, name: 'Module 1 ', add: false, view: true, update: true },
    { id: 2, name: 'Module 2', add: true, view: true, update: false },
    { id: 3, name: 'Module 3', add: true, view: false, update: true },
    { id: 4, name: 'Module 4', add: true, view: true, update: true },
    
  ]);

  if (!isOpen) return null;

  const handleCheckboxChange = (moduleId: number, field: 'add' | 'view' | 'update') => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, [field]: !module[field] }
        : module
    ));
  };

  const handleColumnSelectAll = (field: 'add' | 'view' | 'update') => {
    const isAllChecked = modules.every(module => module[field]);
    setModules(modules.map(module => ({
      ...module,
      [field]: !isAllChecked
    })));
  };


  const isColumnSelected = (field: 'add' | 'view' | 'update') => 
    modules.every(module => module[field]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 mt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-700">
            Update Access rights of {userName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 w-16">Sr. No.</th>
                <th className="pb-4">Module Name</th>
                <th className="pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <span>Add</span>
                    <input
                      type="checkbox"
                      checked={isColumnSelected('add')}
                      onChange={() => handleColumnSelectAll('add')}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th className="pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <span>View</span>
                    <input
                      type="checkbox"
                      checked={isColumnSelected('view')}
                      onChange={() => handleColumnSelectAll('view')}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th className="pb-4 text-center">
                  <div className="flex flex-col items-center">
                    <span>Update</span>
                    <input
                      type="checkbox"
                      checked={isColumnSelected('update')}
                      onChange={() => handleColumnSelectAll('update')}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="border-t">
                  <td className="py-3">{module.id}</td>
                  <td className="py-3">{module.name}</td>
                  <td className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={module.add}
                      onChange={() => handleCheckboxChange(module.id, 'add')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={module.view}
                      onChange={() => handleCheckboxChange(module.id, 'view')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={module.update}
                      onChange={() => handleCheckboxChange(module.id, 'update')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end p-2 border-t gap-3">
         
          <div>
          <Button
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
          >
            Save
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}