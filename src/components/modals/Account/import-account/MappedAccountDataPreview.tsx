import { useState, useEffect } from "react";
import { Account, MappableItem } from "./AccountCsvMapper";
import FormHeader from "../../../ui/FormHeader";
import { Import, LucideScanEye, X } from "lucide-react";
import Button from "../../../ui/Button";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import RefreshToken from "../../../../config/validations/RefreshToken";
import toast from "react-hot-toast";

interface MappedAccountDataPopupProps {
  open: boolean;
  onClose: () => void;
  onCloseSuccessOrConfirmation:() => void;
  mappedData: Account[];
  fieldVariables: Record<string, string>;
  industryTypes: MappableItem[];
  businessTypes: MappableItem[];
  companyAccountTypes: MappableItem[];
  onImport?: (uniqueData: Account[]) => void; // callback to parent
}

interface postDataPropAccountImport {
  company_id: number;
  account_import_mapped_data_list: Account[];
  createdby: number;
}

const MappedAccountDataPopup = ({
  open,
  onClose,
onCloseSuccessOrConfirmation,
  mappedData,
  fieldVariables,
  industryTypes,
  businessTypes,
  companyAccountTypes,
  onImport,
}: MappedAccountDataPopupProps) => {
  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
  const [duplicateIndexes, setDuplicateIndexes] = useState<Set<number>>(
    new Set()
  );
  const { loginStatus } = useLoggedInUserContext();

  

  useEffect(() => {
    const duplicates = new Set<number>();
    const seen: Record<string, number> = {};

    mappedData.forEach((row, index) => {
      const key = `${row.name}_${row.email}_${row.mobilenumber}`;
      if (seen[key] !== undefined) {
        // mark only duplicates (not the first one)
        duplicates.add(index);
      } else {
        seen[key] = index;
      }
    });

    // select only non-duplicate rows
    setSelectedRows(mappedData.map((_, index) => !duplicates.has(index)));

    setDuplicateIndexes(duplicates);
  }, [mappedData]);

  if (!open) return null;

  const fieldKeys = Object.keys(fieldVariables);

  const toggleRowSelection = (index: number) => {
    const updated = [...selectedRows];
    updated[index] = !updated[index];
    setSelectedRows(updated);
  };

  const handleImport = async () => {
    const uniqueData = mappedData.filter((_, index) => selectedRows[index]);
    if (onImport) onImport(uniqueData);
    // console.log("Unique Data:", uniqueData); // for debugging

    const postDataForAccountImport: postDataPropAccountImport = {
      company_id: loginStatus.companyId,
      account_import_mapped_data_list: uniqueData,
      createdby: loginStatus.id,
    };
    // console.log("Post Data For import:", postDataForAccountImport); // for debugging

    await axios
      .post(POST_API.IMPORT_ACCOUNT_VIA_CSV, postDataForAccountImport, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;

        if (data.status) {
          toast.success(data.message);
          onClose();
          onCloseSuccessOrConfirmation();
        } else {
          toast.error(data.message);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: handleImport,
          });
          if (refreshTokenStatus) {
            handleImport();
          }
        }
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-6xl h-[80%] flex flex-col">
        {/* Header */}
        <div className="p-3">
          <FormHeader
            icon={LucideScanEye}
            onClose={onClose}
            preText="Mapped Account Data Preview"
            description="This is previews of mapped account data, highlights duplicates, allows deselection, and imports only unique rows."
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-1">
          {mappedData && mappedData.length > 0 ? (
            <table className="border-collapse border w-full text-xs min-w-[3000px]">
              <thead className="sticky -top-2 bg-gray-100 z-100">
                <tr>
                  <th className="border p-2 w-fit">Select</th>
                  {fieldKeys.map((key) => (
                    <th
                      key={key}
                      className="border p-2 text-left font-medium w-fit"
                    >
                      {fieldVariables[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mappedData.map((row, i) => {
                  const isDuplicate = duplicateIndexes.has(i);
                  return (
                    <tr
                      key={i}
                      className={`hover:bg-gray-50 ${
                        isDuplicate ? "bg-pink-100" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="border p-2 w-fit text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows[i]}
                          onChange={() => toggleRowSelection(i)}
                        />
                      </td>

                      {fieldKeys.map((key) => {
                        if (key === "industry_type_id") {
                          const value = row[key as keyof Account];
                          const result = Array.isArray(value)
                            ? value
                                .map(
                                  (id) =>
                                    industryTypes.find((i) => i.id === id)?.name
                                )
                                .filter((name): name is string => !!name)
                                .join(", ")
                            : industryTypes.find((v) => v.id === value)?.name ??
                              "";
                          return (
                            <td key={key} className="border p-2 w-fit">
                              {result}
                            </td>
                          );
                        }

                        if (key === "business_type_id") {
                          const value = row[key as keyof Account];
                          const result = Array.isArray(value)
                            ? value
                                .map(
                                  (id) =>
                                    businessTypes.find((i) => i.id === id)?.name
                                )
                                .filter((name): name is string => !!name)
                                .join(", ")
                            : businessTypes.find((v) => v.id === value)?.name ??
                              "";
                          return (
                            <td key={key} className="border p-2 w-fit">
                              {result}
                            </td>
                          );
                        }

                        if (key === "company_account_type_id") {
                          const value = row[key as keyof Account];
                          const result = Array.isArray(value)
                            ? value
                                .map(
                                  (id) =>
                                    companyAccountTypes.find((i) => i.id === id)
                                      ?.name
                                )
                                .filter((name): name is string => !!name)
                                .join(", ")
                            : companyAccountTypes.find((v) => v.id === value)
                                ?.name ?? "";
                          return (
                            <td key={key} className="border p-2 w-fit">
                              {result}
                            </td>
                          );
                        }

                        let value = row[key as keyof Account];
                        if (Array.isArray(value)) value = value.join(", ");

                        return (
                          <td key={key} className="border p-2 w-fit">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-gray-600">
              No mapped data available
            </div>
          )}
        </div>

        {/* Footer with Import Button */}
        <div className="p-4 border-t flex justify-end gap-3">
          <div className="w-fit h-fit">
            <Button type="button" onClick={onClose}>
              <div className="flex items-center justify-center gap-0.5">
                <X size={SIZE.SIXTEEN} />
                Cancel
              </div>
            </Button>
          </div>
          <div className="w-fit h-fit">
            <Button onClick={handleImport}>
              <div className="flex items-center justify-center gap-0.5">
                <Import size={SIZE.SIXTEEN} />
                Import Account Data
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappedAccountDataPopup;
