// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

import axios from "axios";
import { useQuery } from "react-query";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export function useUpcomingLives() {
  return useQuery(
    ["lives"],
    async (): Promise<Live[]> => {
      return (await axios.get<Live[]>("/api/v2/lives")).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000,
    },
  );
}

export function useLatestGoods() {
  return useQuery(
    ["goods"],
    async (): Promise<Goods[]> => {
      return (await axios.get<Goods[]>("/api/v2/goods")).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000,
    },
  );
}
