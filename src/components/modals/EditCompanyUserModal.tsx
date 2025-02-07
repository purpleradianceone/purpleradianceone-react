
import React, { useEffect, useState } from 'react';
import { EditIcon, X } from 'lucide-react';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import MessageSnackBar from '../ui/MessageSnackbar';
import  POST_API  from "../../constants/PostApi";
import CompanyUser from '../../@types/company-users/CompanyUser';

type EditUserPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  user : CompanyUser
  handleCompanyUserChange : (users: CompanyUser) => void;
};

export function EditCompanyUserModal({ isOpen, onClose,user,handleCompanyUserChange }: EditUserPopupProps) {

  const [updateUserformData,setUpdateUserFormData] = useState({
    fullName: user.fullname,
    mobilenumber : user.mobilenumber
  })

   const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      type: 'success' as 'success' | 'error',
    });

    const [fulNameErrorMessage,setFullNameErrorMessage] = useState("");

  const {loginStatus} = useLoggedInUserContext();
  const handleEditUserFormChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      const {name,value} = event.target;
      setUpdateUserFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  useEffect(()=>{
    if(isOpen){
      setFullNameErrorMessage("");
    }
  },[isOpen])

  const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = event.target;

    if(name==="fullName"){
      if(!value){
        setFullNameErrorMessage("Full name is required");
      }else{
        setFullNameErrorMessage("")
      }
    }
    if(updateUserformData.fullName === "" && user.fullname === ""){
      if (event.target.value == "") {
        setFullNameErrorMessage("Name is required");
      } else {
        setFullNameErrorMessage("");
      }
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    if( updateUserformData.fullName !== ""){
      if(user.fullname !== updateUserformData.fullName 
        || 
        user.mobilenumber !== updateUserformData.mobilenumber)
        {
        const postUpdateUserData = {
          id : user.id,
          updatedby : loginStatus.id,
          company_id : loginStatus.companyId,
          fullname : updateUserformData.fullName,
          mobilenumber : updateUserformData.mobilenumber,
        }
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + loginStatus.token;
          axios.post(POST_API.UPDATE_COMPANY_USER,postUpdateUserData)
          .then(response => {
            showSnackbar(response.data.message,"success")
            handleCompanyUserChange(user);
            setTimeout(() => {
              onClose();
            }, 2000);
            
  
          })
          .catch(error => {
    
            showSnackbar(error.message,"error")
          })
      }
      else{
        showSnackbar("No changes made","error")
      }
    }
    else{
      showSnackbar("Name is required","error")
      setFullNameErrorMessage("Name is required");
    }
  };
  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(()=>{
    setSnackbar((prev) => ({ ...prev, open: false }));

  },[isOpen])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <EditIcon className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              Edit {user.fullname}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              label="Name : "
              type="text"
              name="fullName"
              value={updateUserformData.fullName}
              placeholder="Enter User Name"
              defaultValue={user.fullname}
              maxLength={256}
              onChange={handleEditUserFormChange}
              error={fulNameErrorMessage}
              onBlur={handleInputBlur}
            />
            <FormInput
              label="Mobile Number : "
              type="tel"
              name="mobilenumber"
              placeholder="Enter Mobile Number"
              defaultValue={user.mobilenumber} 
              onChange={handleEditUserFormChange}
            />
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email Address"
              defaultValue={user.email}
              readonly = {true}
              
            />
            <Button type="submit">Update Company User</Button>
          </form>
        </div>
      </div>
       <MessageSnackBar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseSnackbar}
        duration={2000}
      /> 
    </div>
  );
}
