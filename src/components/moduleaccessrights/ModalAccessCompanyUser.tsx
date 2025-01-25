import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import AccessRightsModalProps from '../../@types/company-users/AccessRightsModalProps';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import { AccessManagementProps } from '../../@types/company-users/AccessManagementProps';
import axios from 'axios';


export function ModalAccessCompanyUser({ isOpen, onClose, users }: AccessRightsModalProps) {
  const [modules, setModules] = React.useState<AccessManagementProps[]>([{
    add : false,
  company_user_id : 0,
  createdon : "",
  crm_module_id : 0,
  id : 0,
  module_name: "",
  update : false,
  updatedby : 0,
  updatedby_user : "",
  view : false
  }]);

  const {loginStatus} = useLoggedInUserContext();


  useEffect(()=>{
    if(isOpen){
      const getCrmModuleAccess={
        company_user_id: users.id,
      }
      console.log(users.id);
      
      axios.defaults.headers.common["Authorization"] =
      "Bearer " + loginStatus.token;
      axios.post("/api/main/purple-crm-api//get/crmmodules/access",getCrmModuleAccess)
      .then(response => 
      {
        setModules(response.data);
        
      }
      )
      .catch(error => {
        console.error(error);
      });
  
    }
   else{
    setModules([]);
   }



  },[isOpen])

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
    <div className="fixed z-10 inset-0  bg-black bg-opacity-10 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium text-gray-700">
            Update Access rights of {users.fullname}
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
                  <td className="py-3">{module.module_name}</td>
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
          >
            Save
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}