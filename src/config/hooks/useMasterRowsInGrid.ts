import { useEffect, useState } from "react"
import RowsInGridDropdownOptions from "../../@types/ag-grid/RowsInGridDropdownOptions"
import POST_API from "../../constants/PostApi"
import axios from "axios"
import ApiError from "../../@types/error/ApiError"
import { STATUS_CODE } from "../../constants/AppConstants"
import RefreshToken from "../validations/RefreshToken"

interface rowsInGridDropdownOptionsResponse {
    id: number,
    rows_in_grid: string
}
export const useMasterRowsInGrid = () => {
    const [rowsInGridDropdownOptions, setRowsInGridDropdownOptions] = useState<RowsInGridDropdownOptions[]>([])

    const fetchMasterRowsInGridDropdownOptions = async () => {
        const postData = {
            id: null,
        };
        setRowsInGridDropdownOptions([]);
        await axios.post(POST_API.GET_MASTER_ROWS_IN_GRID, postData, {
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