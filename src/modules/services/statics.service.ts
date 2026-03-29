// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import axios from "axios";
import { UseQueryOptions, useQuery } from "react-query";
import { Org } from "../../store/org";

export function useServerOrgList(
  options: UseQueryOptions<Org[], unknown, Org[]> = {},
) {
  return useQuery<Org[], unknown, Org[]>(
    ["orgs"],
    async () => {
      const list: any[] = (await axios.get("/statics/orgs.json")).data;
      // list.unshift({ name: "All Vtubers", name_jp: "", short: "All" });
      return list;
    },
    {
      cacheTime: 1000 * 60 * 60 * 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      refetchOnReconnect: false,
      ...options,
    },
  );
}
