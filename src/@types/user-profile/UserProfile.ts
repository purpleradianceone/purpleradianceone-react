type UserPreference = {

    id: number,
    companyUserId: number,
    timezoneId: number,
    isLeftMenu : boolean,
    countryId : number,
    isHamburgerMenuCollapsed : boolean,
    timezoneName : string,
    timezoneUTCOffset : string,
    timezone : string
    rowsInGrid : number,
    createdBy: string,
    updatedBy: string,
    createdOn: string,
    updatedOn: string
}
export default UserPreference;