import { Clock } from "lucide-react";
import { PageLayout } from "../../../../ui/PageLayout";

const MetaAppWhatsappIntegration = () => {
  return (
    <PageLayout>

    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-72 h-40 border rounded-xl shadow-md flex flex-col items-center justify-center bg-gray-50 gap-2">
        <Clock size={28} className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-700">Coming Soon</h2>
        <p className="text-sm text-blue-500 ">Currently under development</p>
        <p className="text-sm text-gray-500"> This feature will be available soon.
        </p>
      </div>
    </div>
    </PageLayout>
  );
};

export default MetaAppWhatsappIntegration;
