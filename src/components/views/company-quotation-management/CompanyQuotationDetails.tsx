/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Check,
  ChevronRight,
  Download,
  File,
  FileArchive,
  Handshake,
  LucideLightbulb,
  LucideSubtitles,
  Pencil,
  RotateCcw,
  Save,
  Send,
  Trash,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {
  formatQuantity,
  formatRupee,
} from "../../../utils/helperMethods/formatFunctions";
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import MetaField from "../../ui/MetaField";
import { PageLayout } from "../../ui/PageLayout";
import SearchInput from "../../ui/SearchInput";
import LoadingPopUpAnimation from "../card/LoadingPopUpAnimation";

import ROUTES_URL from "../../../constants/Routes";
import { LookupAccountDropdown } from "../lookups/lookup-account/LookupAccountDropdown";

import CompanyQuotationProps from "../../../@types/company-quotation/CompanyQuotationProps";
import { Modules } from "../../../@types/List/CompanyQuotationManagementListProps";
import { getLookupAccounts } from "../../../config/apis/AccountApis";
import { getLookupQuotationTemplate } from "../../../config/apis/CompanyQuotationApis";
import { getLookupLeadsWithSignal } from "../../../config/apis/LeadsApi";
import MESSAGE from "../../../constants/Messages";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";
import QuotationStatusChip from "../../ui/QuotationStatusChip";
import { LookupQuotationTemplateDropdown } from "../lookups/company-quotation/LookupQuotationTemplateDropdown";
import { QuotationTypeDropdown } from "../lookups/company-quotation/QuotationTypeDropdown";
import { LookupAccountCompanyProductByProductTypeDropdown } from "../lookups/lookup-account/LookupAccountCompanyProductByProductTypeDropdown";
import { LookupCompanyProductDropdown } from "../lookups/lookup-company-product/LookupCompanyProductDropdown";
import { LookupLeadDropdown } from "../lookups/lookup-lead/LookupLeadDropdown";
import {
  CompanyQuotationHeaderSkeleton,
  CompanyQuotationItemsSkeleton,
} from "./CompanyQuotationDetailsSkeleton";
import { amountToWords } from "../../../utils/helperMethods/amountToWords";

