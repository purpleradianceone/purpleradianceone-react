import { useState } from "react";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

function AddCompanyUserForm() {

  const {loginStatus, }= useLoggedInUserContext(); 

  const [createCompanyUser, setCreateCompanyUser] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    fullName: "",
    email: "",
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setCreateCompanyUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  };


  const handleSubmit = (event : React.FormEvent<HTMLButtonElement>)=> {
    event.preventDefault();

    if (createCompanyUser.fullName !== "" && createCompanyUser.email !== "") {

      const createCompanyUserData = {
        fullname: createCompanyUser.fullName,
        mobilenumber: createCompanyUser.mobileNumber,
        email: createCompanyUser.email,
        createdby:loginStatus.userId,
        company_id:loginStatus.companyId,
      };
        axios.post("/api/main/purple-crm-api/createuser",createCompanyUserData)
        .then((response) => {
            console.log(response);
           alert(response.data.message); 
        })
      }
    }

  return (
    <>
      <form className="space-y-5 lg:w-96 md:w-64 sm:w-36">
        <FormInput
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your Full Name"
          onChange={handleOnChange}
          value={createCompanyUser.fullName}
          error={errorMessage.fullName}
          onBlur={handleOnBlur}
        />
        <FormInput
          label="Mobile Number"
          type="text"
          name="mobileNumber"
          placeholder="Enter your Mobile Number"
          onChange={handleOnChange}
          value={createCompanyUser.mobileNumber}
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your Email"
          onChange={handleOnChange}
          value={createCompanyUser.email}
          error={errorMessage.email}
          onBlur={handleOnBlur}
        />

        <Button type="submit" onClick={handleSubmit}>Create User</Button>
      </form>
    </>
  );
}

export default AddCompanyUserForm;
