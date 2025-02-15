import { NUMBER_VALUES } from "../../constants/AppConstants";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";

export const useUserAccessModules = () => {
  const { accessModules } = useAccessManagementContext();

  //User Management

  const userHasAccessToAddUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.ONE && accessModule.add
  );
  const userHasAccessToViewUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.ONE && accessModule.view
  );

  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.ONE && accessModule.update
  );

  //Access Management
  const userHasAccessToAddAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.TWO && accessModule.add
  );

  const userHasAccessToViewAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.TWO && accessModule.view
  );

  const userHasAccessToUpdateAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.TWO && accessModule.update
  );

  //Lead Management
  const userHasAccessToViewLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.THREE && accessModule.view
  );

  const userHasAccessToUpdateLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.THREE && accessModule.update
  );

  const userHasAccessToAddLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.THREE && accessModule.add
  );

  return {
    userHasAccessToAddUser,
    userHasAccessToViewUser,
    userHasAccessToUpdateUser,
    userHasAccessToAddAccess,
    userHasAccessToViewAccess,
    userHasAccessToUpdateAccess,
    userHasAccessToAddLead,
    userHasAccessToViewLead,
    userHasAccessToUpdateLead,

  };
};
