// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  Box,
  HStack,
  StackProps,
  Text,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useContextMenu } from "react-contexify";
import { Link as NavLink } from "react-router-dom";
import useNamePicker from "../../../modules/common/useNamePicker";
import { DEFAULT_MENU_ID } from "../../song/SongContextMenu";
import { SongArtwork } from "../../song/SongArtwork";

interface SongInfoProps extends StackProps {
  song: Song;
  fullPlayer?: boolean;
}

export const SongInfo = React.memo(
  ({ song, fullPlayer, ...rest }: SongInfoProps) => {
    const { show } = useContextMenu({ id: DEFAULT_MENU_ID });
    const tn = useNamePicker();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const mobileArtClick: React.MouseEventHandler = useCallback(
      (e) => {
        if (isMobile) return;
        else show({ event: e, props: song });
      },
      [isMobile, show, song],
    );

    return (
      <HStack onContextMenu={(e) => show({ event: e, props: song })} {...rest}>
        <SongArtwork
          song={song}
          size={fullPlayer ? 70 : 50}
          resizeHint={70}
          onClick={mobileArtClick}
          _hover={
            !isMobile
              ? { transform: "translateY(-1px)", outline: "#fffa solid 1px" }
              : {}
          }
        />

        <Box>
          <Link as={NavLink} to={`/song/${song.id}`}>
            <Text
              fontWeight={fullPlayer ? 600 : 500}
              noOfLines={fullPlayer ? 2 : 1}
              fontSize={fullPlayer ? "lg" : "md"}
            >
              {song.name}
            </Text>
          </Link>
          <Link as={NavLink} to={`/channel/${song.channel_id}`}>
            <Text
              noOfLines={fullPlayer ? 2 : 1}
              opacity={0.66}
              fontSize={fullPlayer ? "lg" : "md"}
            >
              {tn(song.channel.english_name, song.channel.name)}
            </Text>
          </Link>
        </Box>
      </HStack>
    );
  },
);
