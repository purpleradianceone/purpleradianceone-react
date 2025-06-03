import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";

type TemplatePageProps = {
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
}

export default TemplatePageProps;