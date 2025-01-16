import { Users, ArrowUpDown, CheckCircle2, XCircle } from 'lucide-react';
import companyUsersProps from '../../@types/company-users/CompanyUserProps';
import Button from '../ui/Button';
import {  useState } from 'react';


export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {

  const [showAccessModaleCard, setShowAccessModaleCard]=useState<number | null>(null);

  const handleModalOpen = (index: number) => {
    setShowAccessModaleCard(index);
  };

  const handleModalClose = () => {
    setShowAccessModaleCard(null);
  };


  
  return (
    <div className="mx-16 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Company Members</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                 { key: 'createdby', label: 'Created By' },
                { key: 'id', label: 'User Id' },
                { key: 'fullname', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'mobileNumber', label: 'Mobile Number' },
                { key: 'isactive', label: 'Status' },
                {key : 'Access' , label:'Access'},
                
              ].map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key !== 'status' ? (
                    <button
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
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
            {users.map((user , index) => (
              <tr key={index} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.company_id}</div>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                </td>
               
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.mobilenumber}</div>
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
                    <Button  onClick={() => handleModalOpen(index)}
                    //  onClick={()=>{
                    //   setShowAccessModaleCard(!showAccessModaleCard)
                    // }} 
                    className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-500 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500'>Access</Button>
                  </div>
                  
                </td>
              </tr>
              
            ))}
            
          </tbody>
        </table>
      </div>

     
      {showAccessModaleCard !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Access Modal</h2>
            <p className="text-gray-600">
              You clicked on the button for row ID: {showAccessModaleCard+1}
            </p>
            <button
              onClick={handleModalClose}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}