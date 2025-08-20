/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { SIZE, STATUS_CODE } from "../../constants/AppConstants";
import {
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Star,
  Loader2,
  LucideMailPlus,
  LucidePlus,
  LayoutDashboard,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import useScreenSize from "../../config/hooks/useScreenSize";
import Button from "../ui/Button";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { useSearchFilterPaginationDateHandlers } from "../../config/hooks/usePaginationHandler";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import EmailTemplate from "../../@types/email-template/EmailTemplateType";
import { Switch } from "@headlessui/react"; // Or use your own styled switch
import MESSAGE from "../../constants/Messages";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import { useUserPreference } from "../../context/user/UserPreference";
import AccessDeniedPopup from "../views/not-found/AccessDeniedPage";

type TemplateType = {
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

  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] =
    useState(false);

  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);
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
      <div className="sticky z-10 top-12 flex items-center justify-between bg-gray-50 rounded-lg shadow-sm w-full ">
        <div className="flex  justify-between w-full h-12 items-center">
          <div className="flex gap-2">
            {<LucideMailPlus className="w-7 h-7 text-blue-600 " />}
            {<LayoutDashboard className="w-4 h-4 text-blue-600 " />}

            <span className="text-xl font-bold ">Email Templates</span>
          </div>
          {isLargeScreen && (
            <>
              <div className="flex">
                {/* search box flex div */}
                <div className="relative flex items-start w-44">
                  <div className="grid w-full">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchParameterChange(e.target.value);
                      }}
                    ></SearchInput>
                  </div>
                </div>

                {/* Date FIlters Dropdown */}
                <div className="flex mx-1">
                  <div className="flex">
                    <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                      <Calendar className="mt-2" />
                    </div>
                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
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
            </>
          )}

          {isMediumScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchParameterChange(e.target.value);
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative  gap-2  ">
                <div className="mt-1 flex ">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                    <Calendar />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                  ></DateRangeFilterDropdown>
                </div>
              </div>
              {isFilterOpenInTabletView && isCustomDateOptionSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-45 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFilterOpenInTabletView(!isFilterOpenInTabletView);
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.TWENTY} />
                    </button>

                    <div className="my-10 justify-items-center mb-5">
                      <div className="mb-5">
                        <DateRangePicker
                          onStartDateChange={handleStartDateChange}
                          onEndDateChange={handleEndDateChange}
                        />
                      </div>
                      <div className="w-full justify-items-center">
                        <div className="w-24">
                          <Button>Done</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isSmallScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchParameterChange(e.target.value);
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative gap-2">
                <Button
                  onClick={() => {
                    setIsFiltersOpenInMobileView(!isFiltersOpenInMobileView);
                  }}
                >
                  <Filter size={SIZE.EIGHT} />
                </Button>
              </div>
              {isFiltersOpenInMobileView && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFiltersOpenInMobileView(
                          !isFiltersOpenInMobileView
                        );
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.EIGHT} />
                    </button>
                    {/* Date FIlters Dropdown */}

                    <div className="flex relative gap-2 items-center justify-center mt-10 mb-3">
                      <div className="mt-1 flex ">
                        <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                          <Calendar size={SIZE.TWENTY} />
                        </div>

                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                        ></DateRangeFilterDropdown>
                      </div>
                    </div>

                    {/* Custom Date Picker Div Flex Box*/}
                    <div
                      className="mb-10 justify-items-center"
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

                    {
                      <div className="flex w-full justify-center items-center mb-5">
                        <div className="w-28">
                          <Button
                            onClick={() => {
                              setIsFiltersOpenInMobileView(
                                !isFiltersOpenInMobileView
                              );
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              )}
            </>
          )}
          <Sidebar
            onCreate={() => setShowModal(true)}
            handleAccessDenied={(message: string) => {
              toast.error(message);
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loadingTemplatePage ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex-1 p-4 overflow-x-auto" ref={containerRef}>
            <Tabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              templateTypes={templateTypes}
            />

            <TemplateList
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

const Sidebar: React.FC<{
  onCreate: () => void;
  handleAccessDenied: (message: string) => void;
}> = ({ onCreate, handleAccessDenied }) => {
  const { userHasAccessToAddEmailTemplateSetting } = useUserAccessModules();
  return (
    <div className="flex max-w-60">
      <Button
        disabled={!userHasAccessToAddEmailTemplateSetting}
        onClick={() =>
          userHasAccessToAddEmailTemplateSetting
            ? onCreate()
            : handleAccessDenied(MESSAGE.ERROR.NOT_ATHORISED)
        }
      >
        <div className="flex gap-1">
          <LucidePlus className="w-6 h-6 text-white " />
          <span className=" font-bold ">New Template </span>
        </div>
      </Button>
    </div>
  );
};

type TabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  templateTypes: TemplateType[];
};

const Tabs: React.FC<TabsProps> = ({
  activeTab,
  onTabChange,
  templateTypes,
}) => (
  <div className="sticky top-0 bg-white overflow-x-auto scrollbar-hide">
    <div className="flex flex-nowrap text-xs">
      {templateTypes.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.name)}
          className={`py-2 px-4 border-b-2 whitespace-nowrap ${
            activeTab === tab.name
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-600 hover:text-gray-900"
          } transition-colors duration-200`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  </div>
);

type TemplateListProps = {
  templates: EmailTemplate[];
  loading: boolean;
  hasmore: boolean;
  selectedTypeId: number;
  reset: () => void;
};

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  loading,
  hasmore,
  reset,
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [updatingDefaultId, setUpdatingDefaultId] = useState<number | null>(
    null
  );

  const { userHasAccessToUpdateEmailTemplateSetting } = useUserAccessModules();
  const navigate = useNavigate();

  const handleEditTemplate = (emailTemplate: EmailTemplate): void => {
    navigate(
      `${ROUTES_URL.EMAIL_TEMPLATE_UPDATE}?template_type_id=${emailTemplate.email_type_id}&template_id=${emailTemplate.id}`
    );
  };
  const { loginStatus } = useLoggedInUserContext();
  const handleDefaultToggle = async (template: EmailTemplate) => {
    if (!userHasAccessToUpdateEmailTemplateSetting) {
      toast.error("You don't have access to update the default status.");
      return;
    }

    try {
      setUpdatingDefaultId(template.id);
      const postDataUpdateEmailTemplate = {
        company_id: loginStatus.companyId,
        updatedby_id: loginStatus.id,
        id: template.id,
        email_type_id: template.email_type_id,
        name: null,
        email_subject: null,
        email_body_html: null,
        email_body_json: null,
        is_default: template.is_default,
      };

      await axios
        .post(POST_API.UPDATE_EMAIL_TEMPLATE, postDataUpdateEmailTemplate, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            reset();
            toast.success(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunctionWithParamsNotEvent: handleDefaultToggle,
            });
            if (refreshTokenResponse) {
              handleDefaultToggle(template);
            }
          }
        });
    } catch (error) {
      console.error("Failed to update default status:", error);
      toast.error("Failed to update default status.");
    } finally {
      // setUpdatingDefaultId(null);
    }
  };

  return (
    <>
      {templates.length === 0 && !loading && !hasmore && (
        <div className="text-center text-gray-500 mt-10 p-4 border rounded-md bg-white shadow-sm">
          No templates found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition duration-200 ease-in-out"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {template.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-blue-500 hover:text-blue-700 transition"
                  aria-label={`Preview ${template.name}`}
                >
                  <Eye size={25} />
                </button>
                <Button
                  className="text-green-500 hover:text-green-700 transition"
                  aria-label={`Edit ${template.name}`}
                  disabled={
                    !userHasAccessToUpdateEmailTemplateSetting ||
                    template.is_master
                  }
                  onClick={() => {
                    if (
                      userHasAccessToUpdateEmailTemplateSetting &&
                      !template.is_master
                    ) {
                      handleEditTemplate(template);
                    } else {
                      toast.error(
                        template.is_master
                          ? "Can't Update Master Templates!"
                          : "You don't have access!"
                      );
                    }
                  }}
                >
                  <Edit2 size={25} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Subject:</strong>{" "}
              {template.email_subject || <em>No subject</em>}
            </p>
            <div className="flex flex-col space-y-1 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                {template.isactive ? (
                  <CheckCircle className="text-green-500" size={16} />
                ) : (
                  <XCircle className="text-gray-400" size={16} />
                )}
                <strong>Active:</strong> {template.isactive ? "Yes" : "No"}
              </span>
              <span className="flex items-center gap-2">
                {template.is_default ? (
                  <Star className="text-yellow-500" size={16} />
                ) : (
                  <XCircle className="text-gray-400" size={16} />
                )}
                <strong>Default:</strong>
                <Switch
                  aria-disabled={!userHasAccessToUpdateEmailTemplateSetting}
                  checked={template.is_default}
                  onChange={() => {
                    template.is_default = !template.is_default;
                    handleDefaultToggle(template);
                  }}
                  className={`${
                    template.is_default ? "bg-blue-600" : "bg-gray-300"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition`}
                  disabled={updatingDefaultId === template.id}
                >
                  <span className="sr-only">Toggle Default</span>
                  <span
                    className={`${
                      template.is_default ? "translate-x-5" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </span>
              <span className="flex items-center gap-1">
                {template.is_master ? (
                  <Star className="text-purple-500" size={16} />
                ) : (
                  <XCircle className="text-gray-400" size={16} />
                )}
                <strong>Master:</strong> {template.is_master ? "Yes" : "No"}
              </span>
              <span>
                <strong>Created By:</strong> {template.createdby}
              </span>
              <span>
                <strong>Created On:</strong>{" "}
                {new Date(template.createdon).toLocaleDateString()}
              </span>
              <span>
                <strong>Updated By:</strong> {template.updatedby}
              </span>
              <span>
                <strong>Updated On:</strong>{" "}
                {new Date(template.updatedon).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading && hasmore && (
        <div className="flex justify-center items-center flex-1">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
              Preview: {previewTemplate.name}
            </h2>
            <div
              className="overflow-y-auto flex-1 border rounded p-4 text-sm text-gray-800 bg-gray-50"
              dangerouslySetInnerHTML={{
                __html: previewTemplate.email_body_html,
              }}
            />
            <div className="text-right mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

type TemplateTypeModalProps = {
  onClose: () => void;
  onCreate: (typeId: string) => void;
};

const TemplateTypeModal: React.FC<TemplateTypeModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>(""); // Initial state is an empty string
  const { loginStatus } = useLoggedInUserContext();
  const [templateTypes, setTemplateTypes] = useState<TemplateType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
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
          // Optional: If you want to pre-select the first active type, uncomment the line below.
          // if (activeTypes.length > 0) setSelectedTypeId(String(activeTypes[0].id));
          // Otherwise, leave selectedTypeId as '' so "Select template type" is initially shown.
        }
        if (response.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: fetchTypes,
          });
          if (refreshTokenResponse) {
            fetchTypes();
          }
        }
      } catch (error) {
        console.error("Error fetching template types for modal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, [loginStatus.companyId, loginStatus.id]);

  const handleSubmit = () => {
    if (selectedTypeId) {
      // This check ensures selectedTypeId is not an empty string
      onCreate(selectedTypeId); // Pass the ID string directly
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Select Template Type</h2>
        <select
          value={selectedTypeId} // Value will be '' initially or the selected ID string
          onChange={(e) => setSelectedTypeId(e.target.value)}
          className="w-full mb-3 border px-3 py-2 rounded"
        >
          <option value="">Select template type</option>{" "}
          {/* Value is empty string for no selection */}
          {templateTypes
            .filter((t) => t.isactive)
            .map((type) => (
              <option key={type.id} value={JSON.stringify(type)}>
                {type.name}
              </option>
            ))}
        </select>
        <div className="flex justify-between mt-4">
          <button
            className="text-sm text-gray-600 hover:underline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={selectedTypeId === ""}
            className={`px-4 py-2 rounded text-white ${
              selectedTypeId !== ""
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
