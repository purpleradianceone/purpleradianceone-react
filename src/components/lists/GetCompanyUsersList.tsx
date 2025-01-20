import {Users,ArrowUpDown,CheckCircle2,XCircle,Search,UserPlus,} from "lucide-react";
import companyUsersProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import { useState } from "react";
import { ModalAccessCompanyUser } from "../moduleaccessrights/ModalAccessCompanyUser";
import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";




export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <div className="mx-5 p-6">
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Company Members</h1>
        </div>
        
        <div className="relative w-80">
          <input
            type="search"
            className="w-full h-10 pl-10 pr-12 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search members..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none"
          >
            Search
          </button>
        </div>
        <div>
          <Button
           onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
          >
            <UserPlus size={20} />  Add Company User
          </Button>
          {/* Component for adding a new company user ,  it will open in pop up     */}
          <AddCompanyUserPopUp
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
          </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: "createdby", label: "Created By" },
                { key: "id", label: "User Id" },
                { key: "fullname", label: "Name" },
                { key: "email", label: "Email" },
                { key: "mobileNumber", label: "Mobile Number" },
                { key: "isactive", label: "Status" },
                { key: "Access", label: "Access" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key !== "status" ? (
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      {label}
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  ) : (
                    label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.company_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullname}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {user.mobilenumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {user.isactive ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">Inactive</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-500 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                    >
                      Access
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalAccessCompanyUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName="[Company User Name]"
      />
    </div>
  );
}