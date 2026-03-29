// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { useToast } from "@chakra-ui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { setupAxiosInstanceRouting } from "../../config/apiRouting";

export interface User {
  api_key: string;
  contribution_count: string;
  created_at: string;
  discord_id: string | null;
  google_id: string | null;
  twitter_id: string | null;
  id: string;
  role: "admin" | "editor" | "user";
  username: string;
  yt_channel_key: string | null;
  jwt?: string;
}

const BASE_URL = `${window.location.protocol}//${window.location.host}/api/v2`;

const axiosInstance = axios.create();
// 本番環境: AxiosInstance のリクエストを正しいバックエンドに振り分け
setupAxiosInstanceRouting(axiosInstance);

export function useClient() {
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);
  const user = useStoreState((state) => state.auth.user);
  const authHeader = useStoreState((state) => state.auth.authHeader);
  const token = useStoreState((state) => state.auth.token);

  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const toast = useToast();

  const AxiosInstance = useCallback(
    function <T>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
      const configWithUser: AxiosRequestConfig = {
        baseURL: BASE_URL,
        ...config,
        headers: {
          ...config?.headers,
          ...authHeader,
        },
      };
      return axiosInstance(url, configWithUser);
    },
    [authHeader],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken, setUser]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await AxiosInstance<{ user: User; jwt: string }>(
        "/user/refresh",
      );
      if (resp.status === 200 && resp.data) {
        setUser(resp.data.user);
        setToken(resp.data.jwt);
        console.log("[Auth] Token refreshed");
        return resp.data;
      } else {
        console.log("[Auth] Api error when refreshing token", resp);
        throw new Error("Strange bug occured with user checking...");
      }
    } catch (e) {
      console.error("[Auth] Failed to refresh token", e);
      logout();
      toast({
        position: "top-right",
        title: "Error while logging in",
        status: "error",
      });
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, setUser, toast, setToken]);

  return {
    isLoggedIn,
    user,
    AxiosInstance,
    // login,
    refreshUser,
    logout,
    uid: user?.id ?? "na",
    token,
  };
}
