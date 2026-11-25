import type LoginData from "@/features/auth/models/LoginData";
import type LoginResponseData from "@/features/auth/models/LoginResponseData";
import type User from "@/features/user/models/User";

import {
  loginUser,
  logoutUser,
} from "@/features/auth/services/AuthService";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// =====================================================
// STORAGE KEY
// =====================================================

const LOCAL_KEY = "authsphere_auth";


// =====================================================
// AUTH STATE
// =====================================================

type AuthState = {

  accessToken: string | null;

  user: User | null;

  authStatus: boolean;

  authLoading: boolean;


  // Login
  login: (
    loginData: LoginData
  ) => Promise<LoginResponseData>;


  // Logout
  logout: (
    silent?: boolean
  ) => Promise<void>;


  // Check authentication
  checkLogin: () => boolean;


  // Update authentication state
  changeLocalLoginData: (
    accessToken: string,
    user: User,
    authStatus: boolean
  ) => void;

  // Update user object
  setUser: (user: User) => void;

};


// =====================================================
// AUTH STORE
// =====================================================

const useAuth = create<AuthState>()(

  persist(

    (set, get) => ({

      // =================================================
      // INITIAL STATE
      // =================================================

      accessToken: null,

      user: null,

      authStatus: false,

      authLoading: false,


      // =================================================
      // UPDATE LOCAL AUTH DATA
      // =================================================

      changeLocalLoginData: (
        accessToken,
        user,
        authStatus
      ) => {

        set({
          accessToken,
          user,
          authStatus,
        });

      },

      setUser: (user) => {
        set({ user });
      },


      // =================================================
      // LOGIN
      // =================================================

      login: async (loginData) => {

        console.log("Starting login...");

        set({
          authLoading: true,
        });


        try {

          const loginResponseData =
            await loginUser(loginData);


          console.log(
            "Login successful:",
            loginResponseData
          );


          set({

            accessToken:
              loginResponseData.accessToken,

            user:
              loginResponseData.user,

            authStatus: true,

          });


          return loginResponseData;


        } catch (error) {

          console.error(
            "Login failed:",
            error
          );


          // Make sure failed login
          // does not leave stale state.

          set({
            accessToken: null,
            user: null,
            authStatus: false,
          });


          throw error;


        } finally {

          set({
            authLoading: false,
          });

        }

      },


      // =================================================
      // LOGOUT
      // =================================================

      logout: async (silent = false) => {

        try {

          set({
            authLoading: true,
          });


          // Normal logout:
          // Tell backend to revoke/invalidate
          // the refresh-token/session.

          if (!silent) {

            await logoutUser();

          }


        } catch (error) {

          console.error(
            "Logout request failed:",
            error
          );


        } finally {

          // Always clear local authentication state.

          set({

            accessToken: null,

            user: null,

            authStatus: false,

            authLoading: false,

          });

        }

      },


      // =================================================
      // CHECK LOGIN
      // =================================================

      checkLogin: () => {
        const { authStatus } = get();
        return Boolean(authStatus);
      },

    }),


    // ===================================================
    // ZUSTAND PERSIST (In-Memory Access Token Only)
    // ===================================================

    {
      name: LOCAL_KEY,
      partialize: (state) => ({
        user: state.user,
        authStatus: state.authStatus,
      }),
    }

  )

);


export default useAuth;