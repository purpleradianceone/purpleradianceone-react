import { useEffect, useState } from "react";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function NotAuthorized() {
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

        />
    )
}

export default NotAuthorized;

