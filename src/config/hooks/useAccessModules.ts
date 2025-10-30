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

//  email template
    const userHasAccessToViewSettingGeneral = accessModules.some(
    (accessModule)=>
        accessModule.crm_module_id === 9 && accessModule.view
  );

   const userHasAccessToUpdateSettingGeneral = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 9 && accessModule.update
  );

  const userHasAccessToAddSettingGeneral = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 9 && accessModule.add
  );

  //Setting - Email
  const userHasAccessToViewEmailSetting = accessModules.some(
    (accessModule)=>
        accessModule.crm_module_id === 10 && accessModule.view
  );

   const userHasAccessToUpdateEmailSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 10 && accessModule.update
  );

  const userHasAccessToAddEmailSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 10 && accessModule.add
  );
  
  //meeting setting
  const userHasAccessToViewMeetingSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 11 && accessModule.view
  );

  const userHasAccessToUpdateMeetingSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 11 && accessModule.update
  );

  const userHasAccessToAddMeetingSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 11 && accessModule.add
  );

  //meeting
  const userHasAccessToViewMeeting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 12 && accessModule.view
  );

  const userHasAccessToUpdateMeeting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 12 && accessModule.update
  );

  const userHasAccessToAddMeeting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 12 && accessModule.add
  );

  //email setting company
  const userHasAccessToAddEmailSettingCompany = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 13 && accessModules.add
  );


   const userHasAccessToViewEmailSettingCompany = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 13 && accessModule.view
  );

  const userHasAccessToUpdateEmailSettingCompany = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 13 && accessModule.update
  );

  //setting lead
  const userHasAccessToAddSettingLead = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 14 && accessModules.add
  );

   const userHasAccessToViewSettingLeady = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 14 && accessModule.view
  );

  const userHasAccessToUpdateSettingLead = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 14 && accessModule.update
  );

  //setting email template
const userHasAccessToAddEmailTemplateSetting = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 15 && accessModules.add
  );

   const userHasAccessToViewEmailTemplateSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 15 && accessModule.view
  );

  const userHasAccessToUpdateEmailTemplateSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 15 && accessModule.update
  );

  //email type setting 
  const userHasAccessToAddEmailTypeSetting = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 16 && accessModules.add
  );

   const userHasAccessToViewEmailTypeSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 16 && accessModule.view
  );

  const userHasAccessToUpdateEmailTypeSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 16 && accessModule.update
  );

  //company preferences setting
   //email type setting 
  const userHasAccessToAddCompanyPreferences = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 17 && accessModules.add
  );

   const userHasAccessToViewCompanyPreferences = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 17 && accessModule.view
  );

  const userHasAccessToUpdateCompanyPreferences = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 17 && accessModule.update
  );

  
   //Dashboard
  const userHasAccessToAddDashboard = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 18 && accessModules.add
  );

   const userHasAccessToViewDashboard  = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 18 && accessModule.view
  );

  const userHasAccessToUpdateDashboard = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 18 && accessModule.update
  );

  //company account type
  const userHasAccessToAddCompanyAccountType = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 19 && accessModules.add
  );

   const userHasAccessToViewCompanyAccountType  = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 19 && accessModule.view
  );

  const userHasAccessToUpdateCompanyAccountType = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 19 && accessModule.update
  );

  //account 
  const userHasAccessToAddAccount = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 20 && accessModules.add
  );

   const userHasAccessToViewAccount  = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 20 && accessModule.view
  );

  const userHasAccessToUpdateAccount = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 20 && accessModule.update
  );

  //setting-Integration
  const userHasAccessToAddIntegrationSetting = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 21 && accessModules.add
  );

   const userHasAccessToViewIntegrationSetting  = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 21 && accessModule.view
  );

  const userHasAccessToUpdateIntegrationSetting = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 21 && accessModule.update
  );

  //stock
  const userHasAccessToAddStock = accessModules.some(
    (accessModules) => 
      accessModules.crm_module_id === 23 && accessModules.add
  );

   const userHasAccessToViewStock  = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 23 && accessModule.view
  );

  const userHasAccessToUpdateStock = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === 23 && accessModule.update
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

    userHasAccessToAddSettingGeneral,
    userHasAccessToViewSettingGeneral,
    userHasAccessToUpdateSettingGeneral,

    userHasAccessToAddEmailSetting,
    userHasAccessToViewEmailSetting,
    userHasAccessToUpdateEmailSetting,

    userHasAccessToViewMeetingSetting,
    userHasAccessToUpdateMeetingSetting,
    userHasAccessToAddMeetingSetting,
    
    userHasAccessToViewMeeting,
    userHasAccessToUpdateMeeting,
    userHasAccessToAddMeeting,

    userHasAccessToAddEmailSettingCompany,
    userHasAccessToViewEmailSettingCompany,
    userHasAccessToUpdateEmailSettingCompany,

    userHasAccessToAddSettingLead,
    userHasAccessToViewSettingLeady,
    userHasAccessToUpdateSettingLead,

    userHasAccessToAddEmailTemplateSetting,
    userHasAccessToViewEmailTemplateSetting,
    userHasAccessToUpdateEmailTemplateSetting,

    userHasAccessToAddEmailTypeSetting,
    userHasAccessToViewEmailTypeSetting,
    userHasAccessToUpdateEmailTypeSetting,

    userHasAccessToAddCompanyPreferences,
    userHasAccessToViewCompanyPreferences,
    userHasAccessToUpdateCompanyPreferences,

    userHasAccessToAddDashboard,
    userHasAccessToViewDashboard,
    userHasAccessToUpdateDashboard,

    userHasAccessToAddCompanyAccountType,
    userHasAccessToViewCompanyAccountType,
    userHasAccessToUpdateCompanyAccountType,

    userHasAccessToAddAccount,
    userHasAccessToViewAccount,
    userHasAccessToUpdateAccount,

    userHasAccessToAddIntegrationSetting,
    userHasAccessToViewIntegrationSetting,
    userHasAccessToUpdateIntegrationSetting,

    userHasAccessToAddStock,
    userHasAccessToViewStock,
    userHasAccessToUpdateStock
  };
};
