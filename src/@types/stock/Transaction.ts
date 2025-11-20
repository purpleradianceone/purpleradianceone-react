type Transaction = {
    count : number,
    id : number,
    companyProductId : number,
    companyProductName : string ,
    transactionTypeId: number,
    transactionTypeName : string ,
    quantity : number,
    isInward : boolean,
    otherDetails: string | null,
    description: string | null,
    transactionDate : string ,
    createdBy: string ,
    createdOn : string 
}
export default Transaction;