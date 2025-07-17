import React from "react";

interface LeadImportData {
  additional_contact_number: string;
  address: string;
  company_id: number;
  count: number;
  country_id: number;
  country_name: string;
  createdby_name: string;
  createdon: string;
  district_id: number;
  district_name: string;
  email: string;
  id: number;
  import_tag: string;
  industry_name: string;
  job_title: string;
  lead_owner: string;
  lead_source: string;
  lead_source_id: number;
  lead_status: string;
  lead_status_id: number;
  mobilenumber: string;
  name: string;
  ownerid: number;
  state_id: number;
  state_name: string;
  updatedby_name: string;
  updatedon: string;
  website: string;
}

interface Props {
  leadImportData: LeadImportData[];
}

const LeadImportTable: React.FC<Props> = ({ leadImportData }) => {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-[1000px] bg-white table-auto border rounded-md border-gray-300">
        <thead className=" text-xs font-semibold">
          <tr>
            {Object.keys(leadImportData[0] || {}).map((key) => (
              <th key={key} className="border px-2 py-1 text-left">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm">
          {leadImportData.map((lead, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {Object.values(lead).map((value, i) => (
                <td key={i} className="border px-2 py-1 whitespace-nowrap">
                  {String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadImportTable;
