/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useEffect } from "react";

const StockLiveForCompanyProduct = () => {
  const navigate = useNavigate();
  const {
    companyProductId,
    product_name: productName,
    q_live: liveQuantity,
    q_inward: quantityInward,
    q_outward: quantityOutward,
  } = useParams();
  const { loginStatus } = useLoggedInUserContext();

  const getLiveStock = async (signal: AbortSignal) => {
    const postData = {
      company_id: loginStatus.companyId,
      company_product_id: companyProductId,
      company_warehouse_id: null,
      offset: 0,
      limit: 100,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_STOCK_LIVE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: getLiveStock,
          });
          if (refreshTokenResponse) {
            getLiveStock(signal);
          }
        }
      });
  };
  function handleGoBack() {
    navigate(-1);
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    getLiveStock(signal);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center gap-2 p-4">
        <button
          onClick={handleGoBack}
          className="mt-6 px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          Go Back
        </button>

        {/* Details Card */}
        <div className="flex flex-wrap items-center justify-between bg-white shadow-md rounded-2xl px-6 py-4 border border-gray-100">
          <div className="flex flex-col text-center mx-2">
            <span className="text-gray-500 text-sm">Product Name</span>
            <span className="text-lg font-semibold text-gray-800">
              {productName}
            </span>
          </div>
          <div className="flex flex-col text-center mx-2">
            <span className="text-gray-500 text-sm">Live Quantity</span>
            <span className="text-lg font-semibold text-green-600">
              {liveQuantity}
            </span>
          </div>
          <div className="flex flex-col text-center mx-2">
            <span className="text-gray-500 text-sm">Inward</span>
            <span className="text-lg font-semibold text-blue-600">
              {quantityInward}
            </span>
          </div>
          <div className="flex flex-col text-center mx-2">
            <span className="text-gray-500 text-sm">Outward</span>
            <span className="text-lg font-semibold text-red-600">
              {quantityOutward}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockLiveForCompanyProduct;
