// axiosClient.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { STATUS_CODE } from "../constants/AppConstants";
import RefreshToken from "../config/validations/RefreshToken";

// ───────────────────────────────────────────────────────────────
// 1. AbortController management (WeakMap + Set)
// ───────────────────────────────────────────────────────────────
const controllerMap = new WeakMap<
  InternalAxiosRequestConfig,
  AbortController
>();

// Used ONLY for cancelAllRequests
const controllerSet = new Set<AbortController>();

export const cancelAllRequests = async (): Promise<void> => {
  controllerSet.forEach((controller) => controller.abort());
  controllerSet.clear();
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
    const companyId = localStorage.getItem("companyId");

    if (!companyId || Number(companyId) === 0) {
      return Promise.reject({
        message: "User may be log out. API call blocked.",
        isBlocked: true,
      });
    }

    // const controller = new AbortController();
    // config.signal = controller.signal;

    // controllerMap.set(config, controller);
    // controllerSet.add(controller);

    // Only create controller if caller did NOT provide one
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;

      controllerMap.set(config, controller);
      controllerSet.add(controller);
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
    const config = response.config as InternalAxiosRequestConfig;
    const controller = controllerMap.get(config);

    if (controller) {
      controller.abort(); // optional safety
      controllerSet.delete(controller);
      controllerMap.delete(config);
    }

    return response;
  },

  // ERROR
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // cleanup controller
    if (originalRequest) {
      const controller = controllerMap.get(originalRequest);
      if (controller) {
        controllerSet.delete(controller);
        controllerMap.delete(originalRequest);
      }
    }

    // ───────────────────────────────────────────────────────────────
    // If NOT 401 → return error
    // ───────────────────────────────────────────────────────────────
    if (status !== STATUS_CODE.UNATHORISED) {
      return Promise.reject(error);
    }

    // ───────────────────────────────────────────────────────────────
    // Handle ONLY 401 refresh
    // ───────────────────────────────────────────────────────────────
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosClient(originalRequest)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshSuccess = await RefreshToken({});

      if (refreshSuccess) {
        processQueue(null);
        isRefreshing = false;
        return axiosClient(originalRequest);
      } else {
        processQueue(new Error("Token refresh failed"));
        isRefreshing = false;
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;
      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;

