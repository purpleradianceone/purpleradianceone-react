/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Account from "../../../@types/account/Account";
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
  UserCircle,
  UserRoundPlus,
  X,
} from "lucide-react";
import GetAccounts from "../../views/account/AccountManagement";
import axiosClient from "../../../axios-client/AxiosClient";
import AccountProduct from "../../../@types/account/AccountProduct";
import AccountCompanyProductAgGrid from "../../ag-grid/AccountCompanyProductAgGrid";
import { CompanyProductSla } from "../../../@types/products/CompanyProductSla";
import GetCompanyUsersForLead from "../leads/company-users-selection-modal/GetCompanyUsersForLead";
import { createPortal } from "react-dom";
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

  const { supportTicketCAtegory } = useSupportTicketCategory();
  const { supportTicketSource } = useSupportTicketSource();

  const [persistedSelectedUserId, setPersistedSelectedUserId] = useState<
    number | null
  >(loginStatus.id);
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
  const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfCompanyUserModal(true);
  };

  const handleSelectedCompanyUserChange = (params: CompanyUser | null) => {
    if (params) {
      setPersistedSelectedUserId(params.id);

      setSelectedCompanyUser({
        company_id: params.company_id,
        id: params.id,
        fullname: params.fullname,
        email: params.email,
        mobilenumber: params.mobilenumber,
        createdby: "",
        isactive: params.isactive,
        requestedby: "",
        generate_password: "",
      });
      setOpenPopUpOfCompanyUserModal(false);
    } else {
      setPersistedSelectedUserId(null);
      // Reset selectedCompanyUser to its initial state when null is received
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
  };

  const [stage, setStage] = useState(1);
  const [isOpenForAccountSelection, setIsOpenForAccountSelection] =
    useState<boolean>(true);
  const [
    isOpenForAccountProductSelection,
    setIsOpenForAccountProductSelection,
  ] = useState<boolean>(false);

  const [
    isOpenForAddingSupportTicketDetails,
    setIsOpenForAddingSupportTicketDetails,
  ] = useState<boolean>(false);

  const [selectedAccount, setSelectedAccont] = useState<Account>({
    count: 0,
    id: 0,
    companyId: 0,
    name: "",
    email: "",
    mobileNumber: "",
    industryTypeId: 0,
    industryTypeName: "",
    businessTypeId: 0,
    businessTypeName: "",
    countryId: 0,
    stateId: 0,
    districtId: 0,
    countryName: "",
    stateName: "",
    districtName: "",
    pan: "",
    gst: "",
    tan: "",
    billingAddress: "",
    shippingAddress: "",
    registeredOfficeAddress: "",
    businessResgistrationNumber: "",
    website: "",
    isActive: false,
    createdBy: "",
    createdOn: "",
  });
  const [accountProducts, setAccontProducts] = useState<AccountProduct[]>([]);
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

  const [selectedAccountCompanyProduct, setSelectedAccountCompanyProduct] =
    useState<AccountProduct>({
      accountId: 0,
      companyProductId: 0,
      quantity: 0,
      quantityReturn: 0,
      barcode: "",
      serialNumber: "",
      purchaseDate: "",
      deliveryDate: "",
      deliveryAddress: "",
      billingAddress: "",
      installationDate: "",
      installedBy: 0,
      warrantyIntervalTypeId: 0,
      warranty: 0,
      warrantyStartDate: "",
      warrantyEndDate: "",
      warrantyTerms: "",
      amcCycleIntervalTypeId: 0,
      amcCycle: 0,
      amcCycleStartDate: "",
      amcCycleEndDate: "",
      unitName: "",
      unitNameInStock: "",
      id: 0,
      accountName: "",
      companyProductName: "",
      installedByName: "",
      warrantyIntervalName: "",
      amcIntervalName: "",
      updatedBy: "",
      createdOn: "",
      updatedOn: "",
      createdBy: "",
    });

  const [selectedSupportTicketCategory, setSelectedSupportTicketCategory] =
    useState<number | undefined>(undefined);
  // NOTE : ADD THIS selectedSource
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

  const handleRowSelectAccountProduct = (data: AccountProduct) => {
    if (data) {
      setSelectedAccountCompanyProduct(data);
      setIsOpenForAccountProductSelection(false);
      setIsOpenForAddingSupportTicketDetails(true);
      setStage(3);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      getAccountProducts();
    } else {
      clearSelectedAccountCompanyProduct();
      setAccontProducts([]);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccountCompanyProduct.id !== 0) {
      getCompanyProductSla();
    } else {
      setCompanyProductSla([]);
    }
  }, [selectedAccountCompanyProduct]);

  const clearSelectedAccount = () => {
    setSelectedAccont({
      count: 0,
      id: 0,
      companyId: 0,
      name: "",
      email: "",
      mobileNumber: "",
      industryTypeId: 0,
      industryTypeName: "",
      businessTypeId: 0,
      businessTypeName: "",
      countryId: 0,
      stateId: 0,
      districtId: 0,
      countryName: "",
      stateName: "",
      districtName: "",
      pan: "",
      gst: "",
      tan: "",
      billingAddress: "",
      shippingAddress: "",
      registeredOfficeAddress: "",
      businessResgistrationNumber: "",
      website: "",
      isActive: false,
      createdBy: "",
      createdOn: "",
    });
  };

  const clearSelectedAccountCompanyProduct = () => {
    setSelectedAccountCompanyProduct({
      accountId: 0,
      companyProductId: 0,
      quantity: 0,
      quantityReturn: 0,
      barcode: "",
      serialNumber: "",
      purchaseDate: "",
      deliveryDate: "",
      deliveryAddress: "",
      billingAddress: "",
      installationDate: "",
      installedBy: 0,
      warrantyIntervalTypeId: 0,
      warranty: 0,
      warrantyStartDate: "",
      warrantyEndDate: "",
      warrantyTerms: "",
      amcCycleIntervalTypeId: 0,
      amcCycle: 0,
      amcCycleStartDate: "",
      amcCycleEndDate: "",
      unitName: "",
      unitNameInStock: "",
      id: 0,
      accountName: "",
      companyProductName: "",
      installedByName: "",
      warrantyIntervalName: "",
      amcIntervalName: "",
      updatedBy: "",
      createdOn: "",
      updatedOn: "",
      createdBy: "",
    });
  };

  const clearAllData = async () => {
    setAccontProducts([]);
    setIsOpenForAddingSupportTicketDetails(false);
    setIsOpenForAccountProductSelection(false);
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
    clearSelectedAccountCompanyProduct();
    clearSelectedAccount();
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
      flagVariable = false;
    } else {
      setShowErrorAtSupportTicketSource(false);
    }

    if (selectedSupportTicketCategory === undefined) {
      setShowErrorAtSupportTicketCategory(true);
      flagVariable = false;
    } else {
      setShowErrorAtSupportTicketCategory(false);
    }

    if (selectedCompanyProductSla === undefined) {
      setShowErrorAtCompanyProductSla(true);
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
      toast.error(
        "Please fill Query Discription and select source, ticket category and product SLA"
      );
      flagVariable = false;
    }

    return flagVariable;
  };

  const createSupportTicket = async () => {
    if (!validateForm()) return;

    setIsSupportTicketCreating(true);
    const postData = {
      company_id: loginStatus.companyId,
      account_company_product_id: selectedAccountCompanyProduct?.id,
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
      });
  };

  const getAccountProducts = async () => {
    if (selectedAccount.id === 0) return;
    setAccontProducts([]);
    setIsLoadingForAccountCompanyProducts(true);
    clearSelectedAccountCompanyProduct();
    setSelectedCompanyProductSla(undefined);
    const postDataForAccountProducts = {
      company_id: loginStatus.companyId,
      account_id: selectedAccount?.id,
      company_product_id: null,
      requestedby: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_ACCOUNT_COMPANY_PRODUCT, postDataForAccountProducts, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const formattedData: AccountProduct[] = response.data.map(
            (item: any) => ({
              id: item.id,
              accountId: item.account_id,
              accountName: item.account_name,
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              quantity: item.quantity,
              quantityReturn: item.quantity_return,
              barcode: item.barcode,
              serialNumber: item.serial_number,
              unitName: item.unit_name,
              unitNameInStock: item.unit_name_in_stock,
              purchaseDate: item.purchase_date,
              deliveryDate: item.delivery_date,
              deliveryAddress: item.delivery_address,
              billingAddress: item.billing_address,
              installationDate: item.installation_date,
              installedByName: item.installed_by_name,
              installedBy: item.installed_by,
              warrantyIntervalTypeId: item.warranty_interval_type_id,
              warrantyIntervalName: item.warranty_interval_name,
              warranty: item.warranty,
              warrantyStartDate: item.warranty_start_date,
              warrantyEndDate: item.warranty_end_date,
              warrantyTerms: item.warranty_terms,
              amcCycleIntervalTypeId: item.amc_cycle_interval_type_id,
              amcCycle: item.amc_cycle,
              amcCycleStartDate: item.amc_cycle_start_date,
              amcCycleEndDate: item.amc_cycle_end_date,
              amcIntervalName: item.amc_interval_name,
              updatedBy: item.updatedby,
              createdOn: item.createdon,
              updatedOn: item.updatedon,
              createdBy: item.createdby,
            })
          );
          setAccontProducts(formattedData);
        }
        setIsLoadingForAccountCompanyProducts(false);
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getAccountProducts,
          });
          if (refreshTokenResponse) {
            getAccountProducts();
          }
        }
        if (error.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.error(error.response?.data);
        }
      })
      .finally(() => {
        setIsLoadingForAccountCompanyProducts(false);
      });
  };

  const getCompanyProductSla = async () => {
    if (selectedAccountCompanyProduct.id === 0) return;
    setCompanyProductSla([]);
    setIsLoadingForCompanyProductSla(true);
    const postDataForCompanyProductSla = {
      company_id: loginStatus.companyId,
      company_product_id: selectedAccountCompanyProduct.companyProductId,
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
            callFunction: getAccountProducts,
          });
          if (refreshTokenResponse) {
            getAccountProducts();
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
      {(isSupportTicketCreating ||
        isLoadingForAccountCompanyProducts ||
        isLoadingForCompanyProductSla) && (
        <LoadingPopUpAnimation
          show={
            isSupportTicketCreating ||
            isLoadingForAccountCompanyProducts ||
            isLoadingForCompanyProductSla
          }
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
                setIsOpenForAccountProductSelection(false);
                setIsOpenForAddingSupportTicketDetails(false);
                clearSelectedAccount();
                clearSelectedAccountCompanyProduct();
              }
              if (value === 2) {
                setIsOpenForAccountSelection(false);
                setIsOpenForAccountProductSelection(true);
                setIsOpenForAddingSupportTicketDetails(false);
                clearSelectedAccountCompanyProduct();
              }
              if (value === 3) {
                setIsOpenForAccountSelection(false);
                setIsOpenForAccountProductSelection(false);
                setIsOpenForAddingSupportTicketDetails(true);
              }
            }}
          />
        </div>

        {(selectedAccount.id !== 0 || selectedAccountCompanyProduct.id !== 0) &&
          stage > 1 && (
            <div className="flex gap-10 p-4 rounded-xl border bg-white shadow-sm">
              {/* Selected Account */}
              {selectedAccount.id !== 0 && stage >= 2 && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                    <UserCircle size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Selected Account</p>
                    <p className="font-semibold text-gray-800">
                      {selectedAccount.name || "No account selected"}
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Product */}
              {selectedAccountCompanyProduct.id !== 0 && stage >= 2 && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                    <Package size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Selected Product</p>
                    <p className="font-semibold text-gray-800">
                      {selectedAccountCompanyProduct.companyProductName ||
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
              <GetAccounts
                isUsedForAccountLead={true}
                handleRowSelectedForLead={(data) => {
                  setSelectedAccont(data);
                  setIsOpenForAccountSelection(false);
                  setIsOpenForAccountProductSelection(true);
                  setIsOpenForAddingSupportTicketDetails(false);
                  setStage(2);
                }}
                isUsedForSupportTicketCreation={true}
              />
            </div>
          )}
          {selectedAccount.id !== 0 && isOpenForAccountProductSelection && (
            <div>
              {isOpenForAccountProductSelection && (
                <div className="md:col-span-2  w-full h-96">
                  <AccountCompanyProductAgGrid
                    accountProductData={accountProducts}
                    onRowSelect={handleRowSelectAccountProduct}
                    isUsedForSelection={true}
                  />
                </div>
              )}
            </div>
          )}
          {selectedAccount.id !== 0 &&
            selectedAccountCompanyProduct.id !== 0 &&
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
                    <div className="space-y-1">
                      <CustomDropdown
                        logo={Clock}
                        preselectedOption={selectedSupportTicketCategory}
                        requiredRedDot
                        labelName="Ticket Category :"
                        options={supportTicketCAtegory!}
                        onSelect={handleLeadSelectedSupportTicketCategory}
                      />
                      {showErrorAtSupportTicketCategory &&
                        !selectedSupportTicketCategory && (
                          <div className="text-red-500 text-xs">
                            Please select ticket category
                          </div>
                        )}
                    </div>

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

                    <div>
                      <div className="flex items-center justify-between pr-60 pt-2 gap-1 w-full">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            if (userHasAccessToViewUser) {
                              handleCompanyUserPopUp();
                            } else {
                              toast.error(
                                MESSAGE.MODULE_ACCESS.COMPANY_USER
                                  .DENIED_VIEW_ACCESS
                              );
                            }
                          }}
                          type="submit"
                        >
                          <div className="flex gap-1 items-center whitespace-nowrap">
                            <UserRoundPlus size={16} />
                            <span>Assign</span>
                          </div>
                        </Button>

                        <span className="caption-custom whitespace-nowrap">
                          <span className="input-label-custom">
                            Assign To :
                          </span>{" "}
                          {/* {selectedCompanyUser.fullname || loginStatus.fullName +`(if not assigned)`} */}
                          {selectedCompanyUser.fullname || loginStatus.fullName}
                        </span>
                      </div>

                      <span className="caption-custom">
                        <span className="">Note :</span> If a support ticket
                        assign to is not selected, then ticket will assigned to
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
                {openPopUpOfCompanyUserModal &&
                  createPortal(
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl p-3 shadow-lg w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
                        <FormHeader
                          icon={UserRoundPlus}
                          onClose={() => setOpenPopUpOfCompanyUserModal(false)}
                          preText="Select Company User"
                          description="Select the user to assign him/her to support ticket."
                        />
                        {/* NOTE : CALL TO THE MODAL COMPONENT */}
                        <div className="p-1">
                          <GetCompanyUsersForLead
                            selectedUserId={persistedSelectedUserId} // Pass the persisted ID
                            handleSelectedCompanyUserChange={
                              handleSelectedCompanyUserChange
                            }
                            isUsedForSettings={false}
                          />
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            )}
        </form>
      </div>
    </FormLayout>
  );
}

export default CreateSupportTicketModal;
