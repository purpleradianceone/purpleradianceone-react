import OnlineLeadSettingsTab from "../../../tabs/LeadSettingsTabs";


function LeadSettingsPage(){

    

    return (
        <div className="w-full text center">
            <div className="w-full pt-2 pl-5 pr-1 gap-1">
            <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
                <div className="flex w-full gap-2 justify-center">
                    <div className="flexr">
                        <span className="text-2xl font-bold">Tailor Lead Settings to Your Needs</span>
                    </div>
                </div>
            </div>
            <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
                <OnlineLeadSettingsTab></OnlineLeadSettingsTab>
            </div>

            </div>
        </div>
    );
}

export default LeadSettingsPage;