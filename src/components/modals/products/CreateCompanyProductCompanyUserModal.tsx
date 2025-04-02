import { UserPlus, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import { NUMBER_VALUES, SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import CreateCompanyProductCompanyUserModalProps from "../../../@types/modal/CreateCompanyProductCompanyUserModalProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../@types/ui/MessageSnackbarProps";
import { useEffect, useState } from "react";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import Button from "../../ui/Button";

function CreateCompanyProductCompanyUserModal({
  isOpen,
  onClose,
  product,
}: CreateCompanyProductCompanyUserModalProps) {
  const { isSmallScreen } = useScreenSize();
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { userHasAccessToAddProduct, userHasAccessToViewUser } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [compnayUsers, setCompnayUsers] = useState<CompanyUsersSearchProps[]>([]);

  const navigate = useNavigate();
  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);
  
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchCompanyUsers = async () => {
    if (userHasAccessToViewUser) {
        setCompnayUsers([]);
      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: 0,
        offset: 0,
        search_company_specific_date_range_id: 0,
        search_parameter: "",
        search_parameter_date: "",
      };

      axios
        .post(POST_API.GET_COMPANY_USERS, getCompanyUserPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.data.map((res: any) => {
              if (res.isactive) {
                setCompnayUsers((prev) => [...prev, res]);
              }
            });
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(async (error: ApiError | any) => {
          console.error(error);
          if (error.status == STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({ callFunction: fetchCompanyUsers });
            if (refreshTokenResponse) {
              setIsDialogueOpen(false);
            } else {
              setIsDialogueOpen(true);
            }
          } else if (error.status === STATUS_CODE.FORBIDDEN) {
            setIsDialogueOpen(true);
          }
        });
    }
  };

  const handleCreateCompanyProductCompanyUserSubmit = async () => {
    if (userHasAccessToAddProduct) {
      console.log(product);
      showMessageSnackbar({ message: "User Assigned Successfully", type: "success" });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleMessageSnackbarClose();
      return;
    } else {
      fetchCompanyUsers();
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={isSmallScreen ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-45" : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-45"}>
      <div className="flex min-h-screen mb-5 items-center justify-center">
        <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded-lg shadow-xl animate-fadeIn flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <UserPlus className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Assign User to Company Product: {product.name}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>
          </div>

          {/* Table Container with Fixed Header */}
          <div className="flex-1 overflow-hidden">
            <div className="w-full">
              <table className="w-full">
                <thead className="sticky top-0 bg-white shadow-sm">
                  <tr>
                    <th className="pb-2 text-start w-[5%] px-4">Sr. No.</th>
                    <th className="pb-2 text-start w-[30%] px-4">Name</th>
                    <th className="pb-2 text-start w-[55%] px-4">Email</th>
                    <th className="pb-2 w-[10%] px-4">
                      <div className="flex flex-col items-center">
                        <span>Assign</span>
                        <input
                          type="checkbox"
                          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="overflow-y-auto h-[calc(100%-120px)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
              <table className="w-full">
                <tbody>
                  {compnayUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 whitespace-nowrap w-[5%]">{index + 1}</td>
                      <td className="py-2 px-4 whitespace-nowrap w-[30%]">{user.fullname}</td>
                      <td className="py-2 px-4 whitespace-nowrap w-[55%]">{user.email}</td>
                      <td className="py-2 px-4 text-center whitespace-nowrap w-[10%]">
                        <div className="flex flex-col items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer with Button */}
          <div className="p-6 border-t bg-white">
            <div className="flex justify-end">
              <Button onClick={handleCreateCompanyProductCompanyUserSubmit}>
                Update Users
              </Button>
            </div>
          </div>
        </div>

        <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
      </div>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired!"
        message="Session Expired. Please login again."
      />
    </div>
  );
}

export default CreateCompanyProductCompanyUserModal;