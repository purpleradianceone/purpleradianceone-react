/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react";
import FormLayout from "../../ui/FormLayout";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import DatePickerInput from "../../ui/DatePickerInput";
import { ClipboardPen, LucideCalendar, Receipt } from "lucide-react";
import { useFormattedForPostData } from "../../../config/hooks/useFormatDateForPostData";
import useTransactionType from "../../../config/hooks/useTransactionType";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import Transaction from "../../../@types/stock/Transaction";
import Pagination from "../../ag-grid/Pagination";
import TransactionAgGrid from "../../ag-grid/TransactionAgGrid";
import { useUserPreference } from "../../../context/user/UserPreference";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import FormHeader from "../../ui/FormHeader";

const StockTransactions = ({
  companyProductId,
   onClose
   }: {
    companyProductId : number ;
     onClose: () => void;
     }) => {
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();
  const { loading: transactionTypeDataLoading, transactionType } =
    useTransactionType();
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setTransactionDate(e.target.value);
  }
  const [transactionId , setTransactionId ] = useState<number | null>(null )
  function handleTransactionTypeChange(id : number){
    if ( id !== 0 && id !== undefined || id !== null){
        setTransactionId( id )
    }
  }

  const formattedDate = useFormattedForPostData(transactionDate);

  const {
      currentPage,
      pageSize,
      totalPages,
      setTotalPages,
      handlePageChange,
      handlePageSizeChange,
    } = useSearchFilterPaginationDateHandlers();
  

  const getStockTrasactions = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      company_product_id: companyProductId,
      transaction_type_id: transactionId,
      transaction_date: formattedDate,
      offset: offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_STOCK, postData, { withCredentials: true })
      .then((response) => {

        if(response.status === STATUS_CODE.OK){

            const data = response.data;
            if (data.length > 0) {
                setTotalPages(Math.ceil(response.data[0].count / pageSize));
            }

            const formattedData : Transaction[] = data.map((item : any)=>({
            count : item.count,
            id : item.id,
            companyProductId : item.company_product_id,
            companyProductName : item.company_product_name,
            transactionTypeId: item.transaction_type_id,
            transactionTypeName : item.transaction_type_name ,
            quantity : item.quantity,
            isInward : item.is_inward,
            otherDetails: item.other_details,
            description: item.description,
            transactionDate : item.transaction_date ,
            createdBy: item.createdby ,
            createdOn : item.createdon 
            }))

            setTransactions(formattedData);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: getStockTrasactions,
          });
          if (refreshTokenResponse) {
            getStockTrasactions(signal);
          }
        }
      });
  };

  useEffect(() => {
    const contoller = new AbortController();
    getStockTrasactions(contoller.signal);

    return () => {
      contoller.abort();
    };
  }, [transactionDate , currentPage , pageSize , transactionId]);

  function handleResetTransactionType (){

  }
  if (transactionTypeDataLoading) {
    <FormLayout>
      <LoadingPopUpAnimation show={transactionTypeDataLoading} />
    </FormLayout>;
  }
  return (
    <FormLayout>
      <FormHeader
        icon={Receipt}
        onClose={onClose}
        preText="Transaction history"
        description="Check daily transaction history — select a date to view past records. "
      />
      <div className="flex items-center gap-2"> 

        <DatePickerInput
          label="Transactions Date "
          required
          logo={LucideCalendar}
          name="validFrom"
          defaultValue={transactionDate}
          placeholder="Select Date"
          onChange={handleDateChange}
        />
        {/* adjustment reason */}
              <div className="mt-2 p-1.5  items-center ">
                <h1 className="input-label-custom  mb-1 gap-1 flex items-center ">
                  <ClipboardPen className="text-blue-500" size={15} />{" "}
                  Transaction Type 
                </h1>
                <div className="flex flex-wrap gap-3">
                  {transactionType.length > 0 &&
                    transactionType.map((option: any) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-2 px-1 py-1 border rounded cursor-pointer transition ${
                          transactionId === option.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="adjustmentReason"
                          value={option.id}
                          checked={transactionId === option.id}
                          onChange={() =>
                            handleTransactionTypeChange(option.id)
                          }
                          className="accent-blue-600 cursor-pointer"
                        />

                        <span className="caption-custom">{option.name}</span>
                      </label>
                    ))}
                    <button className="h-1"
                      onClick={handleResetTransactionType}
                    >✖️</button>
                </div>
                
              </div>
      </div>
        {/* <h2>Stock transactions.</h2> */}

      {/* Data Grid Section */}
      <div
        className={`ag-theme-balham w-full ${
          userPreference.isLeftMenu
            ? "h-[calc(100vh-140px)]"
            : "h-[calc(100vh-148px)]"
        }`}
      >
        <TransactionAgGrid data={transactions} />
      </div>
      <div className="flex items-center justify-end ">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </FormLayout>
  );
};

export default StockTransactions;
