// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { Icon } from "@chakra-ui/react";
import { BiMovie } from "react-icons/bi";
import { formatSeconds } from "../../../utils/SongHelper";

export const DurationGrid = ({ song }: { song: Song }) => {
  return (
    <>
      {!!song.is_mv && (
        <Icon mb="-3px" mr={3} as={BiMovie} title="MV" color="gray.500"></Icon>
      )}{" "}
      {formatSeconds(song.end - song.start)}
    </>
  );
};
