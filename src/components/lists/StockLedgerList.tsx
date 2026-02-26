/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen } from "lucide-react";
import Transaction from "../../@types/stock/Transaction";
import COLORS from "../../constants/Colors";
import { useUserPreference } from "../../context/user/UserPreference";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import TransactionAgGrid from "../ag-grid/TransactionAgGrid";
import CustomDropdown from "../modals/leads/CustomDropdown";
import DatePickerInput from "../ui/DatePickerInput";
import LookupCompanyProductDropdown from "../ui/LookupCompanyProductDropdown";

const StockLedgerList = ({
  stockLedger,
  paginationData,
  trasactionType,
  handleSelectedTransactionType,
  selectedTransactionType,
  handleDateChange,
  transactionDate,
  setCompanyProductId,
}: {
  stockLedger: Transaction[];
  paginationData: any;
  trasactionType: { id: number; name: string }[] | undefined;
  handleSelectedTransactionType: (selectedValue: number | undefined) => void;
  selectedTransactionType: { id: number; name: string } | undefined;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  transactionDate: string;
  setCompanyProductId: (id: number | null) => void;
}) => {
  const { userPreference } = useUserPreference();

  return (
    <div
      className={`w-full  pt-1  ${
        userPreference.isLeftMenu ? "pl-1" : "pl-1"
      } pr-1 gap-1`}
    >
      <div
        className={`sticky z-10 top-9 py-0.5 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex items-center pl-1 gap-5">
          <div className="flex gap-1">
            <BookOpen className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
            <span className="section-header-custom">Stock Ledger</span>
          </div>

          <div className="flex justify-center items-center  gap-1">
            {/* search box flex div */}
            <div className="min-w-[250px]">
              <LookupCompanyProductDropdown
                onProductSelected={(product) => {
                  setCompanyProductId(product?.id ?? null);
                }}
              />
            </div>

            <div className="min-w-[150px]">
              <DatePickerInput
                name="validFrom"
                defaultValue={transactionDate}
                placeholder="Select Date"
                onChange={handleDateChange}
              />
            </div>

            <div className="min-w-[150px]">
              <CustomDropdown
                preselectedOption={
                  // savedFilters.selectedtaskType || null
                  selectedTransactionType?.id
                }
                labelName="type"
                options={trasactionType!}
                onSelect={handleSelectedTransactionType}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            userPreference.isLeftMenu
              ? `ag-theme-balham w-full h-[calc(100vh-190px)]`
              : "ag-theme-balham w-full h-[calc(100vh-192px)]"
          }
        >
          <TransactionAgGrid data={stockLedger} />
        </div>
        <div className="flex items-center justify-end ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageChange={paginationData.onPageChange}
            onPageSizeChange={paginationData.onPageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StockLedgerList;
