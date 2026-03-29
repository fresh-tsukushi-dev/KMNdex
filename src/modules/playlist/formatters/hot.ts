// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { t } from "i18next";
import { rkStaticsUrl } from "../../../config/urls";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const hotFormatter: PlaylistFormatter<{ ch: string }, undefined> = {
  bannerImage: (playlist, _, data) => {
    return rkStaticsUrl(
      `/statics/channelImg/${playlist.art_context?.channels?.[0]}/banner/3.jpeg`,
    );
  },
  channelImage: (playlist, _, data) => {
    return rkStaticsUrl(
      `/statics/channelImg/${playlist.art_context?.channels?.[0]}.png`,
    );
  },
  title: (playlist, _, data, { t }) => {
    if (!data) return;
    return t(`Trending Songs`);
  },
  description: (playlist, _, data, { t }) => {
    if (!data) return;
    return t("Trending songs radio");
    // return t(``);
  },
  link: (playlist) => {
    return `/radio/${playlist.id}/`;
  },

  // link: (p, { id }, d: any) => {}
};
