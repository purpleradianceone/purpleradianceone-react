import { useEffect, useState } from "react"
import RowsInGridDropdownOptions from "../../@types/ag-grid/RowsInGridDropdownOptions"
import POST_API from "../../constants/PostApi"
import ApiError from "../../@types/error/ApiError"
import { STATUS_CODE } from "../../constants/AppConstants"
import RefreshToken from "../validations/RefreshToken"
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext"
import axiosClient from "../../axios-client/AxiosClient"

interface rowsInGridDropdownOptionsResponse {
    id: number,
    rows_in_grid: string
}
export const useMasterRowsInGrid = () => {
    const [rowsInGridDropdownOptions, setRowsInGridDropdownOptions] = useState<RowsInGridDropdownOptions[]>([])
    const {loginStatus} = useLoggedInUserContext();

    const fetchMasterRowsInGridDropdownOptions = async () => {
        if(loginStatus.status){
                const postData = {
            id: null,
        };
        setRowsInGridDropdownOptions([]);
        await axiosClient.post(POST_API.GET_MASTER_ROWS_IN_GRID, postData, {
            withCredentials: true,
        })
            .then((response) => {
                if (response.status) {
                    {
                        const data = response.data
                        data.map((data: rowsInGridDropdownOptionsResponse) => {
                            setRowsInGridDropdownOptions((prev) => [
                                ...prev,
                                {
                                    id: data.id,
                                    rowsInGrid: data.rows_in_grid,
                                }
                            ])
                        })
                    }
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async(error: ApiError | any) => {
                if (error.status === STATUS_CODE.UNATHORISED) {

                   const refreshTOkenResponse = await RefreshToken({ callFunction: fetchMasterRowsInGridDropdownOptions });
                   if(refreshTOkenResponse){
                    fetchMasterRowsInGridDropdownOptions();
                   }
                }
            });
        }
        
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            fetchMasterRowsInGridDropdownOptions()
        }, 0)
        return () => clearTimeout(timerId);
    }, []);
    return {
        rowsInGridDropdownOptions,
    }
}