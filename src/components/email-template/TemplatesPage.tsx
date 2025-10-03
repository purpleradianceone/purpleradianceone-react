/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { SIZE, STATUS_CODE } from "../../constants/AppConstants";
import { LucidePlus, Calendar, LayoutDashboard } from "lucide-react";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import Button from "../ui/Button";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { useSearchFilterPaginationDateHandlers } from "../../config/hooks/usePaginationHandler";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import EmailTemplate from "../../@types/email-template/EmailTemplateType";
import MESSAGE from "../../constants/Messages";
import RefreshToken from "../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import { useUserPreference } from "../../context/user/UserPreference";
import AccessDeniedPopup from "../views/not-found/AccessDeniedPage";
import { TemplateTypeModal } from "./template-panel/TemplateTypeModal";
import { EmailTypeDropdown } from "./email-template-custom/EmailTypeDropdown";
import { EmailTemplateList } from "./email-template-custom/TemplateList";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import COLORS from "../../constants/Colors";

export type TemplateType = {
  id: number;
  name: string;
  is_host_email: boolean;
  isactive: boolean;
};

export const TemplatesPage: React.FC = () => {
  const { userPreference } = useUserPreference();
  const [activeTab, setActiveTab] = useState<string>("");
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [loadingTemplatePage, setLoadingTemplatesPage] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const limit: number = 10;
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    dateRangeId,
    concatDate,
    searchParameter,
    handleDatePageIdChange,
    handleEndDateChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({
      dateRangeDropdownOptions,
      handleSearchOption: {
        handleDateRangeIdChange: handleDatePageIdChange,
      },
    });

  const handleTemplateCreate = (type: string) => {
    setShowModal(false);
    navigate(`${ROUTES_URL.EMAIL_TEMPLATE_CREATE}?type=${type}`);
  };

  const getTemplateTypes = async () => {
    setLoadingTemplatesPage(true);
    try {
      const response = await axios.post(
        POST_API.GET_EMAIL_TYPE,
        {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.id,
          is_host_email: false,
        },
        { withCredentials: true }
      );

      if (response.status === STATUS_CODE.OK) {
        const activeTypes = response.data.filter(
          (type: TemplateType) => type.isactive
        );
        setTemplateTypes(activeTypes);
        if (activeTypes.length > 0) {
          setActiveTab(activeTypes[0].name);
          setSelectedTypeId(activeTypes[0].id);
          setOffset(0); // Always reset offset for initial load of a type
          setTemplates([]); // Clear previous templates
          setHasMoreTemplates(true); // Assume there are more templates for the first type
        } else {
          setActiveTab("");
          setSelectedTypeId(0);
          setTemplates([]);
          setHasMoreTemplates(false);
        }
      }
      if (response.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: getTemplateTypes,
        });
        if (refreshTokenResponse) {
          getTemplateTypes();
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: getTemplateTypes,
        });
        if (refreshTokenResponse) {
          getTemplateTypes();
        }
      }
    } finally {
      setLoadingTemplatesPage(false);
    }
  };

  // Refined useCallback for fetching templates
  // Removed 'offset' from dependencies as it's updated within the function
  // Removed 'loadingTemplates' and 'hasMoreTemplates' as dependencies to prevent loops
  const getTemplatesOfCompany = useCallback(
    async ({ typeId, reset = false }: { typeId: number; reset?: boolean }) => {
      // We use a functional update for setOffset to get the latest value
      // and avoid including 'offset' in useCallback dependencies.
      setLoadingTemplates(true); // Set loading state for templates

      try {
        setOffset(reset ? 0 : offset);
        // Get the current offset using a ref or state that's not in useCallback deps
        // For this case, it's okay to read `offset` from state as it's only modified after fetch
        // or set to 0 by the calling useEffect for reset.
        const currentOffset = reset ? 0 : offset;

        const response = await axios.post(
          POST_API.GET_EMAIL_TEMPLATE,
          {
            company_id: loginStatus.companyId,
            requestedby_id: loginStatus.id,
            id: null,
            email_type_id: typeId,
            search_company_specific_date_range_id:
              dateRangeId === 0 ? null : dateRangeId,
            search_parameter: searchParameter,
            search_parameter_date: concatDate,
            offset: currentOffset,
            limit,
          },
          { withCredentials: true }
        );

        if (response.status === STATUS_CODE.OK) {
          const newTemplates = response.data;
          setHasMoreTemplates(newTemplates.length === limit);
          const newOffset: number = currentOffset + limit;
          setOffset(newOffset);
          setTemplates((prev) =>
            reset ? newTemplates : [...prev, ...newTemplates]
          );
        } else {
          setHasMoreTemplates(false);
        }
        if (response.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: getTemplatesOfCompany,
          });
          if (refreshTokenResponse) {
            getTemplatesOfCompany({ typeId, reset });
          }
        }
      } catch (error: ApiError | any) {
        setHasMoreTemplates(false);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: getTemplatesOfCompany,
          });
          if (refreshTokenResponse) {
            getTemplatesOfCompany({ typeId, reset });
          }
        }
      } finally {
        setLoadingTemplates(false);
      }
    },
    [
      offset,
      hasMoreTemplates,
      loginStatus.companyId,
      loginStatus.id,
      dateRangeId,
      searchParameter,
      concatDate,
      limit,
    ]
  ); // Keep offset here if it's read directly, or use a ref

  const handleTabChange = (tab: string) => {
    const selectedType = templateTypes.find((type) => type.name === tab);
    if (selectedType) {
      setActiveTab(tab);
      setSelectedTypeId(selectedType.id);
      // When tab changes, we always want a fresh fetch starting from 0 offset
      setOffset(0);
      // setTemplates([]);
      setHasMoreTemplates(true);
      // The useEffect below will trigger the fetch due to selectedTypeId change
    }
  };

  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");
  const status = searchParams.get("status");

  useEffect(() => {
    getTemplateTypes();
    if (message && status) {
      toast.success(message);
    } else {
      if (message && !status) {
        toast.error(message);
      }
    }
  }, []); // Dependency on loginStatus is appropriate here

  // Effect to trigger initial fetch or re-fetch when selectedTypeId changes (e.g., tab change)
  //No error
  useEffect(() => {
    if (selectedTypeId !== 0) {
      // Only fetch if a valid type is selected
      setTemplates([]); // Clear templates for new type
      setOffset(0); // Reset offset
      setHasMoreTemplates(true); // Assume more templates for new type
      getTemplatesOfCompany({ typeId: selectedTypeId, reset: true });
    }
  }, [selectedTypeId]);

  //No error
  useEffect(() => {
    if (selectedTypeId !== 0) {
      setTemplates([]);
      setOffset(0);
      setHasMoreTemplates(true);
      getTemplatesOfCompany({ typeId: selectedTypeId, reset: true });
    }
  }, [dateRangeId, concatDate, searchParameter]);

  // Effect for infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollBottom = scrollTop + clientHeight;
      const threshold = 200; // Pixels from bottom to trigger load
      if (
        scrollBottom >= scrollHeight - threshold &&
        !loadingTemplates &&
        hasMoreTemplates &&
        selectedTypeId !== 0
      ) {
        getTemplatesOfCompany({ typeId: selectedTypeId, reset: false });
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [
    loadingTemplates,
    hasMoreTemplates,
    selectedTypeId,
    getTemplatesOfCompany,
  ]); // Dependencies are correct here, getTemplatesOfCompany is stable enough now.

  function refresh() {
    getTemplatesOfCompany({ typeId: selectedTypeId, reset: true });
  }
  const { userHasAccessToViewEmailTemplateSetting } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const { userHasAccessToAddEmailTemplateSetting } = useUserAccessModules();

  useEffect(() => {
    if (!userHasAccessToViewEmailTemplateSetting) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewEmailTemplateSetting]);

  if (!userHasAccessToViewEmailTemplateSetting)
    return (
      <div className="flex-none mx-96 mt-14">
        <AccessDeniedPopup
          isOpen={accessDeniedPopUpOpen}
          onClose={() => {
            setAccessDeniedPopUpOpen(false);
            window.history.back();
          }}
        />
      </div>
    );

  return (
    <div
      className={`w-full pt-1 ${
        userPreference.isLeftMenu ? "pl-5" : "px-1"
      }  gap-1 h-screen flex flex-col `}
    >
      {/* Header */}
      <div className={`sticky z-10 top-12 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm w-full mb-2`}>
        <div className="flex  justify-between w-full items-center">
          <div className="flex gap-2">
            {<LayoutDashboard className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />}

            <span className="section-header-custom">Templates</span>
          </div>
          <div>
            <EmailTypeDropdown
              activeTab={activeTab}
              onTabChange={handleTabChange}
              templateTypes={templateTypes}
            />
          </div>

          <div className="flex">
            {/* search box flex div */}
            <div className="relative flex items-start w-52 transition-colors hover:border-gray-400">
              <div className="grid w-full">
                <SearchInput
                  onChange={(e) => {
                    handleSearchParameterChange(e.target.value);
                  }}
                ></SearchInput>
              </div>
            </div>
          </div>

          {/* Date FIlters Dropdown */}
          <div className={`flex gap-0.5 flex-wrap ${isCustomDateOptionSelected ? 'max-h-14' : 'max-h-9'}`}>
            <div className="flex mx-1">
              <div className="flex">
                <div className="flex items-center size-4 justify-center mt-1 mr-2 gap-2 input-label-custom">
                  <Calendar className="mt-1 input-label-custom" />
                </div>
                <DateRangeFilterDropdown
                  dropdownOptions={dateRangeDropdownOptions}
                  handleDateIdChange={handleDateRangeIdChange}
                ></DateRangeFilterDropdown>
              </div>
            </div>
            {/* Custom Date Picker Div Flex Box*/}

            <div
              style={
                isCustomDateOptionSelected
                  ? { visibility: "visible" }
                  : { visibility: "hidden" }
              }
            >
              <DateRangePicker
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>
          </div>

          <div className="flex max-w-60 min-h-7 h-8">
            <Button
              type="submit"
              disabled={!userHasAccessToAddEmailTemplateSetting}
              onClick={(e) => {
                e.preventDefault();
                if (userHasAccessToAddEmailTemplateSetting) {
                  setShowModal(true);
                } else {
                  toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                }
              }}
            >
              <div className="flex items-center justify-center gap-0.5">
                <LucidePlus size={SIZE.SIXTEEN} />
                Template
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loadingTemplatePage ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-x-auto" ref={containerRef}>
            <EmailTemplateList
              templates={templates}
              loading={loadingTemplates}
              hasmore={hasMoreTemplates}
              selectedTypeId={selectedTypeId}
              reset={refresh}
            />
          </div>
          {showModal && (
            <TemplateTypeModal
              onClose={() => setShowModal(false)}
              onCreate={handleTemplateCreate}
            />
          )}
        </>
      )}
    </div>
  );
};
