
import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import MessageSnackBar from '../ui/MessageSnackbar';
import AddCompanyUserStateType from '../../@types/modal/AddCompanyUserStateType';
import AddCompanyUserModalProps from '../../@types/modal/AddCompanyUserModalProps';
import  POST_API  from "../../constants/PostApi";

function AddCompanyUserModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const { loginStatus } = useLoggedInUserContext();
  const [addCompanyUserFormData, setFormData] = useState<AddCompanyUserStateType>({
    fullName: '',
    mobilenumber: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddCompanyUserStateType, string>>>({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const mobileRegex = /^[6-9]\d{9}$/;
  const mobileRegex = /^[0-9]{10,15}$/;
  const validateField = (name: keyof AddCompanyUserStateType, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value) return 'Name is required';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
        break;
      case 'mobilenumber':
        if ( value && !mobileRegex.test(value)) return 'Invalid mobile number';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as { name: keyof AddCompanyUserStateType; value: string };
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as { name: keyof AddCompanyUserStateType; value: string };
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear errors on input
  };

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Partial<Record<keyof AddCompanyUserStateType, string>> = {};
    (Object.keys(addCompanyUserFormData) as (keyof AddCompanyUserStateType)[]).forEach((key) => {
      const error = validateField(key, addCompanyUserFormData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnackbar('Please fill the required fields correctly.', 'error');
      return;
    }

    const createCompanyUserData = {
      fullname: addCompanyUserFormData.fullName.trim(),
      mobilenumber: addCompanyUserFormData.mobilenumber.trim(),
      email: addCompanyUserFormData.email.trim(),
      createdby: loginStatus.id,
      company_id: loginStatus.companyId,
    };

    try {
      const response = await axios.post(POST_API.CREATE_USER, createCompanyUserData ,{
        withCredentials:true,
      });
      if (response.data.status) {
        console.log(response.data)
        showSnackbar(response.data.message, 'success');
        setFormData({ fullName: '', mobilenumber: '', email: '' });
        onClose();
        window.location.href = '/home/manage-users/users';
      } else {
        showSnackbar(response.data.message, 'error');
      }
    } catch (error) {
      showSnackbar('Something went wrong. Please try again.', 'error');
      console.log(error);
      
    }
  };

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
            <UserPlus className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Company CompanyUser
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              label="Name : "
              type="text"
              name="fullName"
              placeholder="Enter User Name"
              value={addCompanyUserFormData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              maxLength={100}
            />
            <FormInput
              label="Mobile Number : "
              type="tel"
              name="mobilenumber"
              placeholder="Enter Mobile Number"
              value={addCompanyUserFormData.mobilenumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.mobilenumber}
              maxLength={15}
            />
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={addCompanyUserFormData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              maxLength={256 }
            />
            <Button type="submit">Create Company CompanyUser</Button>
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

export default AddCompanyUserModal;