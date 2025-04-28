import {
  Calendar,
  X,
  Filter,
  IndianRupee,
  CreditCard,
  CalendarRange,
} from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import useScreenSize from "../../config/hooks/useScreenSize";
import { SIZE, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import Pagination from "../ag-grid/Pagination";
import SubscriptionListAggrid from "../ag-grid/SubscriptionListAggrid";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import SubscriptionListProps from "../../@types/subscription/SubscriptionListProps";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import Button from "../ui/Button";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useState } from "react";
import CreateSubscription from "../subscription-module/CreateSubscription";
import UpdateSubscription from "../subscription-module/UpdateSubscription";

function SubscriptionManagementList({
  subscriptionList,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleSubscriptionListChange
}: {
  subscriptionList: SubscriptionListProps[];
  paginationData: PaginationDataProps;
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  handleSubscriptionListChange: ()=>void;
}) {
  const [isAddSubscriptionModalOpen, setIsAddSubscriptionModalOpen] =
    useState(false);

  const { userHasAccessToAddSubscription, userHasAccessToViewSubscription } =
    useUserAccessModules();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const { isCustomDateOptionSelected, handleDateRangeIdChange } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);
  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] =
    useState(false);
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const [isUpdateSubscriptionModalOpen, setIsUpdateSubscriptionModalOpen] =
    useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionListProps>({
      id: 0,
      allowedUserCount: 0,
      companyUserCount: 0,
      createdBy: "",
      createdOn: "",
      endDate: "",
      isActive: false,
      startDate: "",
      totalCost: 0,
      subscriptionStatus : ""
    });
  const handleUpdateSubscriptionModalOpen = (status: boolean) => {
    setIsUpdateSubscriptionModalOpen(status);
  };
  const handleSelectedSubscription = (params: SubscriptionListProps) => {
    setSelectedSubscription(params);
  };

  return (
    userHasAccessToViewSubscription && (
      <div className="w-full pt-1 pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-9 p-0.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex  gap-2">
            {!isSmallScreen && <CreditCard className="w-6 h-6 text-blue-600" />}

            {(isMediumScreen || isLargeScreen) && (
              <span className="text-1xl font-bold">Subscription</span>
            )}
          </div>

          {isLargeScreen && (
            <>
              <div className="flex gap-1">
                {/* NOTE : SEARCH PARAMETER IS NOT REQ. FOR THIS COMPONENT */}
                {/* search box flex div */}
                {/* <div className="relative flex items-start w-80 "> */}
                {/* <SearchInput
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value
                      );
                    }}
                  ></SearchInput> */}
                {/* </div> */}

                {/* Date FIlters Dropdown */}
                <div className="flex mx-3">
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
                  onStartDateChange={onStartDateChange}
                  onEndDateChange={onEndDateChange}
                />
              </div>
            </>
          )}

          {isMediumScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
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
                          onStartDateChange={onStartDateChange}
                          onEndDateChange={onEndDateChange}
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
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
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
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
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

          {isAddSubscriptionModalOpen && (
            <div
              className={
                isSmallScreen
                  ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-45"
                  : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-45"
              }
            >
              <div className="flex min-h-screen mb-5 items-center justify-center">
                <div
                  className="relative w-full max-w-xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-gray-300
      [&::-webkit-scrollbar-thumb]:bg-gray-400
       [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
                >
                  <div className="py-4 px-6">
                    <div className="flex items-center gap-1 mb-4">
                      <CalendarRange
                        className="text-blue-500"
                        size={SIZE.TWENTY_FOUR}
                      />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Subscribe for Future Access
                      </h2>
                      <button
                        onClick={() => {
                          setIsAddSubscriptionModalOpen(false);
                        }}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                      >
                        <X size={SIZE.TWENTY} />
                      </button>
                    </div>
                    <CreateSubscription 
                    handleSubscriptionListChange={handleSubscriptionListChange}
                    isSubscrptionFromLoginPage={false}
                    isOpen={isAddSubscriptionModalOpen}
                    onClose={()=>{
                      setIsAddSubscriptionModalOpen(false);
                    }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {userHasAccessToAddSubscription ? (
            <>
              <div className="flex gap-1">
                <Button onClick={() => setIsAddSubscriptionModalOpen(true)}>
                  {!isSmallScreen && (
                    <IndianRupee className="mt-0.5" size={17} />
                  )}
                  {isSmallScreen && <IndianRupee size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.ADD_SUBSCRIPTION}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-1">
              <Button disabled={true}>
                {!isSmallScreen && <IndianRupee className="mt-0.5" size={17} />}
                {isSmallScreen && <IndianRupee size={SIZE.EIGHT} />}

                {isLargeScreen && JSX_CHILDREN_NAME.ADD_SUBSCRIPTION}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className="ag-theme-alpine w-full"
            style={{ height: "100%", width: "100%" }}
          >
            <SubscriptionListAggrid
              handleSelectedSubscription={handleSelectedSubscription}
              handleUpdateSubscriptionModalOpen={
                handleUpdateSubscriptionModalOpen
              }
              subscriptionList={subscriptionList}
            />
          </div>
        </div>

        <div className="flex items-center justify-end ">
          <Pagination
            totalPages={paginationData.totalPages}
            currentPage={paginationData.currentPage}
            pageSize={paginationData.pageSize}
            onPageChange={paginationData.handlePageChange}
            onPageSizeChange={paginationData.selectedPageSize}
          />
        </div>

        {/* NOTE : This is the modal for UPDATING CREATED SUBSCRIPTION */}
        {isUpdateSubscriptionModalOpen && (
          <UpdateSubscription 
          handleSubscriptionListChange={handleSubscriptionListChange}
          subscriptionId={selectedSubscription.id}
            existingUserCount={selectedSubscription.allowedUserCount}
            startDate={selectedSubscription.startDate}
            endDate={selectedSubscription.endDate}
            isOpen={isUpdateSubscriptionModalOpen}
            onClose={()=>{
              setIsUpdateSubscriptionModalOpen(false);
            }}
          />
        )}
      </div>
    )
  );
}

export default SubscriptionManagementList;
