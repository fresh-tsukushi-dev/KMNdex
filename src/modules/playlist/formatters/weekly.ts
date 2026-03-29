// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { PlaylistFormatter } from "../useFormatPlaylist";
import { rkStaticsUrl } from "../../../config/urls";

export const weeklyFormatter: PlaylistFormatter<
  { org: string },
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
  title: (playlist, { org }, data, { t }) => {
    return t(`{{org}} Weekly Mix`, { org });
  },
  description: (playlist, { org }, data, { t }) => {
    return t(`Explore this week in {{org}}`, { org });
  },
  // link: (p, { id }, d: any) => {}
};
