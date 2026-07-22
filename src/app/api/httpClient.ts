import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userAccessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userRefreshToken");
}

export function saveTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("userAccessToken", accessToken);
  localStorage.setItem("userRefreshToken", refreshToken);
  window.dispatchEvent(new Event("auth-change"));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
  localStorage.removeItem("userData");
  window.dispatchEvent(new Event("auth-change"));
}

function redirectToLogin() {
  if (
    typeof window === "undefined" ||
    window.location.pathname.includes("/login")
  )
    return;
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
}

let refreshTokenRequest: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  if (!refreshTokenRequest) {
    refreshTokenRequest = axios
      .post(
        "/api/user/auth/refresh-token",
        { refreshToken },
        { baseURL: API_BASE_URL, withCredentials: true }
      )
      .then((res) => {
        const { accessToken, refreshToken: newRefresh } = res.data;
        saveTokens(accessToken, newRefresh);
        return accessToken;
      })
      .finally(() => {
        refreshTokenRequest = null;
      });
  }
  return refreshTokenRequest;
}

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      try {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        originalRequest.headers = headers;
        return httpClient(originalRequest);
      } catch {
        clearAuth();
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;