import { APP_VERSION } from "../../../@types/config/AppVersion";

export const AppVersionViewCard = () => {
  return (
    <span className="caption-custom flex w-full justify-center items-center  mb-1">
      {APP_VERSION}{" "}
    </span>
  );
};
