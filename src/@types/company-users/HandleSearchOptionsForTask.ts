import { souceType } from "../../components/views/my-task-management/MyTaskManegement";

type HandleSearchOptionsForTaskProps = {
    handleSearchPageCriteriaIdChange?: (criteriaId?:number) =>void,
    handleDateRangeIdChange : (dateRangeId? : number) => void,
    handleSearchParameterChange: (searchParameter?: string) => void,
    searchParameter? : string ,
    dateRangeId ? : number,
    startDate ? : string,
    endDate ? : string,
    selectedTaskStage ? : number,
    selectedPriority ? : number,
    selectedSource ? : souceType ,
}
export default HandleSearchOptionsForTaskProps;