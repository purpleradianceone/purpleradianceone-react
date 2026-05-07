import {
  Calendar,
  IndianRupee,
  CreditCard,
  CalendarRange,
} from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import useScreenSize from "../../config/hooks/useScreenSize";
import { SIZE, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import SubscriptionListAggrid from "../ag-grid/SubscriptionListAggrid";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SubscriptionListProps from "../../@types/subscription/SubscriptionListProps";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import Button from "../ui/Button";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import {  useState } from "react";
import CreateSubscription from "../subscription-module/CreateSubscription";
import UpdateSubscription from "../subscription-module/UpdateSubscription";
import { useUserPreference } from "../../context/user/UserPreference";
import FormHeader from "../ui/FormHeader";
import PaginationWithoutCount, { PaginationDataWithoutCountProps } from "../ag-grid/PaginationWithoutCount";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";

function SubscriptionManagementList({
  subscriptionList,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleSubscriptionListChange,
  isDataLoading
}: {
  subscriptionList: SubscriptionListProps[];
  paginationData: PaginationDataWithoutCountProps;
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  handleSubscriptionListChange: () => void;
  isDataLoading : boolean
}) {
  const { userPreference } = useUserPreference();
  const [isAddSubscriptionModalOpen, setIsAddSubscriptionModalOpen] =
    useState(false);

  const { userHasAccessToAddSubscription, userHasAccessToViewSubscription } =
    useUserAccessModules();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const { isCustomDateOptionSelected, handleDateRangeIdChange } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
  const { isLargeScreen, isSmallScreen } = useScreenSize();

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
      subscriptionStatus: "",
    });
  const handleUpdateSubscriptionModalOpen = (status: boolean) => {
    setIsUpdateSubscriptionModalOpen(status);
  };
  const handleSelectedSubscription = (params: SubscriptionListProps) => {
    setSelectedSubscription(params);
  };
  return (
    userHasAccessToViewSubscription && (
      <div
        className={`w-full ${
          userPreference.isLeftMenu ? "pl-5" : "pl-1"
        }   pr-1 gap-1`}
      >
        <div className="sticky z-10 top-9 mt-1 p-0.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <ComponentHeaderAndLogo headerText="Subscription" logo={CreditCard}/>
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
                      <Calendar className="input-label-custom" />
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

          {isAddSubscriptionModalOpen && (
            <div
              className={
                isSmallScreen
                  ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-5"
                  : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-5"
              }
            >
              <div className="flex min-h-screen mb-5 items-center justify-center">
                <div
                  className="relative w-full  max-w-xl min-h-[50vh] max-h-[100vh]  bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-gray-300
      [&::-webkit-scrollbar-thumb]:bg-gray-400
       [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
                >
                  <div className="py-3 px-4">
                    {/* <div className="flex items-center gap-1 mb-4">
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
                    </div> */}

                    <FormHeader
                      icon={CalendarRange}
                      preText="Subscribe for future access"
                      description="Subscribe now to secure future access in advance."
                      onClose={() => {
                          setIsAddSubscriptionModalOpen(false);
                        }}
                    />
                    <CreateSubscription
                      handleSubscriptionListChange={
                        handleSubscriptionListChange
                      }
                      isSubscrptionFromLoginPage={false}
                      isOpen={isAddSubscriptionModalOpen}
                      onClose={() => {
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
                <Button type="submit" onClick={(e) => {
                  e.preventDefault();
                  setIsAddSubscriptionModalOpen(true);
                }}>
                  {/* {!isSmallScreen && (
                    <IndianRupee className="mt-0.5" size={17} />
                  )}
                  {isSmallScreen && <IndianRupee size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.ADD_SUBSCRIPTION} */}
                  <div className="flex items-center gap-0.5">
            <IndianRupee size={SIZE.SIXTEEN}/> {JSX_CHILDREN_NAME.ADD_SUBSCRIPTION}</div>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-1">
              <Button type="submit" onClick={(e) => {
                e.preventDefault();
              }} disabled={true}>
               <div className="flex items-center gap-0.5">
            <IndianRupee size={SIZE.SIXTEEN}/> {JSX_CHILDREN_NAME.ADD_SUBSCRIPTION}</div>
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(100vh-118px)]`
                : "ag-theme-balham w-full h-[calc(100vh-126px)]"
            }
          >
            <SubscriptionListAggrid
              handleSelectedSubscription={handleSelectedSubscription}
              handleUpdateSubscriptionModalOpen={
                handleUpdateSubscriptionModalOpen
              }
              subscriptionList={subscriptionList}
              isDataLoading={isDataLoading}
            />
          </div>
        </div>

        <div className="flex items-center justify-end ">
          <PaginationWithoutCount
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            pageSize={paginationData.pageSize}
            onPageChange={paginationData.onPageChange}
            onPageSizeChange={paginationData.onPageSizeChange}
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
            onClose={() => {
              setIsUpdateSubscriptionModalOpen(false);
            }}
          />
        )}
      </div>
    )
  );
}

export default SubscriptionManagementList;
