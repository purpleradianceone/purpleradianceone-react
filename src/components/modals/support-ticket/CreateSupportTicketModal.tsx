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
  AlarmClockCheck,
  AlarmClockMinusIcon,
  Clock,
  Link,
  LucideMail,
  LucideMessageCircleQuestion,
  LucidePhoneCall,
  Notebook,
  Package,
  QrCodeIcon,
  Save,
  ShieldCheck,
  ShieldX,
  TicketPlus,
  User,
  UserCircle,
  Wrench,
  X,
} from "lucide-react";
import axiosClient from "../../../axios-client/AxiosClient";
import { CompanyProductSla } from "../../../@types/products/CompanyProductSla";
import Button from "../../ui/Button";
import CustomDropdown from "../leads/CustomDropdown";
import MESSAGE from "../../../constants/Messages";
import { useFormChange } from "../../../config/hooks/useFormChange";
import CreateSupportTicket from "../../../@types/support-ticket-management/CreateSuppoetTicket";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useSupportTicketSource } from "../../../config/hooks/useSupportTicketSource";
import StageIndicator from "./StageIdicator";
import { useSupportTicketCategory } from "../../../config/hooks/useSupportTicketCategory";
import AccountCompanyProductForSupportTicket from "../../../@types/support-ticket-management/AccountCompanyProductForSupportTicket";
import GetAccountCompanyProductFroSupportTicket from "../../views/support-ticket-management/GetAccountCompanyProductFroSupportTicket";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import TextAreaInput from "../../ui/TextAreaInput";
import { handleApiError } from "../../../config/error/handleApiError";

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
      accountEmail: "",
      accountMobileNumber: "",
      companyProductId: 0,
      companyProductName: "",
      isAmc: false,
      isWarranty: false,
      quantity: 0,
      barcode: "",
      serialNumber: "",
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
    undefined,
  );

  const [selectedCompanyProductSla, setSelectedCompanyProductSla] = useState<
    number | undefined
  >(undefined);

  const handleLeadSelectedSupportTicketCategory = (
    value: number | undefined,
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

  const getCompanyProductSla = async () => {
    if (selectedAccount.id === 0) return;
    setCompanyProductSla([]);
    setSelectedCompanyProductSla(undefined);
    setIsLoadingForCompanyProductSla(true);
    const postDataForCompanyProductSla = {
      company_id: loginStatus.companyId,
      company_product_id: selectedAccount.companyProductId,
      isactive: true,
      requestedby: loginStatus.id,
    };

    await axiosClient
      .post(
        POST_API.GET_LOOKUP_COMPANY_PRODUCT_SLA,
        postDataForCompanyProductSla,
        {
          withCredentials: true,
        },
      )
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
            }),
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

  useEffect(() => {
    if (selectedAccount) {
      getCompanyProductSla();
    } else {
      setCompanyProductSla([]);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (companyProductSla && companyProductSla.length !== 0) {
      setSelectedCompanyProductSla(companyProductSla[0].id);
    }
  }, [companyProductSla]);

  const clearSelectedAccount = () => {
    setSelectedAccont({
      count: 0,
      id: 0,
      accountId: 0,
      accountName: "",
      accountEmail: "",
      accountMobileNumber: "",
      companyProductId: 0,
      companyProductName: "",
      isAmc: false,
      isWarranty: false,
      quantity: 0,
      barcode: "",
      serialNumber: "",
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
      LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET,
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
        query_description: "Please enter a query description",
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
        handleApiError(error);
      })
      .finally(() => {
        setIsSupportTicketCreating(false);
      });
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
    <FormLayout widthPercent={95} padding={3}>
      {(isSupportTicketCreating || isLoadingForAccountCompanyProducts) && (
        <LoadingPopUpAnimation
          show={isSupportTicketCreating || isLoadingForAccountCompanyProducts}
        />
      )}
      <div
        className={`${isSupportTicketCreating ? "cursor-wait" : "cursor-default"}`}
      >
        <FormHeader
          icon={TicketPlus}
          onClose={() => {
            onClose();
            clearAllData();
          }}
          preText="Create support ticket "
          description="Create support ticket for account product."
        />
        <div className="">
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
          <div className="flex gap-6 p-2 rounded-xl border bg-white shadow-sm">
            {/* Selected Account */}
            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100">
                  <UserCircle size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="caption-custom">Account</p>
                  <p
                    title={
                      selectedAccount.accountName.length > 20
                        ? selectedAccount.accountName
                        : undefined
                    }
                    className="table-data-custom max-w-[120px] select-text truncate"
                  >
                    {selectedAccount.accountName
                      ? selectedAccount.accountName
                      : "No account selected"}
                  </p>
                </div>
              </div>
            )}

            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100">
                  <LucideMail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="caption-custom">Email</p>
                  <p
                    title={
                      selectedAccount.accountEmail.length > 20
                        ? selectedAccount.accountEmail
                        : undefined
                    }
                    className="table-data-custom max-w-[120px] select-text truncate"
                  >
                    {selectedAccount.accountEmail
                      ? selectedAccount.accountEmail
                      : "NA"}
                  </p>
                </div>
              </div>
            )}

            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100">
                  <LucidePhoneCall size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="caption-custom">Mobile Number</p>
                  <p
                    title={
                      selectedAccount.accountMobileNumber.length > 20
                        ? selectedAccount.accountMobileNumber
                        : undefined
                    }
                    className="table-data-custom max-w-[120px] select-text truncate"
                  >
                    {selectedAccount.accountMobileNumber
                      ? selectedAccount.accountMobileNumber
                      : "NA"}
                  </p>
                </div>
              </div>
            )}

            {/* Selected Product */}
            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-green-100">
                  <Package size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="caption-custom">Selected Product</p>
                  <p
                    title={
                      selectedAccount.companyProductName.length > 20
                        ? selectedAccount.companyProductName
                        : undefined
                    }
                    className="table-data-custom max-w-[150px] select-text truncate"
                  >
                    {selectedAccount.companyProductName
                      ? selectedAccount.companyProductName
                      : "No product selected"}
                  </p>
                </div>
              </div>
            )}

            {/* Product Serial Number */}
            {selectedAccount.id !== 0 &&
              stage >= 2 &&
              selectedAccount.serialNumber && (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-green-100">
                    <QrCodeIcon size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="caption-custom">Serial Number</p>
                    <p
                      title={
                        selectedAccount.serialNumber.length > 20
                          ? selectedAccount.serialNumber
                          : undefined
                      }
                      className="table-data-custom max-w-[150px] select-text truncate"
                    >
                      {selectedAccount.companyProductName
                        ? selectedAccount.serialNumber
                        : "No Serial Number"}
                    </p>
                  </div>
                </div>
              )}

            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 flex items-center justify-center rounded-full ${
                    selectedAccount.isAmc ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {selectedAccount.isAmc ? (
                    <AlarmClockCheck size={18} className="text-blue-600" />
                  ) : (
                    <AlarmClockMinusIcon size={18} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="caption-custom">AMC</p>
                  <p className="table-data-custom">
                    {selectedAccount.companyProductName
                      ? selectedAccount.isAmc
                        ? `Active`
                        : `Due`
                      : "No product selected"}
                  </p>
                </div>
              </div>
            )}

            {selectedAccount.id !== 0 && stage >= 2 && (
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 flex items-center justify-center rounded-full ${
                    selectedAccount.isWarranty ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {selectedAccount.isWarranty ? (
                    <ShieldCheck size={18} className="text-blue-600" />
                  ) : (
                    <ShieldX size={18} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="caption-custom">Warranty</p>
                  <p className="table-data-custom">
                    {selectedAccount.companyProductName
                      ? selectedAccount.isWarranty
                        ? `Active`
                        : `Expired`
                      : "No product selected"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <form className="space-y-0">
          {isOpenForAccountSelection && (
            <div className="md:col-span-2  w-full h-fit">
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="">
                      <TextAreaInput
                        label="Query Description:"
                        logo={LucideMessageCircleQuestion}
                        name="query_description"
                        placeholder="Enter query description"
                        value={
                          createSupportTicketModalFormData.query_description
                        }
                        defaultValue={
                          createSupportTicketModalFormData.query_description
                        }
                        onChange={handleSupportTicketModalFormDataChange}
                        required={true}
                        onBlur={handleBlur}
                        cols={0}
                        rows={3}
                        error={error.query_description}
                      />
                    </div>

                    <div className="">
                      <TextAreaInput
                        label="Public Notes:"
                        logo={Notebook}
                        name="public_notes"
                        placeholder="Enter public notes "
                        value={createSupportTicketModalFormData.public_notes}
                        defaultValue={
                          createSupportTicketModalFormData.public_notes
                        }
                        onChange={handleSupportTicketModalFormDataChange}
                        cols={0}
                        rows={3}
                        // onBlur={handleBlur}
                      />
                    </div>

                    <div className="">
                      <TextAreaInput
                        label="Resolution Applied:"
                        logo={Wrench}
                        name="resolution_applied"
                        placeholder="Enter resolution applied if needed "
                        value={
                          createSupportTicketModalFormData.resolution_applied
                        }
                        defaultValue={
                          createSupportTicketModalFormData.resolution_applied
                        }
                        // onBlur={handleBlur}
                        onChange={handleSupportTicketModalFormDataChange}
                        cols={0}
                        rows={3}
                      />
                    </div>

                    {!isLoadingForTicketCategory ? (
                      <div className="">
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
                      <div className="">
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
                      <div className="">
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
                  </div>

                  <div className="grid grid-cols-1">
                    <div className="grid grid-cols-3">
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
                        // isDisabled={!userHasAccessToViewUser}
                        disabledMessage={
                          MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                        }
                      />
                    </div>
                    <span className="caption-custom">
                      <span className="">Note :</span> If a support ticket
                      assign to is not selected or is removed, then ticket will
                      assigned to
                      <span className="table-header-custom active">
                        {" "}
                        creator
                      </span>{" "}
                      by default.
                    </span>
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
