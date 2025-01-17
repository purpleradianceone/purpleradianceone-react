import { Users } from "lucide-react";
import AddCompanyUserForm from "../../forms/AddCompanyUserFrom";

function AddCompanyUser() {
  return (
    <div className="mt-10 p-11 border">
      <div className="flex items-center self-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Add new Company Member</h1>
      </div>
      <AddCompanyUserForm></AddCompanyUserForm>
    </div>
  );
}

export default AddCompanyUser;