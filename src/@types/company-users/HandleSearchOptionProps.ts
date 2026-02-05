type HandleSearchOptionProps = {
    handleSearchPageCriteriaIdChange?: (criteriaId?:number) =>void,
    handleDateRangeIdChange : (dateRangeId? : number) => void,
    handleSearchParameterChange: (searchParameter?: string) => void,
    searchParameter? : string ,
    dateRangeId ? : number,
    startDate ? : string,
    endDate ? : string,
    selectedSupportTicketCategory ? : number ,
    selectedSupportTicketSource ? : number ,
    selectedSupportTicketLifecycle ? : number ,
}
export default HandleSearchOptionProps;