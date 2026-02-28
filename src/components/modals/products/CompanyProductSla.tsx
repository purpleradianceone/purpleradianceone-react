import React, { useMemo, useState } from "react";
import { CompanyProductSla } from "../../../@types/products/CompanyProductSla";
import ToggleButton from "../../ui/ToggleButton";
import { PenLine } from "lucide-react";
import { Item, range } from "../../../constants/NumberList";

type UpdateSlaPayload = {
  isActive?: boolean;
  expectedResolutionTimeHours?: number;
};

interface CompanyProductSlaType {
  companyProductSlaData: CompanyProductSla[];
  onUpdateSla : (id : number , data : UpdateSlaPayload)=> void
}

export const CompanyProductSlaComponent: React.FC<CompanyProductSlaType> = ({
  companyProductSlaData,
  onUpdateSla
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const rangeOfNumber: Item[] = useMemo(() => range(1, 365), []);

  function handleResolutionTimeSelect(id: number, value: number) {
    console.log("Selected value:", value, "for SLA ID:", id);
    setEditingId(null); // close dropdown
    onUpdateSla(id, {expectedResolutionTimeHours: value })
  }

  function handleAccountProductSlaToggle(id : number , event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    onUpdateSla(id , {isActive : checked});
  }

  return (
  <div className="bg-gray-0 border p-3 rounded-md shadow-sm">
    <h1 className="table-header-custom mb-2">Service Level Agreement</h1>

    <div className="w-full overflow-x-auto bg-white rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Expected Resolution (hrs)</th>
            <th className="px-3 py-2 text-center">Active</th>
          </tr>
        </thead>

        <tbody>
          {companyProductSlaData.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              {/* Name */}
              <td className="px-3 py-2 font-medium text-gray-800">
                {item.name}
              </td>

              {/* Resolution Time */}
              <td className="px-3 py-2 relative">
                {editingId === item.id ? (
                  <select
                    className="border rounded px-2 py-1 outline-none focus:ring focus:ring-blue-300 text-sm"
                    autoFocus
                    onBlur={() => setEditingId(null)}
                    value={item.expectedResolutionTimeHours}
                    onChange={(e) =>
                      handleResolutionTimeSelect(
                        item.id,
                        Number(e.target.value)
                      )
                    }
                  >
                    {rangeOfNumber.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    onClick={() => setEditingId(item.id)}
                    className="flex items-center cursor-pointer hover:text-blue-600"
                  >
                    {item.expectedResolutionTimeHours} hours
                    <PenLine className="text-blue-400 inline-block w-3 h-3 ml-2" />
                  </span>
                )}
              </td>

              {/* Active Toggle */}
              <td className="px-3 py-2 text-center">
                <ToggleButton
                  checked={item.isActive}
                  name="isActive"
                  onToggle={(e) => handleAccountProductSlaToggle(item.id, e)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};
