import { XCircle } from "lucide-react";


/**
 * SHOWS CARD INFO THAT - META INTEGRATION IS NOT DONE 
 * @returns JSX
 */
const MetaAppWhatsappIntegration = () => {
  return (

    <div className="h-screen w-full flex items-center justify-center">
      <div className="p-3 h-40 border rounded-xl shadow-md flex flex-col items-center justify-center bg-white gap-2">
        <XCircle size={28} className="text-red-500" />
        <h2 className="text-lg font-semibold text-gray-700">Facebook account is not connected</h2>
        <p className="text-sm text-blue-500 ">First do the Meta integration then this feature will be auto enabled.</p>
      </div>
    </div>
  );
};

export default MetaAppWhatsappIntegration;
