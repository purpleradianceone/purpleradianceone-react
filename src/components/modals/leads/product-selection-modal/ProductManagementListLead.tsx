import {  Calendar, Filter, X } from "lucide-react";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import { useState } from "react";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../../../config/hooks/useDateRangeIdChange";
import SearchInput from "../../../ui/SearchInput";
import DateRangeFilterDropdown from "../../../ui/DateRangeFilterDropdown";
import DateRangePicker from "../../../ui/DateRangePicker";
import { SIZE } from "../../../../constants/AppConstants";
import Pagination from "../../../ag-grid/Pagination";
import Button from "../../../ui/Button";
import ProductsManagementGridLead from "./ProductManagementAgGridLead";
import LeadProductsManagementListProps from "../../../../@types/lead-management/LeadProductManagementListProps";

function ProductsManagementListLead({
  products,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  // handleSelectedProductChange,
  interestTypeData,
  handleProductCheckboxChange,
  alreadyAssignedCompanyProduct
}: LeadProductsManagementListProps) {
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const { userHasAccessToViewProduct } = useUserAccessModules();
  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);
  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] =
    useState(false);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  if (userHasAccessToViewProduct) {
    return (
      <div className="w-full p-2">
        <div className="sticky z-10 top-9  flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1 w-full">
          <div className="flex justify-between w-full ">
            {/* <div className="flex  gap-2"> */}
              {/* {!isSmallScreen ? ( */}
                 {/* <BoxesIcon className="w-6 h-6 text-blue-600 mt-2" /> */}
              {/* ) : ( */}
                {/* <Store className="w-6 h-6 text-blue-600 mt-2" /> */}
              {/* )} */}

              {/* {(isMediumScreen || isLargeScreen) && (
                <>
                  <span className="text-1xl font-bold mt-2">
                    Product Management
                  </span>
                </>
              )} */}
            {/* </div> */}

            {isLargeScreen && (
              <>
                <div className="flex gap-1">
                  {/* search box flex div */}
                  <div className="relative flex items-start w-80 ">
                    <SearchInput
                      onChange={(e) => {
                        handleSearchOption.handleSearchParameterChange(
                          e.target.value
                        );
                      }}
                    ></SearchInput>
                  </div>

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
                          setIsFilterOpenInTabletView(
                            !isFilterOpenInTabletView
                          );
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
          </div>
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className="ag-theme-balham "
            style={{ height: "65vh", width: "100%" }}
          >
            <ProductsManagementGridLead
              handleProductCheckboxChange={handleProductCheckboxChange}
              products={products}
              // handleSelectedProductChange={handleSelectedProductChange}
              interestTypeData={interestTypeData}
              alreadyAssignedCompanyProduct={alreadyAssignedCompanyProduct}
            />
          </div>
        </div>
        <div className="flex items-center justify-end mt-1">
          <Pagination
            totalPages={paginationData.totalPages}
            currentPage={paginationData.currentPage}
            pageSize={paginationData.pageSize}
            onPageChange={paginationData.handlePageChange}
            onPageSizeChange={paginationData.selectedPageSize}
          />
        </div>
      </div>
    );
  }
}

export default ProductsManagementListLead;
