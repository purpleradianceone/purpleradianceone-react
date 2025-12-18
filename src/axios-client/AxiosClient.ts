// axiosClient.ts
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { STATUS_CODE } from "../constants/AppConstants";
import RefreshToken from "../config/validations/RefreshToken";

// ───────────────────────────────────────────────────────────────
// 1. Manage AbortControllers for cancelling all active requests
// ───────────────────────────────────────────────────────────────
const controllers = new Set<AbortController>();

export const cancelAllRequests = async (): Promise<void> => {
  controllers.forEach((controller) => {
    controller.abort();
  });
  controllers.clear();
  await Promise.resolve();
};

// ───────────────────────────────────────────────────────────────
// 2. Axios instance
// ───────────────────────────────────────────────────────────────
const axiosClient: AxiosInstance = axios.create({
  withCredentials: true,
});

// ───────────────────────────────────────────────────────────────
// 3. Refresh Token Queue Management
// ───────────────────────────────────────────────────────────────
let isRefreshing = false;

interface FailedRequest {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown | null): void => {
  failedQueue.forEach((req) => {
    if (error) req.reject(error);
    else req.resolve();
  });

  failedQueue = [];
};

// ───────────────────────────────────────────────────────────────
// 4. REQUEST INTERCEPTOR
// ───────────────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const companyId = localStorage.getItem("companyId"); //For api call blocking after logout

    if (!companyId || Number(companyId) === 0) {
      return Promise.reject({
        message: "User may be log out. API call blocked.",
        isBlocked: true,
      });
    }

    // Add AbortController
    const controller = new AbortController();
    config.signal = controller.signal;
    controllers.add(controller);

    // Add Authorization header
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ───────────────────────────────────────────────────────────────
// 5. RESPONSE INTERCEPTOR
// ───────────────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  // SUCCESS
  (response: AxiosResponse) => {
    // remove controller when request completes
    controllers.forEach((controller) => {
      if (controller.signal === response.config.signal) {
        controllers.delete(controller);
      }
    });

    return response;
  },

  // ERROR
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // remove controller on error
    if (originalRequest?.signal) {
      controllers.forEach((controller) => {
        if (controller.signal === originalRequest.signal) {
          controllers.delete(controller);
        }
      });
    }

    // ───────────────────────────────────────────────────────────────
    //  If NOT 401 → return error to caller directly
    // ───────────────────────────────────────────────────────────────
    if (status !== STATUS_CODE.UNATHORISED) {
      return Promise.reject(error);
    }

    // ───────────────────────────────────────────────────────────────
    //  Handle ONLY 401 for Refresh Token
    // ───────────────────────────────────────────────────────────────
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Already refreshing → queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosClient(originalRequest)),
          reject,
        });
      });
    }

    // Start refreshing
    isRefreshing = true;

    try {
      const refreshSuccess = await RefreshToken({});

      if (refreshSuccess) {
        // Retry queued requests
        processQueue(null);

        isRefreshing = false;

        return axiosClient(originalRequest);
      } else {
        // Refresh failed
        processQueue(new Error("Token refresh failed"));

        isRefreshing = false;

        return Promise.reject(error);
      }
    } catch (refreshError) {
      // Refresh threw error
      processQueue(refreshError);
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;
