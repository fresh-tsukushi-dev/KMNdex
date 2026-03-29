// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { UseQueryOptions, useQuery } from "react-query";
import { useEffect } from "react";
import { useClient } from "../client";
import { encodeUrl } from "../client/utils";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export const useSong = (
  songId: string,
  config: UseQueryOptions<Song, unknown, Song, string[]> = {},
) => {
  const { AxiosInstance } = useClient();

  useEffect(() => {
    const url = `/songs/${songId}`;
    const baseUrl = `${window.location.protocol}//${window.location.host}/api/v2`;
    console.log("[useSong] songId:", songId);
    console.log("[useSong] リクエスト予定URL:", url);
    console.log("[useSong] 解決後URL(想定):", `${baseUrl}${url}`);
  }, [songId]);

  return useQuery(
    ["songs", songId],
    async (q): Promise<Song> => {
      const url = `/songs/${q.queryKey[1]}`;
      console.log("[useSong] queryFn 実行:", url);
      try {
        const resp = await AxiosInstance<Song>(url);
        console.log("[useSong] レスポンスstatus:", resp.status);
        return resp.data;
      } catch (error) {
        console.error("[useSong] リクエスト失敗:", url, error);
        throw error;
      }
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      enabled: !!songId,
      ...config,
    },
  );
};

export const useTrendingSongs = (
  x: { org?: string; channel_id?: string },
  config: UseQueryOptions<
    Song[],
    unknown,
    Song[],
    [string, { org?: string; channel_id?: string }]
  > = {},
) => {
  const { AxiosInstance } = useClient();

  return useQuery(
    ["hot", x],
    async (q): Promise<Song[]> => {
      return (
        await AxiosInstance<Song[]>(encodeUrl(`/songs/hot`, q.queryKey[1]))
      ).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config },
  );
};

export interface SongAPILookupObject {
  org?: string;
  channel_id?: string;
  video_id?: string;
  offset?: number;
  limit?: number;
  paginated?: any;
}

export const useSongAPI = (
  target: SongAPILookupObject,
  config: UseQueryOptions<
    { total: number; items: Song[] },
    unknown,
    { total: number; items: Song[] },
    [string, SongAPILookupObject]
  > = {},
) => {
  const { AxiosInstance } = useClient();

  useEffect(() => {
    const url = "/songs/latest";
    const baseUrl = `${window.location.protocol}//${window.location.host}/api/v2`;
    console.log("[useSongAPI] リクエスト予定URL:", url, "data:", target);
    console.log("[useSongAPI] 解決後URL(想定):", `${baseUrl}${url}`);
  }, [
    target?.org,
    target?.channel_id,
    target?.video_id,
    target?.offset,
    target?.limit,
    target?.paginated,
  ]);

  return useQuery(
    ["songlist", target],
    async (q): Promise<{ total: number; items: Song[] }> => {
      // 必ず/songs/latestでリクエストし、プロキシが効くようにする
      return (
        await AxiosInstance<{ total: number; items: Song[] }>("/songs/latest", {
          method: "POST",
          data: q.queryKey[1],
        })
      ).data;
    },
    { ...DEFAULT_FETCH_CONFIG, ...config },
  );
};
