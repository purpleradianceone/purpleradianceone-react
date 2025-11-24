import React from "react"
import { CompanyProductSla } from "../../../@types/products/CompanyProductSla"

interface CompanyProductSlaType {
companyProductSlaData : CompanyProductSla[]
}
export const CompanyProductSlaComponent :React.FC<CompanyProductSlaType> =({
    companyProductSlaData,
}) =>{

    return (
        < div className="bg-gray-0 border p-1  rounded-md">
        <h1 className="table-header-custom">Service level agreement</h1>
          <div className="w-full overflow-x-auto bg-white">
      <table className="min-w-full border ">
        <thead>
          <tr className=" table-header-custom">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Expected resolutoin time in hours</th>
            <th className="px-4 py-2 text-left">Active</th>
          </tr>
        </thead>

        <tbody>
          {companyProductSlaData.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.expectedResolutionTimeHours + " hours"}</td>
              <td className="px-4 py-2">{item.isActive ? 'true': "false"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
    )
}