import { InfoIcon } from "lucide-react";

function AccessDeniedMessagePage({
  message ="You do not have the necessary permissions to view or modify this setting."
}:{
  message ?:string
}){
    return(
        <div className="flex justify-center p-6 font-roboto">
  <div className="bg-white border border-gray-100 rounded-lg shadow-md p-6 text-center max-w-md">
    <InfoIcon className="text-red-500 w-10 h-10 mx-auto mb-4"></InfoIcon>
    <h3 className="text-ms table-data font-bold text-blue-500 mb-2">Access Denied</h3>
    <p className="text-gray-700 caption-custom">
      {message}
      <br />
      Please contact your administrator to request access if required.
    </p>
   
  </div>
</div> 
    )
}

export default AccessDeniedMessagePage;