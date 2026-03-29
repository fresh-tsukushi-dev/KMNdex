// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { useSyncExternalStore } from "react";
import { FaPlay } from "react-icons/fa";
import { store } from "../../../store";
import { MotionBox } from "../../common/MotionBox";
import { NowPlayingIcon } from "../../icons/NowPlayingIcon";
import { Text } from "@chakra-ui/react";

// Stable references for useSyncExternalStore (must not be recreated per render)
const subscribe = (cb: () => void) => store.subscribe(cb);
const getCurrentlyPlayingId = () =>
  store.getState().playback.currentlyPlaying?.song?.id;
const getIsPlaying = () => store.getState().playback.isPlaying;

export const IdxGrid = ({
  id,
  songId,
  active,
  onPlayClick,
}: {
  id: number;
  songId: string;
  active: boolean;
  onPlayClick: (e: any) => void;
}) => {
  const currentId = useSyncExternalStore(subscribe, getCurrentlyPlayingId);
  const isPlaying = useSyncExternalStore(subscribe, getIsPlaying);

  switch (true) {
    case songId === currentId:
      return (
        <NowPlayingIcon
          isPlaying={isPlaying}
          style={{ color: "var(--chakra-colors-n2-400)" }}
        />
      );
    case active:
      return (
        <MotionBox
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          color="brand.400"
          _hover={{ color: "brand.200" }}
          onClick={onPlayClick}
          cursor="pointer"
          marginLeft="1px"
        >
          <FaPlay />
        </MotionBox>
      );
    default:
      return (
        <Text as={"span"} opacity={0.8}>
          {id + 1}
        </Text>
      );
  }
};
