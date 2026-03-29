// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { getVideoThumbnails } from "../../../utils/SongHelper";
import { rkStaticsUrl } from "../../../config/urls";
import { PlaylistFormatter } from "../useFormatPlaylist";

export const defaultFormatter: PlaylistFormatter<any, any> = {
  bannerImage: (playlist) => {
    if (playlist.content && playlist.content[0]) {
      return rkStaticsUrl(
        `/statics/channelImg/${playlist.content[0].channel_id}/banner/3.jpeg`,
      );
    } else {
      return undefined;
    }
  },
  channelImage: (playlist) => {
    if (playlist.content && playlist.content?.[0]) {
      return rkStaticsUrl(
        `/statics/channelImg/${playlist.content[0].channel_id}/200.png`,
      );
    } else if ((playlist as any).channels || (playlist as any).videoids) {
      // deprecated
      const chs = (playlist as any).channels || [];
      const vids = (playlist as any).videoids || [];
      if (chs.length < 4 && chs.length > 0)
        return rkStaticsUrl(`/statics/channelImg/${chs[0]}.png`);
      else return `https://i.ytimg.com/vi/${vids[0]}/hqdefault.jpg`;
    } else if (
      (playlist as any).art_context &&
      Object.keys((playlist as any).art_context).length !== 0
    ) {
      const chs = (playlist as any).art_context.channels || [];
      const vids = (playlist as any).art_context.videos || [];
      //if it's more channel focused than single video focused.
      if (chs.length < 3 && vids.length > 1)
        return rkStaticsUrl(`/statics/channelImg/${chs[0]}/200.png`);
      else return getVideoThumbnails(vids[0]).medium;
    } else {
      return undefined;
    }
  },
  title: (playlist) => {
    const title = (playlist as any).title;
    return typeof title === "string" ? title : "";
  },
  description: (playlist) => {
    const description = (playlist as any).description;
    return typeof description === "string" ? description : "";
  },
  link: (playlist) => {
    return `/playlists/${playlist.id}/`;
  },
};
