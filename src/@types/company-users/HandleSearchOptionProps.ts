type HandleSearchOptionProps = {
    handleSearchPageCriteriaIdChange?: (criteriaId?:number) =>void,
    handleDateRangeIdChange : (dateRangeId? : number) => void,
    handleSearchParameterChange: (searchParameter?: string) => void,
    searchParameter? : string ,
    dateRangeId ? : number
}
export default HandleSearchOptionProps;