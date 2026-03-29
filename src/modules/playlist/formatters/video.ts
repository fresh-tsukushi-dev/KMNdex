// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { PlaylistFormatter } from "../useFormatPlaylist";

export const videoFormatter: PlaylistFormatter<
  { id: string },
  { id: string; title: string } | undefined
> = {
  title: (playlist, { id }, data, ctx) => {
    return data?.title || "Video";
  },
  description: (p, { id }, video: any, { t, tn }) => {
    if (!t || !tn) return "";

    // descParser からの video 情報が無い場合は、playlist の先頭曲から推測する
    const baseVideo: any =
      video ||
      // @ts-ignore - runtime では PlaylistFull として content が存在するケースを想定
      (p && (p as any).content && (p as any).content[0]);

    if (!baseVideo || !baseVideo.available_at || !baseVideo.channel) {
      return "";
    }

    const date = t("NO_TL.relativeDate", {
      date: new Date(baseVideo.available_at),
    });
    const name = tn(baseVideo.channel.english_name, baseVideo.channel.name);
    return t(`Sang by {{name}} on {{date}}`, { name, date });
  },
  link: (p, { id }, d: any) => {
    return `/video/${id}`;
  },
};