function CompanyQuotationDetails() {
  const itemsAlighnment = "right";
  const tableBorder = "border border-gray-200 pr-1";
  const { quotationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [previousQuotation, setPreviousQuotation] =
    useState<CompanyQuotationProps | null>(null);
  const [quotation, setQuotation] = useState<CompanyQuotationProps | null>(
    null,
  );
  const [quotationLoading, setQuotationLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const { loginStatus } = useLoggedInUserContext();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [refreshLocalUiCount, setRefreshLocalUiCount] = useState<number>(0);
  const [refreshCountItem, setRefreshCountItem] = useState<number>(0);

  const [tempItems, setTempItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedSelectedCompanyProductType4, setSelectedCompanyProductType4] =
    useState<any>(null);
  const [
    selectedAccountCompanyProductType12,
    setSelectedAccountCompanyProductType12,
  ] = useState<any>(null);

  const [selectedQuotationType, setSelectedQuotationType] = useState<any>({
    id: 1,
    name: "Lead",
  });
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [
    selectedPreviousQuotationTemplate,
    setSelectedPreviousQuotationTemplate,
  ] = useState<any>(null);
  const [selectedQuotationTemplate, setSelectedQuotationTemplate] =
    useState<any>(null);

  const [showAccountName, setShowAccountName] = useState<boolean>(false);
  const isCreateMode = !quotationId || Number(quotationId) === 0;
  const otherIdSearchParams = searchParams.get("other_id");
  const quotationTypeIdSearchParams = searchParams.get("quotation_type_id");
  const isUsedForSearchParams = searchParams.get("isUsedFor");
  const fromCreatePage = searchParams.get("fromCreatePage");

  const {
    userHasAccessToAddLeadQuotation,
    userHasAccessToAddAccountQuotation,
    userHasAccessToViewCompanyQuotation,
  } = useUserAccessModules();

  useEffect(() => {
    if (searchParams.has("account_company_product")) {
      const accountCompanyProduct = JSON.parse(
        searchParams.get("account_company_product") ?? "{}",
      );
      setSelectedAccountCompanyProductType12(accountCompanyProduct);
    }
  }, [searchParams]);

  const getCompanyQuotations = async (signal: AbortSignal) => {
    if(loginStatus.companyId == 0)return;
    if (!quotationId || Number(quotationId) === 0) return;
    setQuotationLoading(true);
    const postData = {
      id: Number(quotationId),
      company_id: loginStatus.companyId,
      limit: 1,
      offset: 0,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_QUOTATION,
        postData,
        {
          signal,
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        // console.log(response.data);

        const item = Array.isArray(responseData)
          ? responseData[0]
          : responseData;

        if (!item){
          window.history.back();
          return;
        }

        setDisabled(
          item.quotation_status_name?.trim().toUpperCase() !== "DRAFT",
        );

        const formattedData: CompanyQuotationProps = {
          id: item.id,
          // companyId: item.company_id,
          quotationStatusId: item.quotation_status_id,
          quotationStatusName: item.quotation_status_name,
          quotationTypeId: item.quotation_type_id,
          quotationTypeName: item.quotation_type_name,
          otherId: item.other_id,
          quotationTemplateId: item.quotation_template_id,
          quotationNumber: item.quotation_number,
          otherDetail: item.other_detail,
          quotationDate: item.quotation_date,
          validTillDate: item.valid_till_date,

          basicValue: item.basic_value,
          discountAmount: item.discount_amount,
          taxableValue: item.taxable_value,
          totalTax: item.total_tax,
          totalAmount: item.total_amount,
          adjustmentForRoundOff: item.adjustment_for_round_off,
          companyQuotationFileExtension: item.company_quotation_file_extension,
          companyQuotationOriginUrl: item.company_quotation_origin_url,
          companyQuotationCdnUrl: item.company_quotation_cdn_url,

          templateSnapshot: JSON.parse(item.template_snapshot) as Record<
            string,
            string | null
          >,

          isActive: item.isactive,
          createdBy: item.createdby,
          createdOn: item.createdon,
          updatedBy: item.updatedby,
          updatedOn: item.updatedon,
        };

        const postData = {
          id: formattedData.quotationTemplateId,
          company_id: loginStatus.companyId,
          limit: 1,
          requestedby_id: loginStatus.id,
        };
        const res = await getLookupQuotationTemplate(postData);
        console.error(res.data[0]);
        setSelectedQuotationTemplate(res.data[0]);
        setSelectedPreviousQuotationTemplate(res.data[0]);
        setQuotation(formattedData);
        setPreviousQuotation(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setQuotationLoading(false);
    }
  };
  console.log(disabled);

  const getCompanyQuotationItems = async (signal: AbortSignal) => {
    if(loginStatus.companyId == 0)return;
    if (!quotationId || Number(quotationId) === 0) return;

    setItemsLoading(true);
    const postData = {
      id: null,
      company_id: loginStatus.companyId,
      company_quotation_id: Number(quotationId),
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_QUOTATION_ITEM,
        postData,
        {
          signal,
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data?.sort(
          (a: any, b: any) => a.id - b.id,
        ); // Sort by ID to maintain order

        const items = Array.isArray(responseData)
          ? responseData
          : [responseData];

        setItems(items);
        setTempItems(items);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setItemsLoading(false);
      console.log("into items finally");
    }
  };
  const [showConfirmationDialoge, setShowConfirmationDialoge] =
    useState<boolean>(false);

  const [
    showConfirmationDialogeForNewQuotationCreation,
    setShowConfirmationDialogeForNewQuotationCreation,
  ] = useState<boolean>(false);

  const submitCompanyQuotation = async () => {
    if (!quotation) return;
    if (disabled) {
      return;
    }

    // if (!userHasAccessToUpdateCompanyQuotation) {
    //   return;
    // }
    const postData = {
      company_id: loginStatus.companyId,
      id: quotation.id,
      quotation_status_id: 2,
      isactive: quotation.isActive,
      updatedby_id: loginStatus.id,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        // POST_API.UPDATE_COMPANY_QUOTATION_SUBMIT,
        POST_API.UPDATE_COMPANY_QUOTATION,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        // getCompanyQuotations(new AbortController().signal);
        setRefreshCount((prev) => prev + 1);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewCompanyQuotation = async () => {
    if (tempItems.length <= 0) {
      toast.error(
        "No items available to preview this quotation. \nPlease create a new quotation.",
        {
          style: {
            background: "white",
            color: "#991b1b",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            fontSize: "14px",
          },
          icon: "⚠️",
        },
      );
      setShowConfirmationDialogeForNewQuotationCreation(true);
      return;
    }
    if (!userHasAccessToViewCompanyQuotation) return;
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post(
        POST_API.PREVIEW_DOWNLOAD_COMPANY_QUOTATION_DOWNLOAD,
        {
          company_id: loginStatus.companyId,
          id: Number(quotationId),
          company_quotation_id: Number(quotationId),
          quotation_status_id: quotation?.quotationStatusId,
          company_quotation_type_id: 1,
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob",
          withCredentials: true,
        },
      );
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);

      // ✅ Same as your task document logic
      setLogoPreview(fileUrl); // you can rename this later (e.g. setQuotationPreview)
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to preview quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuotation = async () => {
    if (!quotation) return;
    if (disabled) {
      return;
    }
    if (
      previousQuotation?.quotationDate === quotation.quotationDate &&
      previousQuotation?.validTillDate === quotation.validTillDate &&
      previousQuotation?.quotationTemplateId === selectedQuotationTemplate.id &&
      previousQuotation?.adjustmentForRoundOff ===
        quotation.adjustmentForRoundOff
    ) {
      toast.error(
        "No changes were detected. Please update at least one field.",
        {
          style: {
            color: "#991b1b",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            fontSize: "14px",
          },
          icon: "⚠️",
        },
      );
      return;
    }
    // if (!userHasAccessToUpdateCompanyQuotation) return;
    const postData = {
      id: quotation.id,
      company_id: loginStatus.companyId,
      quotation_template_id: selectedQuotationTemplate.id,
      quotation_date_string: quotation.quotationDate,
      valid_till_date_string: quotation.validTillDate,
      adjustment_for_round_off: quotation.adjustmentForRoundOff,
      quotation_status_id: null,
      updatedby_id: loginStatus.id,
      isactive: quotation.isActive,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_QUOTATION,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        getCompanyQuotations(new AbortController().signal);
        setRefreshCount((prev) => prev + 1);
      } else {
        toast.error(res.data.message);
        await handlePreviousState();
      }
    } catch (error) {
      handleApiError(error);
      await handlePreviousState();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousState = async () => {
    setQuotation(previousQuotation);
    handleResetRoundOff();
    setRefreshLocalUiCount((prev) => prev + 1);
    setSelectedQuotationTemplate(selectedPreviousQuotationTemplate);
  };

  const handleCompanyQuotationDownload = async () => {
    if (!disabled) return;
    if (!userHasAccessToViewCompanyQuotation) return;
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post(
        POST_API.PREVIEW_DOWNLOAD_COMPANY_QUOTATION_DOWNLOAD,
        {
          company_id: loginStatus.companyId,
          id: Number(quotationId),
          company_invoice_id: Number(quotationId),
          quotation_status_id: quotation?.quotationStatusId,
          company_invoice_type_id: 1,
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob",
          withCredentials: true,
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);

      setLogoPreview(fileUrl);
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (item: any) => {
    if (disabled) {
      return;
    }
    const postData = {
      company_id: loginStatus.companyId,
      id: item.id,
      isactive: false, // Soft delete
      updatedby_id: loginStatus.id,
    };
    console.log(postData);
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_QUOTATION_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setRefreshCountItem((prev) => prev + 1); // trigger refresh of items
      } else {
        toast.error(res.data.message);
        cancelEdit();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscountChange = (id: number, discountPercent: number) => {
    setTempItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const safeDiscount = Math.max(0, Math.min(100, discountPercent));

        const discountAmount = (item.basic_value * safeDiscount) / 100;
        const taxableValue = item.basic_value - discountAmount;

        const cgstAmount = (taxableValue * item.cgst_percent) / 100;
        const sgstAmount = (taxableValue * item.sgst_percent) / 100;
        const igstAmount = (taxableValue * item.igst_percent) / 100;
        const cessAmount = (taxableValue * item.cess_percent) / 100;

        const totalTax = cgstAmount + sgstAmount + igstAmount + cessAmount;
        const totalAmount = taxableValue + totalTax;

        return {
          ...item,
          discount_percent: safeDiscount,
          discount_amount: discountAmount,
          taxable_value: taxableValue,
          cgst_amount: cgstAmount,
          sgst_amount: sgstAmount,
          igst_amount: igstAmount,
          cess_amount: cessAmount,
          total_tax: totalTax,
          total_amount: totalAmount,
        };
      }),
    );
  };

  const summary = tempItems.reduce(
    (acc, item) => {
      acc.basic += item.basic_value || 0;
      acc.discount += item.discount_amount || 0;
      acc.taxable += item.taxable_value || 0;
      acc.tax += item.total_tax || 0;
      acc.total += item.total_amount || 0;
      acc.igst += item.igst_amount || 0;
      acc.cess += item.cess_amount || 0;
      acc.adjustment_for_round_off = quotation?.adjustmentForRoundOff || 0;
      return acc;
    },
    { basic: 0, discount: 0, taxable: 0, tax: 0, total: 0, cess: 0, igst: 0 },
  );

  const hasCess = tempItems.some(
    (i) => i.cess_amount != null && i.cess_amount > 0,
  );

  const isInterState = tempItems.some((i)=> i.igst_percent != null && i.igst_percent > 0.0);

  const saveSingleItem = async (item: any) => {
    // if (!userHasAccessToUpdateCompanyQuotation) {
    //   return;
    // }
    const postData = {
      company_id: loginStatus.companyId,
      id: item.id,
      discount_percent: item.discount_percent,
      isactive: item.isactive,
      updatedby_id: loginStatus.id,
    };
    console.log(postData);

    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_QUOTATION_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setRefreshCount((prev) => prev + 1);
        setRefreshCountItem((prev) => prev + 1);
        setEditingItemId(null);
      } else {
        toast.error(res.data.message);
        cancelEdit();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setTempItems(items); // reset condition
    setEditingItemId(null);
  };

  const handleCreateQuotation = async () => {
    if (selectedQuotationType.id === 1 && !userHasAccessToAddLeadQuotation) {
      toast.error(MESSAGE.MODULE_ACCESS.LEAD_QUOTATION.DENIED_ADD_ACCESS);
      return;
    }
    if (selectedQuotationType.id === 2 && !userHasAccessToAddAccountQuotation) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_QUOTATION.DENIED_ADD_ACCESS);
      return;
    }
    if (selectedQuotationType.id === 1) {
      if (!selectedLead) {
        toast.error("Please select a lead");
        return;
      }
    }
    if (selectedQuotationType.id === 2) {
      if (!selectedAccount) {
        toast.error("Please select an account");
        return;
      }
      if (!selectedAccountCompanyProductType12) {
        toast.error("Please select an account product");
        return;
      }
      if (!selectedSelectedCompanyProductType4) {
        toast.error("Please select AMC type product");
        return;
      }
    }

    if (!selectedQuotationTemplate) {
      toast.error("Please select a quotation template");
      return;
    }
    if (!quotation?.quotationDate) {
      toast.error("Please select quotation date.");
      return;
    }
    if (!quotation?.validTillDate) {
      toast.error("Please selelct valid till date.");
      return;
    }

    const formPayload =
      selectedQuotationType.id === 1
        ? {
            company_id: loginStatus.companyId,
            lead_id: selectedLead.id,
            quotation_template_id: selectedQuotationTemplate.id,
            quotation_date_string: quotation?.quotationDate,
            valid_till_date_string: quotation?.validTillDate,
            createdby_id: loginStatus.id,
          }
        : selectedQuotationType.id === 2
          ? {
              company_id: loginStatus.companyId,
              account_company_product_id:
                selectedAccountCompanyProductType12.id,
              company_product_id: selectedSelectedCompanyProductType4.id,
              quotation_template_id: selectedQuotationTemplate.id,
              quotation_date_string: quotation?.quotationDate,
              valid_till_date_string: quotation?.validTillDate,
              createdby_id: loginStatus.id,
            }
          : {
              company_id: loginStatus.companyId,

              createdby_id: loginStatus.id,
            };
    console.log(formPayload);

    setIsSubmitting(true);
    await axiosClient
      .post(
        selectedQuotationType.id === 1
          ? POST_API.CREATE_COMPANY_QUOTATION_QUOTATION_TYPE_1
          : POST_API.CREATE_COMPANY_QUOTATION_QUOTATION_TYPE_2,
        formPayload,
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          console.log(response.data);

          const invoiceId = response?.data?.newid;
          // handleAddInvoice();
          const path = ROUTES_URL.QUOTATION_CREATE_AND_DETAILS.replace(
            ":quotationId",
            String(invoiceId) +
              `?other_id=${selectedQuotationType === 1 ? selectedLead.id : selectedQuotationType === 2 ? selectedAccount.id : 0}&quotation_type_id=${selectedQuotationType.id}&isUsedFor=${isUsedForSearchParams}&fromCreatePage=1`,
          );
          navigate(path, { replace: true });
          // onClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error) => {
        console.log(error);
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account);
  };

  const handleCompanyProductSelection = (lookupCompanyProductType4: any) => {
    setSelectedCompanyProductType4(lookupCompanyProductType4);
  };

  const handleAccountCompanyProductSelection = (
    accountCompanyProductType12: any,
  ) => {
    setSelectedAccountCompanyProductType12(accountCompanyProductType12);
  };

  const handleLeadSelect = (lead: any) => {
    setSelectedLead(lead);
  };

  const handleQuotationTypeSelect = (quotationType: any) => {
    setSelectedQuotationType(quotationType);
  };

  const handleQuotationTemplateSelect = (quotationTemplate: any) => {
    setSelectedQuotationTemplate(quotationTemplate);
  };

  useEffect(() => {
    if (!quotationId || Number(quotationId) === 0) return;
    const controller = new AbortController();
    getCompanyQuotations(controller.signal);
    // getCompanyQuotationItems(controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationId, refreshCount]);

  useEffect(() => {
    if (!quotationId || Number(quotationId) === 0) return;
    const controller = new AbortController();
    getCompanyQuotationItems(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationId, refreshCountItem]);

  async function getSearchParamLead() {
    const postData = {
      company_id: loginStatus.companyId,
      id: Number(otherIdSearchParams),
      isactive: true,
      limit: 1,
      offset: 0,
      requestedby_id: loginStatus.id,
    };
    const res = await getLookupLeadsWithSignal(postData);
    setSelectedLead(res.data[0]);
  }

  async function getSearchParamAccount() {
    const postData = {
      company_id: loginStatus.companyId,
      id: Number(otherIdSearchParams),
      isactive: true,
      limit: 1,
      offset: 0,
      requestedby_id: loginStatus.id,
    };
    const res = await getLookupAccounts(postData);
    setSelectedAccount(res.data[0]);
  }

  useEffect(() => {

    if (
      otherIdSearchParams !== null &&
      otherIdSearchParams !== "0" &&
      quotationTypeIdSearchParams !== null &&
      quotationTypeIdSearchParams !== "0"
    ) {
      if (quotationTypeIdSearchParams === "1") {
        getSearchParamLead();
      }
      if (quotationTypeIdSearchParams === "2") {
        getSearchParamAccount();
      }
    }
  }, []);

  useEffect(() => {

    if (quotationTypeIdSearchParams && quotationTypeIdSearchParams !== "0") {
      setSelectedQuotationType({
        id: Number(quotationTypeIdSearchParams),
        name: quotationTypeIdSearchParams === "1" ? "Lead" : "AMC",
      });
    }
  }, [quotationTypeIdSearchParams]);

  const handleResetRoundOff = () => {
    setQuotation((prev: any) => ({
      ...prev,
      adjustmentForRoundOff: previousQuotation?.adjustmentForRoundOff, // remove roundOff impact
    }));
  };
  const getRoundOffValues = (total: number) => {
    const roundedTotal = Math.round(total);
    const roundOff = Number((roundedTotal - total).toFixed(2));
    return {
      roundedTotal, // final rounded amount
      roundOff, // adjustment (+/-)
      isRounded: roundOff === 0, // ✅ true if already rounded
    };
  };

  const [roundOffValues, setRoundOffValues] = useState(
    getRoundOffValues(quotation?.totalAmount ?? 0),
  );

  useEffect(() => {
    console.log("use effect 6");

    setRoundOffValues(getRoundOffValues(quotation?.totalAmount ?? 0));
    // setRoundOffValues(getRoundOffValues(summary.total ?? 0));
  }, [quotation, quotation?.totalAmount, quotation?.adjustmentForRoundOff]);

  return (
    <PageLayout onScrollChange={setShowAccountName} scrollTopValue={80}>
      <div className=" font-roboto" key={refreshLocalUiCount + ""}>
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* HEADER */}
        {quotationLoading ? (
          <CompanyQuotationHeaderSkeleton />
        ) : (
          <>
            <div className=" sticky top-0 z-10 bg-slate-100 flex text-center justify-start items-center gap-3  py-1">
              {/* <Link to={ROUTES_URL.QUOTATION_MANAGEMENT}> */}
              <Button
                // type="submit"
                className="caption-custom flex items-center justify-center hover:text-gray-800"
                onClick={() => {
                  if (isUsedForSearchParams === Modules.QUOTATION_MODULE)
                    navigate(ROUTES_URL.QUOTATION_MANAGEMENT);
                  else {
                    if (fromCreatePage === "1") {
                      navigate(-1);
                    } else {
                      navigate(-1);
                    }
                  }
                }}
              >
                {`${isUsedForSearchParams === Modules.QUOTATION_MODULE ? "Quotation" : isUsedForSearchParams === Modules.LEAD_QUOTATION ? "Lead Detail" : isUsedForSearchParams === Modules.AMC_QUOTATION ? "AMC Detail" : "Quotation"}`}
              </Button>
              {/* </Link> */}
              <ChevronRight size={16} />
              <h1 className="table-header-custom">Quotation Details</h1>
              {showAccountName && (
                <span
                  className={`
                ml-1 max-w-[700px] truncate text-sm text-gray-500
                transition-all duration-200 ease-out
                will-change-transform will-change-opacity justify-center items-center ${
                  showAccountName
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-1 pointer-events-none"
                } `}
                >
                  (
                  {/* <span>{`${Number(quotationTypeIdSearchParams) === 1 ? "Lead:" : Number(quotationTypeIdSearchParams) === 2 ? "AMC:" : ""}`}</span>{" "} */}
                  {/* <span className="table-data-custom">{`  ${otherIdSearchParams}  `}</span> */}
                  <span>Quotation:</span>{" "}
                  <span className="table-data-custom">{`  ${quotation?.quotationNumber}`}</span>
                  )
                </span>
              )}
            </div>
            <div className="flex justify-between items-center my-2">
              <div>
                <h1 className="section-header-custom">
                  {isCreateMode
                    ? "Create Quotation"
                    : `Quotation #${quotation?.quotationNumber || "[Auto-generated]"} (${quotation?.quotationTypeName})`}
                </h1>
                {!otherIdSearchParams && (
                  <p className="text-sm text-gray-500">
                    {isCreateMode
                      ? `Select an ${quotationTypeIdSearchParams ? (quotationTypeIdSearchParams === "1" ? "lead" : quotationTypeIdSearchParams === "2" ? "account" : "customer") : selectedQuotationType.id === 1 ? "lead" : selectedQuotationType.id === 2 ? "account" : "customer"} to create quotation`
                      : `Lead - ${quotation?.otherId}`}
                  </p>
                )}
              </div>
              {!isCreateMode && (
                <div className="flex gap-x-2 mr-2">
                  <button
                    className={`text-sm border p-2 rounded-md flex items-center gap-1 border-blue-300
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                      ${
                        !disabled
                          ? "bg-gray-50 cursor-not-allowed opacity-50"
                          : "bg-gray-50 hover:bg-blue-200 "
                      }`}
                    disabled={!disabled}
                    onClick={handleCompanyQuotationDownload}
                  >
                    <div className="flex items-center gap-1">
                      <Download size={14} className="text-blue-500" />
                      <span className="text-gray-700">Download</span>
                    </div>
                  </button>
                  <button
                    className={`text-sm border p-2 rounded-md flex items-center gap-1 text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
                      ${
                        !userHasAccessToViewCompanyQuotation
                          ? "bg-gray-50 cursor-not-allowed opacity-50"
                          : "bg-gray-50 hover:bg-red-200 hover border-red-300"
                      }`}
                    disabled={!userHasAccessToViewCompanyQuotation}
                    onClick={previewCompanyQuotation}
                  >
                    <div className="flex items-center gap-1">
                      <FaFilePdf size={14} className="text-red-500" />
                      <span className="">Preview</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
            {isCreateMode && (
              <div>
                <div className="flex items-end justify-start py-1 gap-3">
                  {/* Dropdown */}
                  {quotationTypeIdSearchParams && (
                    <div className="flex w-full gap-3">
                      {quotationTypeIdSearchParams &&
                        (quotationTypeIdSearchParams === "1" ? (
                          <LookupLeadDropdown
                            icon={<Handshake size={14} />}
                            value={selectedLead}
                            label="Lead"
                            handleLeadSelection={handleLeadSelect}
                            isDisabled={true}
                          />
                        ) : quotationTypeIdSearchParams === "2" ? (
                          <LookupAccountDropdown
                            icon={<User size={14} />}
                            value={selectedAccount}
                            label="Account"
                            handleAccountSelection={handleAccountSelect}
                            isDisabled={true}
                          />
                        ) : (
                          "customer"
                        ))}
                      {/** =================For Account Product================= */}
                      {selectedAccount &&
                        quotationTypeIdSearchParams === "2" && (
                          <LookupAccountCompanyProductByProductTypeDropdown
                            icon={<User size={14} />}
                            value={selectedAccountCompanyProductType12}
                            label="Account Product"
                            accountId={selectedAccount.id}
                            //   accountCompanyProductId={Number(searchParams.get("account_product_id"))}
                            productTypeId={[1, 2]}
                            handleAccountCompanyProductSelection={
                              handleAccountCompanyProductSelection
                            }
                            isDisabled={true}
                          />
                        )}
                      {/** =================For Account Product AMC(subscription)================= */}
                      {quotationTypeIdSearchParams === "2" && (
                        <LookupCompanyProductDropdown
                          icon={<LucideSubtitles size={14} />}
                          value={selectedSelectedCompanyProductType4}
                          label="AMC Type Product"
                          productTypeId={[4]}
                          handleCompanyProductSelection={
                            handleCompanyProductSelection
                          }
                          isDisabled={false}
                        />
                      )}

                      <LookupQuotationTemplateDropdown
                        icon={<File size={14} />}
                        value={selectedQuotationTemplate}
                        label="Select Quotation Template"
                        handleQuotationTemplateSelection={
                          handleQuotationTemplateSelect
                        }
                      />
                    </div>
                  )}

                  {!quotationTypeIdSearchParams && (
                    <div className="flex row-span-1 w-full gap-3">
                      <QuotationTypeDropdown
                        icon={<FileArchive size={14} />}
                        value={selectedQuotationType}
                        label="Select Quotation Type"
                        handleQuotationTypeSelection={handleQuotationTypeSelect}
                      />
                      {selectedQuotationType && (
                        <div className=" w-full">
                          {selectedQuotationType.id === 1 && (
                            <LookupLeadDropdown
                              icon={<Handshake size={14} />}
                              value={selectedLead}
                              label="Select Lead"
                              handleLeadSelection={handleLeadSelect}
                            />
                          )}
                          {selectedQuotationType.id === 2 && (
                            <LookupAccountDropdown
                              icon={<User size={14} />}
                              value={selectedAccount}
                              label="Select Account"
                              handleAccountSelection={handleAccountSelect}

                            />
                          )}
                        </div>
                      )}
                      <LookupQuotationTemplateDropdown
                        icon={<File size={14} />}
                        value={selectedQuotationTemplate}
                        label="Select Quotation Template"
                        handleQuotationTemplateSelection={
                          handleQuotationTemplateSelect
                        }
                        
                      />
                    </div>
                  )}
                </div>
                {!quotationTypeIdSearchParams && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {selectedQuotationType.id === 2 && (
                      <LookupAccountCompanyProductByProductTypeDropdown
                        icon={<User size={14} />}
                        value={selectedAccountCompanyProductType12}
                        label="Account Product"
                        accountId={selectedAccount ? selectedAccount.id : null}
                        productTypeId={[1, 2]}
                        handleAccountCompanyProductSelection={
                          handleAccountCompanyProductSelection
                        }
                        isDisabled={selectedAccount ? false : true}
                      />
                    )}

                    {selectedQuotationType.id === 2 && (
                      <LookupCompanyProductDropdown
                        icon={<LucideSubtitles size={14} />}
                        value={selectedSelectedCompanyProductType4}
                        label="AMC Type Product"
                        productTypeId={[4]}
                        handleCompanyProductSelection={
                          handleCompanyProductSelection
                        }
                        isDisabled={false}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* META */}
            <div className="bg-gray-100 border rounded py-1 px-2 mb-1">
              <div className="grid grid-cols-4 ">
                <MetaField
                  label="Quotation Number"
                  value={quotation?.quotationNumber || "[Auto-generated]"}
                />

                <MetaField
                  label="Status"
                  value={
                    <QuotationStatusChip
                      statusId={quotation?.quotationStatusId}
                    />
                  }
                />
                <div
                  className={`${isCreateMode ? "grid grid-cols-2 col-span-2" : "flex gap-4"}`}
                >
                  {disabled ? (
                    <MetaField
                      label="Quotation Date"
                      value={quotation?.quotationDate || "[Auto-generated]"}
                    />
                  ) : (
                    <div className="pr-2">
                      <FormInput
                        label="Quotation Date"
                        type="date"
                        //value={invoice?.validTillDate??""}
                        value={
                          quotation?.quotationDate
                            ? new Date(
                                quotation.quotationDate,
                              ).toLocaleDateString("en-CA")
                            : ""
                        }
                        onChange={(e: any) =>
                          setQuotation((prev) => ({
                            ...prev!,
                            quotationDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                  {disabled ? (
                    <MetaField
                      label="Valid Till"
                      value={quotation?.validTillDate}
                    />
                  ) : (
                    <FormInput
                      label="Valid Till"
                      type="date"
                      //value={quotation?.validTillDate??""}
                      value={
                        quotation?.validTillDate
                          ? new Date(
                              quotation.validTillDate,
                            ).toLocaleDateString("en-CA")
                          : ""
                      }
                      onChange={(e: any) =>
                        setQuotation((prev) => ({
                          ...prev!,
                          validTillDate: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>

                {!isCreateMode &&
                  (disabled ? (
                    <MetaField
                      label="Quotation Template"
                      value={
                        selectedQuotationTemplate
                          ? selectedQuotationTemplate.name
                          : ""
                      }
                    />
                  ) : (
                    <LookupQuotationTemplateDropdown
                      icon={<File size={14} />}
                      value={selectedQuotationTemplate}
                      label="Select Quotation Template"
                      handleQuotationTemplateSelection={
                        handleQuotationTemplateSelect
                      }
                    />
                  ))}

                <MetaField label="Created By" value={quotation?.createdBy} />
                <MetaField label="Created On" value={quotation?.createdOn} />
                <MetaField label="Updated By" value={quotation?.updatedBy} />
                <MetaField label="Updated On" value={quotation?.updatedOn} />
              </div>

              {!isCreateMode && (
                <div className="col-span-2 flex items-center justify-end ">
                  <div className="flex gap-2">
                    {showCompanyLogoPreview && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                        onClick={() => setShowCompanyLogoPreview(false)}
                      >
                        <CustomDocumentPreviewComponent
                          fileUrl={logoPreview!}
                          fileExtension={"application/pdf"}
                          fileName={quotation?.quotationNumber}
                          width={"60%"}
                          height={"85%"}
                          enableDownload={true}
                        />
                      </div>
                    )}

                    {!isCreateMode && (
                      <Button
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          if (tempItems.length <= 0) {
                            toast.error(
                              "No items available to update this quotation. \nPlease create a new quotation.",
                              {
                                style: {
                                  background: "white",
                                  color: "#991b1b",
                                  border: "1px solid #fca5a5",
                                  borderRadius: "8px",
                                  fontSize: "14px",
                                },
                                icon: "⚠️",
                              },
                            );
                            setShowConfirmationDialogeForNewQuotationCreation(
                              true,
                            );
                            return;
                          }
                          updateQuotation();
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Save size={16} />
                          <span>Update</span>
                        </div>
                      </Button>
                    )}
                    {!isCreateMode && (
                      <Button
                        disabled={disabled}
                        // onClick={submitCompanyQuotation}
                        onClick={() => {
                          if (disabled) return;
                          if (tempItems.length <= 0) {
                            toast.error(
                              "No items available to submit this quotation. \nPlease create a new quotation.",
                              {
                                style: {
                                  background: "white",
                                  color: "#991b1b",
                                  border: "1px solid #fca5a5",
                                  borderRadius: "8px",
                                  fontSize: "14px",
                                },
                                icon: "⚠️",
                              },
                            );
                            setShowConfirmationDialogeForNewQuotationCreation(
                              true,
                            );
                            return;
                          }
                          setShowConfirmationDialoge(true);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Send size={16} />
                          <span>Submit</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {/* ITEMS */}
        {itemsLoading || quotationLoading ? (
          <CompanyQuotationItemsSkeleton />
        ) : (
          <>
            {!isCreateMode && userHasAccessToViewCompanyQuotation && (
              <div className="bg-white border rounded p-1 mb-1">
                <div className="flex justify-start items-center py-1">
                  <h3 className="section-header-custom mr-3">Quotation Items</h3>
                  <SearchInput
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                    placeholder="Search product..."
                  />
                </div>
                <div className="w-full max-h-[50vh] overflow-y-auto border rounded">
                  <table className="w-full text-sm font-semibold ">
                    <thead className="sticky top-0 bg-gray-50 z-9 border">
                      <tr className="bg-gray-100 border-b">
                        <th className={tableBorder}>#</th>
                        <th className={`p-2 text-left ${tableBorder}`}>
                          Product/Service/Subscription
                        </th>
                        <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>Qty</th>
                        <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>Rate</th>
                        <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>HSN/SAC</th>
                        <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>Basic Amount</th>
                        <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>Discount(%)</th>
                        <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>Taxable Amount</th>
                        {!isInterState&&<th style={{ textAlign: itemsAlighnment }} className={tableBorder}>CGST (%)</th>}
                        {!isInterState&&<th style={{ textAlign: itemsAlighnment }} className={tableBorder}>SGST (%)</th>}
                        {isInterState&&<th style={{ textAlign: itemsAlighnment }} className={tableBorder}>IGST (%)</th>}
                        {hasCess && <th style={{ textAlign: itemsAlighnment }} className={tableBorder}>Cess (%)</th>}
                        <th
                          style={{ textAlign: itemsAlighnment,  }} className={tableBorder}
                        >
                          Total
                        </th>
                        {!disabled && (
                          <th style={{ textAlign: "center" }} className={tableBorder}>Action</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {tempItems.filter((item) =>
                        item?.company_product_name
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      ).length === 0 ? (
                        <tr>
                          <td
                            colSpan={disabled ? 12 : 13}
                            className={`text-center py-4 text-gray-500 ${tableBorder}`}
                          >
                             Items Not found
                          </td>
                        </tr>
                      ) : (
                        tempItems
                          .filter((item) =>
                            item?.company_product_name
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          )
                          .map((item, i) => {
                            return (
                              <tr
                                key={item.id}
                                className="border-t font-normal text-xs hover:bg-blue-100 text-center"
                              >
                                <td className={tableBorder}>{i + 1}</td>
                                <td className={`p-2 text-left ${tableBorder}`}>
                                  {item.company_product_name}
                                </td>
                                <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatQuantity(item.quantity)}
                                </td>
                                <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatQuantity(item.rate)}
                                </td>
                                <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>{item.hsn || item.sac}</td>
                                <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatRupee(item.basic_value)}
                                </td>
                                {editingItemId === item.id ? (
                                  <td
                                    style={{
                                      justifyContent: "end",
                                      textAlign: itemsAlighnment,
                                    }}
                                    className={tableBorder}
                                  >
                                    {formatRupee(item.discount_amount)}
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      step={"0.1"}
                                      className={`${editingItemId !== item.id ? "" : "border"} rounded p-1 ml-1 text-center w-12 min-w-12 max-w-16`}
                                      value={item.discount_percent}
                                      disabled={
                                        disabled || editingItemId !== item.id
                                      }
                                      onChange={(e) =>
                                        handleDiscountChange(
                                          item.id,
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                  </td>
                                ) : (
                                  <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                    {formatRupee(item.discount_amount)} (
                                    {item.discount_percent}%)
                                  </td>
                                )}
                                <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatRupee(item.taxable_value)}
                                </td>
                                {!isInterState&&<td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatRupee(item.cgst_amount)} (
                                  {item.cgst_percent}%)
                                </td>}
                                {!isInterState&&<td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatRupee(item.sgst_amount)} (
                                  {item.sgst_percent}%)
                                </td>}
                                {isInterState&&<td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                  {formatRupee(item.igst_amount)} (
                                  {item.igst_percent}%)
                                </td>}
                                {hasCess && (
                                  <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                    {formatRupee(item.cess_amount)} (
                                    {item.cess_percent}%)
                                  </td>
                                )}
                                <td
                                  style={{
                                    textAlign: itemsAlighnment,
                                  }}
                                  className={tableBorder}
                                >
                                  {formatRupee(item.total_amount)}
                                </td>

                                {!disabled && (
                                  <td style={{ textAlign: itemsAlighnment }} className={tableBorder}>
                                    <div className="flex gap-2 justify-end">
                                      {editingItemId !== item.id ? (
                                        <button
                                          disabled={disabled}
                                          onClick={() => handleDeleteItem(item)}
                                        >
                                          <Trash
                                            className="text-red-500"
                                            size={16}
                                          />
                                        </button>
                                      ) : null}
                                      {editingItemId === item.id ? (
                                        <div className="flex gap-1 justify-center">
                                          <button
                                            className="text-green-600 text-xs border px-2 rounded hover:bg-blue-500 hover:text-white"
                                            onClick={() => saveSingleItem(item)}
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="text-gray-500 text-xs border px-2 rounded hover:bg-blue-500 hover:text-white"
                                            onClick={cancelEdit}
                                          >
                                            {/* Cancel */}
                                            <X
                                              className="text-gray-600"
                                              size={14}
                                            />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          disabled={disabled}
                                          onClick={() => {
                                            if (disabled) {
                                              return;
                                            }
                                            setEditingItemId(item.id);
                                          }}
                                          className="text-blue-600 text-xs px-2 "
                                        >
                                          {/* Edit */}
                                          <Pencil
                                            className="text-blue-600"
                                            size={14}
                                          />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="w-full items-center justify-center  flex-1">
                  <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1 mt-0.5  bg-blue-100">
                    You can modify quotation items while it's in draft state.
                  </span>
                </div>
              </div>
            )}
            {isCreateMode && (
              <div className="w-full items-center justify-center  flex-1">
                <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1  bg-blue-100">
                  {selectedQuotationType.id == 1
                    ? "Once a quotation is created, all items associated with the selected customer are automatically included."
                    : `After a quotation is created, you can update its items and related details.`}
                </span>
              </div>
            )}
            {isCreateMode && (
              <div className="flex w-full justify-end items-end mt-3 mb-3">
                <div>
                  <Button onClick={handleCreateQuotation}>
                    <div className="flex items-center gap-1">
                      <Save size={16} />
                      <span>{isSubmitting ? "Saving..." : "Save"}</span>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {/* BOTTOM */}
            {/** Summery Block */}
            {!isCreateMode && (
              <div className="grid grid-cols-2 text-sm mb-2">
                <div></div>

                <div className="border rounded-lg p-2 bg-white mt-2 space-y-2">
                  <span className="font-medium text-gray-700 text-sm">
                    Quotation Summary
                  </span>

                  <div className="border rounded-lg p-2 bg-white mt-2 space-y-2">
                    {/* Basic + Discount */}
                    <div className="flex justify-between">
                      <span>A. Basic Amount</span>
                      <span>{formatRupee(summary.basic)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>B. Total Discount</span>
                      <span>{formatRupee(summary.discount)}</span>
                    </div>

                    {/* Taxable */}
                    <div className="flex justify-between text-gray-600 border-t pt-2">
                      <div className="flex">
                        <span className="text-black">C</span>{" "}
                        <span>. Taxable Amount (A-B)</span>
                      </div>
                      <span>{formatRupee(summary.taxable)}</span>
                    </div>

                    {/* Tax + Cess in one row */}
                    <div className="flex justify-between text-gray-600">
                      <div className="flex">
                        <span className="text-black">D</span>
                        <span>
                          . Total Tax ({summary.igst ? "IGST" : "CGST + SGST"}{" "}
                          {summary.cess ? "+ Cess" : ""})
                        </span>
                      </div>
                      <span>{formatRupee(summary.tax)}</span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>E. Total Amount (C+D)</span>
                      <span>₹{formatRupee(summary.total)}</span>
                    </div>

                    {/* Round Off Compact */}
                    <div className="flex items-center justify-between bg-gray-50 border rounded px-2 py-2 text-xs">
                      {/* Left */}
                      <div className="flex flex-col ">
                        <span className="flex gap-3 justify-start items-center table-header-custom-blue ">
                          F. Round Off{" "}
                          <span className="caption-custom">
                            Adjust the amount to make the quotation total
                            rounded.
                          </span>
                        </span>
                        {!roundOffValues.isRounded && (
                          <span className="caption-custom mt-1">
                            <span className="flex">
                              {" "}
                              <LucideLightbulb size={14} />
                              Suggested: {roundOffValues.roundOff} to make{" "}
                              {roundOffValues.roundedTotal}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-1">
                        <div className="w-16">
                          <FormInput
                            disabled={disabled}
                            type="number"
                            min={-1}
                            max={1}
                            step={"0.1"}
                            // className="border rounded px-1 py-0.5 w-10 text-right text-xs"
                            value={quotation?.adjustmentForRoundOff}
                            onChange={(e: any) => {
                              let value = Number(e.target.value);

                              // clamp value between -1 and 1
                              if (value > 1) value = 1;
                              if (value < -1) value = -1;

                              setQuotation((prev) => ({
                                ...prev!,
                                adjustmentForRoundOff: value,
                              }));
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            disabled={disabled}
                            onClick={updateQuotation}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs 
               text-blue-600 border border-blue-200 bg-blue-50 
               hover:bg-blue-100 disabled:opacity-50"
                          >
                            <Check size={14} />
                            Apply
                          </button>

                          <button
                            disabled={disabled}
                            onClick={handleResetRoundOff}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs 
               text-gray-600 border border-gray-200 bg-gray-50 
               hover:bg-gray-100 disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Final Total */}
                    <div className="flex justify-between items-center border-t pt-2">
                      <div className="text-xs text-gray-500 leading-tight">
                        <p className="text-blue-600 font-medium text-sm">
                          Total Quotation Amount (E+F)
                        </p>
                        <p className="flex gap-2 ml-3 caption-custom">
                          <span className="caption-custom text-black">
                            <p> Amount In Words: </p>
                          </span>
                          {amountToWords(
                            summary.total +
                              (quotation?.adjustmentForRoundOff || 0),
                          )}
                        </p>
                      </div>

                      <span className="text-lg font-bold text-blue-600">
                        ₹
                        {formatRupee(
                          summary.total +
                            (quotation?.adjustmentForRoundOff || 0),
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-1 bg-gray-50 border rounded px-3 py-0.5 caption-custom">
                    <span>
                      <LucideSubtitles size={16} />
                    </span>
                    Round off amount will be shown separately in the printed
                    quotation.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <ConfirmationDialog
          title="Confirm Submission of Quotation"
          description="Once submitted, this quotation cannot be edited."
          message="After submission, this quotation will be locked and no further changes or edits will be allowed. Please review all details carefully before submitting."
          open={showConfirmationDialoge}
          onConfirm={() => {
            submitCompanyQuotation();
          }}
          onCancel={() => setShowConfirmationDialoge(false)}
        />
        <ConfirmationDialog
          title="Quotation Deleted"
          description="This quotation has been automatically deleted."
          message={`Since the last item was removed, this ${quotation?.quotationTypeName ? quotation?.quotationTypeName.toLowerCase() + " quotation" : "quotation"} is no longer valid. \nPlease create a new one to proceed.`}
          open={showConfirmationDialogeForNewQuotationCreation}
          onConfirm={() => {
            navigate(-1);
          }}
          confirmButtonText="OK"
          showCancelButton={false}
          onCancel={() =>
            setShowConfirmationDialogeForNewQuotationCreation(false)
          }
        />
      </div>
    </PageLayout>
  );
}

export default CompanyQuotationDetails;
