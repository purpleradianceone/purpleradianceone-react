
import UserAndCompanyProfile from "./UserAndCompanyProfile";


const UserAndCompanyProfileManagement = () => {
  // const { userHasAccessToViewUser } = useUserAccessModules();



  // const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  // useEffect(() => {
  //   if (!userHasAccessToViewUser) {
  //     setAccessDeniedPopUpOpen(true);
  //   }
  // }, [userHasAccessToViewUser]);

  return (
    <div className="w-full h-full">
      {/* {userHasAccessToViewUser ? ( */}
        {/* <> */}
          <div className="min-h-screen min-w-full bg-gray-100 flex items-center justify-center">
            <UserAndCompanyProfile
            />
          </div>
        {/* </> */}
      {/* ) : ( */}
        {/* <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div> */}
      {/* )} */}
    </div>
  );
};
export default UserAndCompanyProfileManagement;
