/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronRight,
  Edit3,
  HeadsetIcon,
  History,
  Hourglass,
  Layers,
  ListTree,
  LucideText,
  ShoppingBag,
  StickyNote,
  TrendingUp,
  User,
  UserCheck2Icon,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useUserPreference } from "../../../context/user/UserPreference";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useSupportTicketLifecycle } from "../../../config/hooks/useSupportTicketLifecycle";
import { useEffect, useRef, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../constants/Messages";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import axiosClient from "../../../axios-client/AxiosClient";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import SupportTicketHistoryView from "./SupportTicketHistoryView";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import CustomDropdown from "../leads/CustomDropdown";
import { useCompanyProductSla } from "../../../config/hooks/useGetCompanyProductSla";
import {
  SupportTicketLIfecycleChangeModal,
  supportTicketLifecycleType,
} from "./SupportTicketLifecycleChangeModal";
import TextAreaInput from "../../ui/TextAreaInput";
import { useSupportTicketEscalationLevel } from "../../../config/hooks/useSupportTicketEscalationLevel";
import { useSupportTicketCategory } from "../../../config/hooks/useSupportTicketCategory";
import ROUTES_URL from "../../../constants/Routes";
import Button from "../../ui/Button";
import SupportTicketTasksModal from "./SupportTicketTasksModal";
import RefreshToken from "../../../config/validations/RefreshToken";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useSupportTicketSource } from "../../../config/hooks/useSupportTicketSource";

