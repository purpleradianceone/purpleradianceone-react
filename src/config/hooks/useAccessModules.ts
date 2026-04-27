import { useAccessManagementContext } from "../../context/user/AccessManagementContext";

export const useUserAccessModules = () => {
  const { accessModules } = useAccessManagementContext();

  //User Management
  const userHasAccessToAddUser = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 1 && accessModule.add,
  );
  const userHasAccessToViewUser = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 1 && accessModule.view,
  );

  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 1 && accessModule.update,
  );

  //Access Management
  const userHasAccessToAddAccess = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 2 && accessModule.add,
  );

  const userHasAccessToViewAccess = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 2 && accessModule.view,
  );

  const userHasAccessToUpdateAccess = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 2 && accessModule.update,
  );

  //Lead Management
  const userHasAccessToViewLead = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 3 && accessModule.view,
  );

  const userHasAccessToUpdateLead = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 3 && accessModule.update,
  );

  const userHasAccessToAddLead = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 3 && accessModule.add,
  );

  //Product Management
  const userHasAccessToViewProduct = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 4 && accessModule.view,
  );

  const userHasAccessToUpdateProduct = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 4 && accessModule.update,
  );

  const userHasAccessToAddProduct = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 4 && accessModule.add,
  );

  //Product Tax Management
  const userHasAccessToViewProductTax = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 5 && accessModule.view,
  );

  const userHasAccessToUpdateProductTax = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 5 && accessModule.update,
  );

  const userHasAccessToAddProductTax = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 5 && accessModule.add,
  );

  //Team Management
  const userHasAccessToViewTeamManagement = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 6 && accessModule.view,
  );

  const userHasAccessToUpdateTeamManagement = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 6 && accessModule.update,
  );

  const userHasAccessToAddTeamManagement = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 6 && accessModule.add,
  );

  //Subscription
  const userHasAccessToViewSubscription = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 7 && accessModule.view,
  );

  const userHasAccessToUpdateSubscription = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 7 && accessModule.update,
  );

  const userHasAccessToAddSubscription = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 7 && accessModule.add,
  );

  //Product Team / User Management
  const userHasAccessToViewProductTeam = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 8 && accessModule.view,
  );

  const userHasAccessToUpdateProductTeam = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 8 && accessModule.update,
  );

  const userHasAccessToAddProductTeam = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 8 && accessModule.add,
  );

  //  email template
  const userHasAccessToViewSettingGeneral = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 9 && accessModule.view,
  );

  const userHasAccessToUpdateSettingGeneral = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 9 && accessModule.update,
  );

  const userHasAccessToAddSettingGeneral = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 9 && accessModule.add,
  );

  //Setting - Email
  const userHasAccessToViewSettingPersonalEmail = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 10 && accessModule.view,
  );

  const userHasAccessToUpdateSettingPersonalEmail = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 10 && accessModule.update,
  );

  const userHasAccessToAddSettingPersonalEmail = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 10 && accessModule.add,
  );

  //meeting setting
  const userHasAccessToViewMeetingSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 11 && accessModule.view,
  );

  const userHasAccessToUpdateMeetingSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 11 && accessModule.update,
  );

  const userHasAccessToAddMeetingSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 11 && accessModule.add,
  );

  //meeting
  const userHasAccessToViewMeeting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 12 && accessModule.view,
  );

  const userHasAccessToUpdateMeeting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 12 && accessModule.update,
  );

  const userHasAccessToAddMeeting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 12 && accessModule.add,
  );

  //email setting company
  const userHasAccessToAddEmailSettingCompany = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 13 && accessModules.add,
  );

  const userHasAccessToViewEmailSettingCompany = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 13 && accessModule.view,
  );

  const userHasAccessToUpdateEmailSettingCompany = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 13 && accessModule.update,
  );

  //setting lead
  const userHasAccessToAddSettingLead = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 14 && accessModules.add,
  );

  const userHasAccessToViewSettingLead = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 14 && accessModule.view,
  );

  const userHasAccessToUpdateSettingLead = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 14 && accessModule.update,
  );

  //setting email template
  const userHasAccessToAddEmailTemplateSetting = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 15 && accessModules.add,
  );

  const userHasAccessToViewEmailTemplateSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 15 && accessModule.view,
  );

  const userHasAccessToUpdateEmailTemplateSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 15 && accessModule.update,
  );

  //email type setting
  const userHasAccessToAddEmailTypeSetting = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 16 && accessModules.add,
  );

  const userHasAccessToViewEmailTypeSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 16 && accessModule.view,
  );

  const userHasAccessToUpdateEmailTypeSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 16 && accessModule.update,
  );

  //company preferences setting
  //email type setting
  const userHasAccessToAddCompanyPreferences = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 17 && accessModules.add,
  );

  const userHasAccessToViewCompanyPreferences = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 17 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyPreferences = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 17 && accessModule.update,
  );

  //Dashboard
  const userHasAccessToAddDashboard = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 18 && accessModules.add,
  );

  const userHasAccessToViewDashboard = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 18 && accessModule.view,
  );

  const userHasAccessToUpdateDashboard = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 18 && accessModule.update,
  );

  //company account type
  const userHasAccessToAddCompanyAccountType = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 19 && accessModules.add,
  );

  const userHasAccessToViewCompanyAccountType = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 19 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyAccountType = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 19 && accessModule.update,
  );

  //account
  const userHasAccessToAddAccount = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 20 && accessModules.add,
  );

  const userHasAccessToViewAccount = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 20 && accessModule.view,
  );

  const userHasAccessToUpdateAccount = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 20 && accessModule.update,
  );

  //setting-Integration
  const userHasAccessToAddIntegrationSetting = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 21 && accessModules.add,
  );

  const userHasAccessToViewIntegrationSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 21 && accessModule.view,
  );

  const userHasAccessToUpdateIntegrationSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 21 && accessModule.update,
  );

  //Support Ticket
  const userHasAccessToAddSupportTicket = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 22 && accessModules.add,
  );

  const userHasAccessToViewSupportTicket = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 22 && accessModule.view,
  );

  const userHasAccessToUpdateSupportTicket = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 22 && accessModule.update,
  );

  const userHasAccessToAddSupportTicketTask = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 33 && accessModules.add,
  );

  const userHasAccessToViewSupportTicketTask = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 33 && accessModule.view,
  );

  const userHasAccessToUpdateSupportTicketTask = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 33 && accessModule.update,
  );

  //stock
  const userHasAccessToAddStock = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 23 && accessModules.add,
  );

  const userHasAccessToViewStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 23 && accessModule.view,
  );

  const userHasAccessToUpdateStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 23 && accessModule.update,
  );

  //setting
  const userHasAccessToAddSetting = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 24 && accessModules.add,
  );

  const userHasAccessToViewSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 24 && accessModule.view,
  );

  const userHasAccessToUpdateSetting = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 24 && accessModule.update,
  );

  //lead-product
  const userHasAccessToAddLeadProduct = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 25 && accessModules.add,
  );

  const userHasAccessToViewLeadProduct = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 25 && accessModule.view,
  );

  const userHasAccessToUpdateLeadProduct = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 25 && accessModule.update,
  );

  //lead-teams
  const userHasAccessToAddLeadTeams = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 26 && accessModules.add,
  );

  const userHasAccessToViewLeadTeams = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 26 && accessModule.view,
  );

  const userHasAccessToUpdateLeadTeams = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 26 && accessModule.update,
  );

  //lead-Contacts
  const userHasAccessToAddLeadContacts = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 27 && accessModules.add,
  );

  const userHasAccessToViewLeadContacts = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 27 && accessModule.view,
  );

  const userHasAccessToUpdateLeadContacts = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 27 && accessModule.update,
  );

  //lead-Details
  const userHasAccessToAddLeadDetails = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 28 && accessModules.add,
  );

  const userHasAccessToViewLeadDetails = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 28 && accessModule.view,
  );

  const userHasAccessToUpdateLeadDetails = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 28 && accessModule.update,
  );

  //lead-tasks
  const userHasAccessToAddLeadTasks = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 29 && accessModules.add,
  );

  const userHasAccessToViewLeadTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 29 && accessModule.view,
  );

  const userHasAccessToUpdateLeadTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 29 && accessModule.update,
  );

  //product-users
  const userHasAccessToAddProductUsers = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 30 && accessModules.add,
  );

  const userHasAccessToViewProductUsers = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 30 && accessModule.view,
  );

  const userHasAccessToUpdateProductUsers = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 30 && accessModule.update,
  );

  //product-stock
  const userHasAccessToAddProductStock = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 31 && accessModules.add,
  );

  const userHasAccessToViewProductStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 31 && accessModule.view,
  );

  const userHasAccessToUpdateProductStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 31 && accessModule.update,
  );

  //product-service-level-agrrement
  const userHasAccessToAddServiceLevelAgreement = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 32 && accessModules.add,
  );

  const userHasAccessToViewServiceLevelAgreement = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 32 && accessModule.view,
  );

  const userHasAccessToUpdateServiceLevelAgreement = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 32 && accessModule.update,
  );

  //account-leads
  const userHasAccessToAddAccountLeads = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 34 && accessModules.add,
  );

  const userHasAccessToViewAccountLeads = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 34 && accessModule.view,
  );

  const userHasAccessToUpdateAccountLeads = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 34 && accessModule.update,
  );

  //account-contacts
  const userHasAccessToAddAccountContacts = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 35 && accessModules.add,
  );

  const userHasAccessToViewAccountContacts = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 35 && accessModule.view,
  );

  const userHasAccessToUpdateAccountContacts = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 35 && accessModule.update,
  );

  //account-types
  const userHasAccessToAddAccountTypes = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 36 && accessModules.add,
  );

  const userHasAccessToViewAccountTypes = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 36 && accessModule.view,
  );

  const userHasAccessToUpdateAccountTypes = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 36 && accessModule.update,
  );

  //account-products
  const userHasAccessToAddAccountProducts = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 37 && accessModules.add,
  );

  const userHasAccessToViewAccountProducts = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 37 && accessModule.view,
  );

  const userHasAccessToUpdateAccountProducts = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 37 && accessModule.update,
  );

  //account-products-amc
  const userHasAccessToAddAccountProductsAmc = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 38 && accessModules.add,
  );

  const userHasAccessToViewAccountProductsAmc = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 38 && accessModule.view,
  );

  const userHasAccessToUpdateAccountProductsAmc = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 38 && accessModule.update,
  );

  //account-products-warranty
  const userHasAccessToAddAccountProductsWarranty = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 39 && accessModules.add,
  );

  const userHasAccessToViewAccountProductsWarranty = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 39 && accessModule.view,
  );

  const userHasAccessToUpdateAccountProductsWarranty = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 39 && accessModule.update,
  );

  //team - users
  const userHasAccessToAddTeamUsers = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 40 && accessModules.add,
  );

  const userHasAccessToViewTeamUsers = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 40 && accessModule.view,
  );

  const userHasAccessToUpdateTeamUSers = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 40 && accessModule.update,
  );

  //setting - support-ticket-category
  const userHasAccessToAddSettingSupposeTicketCategory = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 41 && accessModules.add,
  );

  const userHasAccessToViewSettingSupposeTicketCategory = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 41 && accessModule.view,
  );

  const userHasAccessToUpdateSettingSupposeTicketCategory = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 41 && accessModule.update,
  );

  //setting - company-warehouse
  const userHasAccessToAddSettingCompanyWarehouse = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 42 && accessModules.add,
  );

  const userHasAccessToViewSettingCompanyWarehouse = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 42 && accessModule.view,
  );

  const userHasAccessToUpdateSettingCompanyWarehouse = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 42 && accessModule.update,
  );

  //lead-setting
  const userHasAccessToAddLeadSettings = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 43 && accessModules.add,
  );

  const userHasAccessToViewLeadSettings = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 43 && accessModule.view,
  );

  const userHasAccessToUpdateLeadSettings = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 43 && accessModule.update,
  );

  // Tasks
  const userHasAccessToAddTasks = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 45 && accessModules.add,
  );

  const userHasAccessToViewTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 45 && accessModule.view,
  );

  const userHasAccessToUpdateTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 45 && accessModule.update,
  );
  //All Tasks
  const userHasAccessToAddAllTasks = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 46 && accessModules.add,
  );

  const userHasAccessToViewAllTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 46 && accessModule.view,
  );

  const userHasAccessToUpdateAllTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 46 && accessModule.update,
  );

  const userHasAccessToAddMasterTasks = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 47 && accessModules.add,
  );

  const userHasAccessToViewMasterTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 47 && accessModule.view,
  );

  const userHasAccessToUpdateMasterTasks = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 47 && accessModule.update,
  );
  //lead-setting
  const userHasAccessToAddLeadNote = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 44 && accessModules.add,
  );

  const userHasAccessToViewLeadNote = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 44 && accessModule.view,
  );

  const userHasAccessToUpdateLeadNote = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 44 && accessModule.update,
  );

  //lead-quotation
  const userHasAccessToAddLeadQuotation = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 62 && accessModules.add,
  );

  const userHasAccessToViewLeadQuotation = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 62 && accessModule.view,
  );

  const userHasAccessToUpdateLeadQuotation = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 62 && accessModule.update,
  );

  //setting-company-detail
  const userHasAccessToAddCompanyDetail = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 48 && accessModules.add,
  );

  const userHasAccessToViewCompanyDetail = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 48 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyDetail = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 48 && accessModule.update,
  );

  //setting-quotation-template
  const userHasAccessToAddQuotationTemplate = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 49 && accessModules.add,
  );

  const userHasAccessToViewQuotationTemplate = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 49 && accessModule.view,
  );

  const userHasAccessToUpdateQuotationTemplate = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 49 && accessModule.update,
  );

  // stock management - product wise stock view
  const userHasAccessToAddProductWiseStock = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 50 && accessModules.add,
  );

  const userHasAccessToViewProductWiseStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 50 && accessModule.view,
  );

  const userHasAccessToUpdateProductWiseStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 50 && accessModule.update,
  );
  // stock management - Ware wise stock view
  const userHasAccessToAddWarehouseWiseStock = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 51 && accessModules.add,
  );

  const userHasAccessToViewWarehouseWiseStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 51 && accessModule.view,
  );

  const userHasAccessToUpdateWarehouseWiseStock = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 51 && accessModule.update,
  );
  // stock management - Stock Ledger view
  const userHasAccessToAddStockLedger = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 52 && accessModules.add,
  );

  const userHasAccessToViewStockLedger = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 52 && accessModule.view,
  );

  const userHasAccessToUpdateStockLedger = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 52 && accessModule.update,
  );
  // stock management - Stock Ledger view
  const userHasAccessToAddStockAgeing = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 53 && accessModules.add,
  );

  const userHasAccessToViewStockAgeing = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 53 && accessModule.view,
  );

  const userHasAccessToUpdateStockAgeing = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 53 && accessModule.update,
  );
  // setting - reminder
  const userHasAccessToAddSettingReminder = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 56 && accessModules.add,
  );

  const userHasAccessToViewSettingReminder = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 56 && accessModule.view,
  );

  const userHasAccessToUpdateSettingReminder = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 56 && accessModule.update,
  );

  //Account Service
  const userHasAccessToAddAccountService = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 54 && accessModules.add,
  );

  const userHasAccessToViewAccountService = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 54 && accessModule.view,
  );

  const userHasAccessToUpdateAccountService = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 54 && accessModule.update,
  );

  //Account Subscription
  const userHasAccessToAddAccountSubscription = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 55 && accessModules.add,
  );

  const userHasAccessToViewAccountSubscription = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 55 && accessModule.view,
  );

  const userHasAccessToUpdateAccountSubscription = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 55 && accessModule.update,
  );

  //Company invoice
  const userHasAccessToAddCompanyInvoice = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 57 && accessModules.add,
  );

  const userHasAccessToViewCompanyInvoice = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 57 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyInvoice = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 57 && accessModule.update,
  );

    //Company Quotation
  const userHasAccessToAddCompanyQuotation = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 63 && accessModules.add,
  );

  const userHasAccessToViewCompanyQuotation = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 63 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyQuotation = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 63 && accessModule.update,
  );


  //Invoice Company Product/Item
  const userHasAccessToAddCompanyInvoiceItem = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 58 && accessModules.add,
  );

  const userHasAccessToViewCompanyInvoiceItem = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 58 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyInvoiceItem = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 58 && accessModule.update,
  );

  //Invoice Draft
  const userHasAccessToAddCompanyInvoiceDraft = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 59 && accessModules.add,
  );

  const userHasAccessToViewCompanyInvoiceDraft = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 59 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyInvoiceDraft = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 59 && accessModule.update,
  );

  //Invoice Approval
  const userHasAccessToAddCompanyInvoiceApproval = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 60 && accessModules.add,
  );

  const userHasAccessToViewCompanyInvoiceApproval = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 60 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyInvoiceApproval = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 60 && accessModule.update,
  );

  //Invoice Cancel
  const userHasAccessToAddCompanyInvoiceCancel = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 61 && accessModules.add,
  );

  const userHasAccessToViewCompanyInvoiceCancel = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 61 && accessModule.view,
  );

  const userHasAccessToUpdateCompanyInvoiceCancel = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 61 && accessModule.update,
  );


  const userHasAccessToAddAccountQuotation = accessModules.some(
    (accessModules) => accessModules.crm_module_id === 64 && accessModules.add,
  );

  const userHasAccessToViewAccountQuotation = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 64 && accessModule.view,
  );

  const userHasAccessToUpdateAccountQuotation = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 64 && accessModule.update,
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

    userHasAccessToViewSettingPersonalEmail,
    userHasAccessToAddSettingPersonalEmail,
    userHasAccessToUpdateSettingPersonalEmail,

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
    userHasAccessToViewSettingLead,
    userHasAccessToUpdateSettingLead,

    userHasAccessToAddLeadQuotation,
    userHasAccessToViewLeadQuotation,
    userHasAccessToUpdateLeadQuotation,

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

    userHasAccessToAddSupportTicket,
    userHasAccessToViewSupportTicket,
    userHasAccessToUpdateSupportTicket,
    userHasAccessToAddSupportTicketTask,
    userHasAccessToViewSupportTicketTask,
    userHasAccessToUpdateSupportTicketTask,

    userHasAccessToAddStock,
    userHasAccessToViewStock,
    userHasAccessToUpdateStock,

    userHasAccessToAddSetting,
    userHasAccessToViewSetting,
    userHasAccessToUpdateSetting,

    userHasAccessToAddLeadProduct,
    userHasAccessToViewLeadProduct,
    userHasAccessToUpdateLeadProduct,

    userHasAccessToAddLeadTeams,
    userHasAccessToViewLeadTeams,
    userHasAccessToUpdateLeadTeams,

    userHasAccessToAddLeadContacts,
    userHasAccessToViewLeadContacts,
    userHasAccessToUpdateLeadContacts,

    userHasAccessToAddLeadDetails,
    userHasAccessToViewLeadDetails,
    userHasAccessToUpdateLeadDetails,

    userHasAccessToAddLeadTasks,
    userHasAccessToViewLeadTasks,
    userHasAccessToUpdateLeadTasks,

    userHasAccessToAddProductUsers,
    userHasAccessToViewProductUsers,
    userHasAccessToUpdateProductUsers,

    userHasAccessToAddProductStock,
    userHasAccessToViewProductStock,
    userHasAccessToUpdateProductStock,

    userHasAccessToAddServiceLevelAgreement,
    userHasAccessToViewServiceLevelAgreement,
    userHasAccessToUpdateServiceLevelAgreement,

    userHasAccessToAddAccountLeads,
    userHasAccessToViewAccountLeads,
    userHasAccessToUpdateAccountLeads,

    userHasAccessToAddAccountContacts,
    userHasAccessToViewAccountContacts,
    userHasAccessToUpdateAccountContacts,

    userHasAccessToAddAccountTypes,
    userHasAccessToViewAccountTypes,
    userHasAccessToUpdateAccountTypes,

    userHasAccessToAddAccountProducts,
    userHasAccessToViewAccountProducts,
    userHasAccessToUpdateAccountProducts,

    userHasAccessToAddAccountProductsAmc,
    userHasAccessToViewAccountProductsAmc,
    userHasAccessToUpdateAccountProductsAmc,

    userHasAccessToAddAccountProductsWarranty,
    userHasAccessToViewAccountProductsWarranty,
    userHasAccessToUpdateAccountProductsWarranty,

    userHasAccessToAddTeamUsers,
    userHasAccessToViewTeamUsers,
    userHasAccessToUpdateTeamUSers,

    userHasAccessToAddSettingSupposeTicketCategory,
    userHasAccessToViewSettingSupposeTicketCategory,
    userHasAccessToUpdateSettingSupposeTicketCategory,

    userHasAccessToAddSettingCompanyWarehouse,
    userHasAccessToViewSettingCompanyWarehouse,
    userHasAccessToUpdateSettingCompanyWarehouse,

    userHasAccessToAddLeadSettings,
    userHasAccessToViewLeadSettings,
    userHasAccessToUpdateLeadSettings,

    userHasAccessToAddAllTasks,
    userHasAccessToViewAllTasks,
    userHasAccessToUpdateAllTasks,

    userHasAccessToAddMasterTasks,
    userHasAccessToViewMasterTasks,
    userHasAccessToUpdateMasterTasks,
    userHasAccessToAddLeadNote,
    userHasAccessToViewLeadNote,
    userHasAccessToUpdateLeadNote,

    userHasAccessToAddCompanyDetail,
    userHasAccessToViewCompanyDetail,
    userHasAccessToUpdateCompanyDetail,

    userHasAccessToAddQuotationTemplate,
    userHasAccessToViewQuotationTemplate,
    userHasAccessToUpdateQuotationTemplate,

    userHasAccessToAddProductWiseStock,
    userHasAccessToViewProductWiseStock,
    userHasAccessToUpdateProductWiseStock,

    userHasAccessToAddWarehouseWiseStock,
    userHasAccessToViewWarehouseWiseStock,
    userHasAccessToUpdateWarehouseWiseStock,

    userHasAccessToAddStockLedger,
    userHasAccessToViewStockLedger,
    userHasAccessToUpdateStockLedger,

    userHasAccessToAddStockAgeing,
    userHasAccessToViewStockAgeing,
    userHasAccessToUpdateStockAgeing,

    userHasAccessToViewTasks,
    userHasAccessToAddTasks,
    userHasAccessToUpdateTasks,

    userHasAccessToViewSettingReminder,
    userHasAccessToAddSettingReminder,
    userHasAccessToUpdateSettingReminder,

    userHasAccessToAddAccountService,
    userHasAccessToViewAccountService,
    userHasAccessToUpdateAccountService,

    userHasAccessToAddAccountSubscription,
    userHasAccessToViewAccountSubscription,
    userHasAccessToUpdateAccountSubscription,

    userHasAccessToAddCompanyInvoice,
    userHasAccessToViewCompanyInvoice,
    userHasAccessToUpdateCompanyInvoice,
    userHasAccessToAddCompanyInvoiceItem,
    userHasAccessToViewCompanyInvoiceItem,
    userHasAccessToUpdateCompanyInvoiceItem,
    userHasAccessToAddCompanyInvoiceDraft,
    userHasAccessToViewCompanyInvoiceDraft,
    userHasAccessToUpdateCompanyInvoiceDraft,
    userHasAccessToAddCompanyInvoiceApproval,
    userHasAccessToViewCompanyInvoiceApproval,
    userHasAccessToUpdateCompanyInvoiceApproval,
    userHasAccessToAddCompanyInvoiceCancel,
    userHasAccessToViewCompanyInvoiceCancel,
    userHasAccessToUpdateCompanyInvoiceCancel,

    userHasAccessToAddCompanyQuotation,
    userHasAccessToViewCompanyQuotation,
    userHasAccessToUpdateCompanyQuotation,

    userHasAccessToAddAccountQuotation,
    userHasAccessToViewAccountQuotation,
    userHasAccessToUpdateAccountQuotation,
  };
};
