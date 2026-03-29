// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { Avatar, AvatarProps } from "@chakra-ui/react";
import { RK_DISCOVER_MORE_PINNED_PHOTO_BY_ID } from "../../config/rkmusic";
import { getChannelPhoto } from "../../modules/channel/utils";
import useNamePicker from "../../modules/common/useNamePicker";

interface ChannelPhotoProps extends AvatarProps {
  channelId?: string;
  channel?: {
    id?: string;
    english_name?: string;
    name: string;
    photo?: string;
  };
  resizePhoto?: number;
}

export function ChannelPhoto({
  channelId,
  channel,
  resizePhoto,
  ...rest
}: ChannelPhotoProps) {
  const tn = useNamePicker();

  const id = channelId || channel?.id;
  const src =
    channel?.photo ||
    (id && RK_DISCOVER_MORE_PINNED_PHOTO_BY_ID[id]) ||
    (id && getChannelPhoto(id, resizePhoto));
  const name = tn(channel?.english_name, channel?.name);
  return (
    <Avatar src={src} name={name} loading="lazy" bgColor="unset" {...rest} />
  );
}
