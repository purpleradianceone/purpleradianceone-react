import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import AccessRightsModalProps from "../../@types/company-users/AccessRightsModalProps";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { AccessManagementProps } from "../../@types/company-users/AccessManagementProps";
import axios from "axios";
// import AccessDeniedPage from "../views/not-found/AccessDeniedPage";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import MessageSnackBar from "../ui/MessageSnackbar";
import LoadingSpinner from "../../assets/animations/LoadingSpinner";
function CompanyUserAccessManagementModal({
  isOpen,
  onClose,
  users,
}: AccessRightsModalProps) {
  const{accessModules}= useAccessManagementContext();

  const[dataStatus,setDataStatus] = useState(false);
    const [snackbar, setSnackbar] = useState<{
      open: boolean;
      message: string;
      type: 'success' | 'error';
    }>({
      open: false,
      message: '',
      type: 'success'
    });

  const[changedAccessModules,setChangedAccessModules] = useState<AccessManagementProps[]>([]);
  const initialModulesRef = useRef<AccessManagementProps[]>([]);
     const [spinnerAnimation,setSpinnerAnimation] = useState<{
        status: 'idle' | 'loading' | 'success' | 'error';
        message: string;
      }>({
        status : "idle",
        message : ""
      })

  const [modules, setModules] = React.useState<AccessManagementProps[]>([
    {
      add: false,
      company_user_id: 0,
      createdon: "",
      crm_module_id: 0,
      id: 0,
      module_name: "",
      update: false,
      updatedby: 0,
      updatedby_user: "",
      view: false,
    },
  ]);

  const { loginStatus } = useLoggedInUserContext();

  useEffect(() => {
    if (isOpen) {
      setDataStatus(true);
      const getCrmModuleAccessData = {
        company_id : loginStatus.companyId,
        company_user_id: users.id,
        requestedby : loginStatus.userId
      };

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginStatus.token;
      axios
        .post(
          "/api/main/purple-crm-api/get/crmmodules/access",
          getCrmModuleAccessData
        )
        .then((response) => {
          setModules(response.data);
          setDataStatus(false);
          initialModulesRef.current = response.data;
          setChangedAccessModules([]);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setModules([]);
      setChangedAccessModules([]);
      setSnackbar(prev => ({ ...prev, open: false }));

    }
  }, [isOpen]);
  

if(!isOpen) return null;

  const handleCheckboxChange = (moduleId: number, field: "add" | "view" | "update") => {
    setModules((prevModules) => {
      const updatedModules = prevModules.map((module) =>
        module.id === moduleId ? { ...module, [field]: !module[field] } : module
      );
  
      // Find initial state
      const initialModule = initialModulesRef.current.find((m) => m.id === moduleId);
      const updatedModule = updatedModules.find((m) => m.id === moduleId);
  
      if (!updatedModule || !initialModule) return updatedModules;
  
      // Check if the module state is different from its initial state
      const hasChanged =
        initialModule.add !== updatedModule.add ||
        initialModule.view !== updatedModule.view ||
        initialModule.update !== updatedModule.update;
  
      setChangedAccessModules((prevChanges) => {
        // Remove if unchanged, add if changed
        const filteredChanges = prevChanges.filter((m) => m.id !== moduleId);
        return hasChanged ? [...filteredChanges, updatedModule] : filteredChanges;
      });
  
      return updatedModules;
    });
  };
  

  const handleColumnSelectAll = (field: "add" | "view" | "update") => {
    setModules((prevModules) => {
      const isAllChecked = prevModules.every((module) => module[field]);
  
      const updatedModules = prevModules.map((module) => ({
        ...module,
        [field]: !isAllChecked,
      }));
  
      setChangedAccessModules(() => {
        return updatedModules.filter((updatedModule) => {
          const initialModule = initialModulesRef.current.find((m) => m.id === updatedModule.id);
          return (
            initialModule &&
            (initialModule.add !== updatedModule.add ||
              initialModule.view !== updatedModule.view ||
              initialModule.update !== updatedModule.update)
          );
        });
      });
  
      return updatedModules;
    });
  };
  

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
  };

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSaveAccessModule = () => {
    if (changedAccessModules.length === 0) {
      showSnackbar("No changes to save", "error");  // Updated message for clarity
      return;
    }
  
    setSpinnerAnimation({
      status: "loading",
      message: "Saving...",
    });
  
    const saveCrmModuleAccessData = changedAccessModules.map((module) => ({
      company_id: loginStatus.companyId,
      id: module.id,
      add: module.add,
      view: module.view,
      update: module.update,
      updatedby: loginStatus.userId
    }));
  
    axios.defaults.headers.common["Authorization"] = "Bearer " + loginStatus.token;
  
    axios.post("/api/main/purple-crm-api/update/crmmodules/access", saveCrmModuleAccessData)
      .then(response => {
        showSnackbar(response.data.message, "success");
  
        setSpinnerAnimation({
          status: "success",
          message: "Saved!",
        });
  
        // Reset tracking of changes
        setChangedAccessModules([]);
        initialModulesRef.current = modules;  // Update reference state
  
        setTimeout(() => {
          setSpinnerAnimation({
            status: "idle",
            message: "",
          });
        }, 1000);
      })
      .catch(error => {
        showSnackbar("Something went wrong", "error");
        console.error("Error saving data:", error);
        setSpinnerAnimation({
          status: "idle",
          message: "",
        });
      });
  };
  

  const isColumnSelected = (field: "add" | "view" | "update") =>
    modules.every((module) => module[field]);


  return accessModules.map(accessModule => {
    if(accessModule.crm_module_id === 2 && accessModule.view){
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
            {dataStatus ? 
          (<div className="flex w-full h-48 justify-center items-center">
            <LoadingSpinner></LoadingSpinner>
          </div>) 
          :
          (
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
                        checked={isColumnSelected("add")}
                        onChange={() => handleColumnSelectAll("add")}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </th>
                  <th className="pb-4 text-center">
                    <div className="flex flex-col items-center">
                      <span>View</span>
                      <input
                        type="checkbox"
                        checked={isColumnSelected("view")}
                        onChange={() => handleColumnSelectAll("view")}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </th>
                  <th className="pb-4 text-center">
                    <div className="flex flex-col items-center">
                      <span>Update</span>
                      <input
                        type="checkbox"
                        checked={isColumnSelected("update")}
                        onChange={() => handleColumnSelectAll("update")}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                modules
                .sort((a, b) => a.id - b.id)
                .map((module) => (
                  <tr key={module.id} className="border-t">
                    <td className="py-3">{module.crm_module_id}</td>
                    <td className="py-3">{module.module_name}</td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={module.add}
                        onChange={() => handleCheckboxChange(module.id, "add")}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={module.view}
                        onChange={() => handleCheckboxChange(module.id, "view")}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="checkbox"
                        checked={module.update}
                        onChange={() => handleCheckboxChange(module.id, "update")}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
               
                
                
              </tbody>
            </table>
          </div>
          ) 
          }
                
              <div className="flex justify-end p-2 border-t gap-3">
                <div className="min-w-24">
                  {accessModule.update ? 
                  users.id === loginStatus.userId ?
                  <Button disabled={true}>Save</Button>
                    :<Button onClick={handleSaveAccessModule} spinner={spinnerAnimation}>Save</Button>:
                     <Button disabled={true}>Save</Button>}
                </div>
              </div>
            
          </div>
          <MessageSnackBar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleClose}
        duration={2000}
      />
        </div>
      );
    }

  })
}


export default CompanyUserAccessManagementModal;