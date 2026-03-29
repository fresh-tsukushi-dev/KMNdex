// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { t } from "i18next";
import { rkStaticsUrl } from "../../../config/urls";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const dailyRandomFormatter: PlaylistFormatter<
  { ch: string },
  { channel: Channel } | undefined
> = {
  bannerImage: (playlist, { ch }, data) => {
    return rkStaticsUrl(
      `/statics/channelImg/${ch || data?.channel?.id}/banner/3.jpeg`,
    );
  },
  channelImage: (playlist, { ch }, data) => {
    return rkStaticsUrl(`/statics/channelImg/${ch || data?.channel.id}.png`);
  },
  title: (playlist, { ch }, data, { tn, t }) => {
    if (!data) return;
    const name = tn(data.channel.english_name, data.channel.name);
    return t(`Daily Mix: {{name}}`, { name });
  },
  description: (playlist, { ch }, data, { tn }) => {
    if (!data) return;
    const name = tn(data.channel.english_name, data.channel.name);
    return t(`Your daily dose of {{name}}`, { name });
  },
  // link: (p, { id }, d: any) => {}
};
