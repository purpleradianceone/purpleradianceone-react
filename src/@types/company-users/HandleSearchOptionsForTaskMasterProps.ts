import CompanyUser from "./CompanyUser";

type HandleSearchOptionsForTaskMasterProps = {
    handleSearchPageCriteriaIdChange?: (criteriaId?:number) =>void,
    handleDateRangeIdChange : (dateRangeId? : number) => void,
    handleSearchParameterChange: (searchParameter?: string) => void,
    searchParameter? : string,
    dateRangeId ? : number,
    startDate ? : string,
    endDate ? : string,
    selectedTaskType ? : number,
    selectedPriority ? : number 
    selectedFrequency ? : number,
    selectedCompanyUser ? : CompanyUser
}
export default HandleSearchOptionsForTaskMasterProps;