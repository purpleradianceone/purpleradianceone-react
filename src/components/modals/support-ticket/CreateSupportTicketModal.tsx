/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import FormLayout from "../../ui/FormLayout";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import FormHeader from "../../ui/FormHeader";
import {
  Clock,
  Link,
  LucideMessageCircleQuestion,
  Notebook,
  Package,
  Phone,
  Save,
  TicketPlus,
  User,
  UserCircle,
  X,
} from "lucide-react";
import axiosClient from "../../../axios-client/AxiosClient";
import { CompanyProductSla } from "../../../@types/products/CompanyProductSla";
import Button from "../../ui/Button";
import CustomDropdown from "../leads/CustomDropdown";
import MESSAGE from "../../../constants/Messages";
import FormInput from "../../ui/FormInput";
import { useFormChange } from "../../../config/hooks/useFormChange";
import CreateSupportTicket from "../../../@types/support-ticket-management/CreateSuppoetTicket";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useSupportTicketSource } from "../../../config/hooks/useSupportTicketSource";
import StageIndicator from "./StageIdicator";
import { useSupportTicketCategory } from "../../../config/hooks/useSupportTicketCategory";
import AccountCompanyProductForSupportTicket from "../../../@types/support-ticket-management/AccountCompanyProductForSupportTicket";
import GetAccountCompanyProductFroSupportTicket from "../../views/support-ticket-management/GetAccountCompanyProductFroSupportTicket";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";

