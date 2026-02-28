import { User } from "lucide-react";
import CustomSelect, { SelectOption } from "../ui/CustomSelect";
import { handleApiError } from "../../config/error/handleApiError";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

type Props = {
  value: number | null;
  onChange: (userId: number | null) => void;
};


export const CustomSelectLookupCompanyUser: React.FC<Props> = ({
  value,
  onChange,
}) => {
  const PAGE_SIZE = 25;
  const { loginStatus } = useLoggedInUserContext();

  const [companyUsersOptions, setCompanyUsersOptions] = useState<SelectOption[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetch = async (
    search: string,
    currentOffset: number,
    append = false
  ) => {
    if (isLoading || (!hasMore && append)) return;

    setIsLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      isactive: true,
      search_parameter: search || null,
      offset: currentOffset,
      limit: PAGE_SIZE,
      requestedby: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_LOOKUP_COMPANY_USERS,
        postData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: SelectOption[] = response.data.map((item: any) => ({
          value: item.id,
          label: item.fullname,
        }));

        setCompanyUsersOptions((prev) =>
          append ? [...prev, ...mapped] : mapped
        );

        setHasMore(mapped.length === PAGE_SIZE);
        setOffset(currentOffset + PAGE_SIZE);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuOpen = () => {
    if (companyUsersOptions.length === 0) {
      setOffset(0);
      setHasMore(true);
      fetch("", 0, false);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (hasMore) {
      fetch(searchText, offset, true);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchText(value);
    setOffset(0);
    setHasMore(true);
    fetch(value, 0, false);
  };

  return (
    <CustomSelect
      icon={User}
      label="Assign Owner"
      options={companyUsersOptions}
      placeholder="Select user"
      value={value ?? 0}
      onChange={(selected) => onChange(selected ?? null)}
      onMenuOpen={handleMenuOpen}
      onMenuScrollToBottom={handleMenuScrollToBottom}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      isClearable={false}
    />
  );
};