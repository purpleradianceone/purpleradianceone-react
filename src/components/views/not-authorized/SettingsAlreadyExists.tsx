import { useEffect, useState } from "react";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function SettingsAlreadyExists(){
     const [isDialogueOpen,setIsDialogueOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsDialogueOpen(true);
    },[])
    return(
        <AccessDeniedPopup
        isOpen={isDialogueOpen}
        onClose={()=> {
            setIsDialogueOpen(false);
            window.history.back();
        }}
        message="Settings Already Exists! To Remove Settings Please Contact Admin/Helpdesk"
        />
    )
}
export default SettingsAlreadyExists;