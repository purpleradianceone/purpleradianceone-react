import AssignProductLeadProps from "../../../@types/lead-management/AssignProductLeadProps";
import { usePanel } from "../../../context/panel/usePanel";

const AssignProductToLead =({
    isOpen,
    onClose
}: AssignProductLeadProps) =>{

    const {position}= usePanel();

    if(!isOpen) return null;
    return (
        <div className={`fixed ${position==='left' ? " left-14 top-12" : "top-12"}  z-10 h-full w-full bg-slate-100 `}>
            <button onClick={()=>{
                onClose();
            }}>Close</button>
        <h1 >Assign Product To lead</h1>
        </div>
    )
}

export default AssignProductToLead;