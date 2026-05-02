/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronRight,
  Download,
  File,
  FileArchive,
  Handshake,
  LucideSubtitles,
  Pencil,
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
import { formatRupee } from "../../../utils/helperMethods/formatFunctions";
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
import QuotationStatusChip from "../../ui/QuotationStatusChip";
import { LookupQuotationTemplateDropdown } from "../lookups/company-quotation/LookupQuotationTemplateDropdown";
import { QuotationTypeDropdown } from "../lookups/company-quotation/QuotationTypeDropdown";
import { LookupAccountCompanyProductByProductTypeDropdown } from "../lookups/lookup-account/LookupAccountCompanyProductByProductTypeDropdown";
import { LookupCompanyProductDropdown } from "../lookups/lookup-company-product/LookupCompanyProductDropdown";
import { LookupLeadDropdown } from "../lookups/lookup-lead/LookupLeadDropdown";
import { CompanyQuotationHeaderSkeleton, CompanyQuotationItemsSkeleton } from "./CompanyQuotationDetailsSkeleton";

function CompanyQuotationDetails() {
  const { quotationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  useEffect(()=>{
    if(searchParams.has("account_company_product")){
        const accountCompanyProduct = JSON.parse(searchParams.get("account_company_product")??"{}")
        setSelectedAccountCompanyProductType12(accountCompanyProduct);
    }
  },[searchParams])

  const getCompanyQuotations = async (signal: AbortSignal) => {
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

        if (!item) return;

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
        setQuotation(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setQuotationLoading(false);
    }
  };
  console.log(disabled);

  const getCompanyQuotationItems = async (signal: AbortSignal) => {
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
        setRefreshCount((prev)=>prev+1);
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
    // if (!userHasAccessToUpdateCompanyQuotation) return;
    const postData = {
      id: quotation.id,
      company_id: loginStatus.companyId,
      quotation_template_id: selectedQuotationTemplate.id,
      quotation_date_string: quotation.quotationDate,
      valid_till_date_string: quotation.validTillDate,
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
        setRefreshCount((prev) => prev + 1)
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
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
        type: "application/pdf", // fixed for invoice
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);

      // ✅ Same as your task document logic
      setLogoPreview(fileUrl); // you can rename this later (e.g. setInvoicePreview)
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
      acc.cess += item.cess_amount || 0;
      return acc;
    },
    { basic: 0, discount: 0, taxable: 0, tax: 0, total: 0, cess: 0 },
  );

  const hasCess = tempItems.some(
    (i) => i.cess_amount != null && i.cess_amount > 0,
  );
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


    if (selectedQuotationType.id === 1 && (!userHasAccessToAddLeadQuotation)) {
      toast.error(MESSAGE.MODULE_ACCESS.LEAD_QUOTATION.DENIED_ADD_ACCESS);
      return;
    }
    if (selectedQuotationType.id === 2 && (!userHasAccessToAddAccountQuotation)) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_QUOTATION.DENIED_ADD_ACCESS);
      return;
    }
    if (selectedQuotationType.id === 1) {
      if (!selectedLead) {
        toast.error("Please select an lead");
        return;
      }
    }
    if (selectedQuotationType.id === 2) {
      if (!selectedAccount) {
        toast.error("Please select an account");
        return;
      }
      if(!selectedAccountCompanyProductType12){
        toast.error("Please select an account product");
        return;
      }
      if(!selectedSelectedCompanyProductType4){
        toast.error("Please select AMC type product");
        return;
      }
    }


    if (!selectedQuotationTemplate) {
      toast.error("Please select an quotation template");
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
        : selectedQuotationType.id === 2?{
            company_id: loginStatus.companyId,
            account_company_product_id: selectedAccountCompanyProductType12.id,
            company_product_id: selectedSelectedCompanyProductType4.id,
            quotation_template_id: selectedQuotationTemplate.id,
            quotation_date_string: quotation?.quotationDate,
            valid_till_date_string: quotation?.validTillDate,
            createdby_id: loginStatus.id,
          }:{
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

  //   const handleAddToInvoice = async () => {
  //     const postData = {
  //       company_id: loginStatus.companyId,
  //       account_id: invoice?.accountId,
  //       createdby_id: loginStatus.id,
  //     };
  //     console.log(postData);
  //     setIsSubmitting(true);
  //     try {
  //       const res = await axiosClient.post(
  //         POST_API.CREATE_COMPANY_INVOICE_ITEM,
  //         postData,
  //         {
  //           withCredentials: true,
  //         },
  //       );

  //       if (res.data.status) {
  //         toast.success(res.data.message);
  //         setRefreshCount((prev) => prev + 1);
  //       } else {
  //         toast.error(res.data.message);
  //       }
  //     } catch (error) {
  //       handleApiError(error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

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

    useEffect(()=>{
    if(quotationTypeIdSearchParams && quotationTypeIdSearchParams !== "0"){
        setSelectedQuotationType({id:Number(quotationTypeIdSearchParams), name: quotationTypeIdSearchParams === "1"?"Lead":"AMC" })
    }
  },[quotationTypeIdSearchParams]);

  return (
    <PageLayout onScrollChange={setShowAccountName} scrollTopValue={80}>
      <div className="p-1 font-roboto">
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* HEADER */}

        {quotationLoading ? (
          <CompanyQuotationHeaderSkeleton />
        ) : (
          <>
            <div className=" sticky top-0 z-10 bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 ">
              {/* <Link to={ROUTES_URL.QUOTATION_MANAGEMENT}> */}
              <Button
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
                  <span>{`${Number(quotationTypeIdSearchParams) === 1 ? "Lead:" : Number(quotationTypeIdSearchParams) === 2 ? "AMC:" : "Other:"}`}</span>{" "}
                  <span className="table-data-custom">{`  ${otherIdSearchParams},  `}</span>
                  <span>Quotation:</span>{" "}
                  <span className="table-data-custom">{`  ${quotation?.quotationNumber}`}</span>
                  )
                </span>
              )}
            </div>
            <div className="flex justify-between items-center my-2">
              <div>
                <h1 className="table-header-custom">
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
                <div className="flex gap-x-2">
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
                      <span className="text-gray-700">Download</span>
                      <Download size={14} className="text-blue-500" />
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
                      <span className="">Preview</span>
                      <FaFilePdf size={14} className="text-red-500" />
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
                {!quotationTypeIdSearchParams && <div className="grid grid-cols-3 gap-3 mb-3">
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
                </div>}
                
              </div>
            )}

            {/* META */}
            <div className="bg-gray-100 border rounded py-1 px-2 mb-2">
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
                <div className="col-span-2 flex items-center justify-end p-1">
                  <div className="flex gap-2">
                    {showCompanyLogoPreview && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                        onClick={() => setShowCompanyLogoPreview(false)}
                      >
                        <CustomDocumentPreviewComponent
                          fileUrl={logoPreview!}
                          fileExtension={"application/pdf"}
                          width={"60%"}
                          height={"85%"}
                          enableDownload={true}
                        />
                      </div>
                    )}

                    {!isCreateMode && (
                      <Button
                        disabled={
                          disabled
                        }
                        onClick={updateQuotation}
                      >
                        Update
                      </Button>
                    )}
                    {!isCreateMode && (
                      <Button
                        disabled={
                          disabled
                        }
                        onClick={submitCompanyQuotation}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              )}

              
            </div>
          </>
        )}
        {/* ITEMS */}
        {itemsLoading ? (
          <CompanyQuotationItemsSkeleton />
        ) : (
          <>
            {!isCreateMode && userHasAccessToViewCompanyQuotation && (
              <div className="bg-white border rounded p-2 mb-1">
                <div className="flex justify-between py-1">
                  <h3 className="font-semibold">Quotation Items</h3>
                  <SearchInput
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                    placeholder="Search product..."
                  />
                  
                </div>
                <div className="w-full overflow-y-auto border rounded">
                  <table className="w-full text-sm font-semibold ">
                    <thead className="sticky top-0 bg-gray-50 z-10 border">
                      <tr className="bg-gray-100 border-b">
                        <th>#</th>
                        <th className="p-2 text-left">
                          Product/Service/Subscription
                        </th>
                        <th>Qty</th>
                        <th style={{ textAlign: "right" }}>Price</th>
                        <th>HSN/SAC</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                        <th>Discount(%)</th>
                        <th style={{ textAlign: "right" }}>Taxable Value</th>
                        <th style={{ textAlign: "right" }}>CGST (%)</th>
                        <th style={{ textAlign: "right" }}>SGST (%)</th>
                        <th style={{ textAlign: "right" }}>IGST (%)</th>
                        {hasCess && <th>Cess (%)</th>}
                        <th
                          style={{ textAlign: "right", paddingRight: "10px" }}
                        >
                          Total Item Amount
                        </th>
                        {!disabled && (
                          <th style={{ textAlign: "center" }}>Action</th>
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
                            className="text-center py-4 text-gray-500"
                          >
                            No rows found
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
                                <td>{i + 1}</td>
                                <td className="p-2 text-left">
                                  {item.company_product_name}
                                </td>
                                <td>{item.quantity}</td>
                                <td style={{ textAlign: "right" }}>
                                  {item.rate}
                                </td>
                                <td>{item.hsn || item.sac}</td>
                                <td style={{ textAlign: "right" }}>
                                  {item.basic_value}
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className={`${editingItemId !== item.id ? "" : "border"} rounded p-1 text-center w-16`}
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
                                <td style={{ textAlign: "right" }}>
                                  {item.taxable_value}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {item.cgst_amount} ({item.cgst_percent}%)
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {item.sgst_amount} ({item.sgst_percent}%)
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {item.igst_amount} ({item.igst_percent}%)
                                </td>
                                {hasCess && (
                                  <td>
                                    {item.cess_amount} ({item.cess_percent}%)
                                  </td>
                                )}
                                <td
                                  style={{
                                    textAlign: "right",
                                    paddingRight: "10px",
                                  }}
                                >
                                  {item.total_amount}
                                </td>

                                {!disabled && (
                                  <td style={{ textAlign: "right" }}>
                                    <div className="flex gap-2 justify-end">
                                      {editingItemId !== item.id ? (
                                        <button
                                          disabled={
                                            disabled
                                          }
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
                                          disabled={
                                            disabled
                                          }
                                          onClick={() => {
                                            if (
                                              disabled
                                            ) {
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
                  <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1  bg-blue-100">
                    You can modify quotation items while it's in draft state.
                  </span>
                </div>
              </div>
            )}
            {isCreateMode && <div className="flex w-full justify-end items-end mb-3">
                    <div>
                    <Button onClick={handleCreateQuotation}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    </div>
                  </div>}
            {isCreateMode && (
              <div className="w-full items-center justify-center  flex-1">
                <span className="text-xs flex items-center justify-center font-medium text-gray-500 border rounded-lg px-2 py-1  bg-blue-100">
                  {(selectedQuotationType.id==1)?'Once an quotation is created, all items assigned to that customer are automatically added to the quotation.':`Once an quotation is created, you can modify the items and related data.`}
                </span>
              </div>
            )}
            {/* BOTTOM */}
            {!isCreateMode && (
              <div className="grid grid-cols-2 text-sm mb-2">
                {/* Left */}
                <div className="space-y-2"></div>
                <div>
                  <span className="font-medium text-gray-700 text-sm ">
                    Summary
                  </span>
                  {/* Right Summary */}
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Amount</span>
                      <span>{formatRupee(summary.basic)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Total Discount</span>
                      <span>{formatRupee(summary.discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>{formatRupee(summary.taxable)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Total Cess</span>
                      <span>{formatRupee(summary.cess)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tax</span>
                      <span>{formatRupee(summary.tax)}</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between text-base font-semibold text-blue-600">
                      <span>Total Quotation Amount</span>
                      <span>{formatRupee(summary.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default CompanyQuotationDetails;
