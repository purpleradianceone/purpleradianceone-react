import { LucideIcon } from "lucide-react"

export const ComponentHeaderAndLogo=({
    logo : Logo,
    headerText
}:{
    logo : LucideIcon,
    headerText : string 
})=>{
    return(
         <div className="flex items-center gap-1">
                <Logo className="text-blue-600 h-5 w-5"/>
                <span className="section-header-custom">{headerText}</span>
              </div>
    )
}