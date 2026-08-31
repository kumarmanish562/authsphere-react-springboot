import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type RegisterData from "@/models/RegisterData";
import type User from "@/models/User";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined in .env"
  );
}

// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (
  data: RegisterData
) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  // ===================================================
  // RESPONSE
  // ===================================================

  let result: unknown = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (!response.ok) {
    if (
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
    ) {
      throw new Error(result.message);
    }

    throw new Error(
      "Unable to create account."
    );
  }

  // ===================================================
  // SUCCESS
  // ===================================================

  return result;
};

// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (
  data: LoginData
): Promise<LoginResponseData> => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  // ===================================================
  // RESPONSE
  // ===================================================

  let result: unknown = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (!response.ok) {
    if (
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
    ) {
      throw new Error(result.message);
    }

    throw new Error(
      "Invalid email or password."
    );
  }

  // ===================================================
  // SUCCESS
  // ===================================================

  return result as LoginResponseData;
};

// =====================================================
// REFRESH TOKEN
// =====================================================

export const refreshToken =
  async (): Promise<LoginResponseData> => {
    const response = await fetch(
      `${API_BASE_URL}/auth/refresh`,
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    let result: unknown = null;

    try {
      result = await response.json();
    } catch {
      result = null;
    }

    // =================================================
    // ERROR
    // =================================================

    if (!response.ok) {
      if (
        typeof result === "object" &&
        result !== null &&
        "message" in result &&
        typeof result.message === "string"
      ) {
        throw new Error(result.message);
      }

      throw new Error(
        "Session expired. Please login again."
      );
    }

    // =================================================
    // SUCCESS
    // =================================================

    return result as LoginResponseData;
  };

// =====================================================
// LOGOUT USER
// =====================================================

export const logoutUser =
  async (): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/auth/logout`,
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // =================================================
    // ERROR
    // =================================================

    if (!response.ok) {
      let message =
        "Unable to logout.";

      try {
        const result =
          await response.json();

        if (
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
        ) {
          message = result.message;
        }
      } catch {
        // Ignore empty response
      }

      throw new Error(message);
    }
  };

// =====================================================
// GET CURRENT USER
// =====================================================

export const getCurrentUser = async (
  email?: string
): Promise<User> => {
  const url = email
    ? `${API_BASE_URL}/auth/me?email=${encodeURIComponent(email)}`
    : `${API_BASE_URL}/auth/me`;

  const response = await fetch(
    url,
    {
      method: "GET",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // =================================================
  // RESPONSE
  // =================================================

  let result: unknown = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  // =================================================
  // ERROR
  // =================================================

  if (!response.ok) {
    if (
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
    ) {
      throw new Error(result.message);
    }

    throw new Error(
      "Unable to get current user."
    );
  }

  // =================================================
  // SUCCESS
  // =================================================

  return result as User;
};