import { useMutation } from "@tanstack/react-query";
import httpClient, { saveTokens, clearAuth } from "@/app/api/httpClient";
import { userApiRoutes } from "@/utils/constants";
import { useRouter } from "next/navigation";

export interface RegisterPayload {
  name: string;
  email?: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  msg: string;
  accessToken?: string;
  refreshToken?: string;
  user?: UserData;
}

async function register(payload: RegisterPayload) {
  const res = await httpClient.post<AuthResponse>(
    userApiRoutes.auth.register,
    payload
  );
  return res.data;
}

async function login(payload: LoginPayload) {
  const res = await httpClient.post<AuthResponse>(
    userApiRoutes.auth.login,
    payload
  );
  return res.data;
}

async function logout() {
  const res = await httpClient.post(userApiRoutes.auth.logout);
  return res.data;
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      router.push("/login");
    },
  });
}

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.accessToken && data.refreshToken) {
        saveTokens(data.accessToken, data.refreshToken);
        localStorage.setItem("userData", JSON.stringify(data.user));
      }
      router.push("/home");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
    onError: () => {
      clearAuth();
      router.push("/login");
    },
  });
}