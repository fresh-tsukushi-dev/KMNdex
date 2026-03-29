// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { PlaylistFormatter } from "../useFormatPlaylist";
import { rkStaticsUrl } from "../../../config/urls";

export const mvFormatter: PlaylistFormatter<
  { org: string; sort: string },
  { org: string } | undefined
> = {
  channelImage: (playlist, { org }, data) => {
    if (playlist.content && playlist.content[0]) {
      return rkStaticsUrl(
        `/statics/channelImg/${playlist.content[0].channel_id}.png`,
      );
    } else {
      return undefined;
    }
  },
  title: (playlist, { org, sort }, _, { t }) => {
    switch (sort) {
      case "random":
        return t("Best of {{org}}", { org });
      case "latest":
        return t("Recent {{org}} covers & originals", { org });
    }
  },
  description: (playlist, { org, sort }, data, { t }) => {
    switch (sort) {
      case "random":
        return t(`Relive the top hits from {{org}}`, { org });
      case "latest":
        return t("Latest released covers & originals from {{org}}", { org });
    }
  },
};
