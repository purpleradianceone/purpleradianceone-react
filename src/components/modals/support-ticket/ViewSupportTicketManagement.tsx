/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit3, HeadsetIcon, History, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useUserPreference } from "../../../context/user/UserPreference";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

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
import FormInput from "../../ui/FormInput";
import CustomDropdown from "../leads/CustomDropdown";
import { useCompanyProductSla } from "../../../config/hooks/useGetCompanyProductSla";

const ViewSupportTicketManagement = () => {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();

  const [searchParams] = useSearchParams();
  const { userHasAccessToUpdateSupportTicket } = useUserAccessModules();

  const [selectedSupportTicket, setSelectedSupportTicket] = useState(
    JSON.parse(searchParams.get("supportTicketData") || "{}")
  );
  const [selectedCompanyProductSla, setSelectedCompanyProductSla] = useState<
    number | undefined
  >();
  const [
    selectedSupportTicketLifecycleId,
    setSelectedSupportTicketLifecycleId,
  ] = useState<number | null>(null);

  const navigate = useNavigate();
  const {
    supportTicketLifecycle,
    isLoading: isLoadingForSupportTicketLifecycle,
  } = useSupportTicketLifecycle();

  const {
    companyProductSla,
    loading: isLoadingForCompanyProductSla,
    refetch: refetchCompanyProductSla,
  } = useCompanyProductSla(selectedSupportTicket.companyProductId);

  const [isOpenLeadStatusHistory, setIsOpenLeadStatusHistory] =
    useState<boolean>(false);

  const handleSaveSupportTicketLifecycleUpdate = async () => {
    if (!selectedSupportTicket || selectedSupportTicketLifecycleId === null)
      return;

    const postDataForLeadStatusUpdate = {
      company_id: loginStatus.companyId,
      id: selectedSupportTicket.id,
      company_product_sla_id: selectedCompanyProductSla,
      support_ticket_lifecycle_id: selectedSupportTicketLifecycleId,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_SUPPORT_TICKET,
        postDataForLeadStatusUpdate,
        { withCredentials: true }
      );
      if (response?.status == STATUS_CODE.OK) {
        if (response.data.status) {
          const updatedStatusName = supportTicketLifecycle?.find(
            (item) => item.id === selectedSupportTicketLifecycleId
          )?.name;

          const parsedQuery = JSON.parse(
            searchParams.get("supportTicketData") || "{}"
          );
          parsedQuery.supportTicketLifecycleId =
            selectedSupportTicketLifecycleId.toString();
          parsedQuery.supportTicketLifecycleName =
            updatedStatusName!.toString();
          const newQueryString = qs.stringify({
            supportTicketData: JSON.stringify(parsedQuery),
          });

          setSelectedSupportTicket((prev: any) => ({
            ...prev,
            supportTicketLifecycleName: updatedStatusName,
            supportTicketLifecycleId: selectedSupportTicketLifecycleId,
          }));
          setSelectedSupportTicketLifecycleId(null);

          const newPath = `${window.location.pathname}?${newQueryString}`;
          navigate(newPath, { replace: true });

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
      //
    }
  };
  useEffect(() => {
    refetchCompanyProductSla();
    console.log("company product id" + selectedSupportTicket.companyProductId);
    console.log(
      "company product id 2" + selectedSupportTicket.company_product_id
    );
  }, [selectedSupportTicket.companyProductSlaId]);

  // const handleClickLeadOwnerChange = () => {
  //   // setIsLeadOwnerPopUpOpen(true);
  // };

  const handleLeadInfoSave = async () => {
    // const trimmedName = selectedLeadData.name?.trim() ?? "";
    // // case 1: only spaces → not allowed
    // if (selectedLeadData.name !== "" && trimmedName === "") {
    //   setSelectedLeadData((prev: any) => ({
    //     ...prev,
    //     name: null,
    //   }));
    // }
    // console.log(trimmedName);
    // const PostDataForLeadUpdate: PostDataLeadUpdate = {
    //   company_id: loginStatus.companyId,
    //   id: selectedLeadData.id, //NOTE : LEAD ID FOR EDIT
    //   name: selectedLeadData.name,
    //   email: selectedLeadData.email,
    //   mobilenumber: selectedLeadData.mobileNumber,
    //   updatedby_id: loginStatus.id,
    // };
    // console.log(PostDataForLeadUpdate);
    // try {
    //   const response = await axios.post(
    //     POST_API.UPDATE_LEAD,
    //     PostDataForLeadUpdate,
    //     { withCredentials: true }
    //   );
    //   if (response.data.status) {
    //     //parse query string
    //     const rawLeadData = window.location.search;
    //     const urlParams = new URLSearchParams(rawLeadData);
    //     const leadDataStr = urlParams.get("leadData");
    //     const parsedQuery = JSON.parse(leadDataStr || "{}");
    //     parsedQuery.name = !selectedLeadData.name ? "" : selectedLeadData.name;
    //     parsedQuery.email = !selectedLeadData.email
    //       ? ""
    //       : selectedLeadData.email;
    //     parsedQuery.mobileNumber = !selectedLeadData.mobileNumber
    //       ? ""
    //       : selectedLeadData.mobileNumber;
    //     const newQueryString = qs.stringify({
    //       leadData: JSON.stringify(parsedQuery),
    //     });
    //     const newPath = `${window.location.pathname}?${newQueryString}`;
    //     navigate(newPath, { replace: true });
    //     toast.success(response.data.message);
    //     fetchLeadContact();
    //   } else if (response.data.status === false) {
    //     toast.error(response.data.message);
    //   }
    // } catch (error: any) {
    //   if (error.status === STATUS_CODE.UNATHORISED) {
    //     const refreshTokenStatus = await RefreshToken({
    //       callFunctionWithEvent: handleLeadInfoSave,
    //     });
    //     // setIsDialogueOpen(!refreshTokenStatus);
    //     if (refreshTokenStatus) {
    //       handleLeadInfoSave();
    //     }
    //   } else if (error.status === 400) {
    //     toast.error(error.response.data);
    //   }
    // }
  };

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
            <button
              className="flex items-center gap-1 caption-custom justify-center hover:text-blue-600 "
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft size={14} />
              <span>back</span>
            </button>
          </div>
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
                        setSelectedSupportTicketLifecycleId(item.id);
                        await handleSaveSupportTicketLifecycleUpdate();
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
          {/* Column 1 */}
          <div className="w-full md:w-[99hv] flex flex-col gap-2">
            {/* Support Ticket Basic Info */}
            <div className=" flex shadow-sm border rounded-sm p-1  ">
              <div className="grid grid-cols-2 gap-2  ">
                <div className=" flex items-center gap-3 col-span-3  ">
                  <div className="bg-blue-600 p-2 rounded text-white">
                    <HeadsetIcon size={30} />
                  </div>
                  <div className="table-header-custom">
                    <Detail
                      label="Account"
                      hasBorder={false}
                      type={"none"}
                      value={selectedSupportTicket?.accountName}
                    />
                  </div>
                </div>
                <div className=" flex items-center gap-3 col-span-3  ">
                  <div className="bg-blue-600  p-2 rounded text-white">
                    <ShoppingBag size={30} />
                  </div>
                  <div className="table-header-custom">
                    <Detail
                      label="Support Product"
                      hasBorder={false}
                      type={"none"}
                      value={selectedSupportTicket?.companyProductName}
                    />
                  </div>
                </div>

                <div
                  onClick={() => {
                    if (!userHasAccessToUpdateSupportTicket) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                  title={
                    userHasAccessToUpdateSupportTicket
                      ? ""
                      : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                  }
                >
                  <Detail
                    // hasBorder={true}
                    label="Public Note"
                    type={userHasAccessToUpdateSupportTicket ? "text" : "none"}
                    value={selectedSupportTicket?.publicNotes}
                    onChange={(e) => {
                      setSelectedSupportTicket({
                        ...selectedSupportTicket,
                        publicNotes: e.target.value.trim(),
                      });
                    }}
                    handleSupportTicketInfoSave={handleLeadInfoSave}
                    rows={7}
                  />
                </div>

                {/* <div
                  className="ml-4"
                  onClick={() => {
                    if (!userHasAccessToUpdateSupportTicket) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                  title={
                    userHasAccessToUpdateSupportTicket
                      ? ""
                      : MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                  }
                >
                  <Detail
                    label="Product SLA"
                    // hasBorder={true}
                    type={userHasAccessToUpdateSupportTicket ? "text" : "none"}
                    value={selectedSupportTicket?.companyProductSlaName}
                    onChange={(e) => {
                      setSelectedSupportTicket({
                        ...selectedSupportTicket,
                        companyProductSlaName: e.target.value,
                      });
                    }}
                    handleSupportTicketInfoSave={handleLeadInfoSave}
                  />
                </div> */}
                <div className="flex relative ">
                  <CompanyUserSearchFieldInput
                    label="Assign To"
                    placeholder={selectedSupportTicket.assignedToName}
                    defaultValue={selectedSupportTicket.assignedToName}
                    onUserSelected={(user) => {
                      if (user) {
                        // setSelectedCompanyUser(user);
                      }
                    }}
                    isDisabled={!userHasAccessToUpdateSupportTicket}
                    disabledMessage={
                      MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                        .UPDATE_ACCESS_DENIED_MESSAGE
                    }
                  />
                </div>
                <div>
                  <div>
                    <FormInput
                      label="Query Description"
                      defaultValue={selectedSupportTicket?.queryDescription}
                      value={selectedSupportTicket.queryDescription}
                      maxLength={5}
                    />
                  </div>
                </div>
                {isLoadingForCompanyProductSla ? (
                  <div className="flex flex-col gap-1 w-full animate-pulse">
                    {/* Label skeleton */}
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>

                    {/* Input skeleton */}
                    <div className="h-9 w-full bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div>
                    <CustomDropdown
                      labelName="Product SLA"
                      options={companyProductSla}
                      preselectedOption={
                        selectedSupportTicket?.companyProductSlaId
                      }
                      onSelect={(value) => {
                        setSelectedCompanyProductSla(value);
                        const result = companyProductSla?.find(item => item.id === 1);
                        setSelectedSupportTicket({
                          ...selectedSupportTicket,
                          companyProductSlaName: result?.name,
                        });
                        setSelectedSupportTicket({
                          ...selectedSupportTicket,
                          companyProductSlaId: value
                        });

                        handleLeadInfoSave();

                      }}
                    />
                  </div>
                )}
                <div>
                  <Detail
                    type="none"
                    label="Created on"
                    value={selectedSupportTicket?.createdOn}
                  />
                </div>
                <div className="ml-4">
                  <Detail
                    type="none"
                    label="Created by"
                    value={selectedSupportTicket?.createdBy}
                  />
                </div>
                <div>
                  <Detail
                    type="none"
                    label="Updated By"
                    value={selectedSupportTicket?.updatedBy}
                  />
                </div>
                <div>
                  <Detail
                    type="none"
                    label="Updated On"
                    value={selectedSupportTicket?.updatedOn}
                  />
                </div>
              </div>
            </div>
          </div>

          {/**Second column*/}
          <div>second column</div>
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
  rows?: number; // ⭐ NEW
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

  // ⭐ Auto-resize textarea
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
                  ["Lead source", "Created by", "Created on"].includes(label)
                    ? ""
                    : "border border-gray-200 rounded-md px-1"
                }`}
              >
                {value}
              </span>
            ) : (
              <span
                className={`${
                  ["Lead source", "Created by", "Created on"].includes(label)
                    ? ""
                    : "border border-gray-200 rounded-md"
                } caption-custom px-1`}
              >
                {["Lead source", "Created by", "Created on"].includes(label)
                  ? "Data not found"
                  : "Add here..."}
              </span>
            )}
          </p>
        </div>
      ) : type === "text" ? (
        // ⭐ MULTI-LINE DISPLAY
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
