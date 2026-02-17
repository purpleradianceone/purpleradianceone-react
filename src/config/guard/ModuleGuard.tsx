import React from "react";
import { useUserAccessModules } from "../hooks/useAccessModules";
import AccessDeniedMessagePage from "../../components/views/not-found/AccessDeniedMessagePage";

interface ModuleGuardProps {
  permissionKey: keyof ReturnType<typeof useUserAccessModules>;
  deniedMessage?: string;
  children: React.ReactNode;
}
export function ModuleGuard({
  children,
  permissionKey,
  deniedMessage = "Dont have permission",
}: ModuleGuardProps) {
  const permission = useUserAccessModules();

  if (!permission[permissionKey]) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <AccessDeniedMessagePage message={deniedMessage} />
      </div>
    );
  }
  return <>{children}</>;
}