const ViewSupportTicketManagement = () => {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();

  const [searchParams] = useSearchParams();
  const { userHasAccessToUpdateSupportTicket } = useUserAccessModules();

  const [selectedSupportTicket, setSelectedSupportTicket] = useState(
    JSON.parse(searchParams.get("supportTicketData") || "{}")
  );

  const [formData, setFormData] = useState({
    queryDescription: selectedSupportTicket.queryDescription,
    publicNotes: selectedSupportTicket.publicNotes,
    resolutionApplied: selectedSupportTicket.resolutionApplied,
  });

  useEffect(() => {
    setFormData({
      queryDescription: selectedSupportTicket.queryDescription,
      publicNotes: selectedSupportTicket.publicNotes,
      resolutionApplied: selectedSupportTicket.resolutionApplied,
    });
  }, [selectedSupportTicket]);

  const [selectedAssignTo, setSelectedAssignTo] = useState<CompanyUser>({
    company_id: 0,
    email: "",
    fullname: selectedSupportTicket.assignedToName,
    mobilenumber: "",
    generate_password: "",
    createdby: "",
    id: selectedSupportTicket.assignedTo,
    isactive: false,
    requestedby: "",
  });

  const [selectedResolvedBy, setSelectedResolvedBy] = useState<CompanyUser>({
    company_id: 0,
    email: "",
    fullname: selectedSupportTicket.resolvedByName,
    mobilenumber: "",
    generate_password: "",
    createdby: "",
    id: selectedSupportTicket.resolvedBy,
    isactive: false,
    requestedby: "",
  });

  const [selectedSupportTicketCategory, setSelectedSupportTicketCategor] =
    useState({
      id: selectedSupportTicket.supportTicketCategoryId,
      name: "",
    });

  const [selectedCompanyProductSla, setSelectedCompanyProductSla] = useState({
    id: selectedSupportTicket.companyProductSlaId,
    name: "",
  });

  const [selectedSupportTicketSource, setSelectedSupportTicketSource] =
    useState({
      id: selectedSupportTicket.supportTicketSourceId,
      name: "",
    });

  const [
    selectedSupportTicketEscalationId,
    setSelectedSupportTicketEscalationId,
  ] = useState<number | undefined>();
  const [
    selectedSupportTicketLifecycleId,
    setSelectedSupportTicketLifecycleId,
  ] = useState<number | undefined>(undefined);
  const [
    selectedSupportTicketLifecycleName,
    setSelectedSupportTicketLifecycleName,
  ] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const {
    supportTicketLifecycle,
    isLoading: isLoadingForSupportTicketLifecycle,
  } = useSupportTicketLifecycle();

  const {
    companyProductSla,
    loading: isLoadingForCompanyProductSla,
    // refetch: refetchCompanyProductSla,
  } = useCompanyProductSla(selectedSupportTicket.companyProductId);

  const {
    supportTicketCategory,
    isLoading: isLoadingForSupportTicketCategory,
  } = useSupportTicketCategory();

  const {
    supportTickeEscalationLevel,
    isLoading: isLoadingForSupportTicketEscalationLevel,
  } = useSupportTicketEscalationLevel();

  const { supportTicketSource, isLoading: isLoadingForSupportTicketSource } =
    useSupportTicketSource();

  const [isOpenLeadStatusHistory, setIsOpenLeadStatusHistory] =
    useState<boolean>(false);

  const [isLoadingForLifecycleChanging, setIsLoadingForLifecycleChanging] =
    useState<boolean>(false);

  const handleSaveSupportTicketLifecycleUpdate = async (
    lifecycleFormData: supportTicketLifecycleType
  ) => {
    setIsLoadingForLifecycleChanging(true);
    // console.log(lifecycleFormData);
    if (!selectedSupportTicket || selectedSupportTicketLifecycleId === null)
      return;

    const postDataForSupportLifecycleUpdate = {
      company_id: loginStatus.companyId,
      id: selectedSupportTicket.id,
      company_product_sla_id: selectedCompanyProductSla.id,
      support_ticket_lifecycle_id: selectedSupportTicketLifecycleId,
      query_description: lifecycleFormData.queryDescription,
      public_notes: lifecycleFormData.publicNotes,
      resolution_applied: lifecycleFormData.resolutionApplied,
      resolvedby:
        selectedSupportTicketLifecycleId! >= 4
          ? lifecycleFormData.resolvedBy.id
          : null,
      updatedby_id: loginStatus.id,
      selectedSupportTicketEscalationId: selectedSupportTicketEscalationId,
    };

    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_SUPPORT_TICKET,
        postDataForSupportLifecycleUpdate,
        { withCredentials: true }
      );
      if (response?.status == STATUS_CODE.OK) {
        if (response.data.status) {
          const updatedStatusName = supportTicketLifecycle?.find(
            (item) => item.id === selectedSupportTicketLifecycleId
          )?.name;

          const updatedSupportTicketLifecycle = {
            supportTicketLifecycleId: selectedSupportTicketLifecycleId,
            supportTicketLifecycleName: updatedStatusName,
            queryDescription:
              lifecycleFormData.queryDescription.trim() === ""
                ? selectedSupportTicket.queryDescription
                : lifecycleFormData.queryDescription,
            resolutionApplied:
              lifecycleFormData.resolutionApplied.trim() === ""
                ? selectedSupportTicket.resolutionApplied
                : lifecycleFormData.resolutionApplied,
            publicNotes:
              lifecycleFormData.publicNotes.trim() === ""
                ? selectedSupportTicket.publicNotes
                : lifecycleFormData.publicNotes,
            resolvedBy:
              selectedSupportTicketLifecycleId! >= 4
                ? lifecycleFormData.resolvedBy.id
                : null,
            resolvedByName:
              selectedSupportTicketLifecycleId! >= 4
                ? lifecycleFormData.resolvedBy.fullname
                : null,
          };

          setSelectedSupportTicket((prev: any) => ({
            ...prev,
            ...updatedSupportTicketLifecycle,
          }));

          //updating the url params
          const searchParams = new URLSearchParams(location.search);

          const existingData = searchParams.get("supportTicketData");

          const updatedQueryData = {
            ...(existingData ? JSON.parse(existingData) : {}),
            ...updatedSupportTicketLifecycle,
          };

          searchParams.set(
            "supportTicketData",
            JSON.stringify(updatedQueryData)
          );
          setSelectedSupportTicketLifecycleId(undefined);
          setSelectedSupportTicketLifecycleName(undefined);

          navigate(`${location.pathname}?${searchParams.toString()}`, {
            replace: true,
          });

          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.error(error.response?.data);
      }
    } finally {
      setIsLoadingForLifecycleChanging(false);
    }
  };

  // const handleClickLeadOwnerChange = () => {
  //   // setIsLeadOwnerPopUpOpen(true);
  // };
  function handleFormDataChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      return { ...prev, [name]: value };
    });
    // setSelectedSupportTicket((prev: any) => {
    //   return { ...prev, [name]: value };
    // });
  }

  const handSupportTicketInfoSave = async () => {
    if (
      selectedSupportTicketCategory?.id ===
        selectedSupportTicket.supportTicketCategoryId &&
      selectedCompanyProductSla.id ===
        selectedSupportTicket.companyProductSlaId &&
      selectedAssignTo.id === selectedSupportTicket.assignedTo &&
      selectedSupportTicketSource.id ===
        selectedSupportTicket.supportTicketSourceId &&
      formData.queryDescription.trim() ===
        selectedSupportTicket.queryDescription.trim() &&
      formData.publicNotes.trim() ===
        selectedSupportTicket.publicNotes.trim() &&
      formData.resolutionApplied.trim() ===
        selectedSupportTicket.resolutionApplied.trim() &&
      selectedResolvedBy.id === selectedSupportTicket.resolvedBy
    )
      return;

    const PostDataForSupportTicketUpdate = {
      company_id: loginStatus.companyId,
      id: selectedSupportTicket.id,
      support_ticket_category_id:
        selectedSupportTicketCategory?.id !== 0
          ? selectedSupportTicketCategory?.id
          : selectedSupportTicket.supportTicketCategoryId,
      company_product_sla_id:
        selectedCompanyProductSla.id !== 0
          ? selectedCompanyProductSla.id
          : selectedSupportTicket.companyProductSlaId,
      support_ticket_source_id:
        selectedSupportTicketSource.id ||
        selectedSupportTicket.supportTicketSourceId,
      query_description: formData.queryDescription,
      public_notes: formData.publicNotes,
      resolution_applied: formData.resolutionApplied,
      assignedto:
        selectedAssignTo.id !== 0
          ? selectedAssignTo.id
          : selectedSupportTicket.assignTo,
      resolvedby: selectedResolvedBy.id,
      updatedby_id: loginStatus.id,
    };
    console.log(PostDataForSupportTicketUpdate);

    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_SUPPORT_TICKET,
        PostDataForSupportTicketUpdate,
        { withCredentials: true }
      );
      if (response.data.status) {
        //updating the local state
        const updatedSupportTicket = {
          assignedTo: selectedAssignTo.id,
          assignedToName: selectedAssignTo.fullname,
          supportTicketCategoryId: selectedSupportTicketCategory?.id,
          supportTicketCategoryName: selectedSupportTicketCategory?.name,
          companyProductSlaId: selectedCompanyProductSla?.id,
          companyProductSlaName: selectedCompanyProductSla?.name,
          supportTicketSourceId: selectedSupportTicketSource?.id,
          supportTicketSourceName: selectedSupportTicketSource?.name,
          queryDescription: formData.queryDescription,
          publicNotes: formData.publicNotes,
          resolutionApplied: formData.resolutionApplied,
          resolvedBy: selectedResolvedBy.id,
          resolvedByName: selectedResolvedBy.fullname,
        };
        setSelectedSupportTicket((prev: any) => ({
          ...prev,
          ...updatedSupportTicket,
        }));

        //updating the url params
        const searchParams = new URLSearchParams(location.search);

        const existingData = searchParams.get("supportTicketData");

        const updatedQueryData = {
          ...(existingData ? JSON.parse(existingData) : {}),
          ...updatedSupportTicket,
        };

        searchParams.set("supportTicketData", JSON.stringify(updatedQueryData));

        navigate(`${location.pathname}?${searchParams.toString()}`, {
          replace: true,
        });

        toast.success(response.data.message);
      } else if (response.data.status === false) {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handSupportTicketInfoSave,
        });
        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          handSupportTicketInfoSave();
        }
      } else if (error.status === 400) {
        toast.error(error.response.data);
      }
    }
  };

  useEffect(() => {
    if (
      (selectedCompanyProductSla.id !== 0 &&
        selectedCompanyProductSla.id !==
          selectedSupportTicket.companyProductSlaId) ||
      (selectedSupportTicketCategory.id !== 0 &&
        selectedSupportTicketCategory.id !==
          selectedSupportTicket.supportTicketCategoryId) ||
      (selectedAssignTo.id !== 0 &&
        selectedAssignTo.id !== selectedSupportTicket.assignedTo) ||
      (selectedSupportTicketSource.id !== 0 &&
        selectedSupportTicketSource.id !==
          selectedSupportTicket.supportTicketSourceId) ||
      (selectedResolvedBy.id !== 0 &&
        selectedResolvedBy.id !== selectedSupportTicket.resolvedBy)
    ) {
      handSupportTicketInfoSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCompanyProductSla.id,
    selectedSupportTicketCategory.id,
    selectedAssignTo.id,
    selectedSupportTicketSource.id,
    selectedResolvedBy.id,
  ]);

  return (
    <div
      className={`fixed top-8 inset-0 z-10 bg-white ${
        userPreference.isLeftMenu ? "ml-[54px] mt-4" : " mt-6"
      } overflow-auto`}
    >
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex mt-1 bg-slate-100 mx-2 p-0.5 rounded  items-center justify-between     ">
          <div className="flex w-fit gap-6">
            {/* <button
              className="flex items-center gap-1 caption-custom justify-center hover:text-blue-600 "
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft size={14} />
              <span>back</span>
            </button> */}
            <Link to={ROUTES_URL.SUPPORT_TICKET_MANAGEMENT}>
              <Button className="flex caption-custom items-center justify-center hover:text-gray-800">
                <span>Support</span>
              </Button>
            </Link>
            <ChevronRight size={16} />
            <h1 className="table-header-custom">Support Ticket Details</h1>
          </div>
          {/* <div>abc</div> */}
        </div>
        {/*Support Ticket Lifecycle*/}
        {!isLoadingForSupportTicketLifecycle ? (
          <div className="mx-2 mt-2  flex  bg-slate-100  shadow rounded-sm">
            <div className="flex w-full">
              <div
                className="flex w-[100%] border bg-white"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
                }}
              >
                {supportTicketLifecycle!.map((item: any) => (
                  <button
                    title={item.name}
                    key={item.id}
                    className={`flex-1 overflow-hidden ${
                      selectedSupportTicket.supportTicketLifecycleName ===
                      item.name
                        ? "bg-blue-700 table-header-custom-white hover:bg-blue-500 hover:text-white"
                        : "hover:bg-blue-700 table-header-custom hover:text-white"
                    }
              ${
                selectedSupportTicketLifecycleId === item.id &&
                "bg-sky-400 hover:bg-sky-500 table-header-custom-white"
              } text-center p-1`}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
                    }}
                    onClick={async () => {
                      if (userHasAccessToUpdateSupportTicket) {
                        if (
                          selectedSupportTicket.supportTicketLifecycleId !==
                          item.id
                        ) {
                          setSelectedSupportTicketLifecycleId(item.id);
                          setSelectedSupportTicketLifecycleName(item.name);
                        }
                        /////////////////////////////////////////////////////////////////////////////////////
                      } else {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                            .UPDATE_ACCESS_DENIED_MESSAGE
                        );
                      }
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              {/* status history */}
              <div className="flex justify-end caption-custom  mb-1 px-2">
                {/* <span className="font-semibold ">Lead Status</span> */}
                <button
                  onClick={() => {
                    setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
                  }}
                >
                  <span
                    title="Status history"
                    className="flex items-center justify-center hover:text-blue-600 "
                  >
                    <History size={12} className="mt-0" />
                    History
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-2 mt-2 flex bg-slate-100 shadow rounded-sm animate-pulse">
            <div className="flex w-full">
              {/* Skeleton for lifecycle buttons */}
              <div
                className="flex w-[100%] border bg-white"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
                }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className="flex-1 p-1 mx-1 bg-slate-200 rounded"
                    style={{
                      height: "28px",
                      clipPath:
                        "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
                    }}
                  ></div>
                ))}
              </div>

              {/* Skeleton for History button */}
              <div className="flex justify-end caption-custom mb-1 px-2 items-center">
                <div className="w-14 h-4 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {/**Sections */}
        <div className="w-full flex flex-col gap-1 p-2">
          {/** Section 1 */}
          {/* SUPPORT TICKET DETAILS */}
          <div className="w-full flex flex-col gap-4 p-1">
            {/* ===== ACCOUNT + PRODUCT IN SINGLE CARD ===== */}
            <div className="p-2 bg-white shadow rounded-lg border  flex flex-col gap-4">
              <div className="flex col-span-1 md:con-span-2 gap-6 justify-between ">
                <div className="flex gap-6">
                  {/* Account */}
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded text-white">
                      <HeadsetIcon size={30} strokeWidth={3} />
                    </div>
                    <Detail
                      label="Account"
                      hasBorder={false}
                      type="none"
                      value={selectedSupportTicket?.accountName}
                    />
                  </div>

                  {/* Support Product */}
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded text-white">
                      <ShoppingBag size={30} strokeWidth={3} />
                    </div>
                    <Detail
                      label="Support Product"
                      hasBorder={false}
                      type="none"
                      value={selectedSupportTicket?.companyProductName}
                    />
                  </div>
                </div>
                <Detail
                  type="none"
                  label={
                    selectedSupportTicket?.resolvedByName !== "NA" &&
                    selectedSupportTicket?.resolvedByName
                      ? "Resolved By"
                      : "Resolved Status"
                  }
                  value={
                    selectedSupportTicket?.resolvedByName || "Not Resolved"
                  }
                />
              </div>
            </div>

            {/* ===== MAIN TWO-COLUMN LAYOUT ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LEFT SIDE FORM */}
              <div className="flex flex-col gap-4">
                {/* 4 DROPDOWNS GRID */}
                <div className="p-1 bg-white shadow rounded-lg border grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Assign To */}
                  <CompanyUserSearchFieldInput
                    logo={User}
                    label="Assign To"
                    // placeholder={selectedSupportTicket.assignedToName}
                    defaultValue={selectedSupportTicket.assignedToName}
                    isDisabled={!userHasAccessToUpdateSupportTicket}
                    disabledMessage={
                      MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                        .UPDATE_ACCESS_DENIED_MESSAGE
                    }
                    onUserSelected={(user) => {
                      if (user && user.id !== 0) {
                        setSelectedAssignTo(user);
                        // handSupportTicketInfoSave();
                      }
                      if (user === null || user === undefined) {
                        setSelectedAssignTo({
                          company_id: 0,
                          email: "",
                          fullname: selectedSupportTicket.assignedToName,
                          mobilenumber: "",
                          generate_password: "",
                          createdby: "",
                          id: selectedSupportTicket.assignedTo,
                          isactive: false,
                          requestedby: "",
                        });
                      }
                    }}
                  />

                  {/* Ticket Category */}
                  {isLoadingForSupportTicketCategory ? (
                    <div className="flex flex-col gap-2 animate-pulse w-full">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  ) : (
                    <CustomDropdown
                      logo={ListTree}
                      labelName="Ticket Category"
                      options={supportTicketCategory}
                      preselectedOption={
                        selectedSupportTicket?.supportTicketCategoryId
                      }
                      onSelect={(value) => {
                        if (userHasAccessToUpdateSupportTicket) {
                          const result = supportTicketCategory?.find(
                            (item) => item.id === value
                          );
                          setSelectedSupportTicketCategor({
                            id: value || 0,
                            name: result?.name || "",
                          });
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                              .UPDATE_ACCESS_DENIED_MESSAGE
                          );
                        }
                      }}
                    />
                  )}

                  {/* Product SLA */}
                  {isLoadingForCompanyProductSla ? (
                    <div className="flex flex-col gap-2 animate-pulse w-full">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  ) : (
                    <CustomDropdown
                      logo={Hourglass}
                      labelName="Product SLA"
                      options={companyProductSla}
                      preselectedOption={
                        selectedSupportTicket?.companyProductSlaId
                      }
                      onSelect={(value) => {
                        if (userHasAccessToUpdateSupportTicket) {
                          const result = companyProductSla?.find(
                            (item) => item.id === value
                          );
                          setSelectedCompanyProductSla({
                            id: value || 0,
                            name: result?.name || "",
                          });
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                              .UPDATE_ACCESS_DENIED_MESSAGE
                          );
                        }
                      }}
                    />
                  )}

                  {/* Support ticket source */}
                  {isLoadingForSupportTicketSource ? (
                    <div className="flex flex-col gap-2 animate-pulse w-full">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  ) : (
                    <CustomDropdown
                      logo={Layers}
                      labelName="Source"
                      options={supportTicketSource}
                      preselectedOption={
                        selectedSupportTicket?.supportTicketSourceId
                      }
                      onSelect={(value) => {
                        const result = supportTicketSource?.find(
                          (item) => item.id === value
                        );
                        setSelectedSupportTicketSource({
                          id: value,
                          name: result?.name || "",
                        });
                      }}
                    />
                  )}

                  {isLoadingForSupportTicketEscalationLevel ? (
                    <div className="flex flex-col gap-2 animate-pulse w-full">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  ) : (
                    <CustomDropdown
                      logo={TrendingUp}
                      labelName="Escalation Level"
                      options={supportTickeEscalationLevel}
                      preselectedOption={
                        selectedSupportTicket?.supportTicketEscalationLevelId
                      }
                      onSelect={(value) => {
                        setSelectedSupportTicketEscalationId(value);
                        const result = supportTickeEscalationLevel?.find(
                          (item) => item.id === value
                        );
                        setSelectedSupportTicket({
                          ...selectedSupportTicket,
                          supportTicketEscalationLevelName: result?.name,
                          supportTicketEscalationLevelId: value,
                        });
                        // handSupportTicketInfoSave();
                      }}
                    />
                  )}

                  {selectedSupportTicket.resolvedBy && (
                    <CompanyUserSearchFieldInput
                      logo={UserCheck2Icon}
                      label="Resolved By"
                      // placeholder={selectedSupportTicket.assignedToName}
                      defaultValue={selectedSupportTicket.resolvedByName}
                      isDisabled={!userHasAccessToUpdateSupportTicket}
                      disabledMessage={
                        MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                          .UPDATE_ACCESS_DENIED_MESSAGE
                      }
                      onUserSelected={(user) => {
                        if (user && user.id !== 0) {
                          setSelectedResolvedBy(user);
                          // handSupportTicketInfoSave();
                        }
                        if (user === null || user === undefined) {
                          setSelectedResolvedBy({
                            company_id: 0,
                            email: "",
                            fullname: selectedSupportTicket.assignedToName,
                            mobilenumber: "",
                            generate_password: "",
                            createdby: "",
                            id: selectedSupportTicket.assignedTo,
                            isactive: false,
                            requestedby: "",
                          });
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {/* RIGHT SIDE DETAILS */}
              <div className="flex flex-col gap-4">
                {/* Created/Updated Info */}
                <div className="p-4 bg-white shadow rounded-lg border grid grid-cols-2 gap-1">
                  <Detail
                    label="Created By"
                    type="none"
                    value={selectedSupportTicket?.createdBy}
                  />
                  <Detail
                    label="Created On"
                    type="none"
                    value={selectedSupportTicket?.createdOn}
                  />

                  <Detail
                    label="Updated By"
                    type="none"
                    value={selectedSupportTicket?.updatedBy}
                  />
                  <Detail
                    label="Updated On"
                    type="none"
                    value={selectedSupportTicket?.updatedOn}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="px-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Query Description */}
            <TextAreaInput
              logo={LucideText}
              label="Query Description"
              name="queryDescription"
              value={formData.queryDescription}
              defaultValue={selectedSupportTicket?.queryDescription}
              onChange={(e) => {
                if (userHasAccessToUpdateSupportTicket) {
                  handleFormDataChange(e);
                }
              }}
              readonly={!userHasAccessToUpdateSupportTicket}
              disabled={!userHasAccessToUpdateSupportTicket}
              onBlur={() => {
                if (userHasAccessToUpdateSupportTicket) {
                  handSupportTicketInfoSave();
                }
              }}
              rows={2}
              cols={0}
            />

            {/* Resolution */}
            <TextAreaInput
              logo={Wrench}
              label="Resolution Applied"
              name="resolutionApplied"
              value={formData.resolutionApplied}
              defaultValue={selectedSupportTicket?.resolutionApplied}
              onChange={(e) => {
                if (userHasAccessToUpdateSupportTicket) handleFormDataChange(e);
              }}
              readonly={!userHasAccessToUpdateSupportTicket}
              disabled={!userHasAccessToUpdateSupportTicket}
              onBlur={() => {
                if (userHasAccessToUpdateSupportTicket) {
                  handSupportTicketInfoSave();
                }
              }}
              rows={2}
              cols={0}
            />

            {/* Public Notes */}
            <TextAreaInput
              logo={StickyNote}
              label="Public Notes"
              name="publicNotes"
              value={formData.publicNotes}
              defaultValue={selectedSupportTicket?.publicNotes}
              onChange={(e) => {
                if (userHasAccessToUpdateSupportTicket) handleFormDataChange(e);
              }}
              readonly={!userHasAccessToUpdateSupportTicket}
              disabled={!userHasAccessToUpdateSupportTicket}
              onBlur={() => {
                if (userHasAccessToUpdateSupportTicket) {
                  handSupportTicketInfoSave();
                }
              }}
              rows={2}
              cols={0}
            />
          </div>

          {/* third Column */}
          <div className="mt-3 p-1">
            <SupportTicketTasksModal
            // ownerId ={selectedSupportTicket?.assignedToId}
            />
          </div>
        </div>

        {/* Support Ticket history */}
        {isOpenLeadStatusHistory && (
          <SupportTicketHistoryView
            selectedSupportTicket={selectedSupportTicket}
            isOpen={isOpenLeadStatusHistory}
            onClose={() => {
              setIsOpenLeadStatusHistory(!isOpenLeadStatusHistory);
            }}
          />
        )}

        {selectedSupportTicketLifecycleId && (
          <SupportTicketLIfecycleChangeModal
            isLoading={isLoadingForLifecycleChanging}
            previousSupportTicketStatus={selectedSupportTicket}
            selectedSupportTicketLifecyclId={selectedSupportTicketLifecycleId}
            selectedSupportTicketLifecycleName={
              selectedSupportTicketLifecycleName
            }
            handleSubmit={handleSaveSupportTicketLifecycleUpdate}
            onClose={() => {
              setSelectedSupportTicketLifecycleId(undefined);
              setSelectedSupportTicketLifecycleName(undefined);
            }}
          />
        )}
      </motion.section>
    </div>
  );
};
export default ViewSupportTicketManagement;

type DetailProps = {
  label: string;
  value: string;
  type?: "text" | "number" | "select" | "none";
  options?: string[];
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSupportTicketInfoSave?: () => Promise<void>;
  handleClickLeadOwnerChange?: () => void;
  hasBorder?: boolean;
  rows?: number;
};

const Detail: React.FC<DetailProps> = ({
  label,
  value,
  type,
  options = [],
  onChange,
  handleSupportTicketInfoSave,
  handleClickLeadOwnerChange,
  hasBorder,
  rows = 3,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const prevValueRef = useRef(value);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (type === "text" && isEditing && textAreaRef.current) {
      const el = textAreaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [value, type, isEditing]);

  const handleClick = () => {
    prevValueRef.current = value;
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    const trimmedValue = value.trim();
    if (trimmedValue === prevValueRef.current) return;

    if (label === "Mobile number") {
      const isValid = value
        .trim()
        .match(MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN);

      if (!isValid) {
        onChange?.({
          target: { value: prevValueRef.current },
        } as any);

        toast.error(
          MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN
        );
        return;
      }
    } else if (label === "Email") {
      const isValid = value.trim().match(VALIDATIONS.EMAIL);
      if (!isValid) {
        onChange?.({
          target: { value: prevValueRef.current },
        } as any);

        toast.error(MESSAGE.ERROR.EMAIL_NOT_VALID_ERROR);
        return;
      }
    }

    if (trimmedValue !== value) {
      onChange?.({
        target: { value: trimmedValue },
      } as any);
    }

    if (value !== prevValueRef.current) {
      handleSupportTicketInfoSave?.();
    }
  };

  return (
    <div>
      <label className="caption-custom block whitespace-nowrap overflow-hidden">
        {label}
      </label>

      {isEditing ? (
        // --------------------------
        //    EDIT MODE
        // --------------------------
        type === "select" ? (
          <select
            className="input-label-custom"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            autoFocus
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === "text" ? (
          <textarea
            ref={textAreaRef}
            className="input-label-custom border border-gray-400 rounded-sm p-1 w-64 focus:outline-none focus:ring-0 resize-none"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            autoFocus
            rows={rows}
          />
        ) : (
          type !== "none" && (
            <input
              type={type}
              className={`input-label-custom border border-gray-400 rounded-sm p-0 m-0 ${
                label === "Name" ? "w-fit" : "w-48"
              } focus:outline-none focus:ring-0`}
              value={value}
              onChange={onChange}
              onBlur={handleBlur}
              autoFocus
              maxLength={60}
            />
          )
        )
      ) : // --------------------------
      //    DISPLAY MODE
      // --------------------------
      type === "none" ? (
        <div>
          <p className="input-label-custom text-gray-800 whitespace-nowrap overflow-x-hidden text-clip">
            {value ? (
              <span
                className={`${
                  [
                    "Updated By",
                    "Updated On",
                    "Created By",
                    "Created On",
                    "Account",
                    "Support Product",
                    "Resolved Status",
                    "Resolved By",
                  ].includes(label)
                    ? ""
                    : "border border-gray-200 rounded-md px-1 py-0.5"
                }`}
              >
                {value}
              </span>
            ) : (
              <span
                className={`${
                  [
                    "Updated By",
                    "Updated On",
                    "Created By",
                    "Created On",
                  ].includes(label)
                    ? ""
                    : "border border-gray-200 rounded-md"
                } caption-custom px-1`}
              >
                {["Updated By", "Created By", "Created On"].includes(label)
                  ? "Data not found"
                  : "Add here..."}
              </span>
            )}
          </p>
        </div>
      ) : type === "text" ? (
        <div
          className={`input-label-custom border border-gray-200 rounded-md p-1 w-64 whitespace-pre-wrap cursor-pointer hover:bg-slate-100`}
          onClick={handleClick}
          title={value}
        >
          {value || <span className="italic text-gray-400">Add here...</span>}
        </div>
      ) : label === "Lead owner" ? (
        <div
          title={value}
          className="input-label-custom hover:bg-slate-100 cursor-pointer"
          onClick={handleClickLeadOwnerChange}
        >
          {value ? (
            <>
              {value}
              <Edit3 className="ml-1 h-3 w-3 inline-block text-slate-400 flex-shrink-0" />
            </>
          ) : (
            <span className="input-label-custom">Add here...</span>
          )}
        </div>
      ) : (
        <div
          title={value ?? "Enter value "}
          className={`table-header-custom flex items-center min-w-48 ${
            label === "Name" ? "table-header-custom" : "input-label-custom"
          } ${
            hasBorder ? "border rounded-md px-1 border-gray-200" : ""
          } cursor-pointer`}
          onClick={handleClick}
        >
          <div className="flex items-center cursor-pointer hover:bg-slate-100 rounded transition-colors">
            <span
              className={`truncate ${label === "Name" ? "" : "max-w-[205px]"}`}
            >
              {value || (
                <span className="p-1 caption-custom italic">Add here...</span>
              )}
            </span>
            <Edit3 className="ml-1 h-3 w-3 text-slate-400 flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};
