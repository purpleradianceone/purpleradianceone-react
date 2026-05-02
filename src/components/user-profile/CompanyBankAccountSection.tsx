/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import EditableSection from "./EditableSection";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import MetaField from "../ui/MetaField";

const CompanyBankAccountSection = ({
  userHasAccessToView,
  userHasAccessToUpdate,
  userHasAccessToAdd,
}: any) => {
  const { loginStatus } = useLoggedInUserContext();

  const [bankList, setBankList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null); // 0 = new
  const [bankForm, setBankForm] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // ================= FETCH =================
  const fetchBankAccounts = async () => {
    try {
      const res = await axiosClient.post(
        POST_API.GET_COMPANY_BANK_ACCOUNT,
        {
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
        },
        { withCredentials: true },
      );
      console.log(res.data);

      setBankList(res.data || []);
    } catch {
      toast.error("Failed to fetch bank accounts");
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  // ================= EDIT =================
  const handleEdit = (bank: any) => {
    setEditingId(bank.id);
    setBankForm(bank);
  };

  const handleCancel = () => {
    setEditingId(null);
    setBankForm({});
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!bankForm.account_name) {
      toast.error("Account name is required");
      return false;
    }
    if (!bankForm.account_number) {
      toast.error("Account number is required");
      return false;
    }
    if (!bankForm.ifsc) {
      toast.error("IFSC is required");
      return false;
    }

    // IFSC format (India)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifsc)) {
      toast.error("Invalid IFSC format");
      return false;
    }

    if (!bankForm.bank_name) {
      toast.error("Bank name is required");
      return false;
    }

    if (!bankForm.branch_name) {
      toast.error("Branch name is required");
      return false;
    }

    return true;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!userHasAccessToUpdate) {
      toast.error("No update access");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        ...bankForm,
        company_id: loginStatus.companyId,
        createdby_id: loginStatus.id,
        updatedby_id: loginStatus.id,
      };
      console.log(payload);

      const api =
        editingId === 0
          ? POST_API.CREATE_COMPANY_BANK_ACCOUNT
          : POST_API.UPDATE_COMPANY_BANK_ACCOUNT;

      const { data } = await axiosClient.post(api, payload, {
        withCredentials: true,
      });

      // ================= BUSINESS RESPONSE =================
      if (data?.status) {
        toast.success(data.message || "Saved successfully");
        handleCancel();
        fetchBankAccounts();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userHasAccessToView) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-6 space-y-4 font-roboto">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h3 className="section-header-custom">
          Bank Accounts{" "}
          <span className="caption-custom">(Click Edit to change)</span>
        </h3>

        {userHasAccessToUpdate && (
          <div>
            <Button
              onClick={() => {
                setEditingId(0);
                setBankForm({
                  account_name: "",
                  account_number: "",
                  ifsc: "",
                  bank_name: "",
                  branch_name: "",
                  is_primary_account: false,
                });
              }}
            >
              + Add New
            </Button>
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        {/* ================= ADD NEW ================= */}
        {editingId === 0 && (
          <EditableSection
            hasAccess={userHasAccessToAdd}
            title="Add Bank Account"
            sectionKey="bank-new"
            isEditing={true}
            onCancel={handleCancel}
            onSave={handleSave}
            isLoadingForUpdate={isLoading}
            onEdit={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <FormInput
                label="Account Name"
                placeholder="Enter Account Name"
                value={bankForm.account_name || ""}
                onChange={(e: any) =>
                  setBankForm({
                    ...bankForm,
                    account_name: e.target.value,
                  })
                }
              />

              <FormInput
                label="Account Number"
                placeholder="Enter Account Number"
                value={bankForm.account_number || ""}
                onChange={(e: any) =>
                  setBankForm({
                    ...bankForm,
                    account_number: e.target.value,
                  })
                }
              />

              <FormInput
                label="IFSC"
                placeholder="Enter IFSC"
                value={bankForm.ifsc || ""}
                onChange={(e: any) =>
                  setBankForm({
                    ...bankForm,
                    ifsc: e.target.value.toUpperCase(),
                  })
                }
              />

              <FormInput
                label="Bank Name"
                placeholder="Enter Bank Name"
                value={bankForm.bank_name || ""}
                onChange={(e: any) =>
                  setBankForm({
                    ...bankForm,
                    bank_name: e.target.value,
                  })
                }
              />

              <FormInput
                label="Branch Name"
                placeholder="Enter Branch Name"
                value={bankForm.branch_name || ""}
                onChange={(e: any) =>
                  setBankForm({
                    ...bankForm,
                    branch_name: e.target.value,
                  })
                }
              />

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={bankForm.is_primary_account || false}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      is_primary_account: e.target.checked,
                    })
                  }
                />
                <label className="caption-custom">Primary Account</label>
              </div>
            </div>
          </EditableSection>
        )}

        {/* ================= LIST ================= */}
        {bankList.map((bank) => {
          const isEditing = editingId === bank.id;

          return (
            <EditableSection
              key={bank.id}
              hasAccess={userHasAccessToUpdate}
              title=""
              sectionKey={`bank-${bank.id}`}
              onEdit={() => handleEdit(bank)}
              isEditing={isEditing}
              onCancel={handleCancel}
              onSave={handleSave}
              isLoadingForUpdate={isLoading}
            >
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-6">
                  <FormInput
                    label="Account Name"
                    value={bankForm.account_name || ""}
                    onChange={(e: any) =>
                      setBankForm({
                        ...bankForm,
                        account_name: e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label="Account Number"
                    value={bankForm.account_number || ""}
                    onChange={(e: any) =>
                      setBankForm({
                        ...bankForm,
                        account_number: e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label="IFSC"
                    value={bankForm.ifsc || ""}
                    onChange={(e: any) =>
                      setBankForm({
                        ...bankForm,
                        ifsc: e.target.value.toUpperCase(),
                      })
                    }
                  />

                  <FormInput
                    label="Bank Name"
                    value={bankForm.bank_name || ""}
                    onChange={(e: any) =>
                      setBankForm({
                        ...bankForm,
                        bank_name: e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label="Branch Name"
                    value={bankForm.branch_name || ""}
                    onChange={(e: any) =>
                      setBankForm({
                        ...bankForm,
                        branch_name: e.target.value,
                      })
                    }
                  />

                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      checked={bankForm.is_primary_account || false}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          is_primary_account: e.target.checked,
                        })
                      }
                    />
                    <label className="caption-custom">Primary Account</label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  <MetaField label="Account Name:" value={bank.account_name} />
                  <MetaField
                    label="Account Number:"
                    value={bank.account_number}
                  />
                  <MetaField label="IFSC:" value={bank.ifsc} />
                  <MetaField label="Bank Name:" value={bank.bank_name} />
                  <MetaField label="Branch:" value={bank.branch_name} />
                  <div>
                    <span className="input-label-custom">Primary:</span>
                    <p
                      className={`${bank.is_primary_account ? ` caption-custom-blue` : `input-label-custom`}`}
                    >
                      {bank.is_primary_account ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}
            </EditableSection>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyBankAccountSection;
