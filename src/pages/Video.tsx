// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { Text } from "@chakra-ui/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { FiTag, FiYoutube } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { usePlaylistTitleDesc } from "../modules/playlist/useFormatPlaylist";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";
import { rkIsChannelInScope, RK_SINGLE_CHANNEL_MODE } from "../config/rkmusic";

export default function Video() {
  const { t } = useTranslation();
  let params = useParams();
  let videoId = params.id!;
  const playlistQuery = usePlaylist(`:video[id=${videoId}]`);
  const playlist = playlistQuery.data;
  const { title, description } = usePlaylistTitleDesc(playlist);

  const queueSongs = useSongQueuer();
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist,
  );

  const scopedPlaylist = RK_SINGLE_CHANNEL_MODE
    ? playlist && {
        ...playlist,
        content: playlist.content?.filter((song) =>
          rkIsChannelInScope(song.channel_id),
        ),
      }
    : playlist;

  return (
    <PageContainer>
      <ContainerInlay>
        <PlaylistHeading
          playlist={scopedPlaylist}
          title={title || "Video"}
          description={description || ""}
          count={scopedPlaylist?.content?.length || 0}
          max={0}
          totalLengthSecs={scopedPlaylist?.content?.reduce(
            (a, c) => a + c.end - c.start,
            0,
          )}
        />
        {scopedPlaylist?.content && (
          <PlaylistButtonArray
            playlist={scopedPlaylist}
            canEdit={false}
            editMode={false}
            onPlayClick={() => {
              scopedPlaylist && setPlaylist({ playlist: scopedPlaylist });
            }}
            canStar={false}
            onAddQueueClick={() => {
              scopedPlaylist.content &&
                queueSongs({
                  songs: [...scopedPlaylist.content],
                  immediatelyPlay: false,
                });
            }}
            mb={2}
          >
            {/* @ts-ignore */}
            {[
              {
                // @ts-ignore
                title: t("Open in YouTube"),
                ariaLabel: "open-on-youtube",
                icon: <FiYoutube />,
                onClick: () => window.open("https://youtu.be/" + videoId),
              },
            ]}
          </PlaylistButtonArray>
        )}
        <Suspense fallback={<div>{t("Loading...")}</div>}>
          {scopedPlaylist?.content && <SongTable playlist={scopedPlaylist} />}{" "}
        </Suspense>
        {!playlist && playlistQuery.isError && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FiTag size={40} />
            <Text>{t("Stream is not yet tagged with any songs.")}</Text>
          </div>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
