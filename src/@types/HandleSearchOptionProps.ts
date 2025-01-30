type HandleSearchOptionProps = {
    handleSearchPageCriteriaIdChange: (criteriaId?:number) =>void,
    handleDateIdChange : (dateRangeId? : number) => void,
    handleSearchParameterChange: (searchParameter?: string) => void,
}
export default HandleSearchOptionProps;