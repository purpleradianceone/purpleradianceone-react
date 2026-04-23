import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiError } from "../../../../config/error/handleApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { getGoogleAdsIntegration } from "../../../../config/apis/IntegrationApis";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

type GoogleIntegrationStatusType = {
  id: number;
  companyId: number;
  isActive: boolean;
};

export const GoogleAdsIntegrationStatus = ({
  googleIntegrationStatus,
  setGoogleIntegrationStatus,
}: {
  googleIntegrationStatus: GoogleIntegrationStatusType | null;
  setGoogleIntegrationStatus: React.Dispatch<
    React.SetStateAction<GoogleIntegrationStatusType | null>
  >;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [loading, setLoading] = useState<boolean>(false);

  const getGoogleAdsIntegrationStatus = async () => {
    try {
      setLoading(true);

      const response = await getGoogleAdsIntegration({
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
      });

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;

        setGoogleIntegrationStatus({
          id: responseData.id,
          companyId: responseData.company_id,
          isActive: responseData.isactive,
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGoogleAdsIntegrationStatus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!googleIntegrationStatus) return null;

  return (
    <div
      className={`w-full border ${
        googleIntegrationStatus.isActive
          ? "bg-green-100 border-green-300 text-green-700"
          : "bg-red-100 border-red-300 text-red-700"
      } px-4 py-3 rounded-md flex items-center justify-center gap-2`}
    >
      <AlertCircle size={18} />
      <span className="font-medium">
        {googleIntegrationStatus.isActive
          ? "Google Account is connected."
          : "Google Account is not connected."}
      </span>
    </div>
  );
};