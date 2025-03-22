import { useAccessManagementContext } from "../../context/user/AccessManagementContext";


export const useUserAccessModules = () => {
  const { accessModules} = useAccessManagementContext();

  //User Management
  const userHasAccessToAddUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 1 && accessModule.add
  );
  const userHasAccessToViewUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 1 && accessModule.view
  );

  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 1 && accessModule.update
  );

  //Access Management
  const userHasAccessToAddAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 2 && accessModule.add
  );

  const userHasAccessToViewAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 2 && accessModule.view
  );

  const userHasAccessToUpdateAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 2 && accessModule.update
  );

  //Lead Management
  const userHasAccessToViewLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 3 && accessModule.view
  );

  const userHasAccessToUpdateLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 3 && accessModule.update
  );

  const userHasAccessToAddLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 3 && accessModule.add
  );

  //Product Management
  const userHasAccessToViewProduct = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 4 && accessModule.view
  );

  const userHasAccessToUpdateProduct = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 4 && accessModule.update
  );

  const userHasAccessToAddProduct = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 4 && accessModule.add
  );

  //Product Tax Management
  const userHasAccessToViewProductTax = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 5 && accessModule.view
  );

  const userHasAccessToUpdateProductTax = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 5 && accessModule.update
  );

  const userHasAccessToAddProductTax = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 5 && accessModule.add
  );

  //Team Management
  const userHasAccessToViewTeamManagement = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 6 && accessModule.view
  );

  const userHasAccessToUpdateTeamManagement = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 6 && accessModule.update
  );

  const userHasAccessToAddTeamManagement = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 6 && accessModule.add
  );

  //Subscription
  const userHasAccessToViewSubscription = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 7 && accessModule.view
  );

  const userHasAccessToUpdateSubscription = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 7 && accessModule.update
  );

  const userHasAccessToAddSubscription = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 7 && accessModule.add
  );

  //Product Team / User Management
  const userHasAccessToViewProductTeam = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 8 && accessModule.view
  );

  const userHasAccessToUpdateProductTeam = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 8 && accessModule.update
  );

  const userHasAccessToAddProductTeam = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 8 && accessModule.add
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
    userHasAccessToAddProduct,
    userHasAccessToViewProduct,
    userHasAccessToUpdateProduct,
    userHasAccessToAddProductTax,
    userHasAccessToViewProductTax,
    userHasAccessToUpdateProductTax,
    userHasAccessToAddTeamManagement,
    userHasAccessToViewTeamManagement,
    userHasAccessToUpdateTeamManagement,
    userHasAccessToAddSubscription,
    userHasAccessToViewSubscription,
    userHasAccessToUpdateSubscription,
    userHasAccessToAddProductTeam,
    userHasAccessToViewProductTeam,
    userHasAccessToUpdateProductTeam,
  };
};
