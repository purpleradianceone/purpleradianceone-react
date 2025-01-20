import React, { useState } from 'react';
import { UserPlus, WineOff, X } from 'lucide-react';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';


type FormData= {
  fullName: string;
  mobilenumber: string;
  email: string;
}


type AddUserPopupProps= {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCompanyUserPopUp({ isOpen, onClose }: AddUserPopupProps) {
  
  const {loginStatus, }= useLoggedInUserContext(); 
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobilenumber: '',
    email: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    fullName: "",
    email: "",
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = (event : React.FormEvent<HTMLButtonElement>)=> {
    event.preventDefault();

    if (formData.fullName !== "" && formData.email !== "") {

      const createCompanyUserData = {
        fullname: formData.fullName,
        mobilenumber: formData.mobilenumber,  
        email: formData.email,
        createdby:loginStatus.userId,
        company_id:loginStatus.companyId,
      };
        axios.post("/api/main/purple-crm-api/createuser",createCompanyUserData)
        .then((response) => {
            console.log(response);
           if(response.data.status){
            window.location.href="/home/manage-users/users";
           }
            //NEED TO ADD GOOD ALERT MESSAGE
          //  alert(response.data.message); 
           onClose();
           
        })
      }
      
    }

  const handleOnBlur =(event:React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = event.target;
    if (name === "fullName") {
        if(!value){
            setErrorMessage((prevData) => ({
                ...prevData,
                [name]: "This field is required",
              }));
        }
        else {
            setErrorMessage((prevData) => ({
              ...prevData,
              [name]: "",
            }));
          }
    } 
    

    if (name === "email") {
      if (!value) {
        setErrorMessage((prevData) => ({
          ...prevData,
          [name]: "This field is required",
        }));
      } else {
        setErrorMessage((prevData) => ({
          ...prevData,
          [name]: "",
        }));
      }
    }
  }
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
              Add New Company User
            </h2>
          </div>

          <form className="space-y-4">
            <div>
              <FormInput label='Full Name' 
                type="text"
                name="fullName"
                placeholder="Enter User Name"
                onChange={handleOnChange}
                value={formData.fullName}
                error={errorMessage.fullName}
                onBlur={handleOnBlur}
                />
            </div>

            <div>
              <FormInput
              label='mobile Number'
              type='tel'
              name='mobilenumber'
              onChange={handleOnChange}
              value={formData.mobilenumber}
              onBlur={handleOnBlur}
              placeholder="Enter your Mobile Number"
             
              />
            </div>
            <div>
            <FormInput
              label='Enter Email'
              type='text'
              name='email'
              onChange={handleOnChange}
              value={formData.email}
              error={errorMessage.email}
              onBlur={handleOnBlur}
              placeholder="Enter your Email"
              />
            </div>

            <Button
              type="submit"
            onClick={handleSubmit}
            >
              Create Company User
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}