function CreateSupportTicketModal({
  isOpen,
  onClose,
  handleSupportTicketCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleSupportTicketCreated: () => void;
}) {
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToViewUser } = useUserAccessModules();

  const { supportTicketCategory, isLoading: isLoadingForTicketCategory } =
    useSupportTicketCategory();
  const { supportTicketSource, isLoading: isLoadingForTicketSource } =
    useSupportTicketSource();

  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    createdby: "",
    isactive: false,
    requestedby: "",
    generate_password: "",
  });

  const [stage, setStage] = useState(1);
  const [isOpenForAccountSelection, setIsOpenForAccountSelection] =
    useState<boolean>(true);

  const [
    isOpenForAddingSupportTicketDetails,
    setIsOpenForAddingSupportTicketDetails,
  ] = useState<boolean>(false);

  const [selectedAccount, setSelectedAccont] =
    useState<AccountCompanyProductForSupportTicket>({
      count: 0,
      id: 0,
      accountId: 0,
      accountName: "",
      companyProductId: 0,
      companyProductName: "",
      quantity: 0,
      barcode: "",
      serialNumber: 0,
      unitName: "",
      purchaseDate: "",
      isActive: false,
      createdBy: "",
      updatedBy: "",
      createdOn: "",
      updatedOn: "",
    });
  const [
    isLoadingForAccountCompanyProducts,
    setIsLoadingForAccountCompanyProducts,
  ] = useState<boolean>(false);
  const [companyProductSla, setCompanyProductSla] = useState<
    CompanyProductSla[]
  >([]);
  const [isLoadingForCompanyProductSla, setIsLoadingForCompanyProductSla] =
    useState<boolean>(false);

  const [isSupportTicketCreating, setIsSupportTicketCreating] =
    useState<boolean>(false);

  const [selectedSupportTicketCategory, setSelectedSupportTicketCategory] =
    useState<number | undefined>(undefined);

  const [selectedSource, setSelectedSource] = useState<number | undefined>(
    undefined
  );

  const [selectedCompanyProductSla, setSelectedCompanyProductSla] = useState<
    number | undefined
  >(undefined);

  const handleLeadSelectedSupportTicketCategory = (
    value: number | undefined
  ) => {
    setSelectedSupportTicketCategory(value);
  };
  const handleLeadSelectedSource = (value: number | undefined) => {
    setSelectedSource(value);
  };

  const handleLeadSelectedCompanyProductSla = (value: number | undefined) => {
    setSelectedCompanyProductSla(value);
  };

  const [
    showErrorAtSupportTicketCategory,
    setShowErrorAtSupportTicketCategory,
  ] = useState<boolean>(false);
  const [showErrorAtSupportTicketSource, setShowErrorAtSupportTicketSource] =
    useState<boolean>(false);
  const [showErrorAtCompanyProductSla, setShowErrorAtCompanyProductSla] =
    useState<boolean>(false);

  useEffect(() => {
    if (selectedAccount) {
      getCompanyProductSla();
    } else {
      setCompanyProductSla([]);
    }
  }, [selectedAccount]);

  const clearSelectedAccount = () => {
    setSelectedAccont({
      count: 0,
      id: 0,
      accountId: 0,
      accountName: "",
      companyProductId: 0,
      companyProductName: "",
      quantity: 0,
      barcode: "",
      serialNumber: 0,
      unitName: "",
      purchaseDate: "",
      isActive: false,
      createdBy: "",
      updatedBy: "",
      createdOn: "",
      updatedOn: "",
    });
  };

  const clearAllData = async () => {
    setIsOpenForAddingSupportTicketDetails(false);
    setStage(1);
    setIsOpenForAccountSelection(true);
    setIsLoadingForAccountCompanyProducts(false);
    setIsSupportTicketCreating(false);
    setIsLoadingForCompanyProductSla(false);
    setSelectedSupportTicketCategory(undefined);
    setSelectedSource(undefined);
    setSelectedCompanyProductSla(undefined);
    createSupportTicketModalFormData.public_notes = "";
    createSupportTicketModalFormData.query_description = "";
    createSupportTicketModalFormData.resolution_applied = "";
    setShowErrorAtSupportTicketSource(false);
    setShowErrorAtCompanyProductSla(false);
    setShowErrorAtSupportTicketCategory(false);
    setError((prev) => ({
      ...prev,
      query_description: "",
    }));

    setSelectedCompanyUser({
      company_id: 0,
      id: 0,
      fullname: "",
      email: "",
      mobilenumber: "",
      createdby: "",
      isactive: false,
      requestedby: "",
      generate_password: "",
    });
    clearSelectedAccount();
    localStorage.removeItem(
      LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET
    );
  };

  const initialCreatSupportTicketFormData: CreateSupportTicket = {
    query_description: "",
    public_notes: "",
    resolution_applied: "",
  };

  const {
    formData: createSupportTicketModalFormData,
    handleChange: handleSupportTicketModalFormDataChange,
  } = useFormChange(initialCreatSupportTicketFormData);

  const [error, setError] = useState<{
    query_description: string;
  }>({
    query_description: "",
  });

  const validateForm = (): boolean => {
    let flagVariable: boolean = true;
    if (createSupportTicketModalFormData.query_description === "") {
      toast.error("Please enter a query description.");
      setError((prev) => ({
        ...prev,
        query_description: "Please enter a query description.",
      }));
      flagVariable = false;
    } else {
      setError((prev) => ({
        ...prev,
        query_description: "",
      }));
    }
    if (selectedSource === undefined) {
      setShowErrorAtSupportTicketSource(true);
      toast.error("Please select support ticket source.");
      flagVariable = false;
    } else {
      setShowErrorAtSupportTicketSource(false);
    }

    if (selectedSupportTicketCategory === undefined) {
      setShowErrorAtSupportTicketCategory(true);
      toast.error("Please select support ticket category.");
      flagVariable = false;
    } else {
      setShowErrorAtSupportTicketCategory(false);
    }

    if (selectedCompanyProductSla === undefined) {
      setShowErrorAtCompanyProductSla(true);
      toast.error("Please select product sla.");
      flagVariable = false;
    } else {
      setShowErrorAtCompanyProductSla(false);
    }

    if (
      createSupportTicketModalFormData.query_description.trim() === "" ||
      selectedSource === undefined ||
      selectedSupportTicketCategory === undefined ||
      selectedCompanyProductSla === undefined
    ) {
      // toast.error(
      //   "Please fill Query Discription and select source, ticket category and product SLA"
      // );
      flagVariable = false;
    }

    return flagVariable;
  };

  const createSupportTicket = async () => {
    if (!validateForm()) return;

    setIsSupportTicketCreating(true);
    const postData = {
      company_id: loginStatus.companyId,
      account_company_product_id: selectedAccount?.id,
      company_product_sla_id: selectedCompanyProductSla,
      support_ticket_category_id: selectedSupportTicketCategory,
      support_ticket_source_id: selectedSource,
      query_description: createSupportTicketModalFormData.query_description,
      public_notes: createSupportTicketModalFormData.public_notes,
      resolution_applied: createSupportTicketModalFormData.resolution_applied,
      assignedto:
        selectedCompanyUser.id === 0 ? loginStatus.id : selectedCompanyUser.id,
      createdby_id: loginStatus.id,
    };
    console.log("create support ticket data:");
    console.log(postData);

    await axiosClient
      .post(POST_API.CREATE_SUPPORT_TICKET, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleSupportTicketCreated();
          setIsSupportTicketCreating(false);
          clearSelectedAccount();
          clearAllData();
          onClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: createSupportTicket,
          });
          if (refreshTokenResponse) {
            createSupportTicket();
          }
        }
        if (error.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.error(error.response?.data);
        }
      })
      .finally(() => {
        setIsSupportTicketCreating(false);
      });
  };

  const getCompanyProductSla = async () => {
    if (selectedAccount.id === 0) return;
    setCompanyProductSla([]);
    setSelectedCompanyProductSla(undefined);
    setIsLoadingForCompanyProductSla(true);
    const postDataForCompanyProductSla = {
      company_id: loginStatus.companyId,
      company_product_id: selectedAccount.companyProductId,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_COMPANY_PRODUCT_SLA, postDataForCompanyProductSla, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const formattedData: CompanyProductSla[] = response.data.map(
            (item: any) => ({
              id: item.id,
              companyProductId: item.company_product_id,
              name: `${item.name} (Resolution Time: ${item.expected_resolution_time_hours}hr)`,
              colorCode: item.color_code,
              expectedResolutionTimeHours: item.expected_resolution_time_hours,
              isActive: item.isactive,
              createdBy: item.createdby,
              updatedBy: item.updatedby,
              createdOn: item.createdon,
              updatedOn: item.updatedon,
            })
          );
          setCompanyProductSla(formattedData);
        }
        setIsLoadingForCompanyProductSla(false);
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getCompanyProductSla,
          });
          if (refreshTokenResponse) {
            getCompanyProductSla();
          }
        }
        if (error.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.error(error.response?.data);
        }
      })
      .finally(() => {
        setIsLoadingForCompanyProductSla(false);
      });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "query_description" && value === "") {
      setError((prev) => ({
        ...prev,
        query_description: "Please enter a query description.",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        query_description: "",
      }));
    }
  };

  if (!isOpen) return null;
  return (
    <FormLayout>
      {(isSupportTicketCreating || isLoadingForAccountCompanyProducts) && (
        <LoadingPopUpAnimation
          show={isSupportTicketCreating || isLoadingForAccountCompanyProducts}
        />
      )}
      <div className="py-4 px-3">
        <FormHeader
          icon={TicketPlus}
          onClose={() => {
            onClose();
            clearAllData();
          }}
          preText="Create support ticket "
          description="Create support ticket for account product."
        />
        <div className="mb-4">
          <StageIndicator
            stage={stage}
            onStageChange={(value) => {
              setStage(value);
              if (value === 1) {
                setIsOpenForAccountSelection(true);
                setIsOpenForAddingSupportTicketDetails(false);
                clearSelectedAccount();
              }
              if (value === 2) {
                setIsOpenForAccountSelection(false);
                setIsOpenForAddingSupportTicketDetails(true);
              }
            }}
          />
        </div>

        {selectedAccount.id !== 0 && stage > 1 && (
          <div className="flex gap-10 p-2 rounded-xl border bg-white shadow-sm">
            {/* Selected Account */}
            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                  <UserCircle size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="caption-custom">Account</p>
                  <p className="table-header-custom">
                    {selectedAccount.accountName || "No account selected"}
                  </p>
                </div>
              </div>
            )}

            {/* Selected Product */}
            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                  <Package size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="caption-custom">Selected Product</p>
                  <p className="table-header-custom">
                    {selectedAccount.companyProductName ||
                      "No product selected"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <form className="space-y-0">
          {isOpenForAccountSelection && (
            <div className="md:col-span-2  w-full h-96">
              <GetAccountCompanyProductFroSupportTicket
                handleRowSelect={(data) => {
                  setSelectedAccont(data);
                  setIsOpenForAccountSelection(false);
                  setIsOpenForAddingSupportTicketDetails(true);
                  setStage(2);
                }}
              />
            </div>
          )}

          {selectedAccount.id !== 0 &&
            selectedAccount.id !== 0 &&
            isOpenForAddingSupportTicketDetails && (
              <div>
                {/* Form */}
                <form className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 space-y-1 space-x-1">
                    <div className="">
                      <FormInput
                        label="Query Description:"
                        logo={LucideMessageCircleQuestion}
                        type="text"
                        name="query_description"
                        placeholder="Enter Query Description: "
                        value={
                          createSupportTicketModalFormData.query_description
                        }
                        defaultValue={
                          createSupportTicketModalFormData.query_description
                        }
                        onChange={handleSupportTicketModalFormDataChange}
                        required={true}
                        onBlur={handleBlur}
                      />
                      {error.query_description && (
                        <div className="caption-custom-inactive">
                          {error.query_description}
                        </div>
                      )}
                    </div>
                    <div className="">
                      <FormInput
                        label="Public Notes:"
                        logo={Notebook}
                        type="text"
                        name="public_notes"
                        placeholder="Enter Public Notes: "
                        value={createSupportTicketModalFormData.public_notes}
                        defaultValue={
                          createSupportTicketModalFormData.public_notes
                        }
                        onChange={handleSupportTicketModalFormDataChange}
                        // onBlur={handleBlur}
                      />
                    </div>

                    <div className="">
                      <FormInput
                        type="text"
                        label="Resolution Applied:"
                        logo={Phone}
                        name="resolution_applied"
                        placeholder="Enter Resolution Applied If Needed: "
                        value={
                          createSupportTicketModalFormData.resolution_applied
                        }
                        defaultValue={
                          createSupportTicketModalFormData.resolution_applied
                        }
                        // onBlur={handleBlur}
                        onChange={handleSupportTicketModalFormDataChange}
                      />
                    </div>

                    {!isLoadingForTicketCategory ? (
                      <div className="space-y-1">
                        <CustomDropdown
                          logo={Clock}
                          preselectedOption={selectedSupportTicketCategory}
                          requiredRedDot
                          labelName="Ticket Category :"
                          options={supportTicketCategory!}
                          onSelect={handleLeadSelectedSupportTicketCategory}
                        />
                        {showErrorAtSupportTicketCategory &&
                          !selectedSupportTicketCategory && (
                            <div className="text-red-500 text-xs">
                              Please select ticket category
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="space-y-1 animate-pulse">
                        {/* Label skeleton */}
                        <div className="w-32 h-3 bg-slate-200 rounded"></div>

                        {/* Dropdown skeleton */}
                        <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                      </div>
                    )}

                    {!isLoadingForTicketSource ? (
                      <div className="space-y-1">
                        <CustomDropdown
                          logo={Link}
                          preselectedOption={selectedSource}
                          requiredRedDot
                          labelName="Ticket Source :"
                          options={supportTicketSource!}
                          onSelect={handleLeadSelectedSource}
                        />
                        {showErrorAtSupportTicketSource && !selectedSource && (
                          <div className="text-red-500 text-xs">
                            Please select ticket source
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1 animate-pulse">
                        {/* Label skeleton */}
                        <div className="w-32 h-3 bg-slate-200 rounded"></div>

                        {/* Dropdown skeleton */}
                        <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                      </div>
                    )}

                    {!isLoadingForCompanyProductSla ? (
                      <div className="space-y-1">
                        <CustomDropdown
                          logo={Clock}
                          preselectedOption={selectedCompanyProductSla}
                          requiredRedDot
                          labelName="Product SLA :"
                          options={companyProductSla!}
                          onSelect={handleLeadSelectedCompanyProductSla}
                        />
                        {showErrorAtCompanyProductSla &&
                          !selectedCompanyProductSla && (
                            <div className="text-red-500 text-xs">
                              Please select product SLA
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="space-y-1 animate-pulse">
                        {/* Label skeleton */}
                        <div className="w-32 h-3 bg-slate-200 rounded"></div>

                        {/* Dropdown skeleton */}
                        <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                      </div>
                    )}

                    <div>
                      <CompanyUserSearchFieldInput
                        label="Assign To:"
                        required
                        // placeholder={loginStatus.fullName}
                        defaultValue={
                          selectedCompanyUser.fullname === ""
                            ? loginStatus.fullName
                            : selectedCompanyUser.fullname
                        }
                        logo={User}
                        onUserSelected={(user) => {
                          if (user && user.id !== 0) {
                            setSelectedCompanyUser(user);
                          }
                          if (user === null || user === undefined) {
                            setSelectedCompanyUser({
                              company_id: 0,
                              id: 0,
                              fullname: "",
                              email: "",
                              mobilenumber: "",
                              createdby: "",
                              isactive: false,
                              requestedby: "",
                              generate_password: "",
                            });
                          }
                        }}
                        isDisabled={!userHasAccessToViewUser}
                        disabledMessage={
                          MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                        }
                        // error={selectedCompanyUser.fullname===""?"Need to select assign to":""}
                      />
                      <span className="caption-custom">
                        <span className="">Note :</span> If a support ticket
                        assign to is not selected or is removed, then ticket
                        will assigned to
                        <span className="table-header-custom active">
                          {" "}
                          creator
                        </span>{" "}
                        by default.
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end ">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          onClose();
                          clearAllData();
                        }}
                        type="button"
                      >
                        <div className="flex items-center gap-0.5">
                          <X size={16} />
                          <span>Cancel</span>
                        </div>
                      </Button>
                      <Button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          createSupportTicket();
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Save size={16} />
                          <span>Save</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
        </form>
      </div>
    </FormLayout>
  );
}

export default CreateSupportTicketModal;
