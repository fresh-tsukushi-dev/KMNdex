// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  Box,
  Button,
  Flex,
  FlexProps,
  Heading,
  HStack,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ChannelCard } from "../components/channel/ChannelCard";
import { CardCarousel } from "../components/common/CardCarousel";
import { VideoPlaylistCarousel } from "../components/playlist/VideoPlaylistCarousel";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { SongCard } from "../components/song/SongCard";
import { useDiscoveryOrg } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useStoreActions, useStoreState } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useMemo } from "react";
import { useServerOrgList } from "../modules/services/statics.service";
import {
  RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS,
  RK_SINGLE_CHANNEL_MODE,
} from "../config/rkmusic";
import { LiveSection } from "../components/home/LiveSection";
import { GoodsSection } from "../components/home/GoodsSection";

export function HomeHeading({
  children,
  seeMoreTo,
  seeMoreText,
  mb,
}: {
  children: React.ReactNode;
  seeMoreTo?: string;
  seeMoreText?: string;
  mb?: FlexProps["mb"];
}) {
  const { t } = useTranslation();
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      mb={(mb ?? { base: 2, md: 3 }) as any}
    >
      <Heading size="lg" fontSize={["lg", null, "xl", null, "xl"] as any}>
        <Box>{children}</Box>
      </Heading>
      {seeMoreTo && (
        <Button
          variant="ghost"
          colorScheme="n2"
          size="sm"
          as={Link}
          to={seeMoreTo}
          ml={2}
        >
          {seeMoreText || t("See More")}
        </Button>
      )}
    </Flex>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const org = useStoreState((store) => store.org.currentOrg);
  const setOrg = useStoreActions((state) => state.org.setOrg);
  const { data: orgs } = useServerOrgList();
  const { data: trendingSongs, ...trendingStatus } = useTrendingSongs(
    org.name !== "All Vtubers" ? { org: org.name } : {},
  );
  const { org: orgParam } = useParams();
  useEffect(() => {
    if (!orgParam) return;
    if (orgParam !== org.name) {
      const targetOrg = orgs?.filter((x) => x.name === orgParam);
      if (targetOrg && targetOrg.length === 1 && targetOrg[0]) {
        setOrg(targetOrg[0]);
      }
    }
  }, [org, orgParam, orgs, setOrg]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const queueSongs = useSongQueuer();

  const { data: discovery, ...discoveryStatus } = useDiscoveryOrg(org.name);

  const discoverChannels = useMemo(() => {
    const apiChannels = discovery?.channels ?? [];
    if (!RK_SINGLE_CHANNEL_MODE) return apiChannels.slice(0, 10);
    // シングルチャンネルモード: ピン留めチャンネルをマージ
    const combined: ChannelStub[] = [
      ...RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS,
      ...apiChannels,
    ];
    const seen = new Set<string>();
    return combined
      .filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      })
      .slice(0, 10);
  }, [discovery?.channels]);

  const {
    sgp: recPlaylists,
    radios: recRadios,
    ugp: communityPlaylists,
  } = useMemo(() => {
    const sgp: PlaylistStub[] = [];
    const radios: PlaylistStub[] = [];
    const ugp: PlaylistStub[] = [];
    discovery?.recommended?.playlists.forEach((p) => {
      if (p.type === "ugp") ugp.push(p);
      else if (p.type.startsWith("radio")) radios.push(p);
      else sgp.push(p);
    });
    return { sgp, radios, ugp };
  }, [discovery]);

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Home")} - KMNdex</title>
      </Helmet>
      <ContainerInlay pt={3}>
        <HomeSection>
          <HomeHeading>{t("Recent Singing Streams")}</HomeHeading>

          {isMobile ? (
            <CardCarousel height={210} width={160} scrollMultiplier={2}>
              {discovery?.recentSingingStreams
                ?.filter((stream) => stream.playlist?.content?.length)
                .map((stream) => (
                  <PlaylistCard
                    playlist={stream.playlist!}
                    key={"kpc" + stream.playlist?.id}
                    mx={["2px", null, 1, 2]}
                  />
                ))}
            </CardCarousel>
          ) : (
            <VideoPlaylistCarousel
              videoPlaylists={discovery?.recentSingingStreams}
            />
          )}
        </HomeSection>

        {recPlaylists?.length ? (
          <HomeSection>
            <HomeHeading seeMoreTo="./playlists">
              {t("{{org}} Playlists", { org: org.name })}
            </HomeHeading>
            <CardCarousel
              height={210}
              width={160}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {recPlaylists?.map((p) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
            </CardCarousel>
          </HomeSection>
        ) : null}

        {!RK_SINGLE_CHANNEL_MODE && recRadios?.length ? (
          <HomeSection>
            <HomeHeading seeMoreTo="./radios">
              {t("{{org}} Radios", { org: org.name })}
            </HomeHeading>
            <CardCarousel
              height={210}
              width={160}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {recRadios?.map((p) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
            </CardCarousel>
          </HomeSection>
        ) : null}

        {!RK_SINGLE_CHANNEL_MODE && communityPlaylists?.length ? (
          <HomeSection>
            <HomeHeading seeMoreTo="./community">
              {t("{{org}} Community Playlists", { org: org.name })}
            </HomeHeading>
            <CardCarousel
              height={210}
              width={160}
              scrollMultiplier={isMobile ? 2 : 4}
            >
              {communityPlaylists?.map((p) => (
                <PlaylistCard
                  playlist={p}
                  key={"rec" + p.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
            </CardCarousel>
          </HomeSection>
        ) : null}

        <LiveSection />
        <GoodsSection />

        <HomeSection>
          <HStack alignItems="flex-end" mb={3}>
            <HomeHeading mb={0}>
              {t("Trending {{org}} Songs", { org: org.name })}
            </HomeHeading>
            <Spacer />
            <Button
              variant="ghost"
              size="sm"
              colorScheme="n2"
              onClick={() =>
                queueSongs({
                  songs: trendingSongs || [],
                  immediatelyPlay: false,
                })
              }
            >
              {t("Queue ({{amount}})", { amount: trendingSongs?.length })}
            </Button>
          </HStack>
          <CardCarousel
            height={180}
            width={128}
            scrollMultiplier={isMobile ? 2 : 4}
          >
            {trendingSongs?.map((song) => (
              <SongCard song={song} key={song.id} mx={["2px", null, 1, 2]} />
            ))}
          </CardCarousel>
        </HomeSection>

        <HomeSection>
          <HomeHeading seeMoreTo={`./channels`}>
            {t("Discover {{org}}", { org: org.name })}
          </HomeHeading>
          <CardCarousel
            height={180}
            width={160}
            scrollMultiplier={isMobile ? 2 : 4}
            mb={2}
          >
            {discoverChannels.map((c) => (
              <ChannelCard
                channel={c}
                key={c.id}
                marginX={["2px", null, 1, 2]}
              />
            ))}
          </CardCarousel>
        </HomeSection>
      </ContainerInlay>
    </PageContainer>
  );
}

const HomeSection = styled.div`
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
`;
