// import React, { useState } from 'react';
// import { UserPlus, X } from 'lucide-react';
// import FormInput from '../ui/FormInput';
// import Button from '../ui/Button';
// import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
// import axios from 'axios';
// import MessageSnackBar from '../ui/MessageSnackbar';


// type FormData= {
//   fullName: string;
//   mobilenumber: string;
//   email: string;
// }


// type AddUserPopupProps= {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function AddCompanyUserPopUp({ isOpen, onClose }: AddUserPopupProps) {
  
//   const {loginStatus, }= useLoggedInUserContext(); 
//   const [formData, setFormData] = useState<FormData>({
//     fullName: '',
//     mobilenumber: '',
//     email: '',
//   });

//   const [errorMessage, setErrorMessage] = useState({
//     fullName: "",
//     email: "",
//   });

//   const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
    
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const [snackbar , setSnackbar]=useState<{
//     open: boolean;
//     message: string;
//     type: 'success' | 'error';
//   }>({
//     open: false,
//     message: '',
//     type: "success"
//   })
//   const showSnackbar = (message: string, type: 'success' | 'error') => {
//     setSnackbar({ open: true, message, type });
//   };

//   const handleClose = () => {
//     setSnackbar(prev => ({ ...prev, open: false  }));
//   };

//    /**
//    *
//    * @param email for validation
//    * @returns boolean , does email validation using provided regex
//    */
//    const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };
  
//   const handleSubmit = (event : React.FormEvent<HTMLButtonElement>)=> {
//     event.preventDefault();


//     if(!formData.fullName){
//       setErrorMessage((prev)=>({
//         ...prev,
//         fullName:"Name is required"
//       }))
//     }else{
//       setErrorMessage((prev)=>({
//         ...prev,
//         fullName:""
//       }))
//     }


//     if(!formData.email){
//       setErrorMessage((prev)=>({
//         ...prev,
//         email:"Email is required"
//       }))
//     }else if (!validateEmail(formData.email)) {
//       setErrorMessage((prev) => ({
//         ...prev,
//         email: "Email Address must be valid!",
//       }));
//     }else{
//       setErrorMessage((prev)=>({
//         ...prev,
//         email:""
//       }))
//     }

//     if (formData.fullName !== "" && formData.email !== "" && validateEmail(formData.email)) {

//       const createCompanyUserData = {
//         fullname: formData.fullName,
//         mobilenumber: formData.mobilenumber,  
//         email: formData.email,
//         createdby:loginStatus.userId,
//         company_id:loginStatus.companyId,
//       };

//         axios.post("",createCompanyUserData)
//         .then((response) => {
//           if(response.data.status){
//             showSnackbar(response.data.message, 'success');
//             console.log(response);
//             if(response.data.status){
//              window.location.href="/home/manage-users/users";
//             }
//              //NEED TO ADD GOOD ALERT MESSAGE
//            //  alert(response.data.message); 
//             onClose();
//           }else{
//             showSnackbar(response.data.message, 'error');
//           }
//         })
        
//         .catch(() => {
//           showSnackbar('Something went wrong please check your network', 'error');
//           });
//     }
//     else{
//         showSnackbar("Please fill required fields", 'error');
        
//       }
//     }

//   const handleOnBlur =(event:React.ChangeEvent<HTMLInputElement>)=>{
//     const { name, value } = event.target;
//     if (name === "fullName") {
//         if(!value){
//             setErrorMessage((prevData) => ({
//                 ...prevData,
//                 [name]: "Name is required",
//               }));
//         }
//         else {
//             setErrorMessage((prevData) => ({
//               ...prevData,
//               [name]: "",
//             }));
//           }
//     } 
    

//     if (name === "email") {
//       if (!value) {
//         setErrorMessage((prevData) => ({
//           ...prevData,
//           [name]: "Email is required",
//         }));
//       }else if(!validateEmail(value)){
//         setErrorMessage((prevData)=>({
//           ...prevData,
//           [name]: "Email is not valid!",
//         }))
//       }else {
//         setErrorMessage((prevData) => ({
//           ...prevData,
//           [name]: "",
//         }));
//       }
//     }
//   }
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
//         >
//           <X size={20} />
//         </button>

//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <UserPlus className="text-blue-500" size={24} />
//             <h2 className="text-xl font-semibold text-gray-800">
//               Add New Company User
//             </h2>
//           </div>

//           <form className="space-y-4">
//             <div>
//               <FormInput label='Name : ' 
//                 type="text"
//                 name="fullName"
//                 placeholder="Enter User Name"
//                 onChange={handleOnChange}
//                 value={formData.fullName}
//                 error={errorMessage.fullName}
//                 onBlur={handleOnBlur}
//                 />
//             </div>

//             <div>
//               <FormInput
//               label='Mobile Number : '
//               type='tel'
//               name='mobilenumber'
//               onChange={handleOnChange}
//               value={formData.mobilenumber}
//               onBlur={handleOnBlur}
//               placeholder="Enter  Mobile Number"
             
//               />
//             </div>
//             <div>
//             <FormInput
//               label='Email : '
//               type='text'
//               name='email'
//               onChange={handleOnChange}
//               value={formData.email}
//               error={errorMessage.email}
//               onBlur={handleOnBlur}
//               placeholder="Enter Email Address"
//               />
//             </div>

//             <Button
//               type="submit"
//             onClick={handleSubmit}
//             >
//               Create Company User
//             </Button>
//           </form>
//         </div>
//       </div>
//       <MessageSnackBar
//         isOpen={snackbar.open}
//         message={snackbar.message}
//         type={snackbar.type}
//         onClose={handleClose}
//         duration={2000}
//       />
//     </div>
//   );
// }
import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import { useLoggedInUserContext } from '../../context/user/LoggedInUserContext';
import axios from 'axios';
import MessageSnackBar from '../ui/MessageSnackbar';


type FormData = {
  fullName: string;
  mobilenumber: string;
  email: string;
};

type AddUserPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddCompanyUserPopUp({ isOpen, onClose }: AddUserPopupProps) {
  const { loginStatus } = useLoggedInUserContext();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobilenumber: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value) return 'Name is required';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
        break;
      case 'mobilenumber':
        if (value && !mobileRegex.test(value)) return 'Invalid mobile number';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as { name: keyof FormData; value: string };
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as { name: keyof FormData; value: string };
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

    const newErrors: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnackbar('Please fill the required fields correctly.', 'error');
      return;
    }

    const createCompanyUserData = {
      fullname: formData.fullName.trim(),
      mobilenumber: formData.mobilenumber.trim(),
      email: formData.email.trim(),
      createdby: loginStatus.userId,
      company_id: loginStatus.companyId,
    };

    try {
      const response = await axios.post('/api/main/purple-crm-api/createuser', createCompanyUserData);
      if (response.data.status) {
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
              Add New Company User
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              label="Name : "
              type="text"
              name="fullName"
              placeholder="Enter User Name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
            />
            <FormInput
              label="Mobile Number : "
              type="tel"
              name="mobilenumber"
              placeholder="Enter Mobile Number"
              value={formData.mobilenumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.mobilenumber}
            />
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
            />
            <Button type="submit">Create Company User</Button>
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
