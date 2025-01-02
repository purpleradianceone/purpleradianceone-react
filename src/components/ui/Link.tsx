
import React from "react";
import { Link } from "react-router-dom";

type LinkProp={
    to:string,
    children : React.ReactNode
    className:string
}

function  LinkComponent({to , children }: LinkProp)  {
    return(
        <Link to={to} className="text-blue-600" children={children}/>
    )
}
export default LinkComponent;