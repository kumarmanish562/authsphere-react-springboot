import axios, {
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";

import useAuth from "@/auth/store";
import { refreshToken } from "@/services/AuthService";
import toast from "react-hot-toast";


// =====================================================
// TYPES
// =====================================================

type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};


// =====================================================
// API CLIENT
// =====================================================

const apiClient = axios.create({

  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8083/api/m1",

  headers: {
    "Content-Type": "application/json",
  },

  // Required for HttpOnly refresh-token cookie
  withCredentials: true,

  timeout: 10000,
});


// =====================================================
// REFRESH STATE
// =====================================================

let isRefreshing = false;


// Requests waiting for a new access token

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let pendingRequests: PendingRequest[] = [];


// =====================================================
// QUEUE REQUEST
// =====================================================

function queueRequest(
  resolve: (token: string) => void,
  reject: (error: unknown) => void
) {

  pendingRequests.push({
    resolve,
    reject,
  });

}


// =====================================================
// RESOLVE QUEUE
// =====================================================

function resolveQueue(
  newToken: string
) {

  pendingRequests.forEach(
    ({ resolve }) => {
      resolve(newToken);
    }
  );

  pendingRequests = [];

}


// =====================================================
// REJECT QUEUE
// =====================================================

function rejectQueue(
  error: unknown
) {

  pendingRequests.forEach(
    ({ reject }) => {
      reject(error);
    }
  );

  pendingRequests = [];

}


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

apiClient.interceptors.request.use(

  (config) => {

    const accessToken =
      useAuth.getState().accessToken;


    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

apiClient.interceptors.response.use(

  // -----------------------------------------------
  // Successful response
  // -----------------------------------------------

  (response) => {

    return response;

  },


  // -----------------------------------------------
  // Error response
  // -----------------------------------------------

  async (error: AxiosError) => {

    const originalRequest =
      error.config as RetryableRequestConfig | undefined;


    // =================================================
    // NO RESPONSE
    // =================================================

    if (!error.response) {

      toast.error(
        "Network error. Please check your connection."
      );

      return Promise.reject(error);

    }


    const status =
      error.response.status;


    // =================================================
    // ONLY HANDLE 401
    // =================================================

    if (
      status !== 401 ||
      !originalRequest
    ) {

      const message =
        (
          error.response.data as {
            message?: string;
          }
        )?.message ||
        "An error occurred";


      toast.error(message);


      return Promise.reject(error);

    }


    // =================================================
    // PREVENT INFINITE RETRY
    // =================================================

    if (originalRequest._retry) {

      return Promise.reject(error);

    }


    originalRequest._retry = true;


    // =================================================
    // ANOTHER REQUEST IS ALREADY REFRESHING
    // =================================================

    if (isRefreshing) {

      return new Promise(
        (resolve, reject) => {

          queueRequest(

            (newToken) => {

              originalRequest.headers =
                originalRequest.headers || {};

              originalRequest.headers.Authorization =
                `Bearer ${newToken}`;


              resolve(
                apiClient(originalRequest)
              );

            },

            (refreshError) => {

              reject(refreshError);

            }

          );

        }
      );

    }


    // =================================================
    // START TOKEN REFRESH
    // =================================================

    isRefreshing = true;


    try {

      console.log(
        "Access token expired. Refreshing..."
      );


      // ---------------------------------------------
      // Refresh token
      // ---------------------------------------------

      const loginResponse =
        await refreshToken();


      const newToken =
        loginResponse.accessToken;


      if (!newToken) {

        throw new Error(
          "No access token received from refresh endpoint."
        );

      }


      // ---------------------------------------------
      // Update Zustand
      // ---------------------------------------------

      useAuth
        .getState()
        .changeLocalLoginData(
          newToken,
          loginResponse.user,
          true
        );


      // ---------------------------------------------
      // Resolve waiting requests
      // ---------------------------------------------

      resolveQueue(newToken);


      // ---------------------------------------------
      // Retry original request
      // ---------------------------------------------

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;


      return apiClient(originalRequest);


    } catch (refreshError) {

      console.error(
        "Token refresh failed:",
        refreshError
      );


      // ---------------------------------------------
      // Reject queued requests
      // ---------------------------------------------

      rejectQueue(refreshError);


      // ---------------------------------------------
      // Clear authentication
      // ---------------------------------------------

      useAuth
        .getState()
        .logout(true);


      toast.error(
        "Your session has expired. Please login again."
      );


      return Promise.reject(refreshError);


    } finally {

      isRefreshing = false;

    }

  }

);


export default apiClient;