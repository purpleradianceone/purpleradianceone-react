import LeadDataProps from "./LeadProps";

type UpdateLeadProps = {
    isOpen: boolean;
    onClose: () => void,
    selectedLeadForEdit  : LeadDataProps,
    onEditRefreshLeadData? : () => void, //note : done non mandatory right now if using then remove ?
}

export default UpdateLeadProps;