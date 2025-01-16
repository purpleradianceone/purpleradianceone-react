import { Users, ArrowUpDown, CheckCircle2, XCircle } from 'lucide-react';
import companyUsersProps from '../../@types/company-users/CompanyUserProps';




export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {


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
                { key: 'fullname', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'mobileNumber', label: 'Mobile Number' },
                { key: 'createdby', label: 'Created By' },
                { key: 'isactive', label: 'Status' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key !== 'status' ? (
                    <button
                      // onClick={() => handleSort(key as SortField)}
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
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
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
                  <div className="text-sm text-gray-600">{user.company_id}</div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}