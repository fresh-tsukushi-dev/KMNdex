// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import axios from "axios";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";
import {
  RK_PRIMARY_CHANNEL_ID,
  RK_SINGLE_CHANNEL_MODE,
} from "../../config/rkmusic";

export function useDiscoveryOrg(org: string) {
  // シングルチャンネルモードでは org → channel エンドポイントに切り替え
  const url = RK_SINGLE_CHANNEL_MODE
    ? `/api/v2/musicdex/discovery/channel/${RK_PRIMARY_CHANNEL_ID}/`
    : `/api/v2/musicdex/discovery/org/${org}/`;

  return useQuery(
    ["discoveryOrg", org],
    async () => {
      return (await axios.get<OrgDiscovery>(url)).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
    },
  );
}

export function useDiscoveryFavorites() {
  const { AxiosInstance, uid } = useClient();

  return useQuery(
    ["discoveryFavorites", uid],
    async () =>
      (await AxiosInstance<OrgDiscovery>("/musicdex/discovery/favorites")).data,
  );
}

export function useDiscoveryChannel(
  channelId: string,
  options: UseQueryOptions<
    ChannelDiscovery,
    unknown,
    ChannelDiscovery,
    [string, string]
  > = {},
) {
  return useQuery(
    ["discoveryChannel", channelId],
    async (qk) => {
      return (
        await axios.get<ChannelDiscovery>(
          "/api/v2/musicdex/discovery/channel/" + qk.queryKey[1] + "/",
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
      ...options,
    },
  );
}

/**
 *
 * @param org which org (name) to lookup
 * @param type sgp | ugp | radio
 * @returns
 */
export function useAllPlaylistDiscoveryForOrg(
  org: string,
  type: string,
  options: UseInfiniteQueryOptions<PlaylistStub[]> = {},
) {
  const url = RK_SINGLE_CHANNEL_MODE
    ? `/api/v2/musicdex/discovery/channel/${RK_PRIMARY_CHANNEL_ID}/playlists`
    : `/api/v2/musicdex/discovery/org/${org}/playlists`;

  return useInfiniteQuery<PlaylistStub[]>(
    ["discoveryPlaylistsAll", org, type],
    async ({ pageParam = 0 }) => {
      const list: any[] = (
        await axios.get<PlaylistList>(url, {
          params: {
            type,
            offset: 100 * pageParam,
          },
        })
      ).data.items;
      return list;
    },
    {
      ...options,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 100 ? pages.length : null,
      keepPreviousData: options.keepPreviousData ?? true,
      retry: options.retry ?? 1,
      cacheTime: options.cacheTime ?? 1000 * 60 * 60 * 5,
      refetchOnMount: options.retryOnMount ?? false,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      staleTime: options.staleTime ?? 1000 * 60 * 60 * 5,
      refetchOnReconnect: options.refetchOnReconnect ?? false,
    },
  );
}

/**
 *
 * @param org which org (name) to lookup
 * @param type sgp | ugp | radio
 * @returns
 */
export function useAllPlaylistDiscoveryForFavorites(
  type: string,
  options: UseInfiniteQueryOptions<PlaylistStub[]> = {},
) {
  const { AxiosInstance, isLoggedIn } = useClient();

  return useInfiniteQuery<PlaylistStub[]>(
    ["discoveryPlaylistsAll", "favorites", type],
    async ({ pageParam = 0 }) => {
      const list: any[] = (
        await AxiosInstance<PlaylistList>(
          `/musicdex/discovery/favorites/playlists`,
          {
            params: {
              type,
              offset: 100 * pageParam,
            },
          },
        )
      ).data.items;
      return list;
    },
    {
      ...options,
      enabled: isLoggedIn && options.enabled,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 100 ? pages.length : null,
      keepPreviousData: options.keepPreviousData ?? true,
      retry: options.retry ?? 1,
      cacheTime: options.cacheTime ?? 1000 * 60 * 60 * 5,
      refetchOnMount: options.retryOnMount ?? false,
      refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
      staleTime: options.staleTime ?? 1000 * 60 * 60 * 5,
      refetchOnReconnect: options.refetchOnReconnect ?? false,
    },
  );
}
