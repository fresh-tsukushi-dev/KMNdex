// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Spacer,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import {
  FiList,
  FiShare2,
  FiTwitter,
  FiYoutube,
  FiSearch,
  FiHeart,
} from "react-icons/fi";
import { useQuery } from "react-query";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ChannelCard } from "../components/channel/ChannelCard";
import { ChannelPhoto } from "../components/channel/ChannelPhoto";
import { BGImg, BGImgContainer } from "../components/layout/BGImgContainer";
import { CardCarousel } from "../components/common/CardCarousel";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistCard } from "../components/playlist/PlaylistCard";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClipboardWithToast } from "../modules/common/clipboard";
import useNamePicker from "../modules/common/useNamePicker";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { useDiscoveryChannel } from "../modules/services/discovery.service";
import { useTrendingSongs } from "../modules/services/songs.service";
import { useSongQueuer } from "../utils/SongQueuerHook";
import ChannelSongs from "./ChannelSongs";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  useFavorites,
  useFavoritesUpdater,
} from "../modules/services/favorite.service";
import { useClient } from "../modules/client";
import { IconType } from "react-icons/lib";
import {
  RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS,
  RK_HAS_EXPLICIT_SCOPED_CHANNEL_IDS,
  RK_PRIMARY_CHANNEL_ID,
  rkCanonicalizeChannelId,
  rkGetPinnedDiscoverChannelName,
  rkIsPinnedDiscoverChannelId,
  rkIsChannelInScope,
  rkIsOrgInScope,
  RK_SINGLE_CHANNEL_MODE,
} from "../config/rkmusic";

export default function Channel() {
  const { t } = useTranslation();
  let params = useParams();
  const rawChannelId = params.id ?? "";
  const channelId = rkCanonicalizeChannelId(rawChannelId);
  const shouldRedirectToCanonicalId =
    RK_SINGLE_CHANNEL_MODE && !!rawChannelId && rawChannelId !== channelId;
  const shouldRedirectToPrimaryChannel =
    RK_SINGLE_CHANNEL_MODE &&
    RK_HAS_EXPLICIT_SCOPED_CHANNEL_IDS &&
    !!channelId &&
    !rkIsChannelInScope(channelId);

  // Always allow fetching the channel so we can decide scope by org
  // when explicit channel IDs are not configured.
  const channelQueryEnabled = !!channelId;

  const { data: channel, ...channelStatus } = useQuery<Channel, AxiosError>(
    ["channel", channelId],
    async (q) => {
      return (await axios.get("/api/v2/channels/" + q.queryKey[1])).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 600000 /* 10 mins */,
      enabled: channelQueryEnabled,
    },
  );

  const secondaryQueriesEnabled =
    !!channelId &&
    !shouldRedirectToPrimaryChannel &&
    (!RK_SINGLE_CHANNEL_MODE ||
      RK_HAS_EXPLICIT_SCOPED_CHANNEL_IDS ||
      rkIsOrgInScope(channel?.org));

  const { data: discovery, ...discoveryStatus } = useDiscoveryChannel(
    channelId,
    { enabled: secondaryQueriesEnabled },
  );

  const { data: trending, ...trendingStatus } = useTrendingSongs(
    { channel_id: channelId },
    { enabled: secondaryQueriesEnabled },
  );

  const shouldLoadPrimaryChannel =
    RK_SINGLE_CHANNEL_MODE &&
    secondaryQueriesEnabled &&
    !!RK_PRIMARY_CHANNEL_ID &&
    channelId !== RK_PRIMARY_CHANNEL_ID;
  const { data: primaryChannel } = useQuery<Channel, AxiosError>(
    ["rkPrimaryChannel", RK_PRIMARY_CHANNEL_ID],
    async () => {
      return (await axios.get("/api/v2/channels/" + RK_PRIMARY_CHANNEL_ID))
        .data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      enabled: shouldLoadPrimaryChannel,
      cacheTime: 60 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
    },
  );

  const pinnedDiscoverChannels = RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS;

  const queueSongs = useSongQueuer();
  const tn = useNamePicker();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (shouldRedirectToCanonicalId) {
    return <Navigate to={`/channel/${channelId}`} replace />;
  }

  if (shouldRedirectToPrimaryChannel) {
    if (channelId === RK_PRIMARY_CHANNEL_ID) {
      // Prevent infinite redirects when primary is not considered in-scope by config.
      // (We also enforce primary in scope in rkmusic.ts, but keep this as a safety net.)
    } else {
      return <Navigate to={`/channel/${RK_PRIMARY_CHANNEL_ID}`} replace />;
    }
  }

  // When scoped channel IDs are not explicitly configured, fall back to org-based scope.
  if (
    RK_SINGLE_CHANNEL_MODE &&
    !RK_HAS_EXPLICIT_SCOPED_CHANNEL_IDS &&
    channel &&
    !rkIsOrgInScope(channel.org)
  ) {
    if (channelId === RK_PRIMARY_CHANNEL_ID) {
      // Safety net: don't redirect primary to itself.
    } else {
      return <Navigate to={`/channel/${RK_PRIMARY_CHANNEL_ID}`} replace />;
    }
  }

  const channelNotFound =
    !!channelStatus.error &&
    (channelStatus.error as AxiosError | undefined)?.response?.status === 404;

  if (
    RK_SINGLE_CHANNEL_MODE &&
    channelNotFound &&
    rkIsPinnedDiscoverChannelId(channelId)
  ) {
    const pinnedName =
      rkGetPinnedDiscoverChannelName(channelId) ??
      pinnedDiscoverChannels.find((c) => c.id === channelId)?.name ??
      channelId;

    return (
      <PageContainer>
        <Helmet>
          <title>{pinnedName} - KMNdex</title>
        </Helmet>
        <ContainerInlay>
          <VStack w="100%" spacing={4} align="flex-start">
            <HStack w="100%" spacing={4} align="center">
              <ChannelPhoto
                channel={pinnedDiscoverChannels.find((c) => c.id === channelId)}
                channelId={channelId}
                size="xl"
                borderRadius={4}
              />
              <VStack align="flex-start" spacing={1}>
                <Heading size="md">{pinnedName}</Heading>
                <Box opacity={0.8}>
                  {t(
                    "This channel is not available yet, so KMNdex cannot show videos/songs for it.",
                  )}
                </Box>
              </VStack>
            </HStack>
            <HStack spacing={3}>
              <Button
                as="a"
                href={`https://www.youtube.com/channel/${channelId}`}
                target="_blank"
                rel="noreferrer"
                colorScheme="red"
              >
                {t("Open on YouTube")}
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `/channel/${RK_PRIMARY_CHANNEL_ID}`;
                }}
                variant="ghost"
                colorScheme="n2"
              >
                {t("Go to primary channel")}
              </Button>
            </HStack>
          </VStack>
        </ContainerInlay>
      </PageContainer>
    );
  }

  const isAnyLoading =
    channelStatus.isLoading ||
    discoveryStatus.isLoading ||
    trendingStatus.isLoading;
  const anyError =
    (channelStatus.error as AxiosError | undefined) ??
    (discoveryStatus.error as AxiosError | undefined) ??
    (trendingStatus.error as AxiosError | undefined);
  const isAnyError =
    channelStatus.isError || discoveryStatus.isError || trendingStatus.isError;

  if (isAnyLoading || isAnyError) {
    return (
      <PageContainer>
        <ContainerInlay>
          <QueryStatus
            queryStatus={{
              isLoading: isAnyLoading,
              isError: isAnyError,
              error: anyError,
            }}
          />
        </ContainerInlay>
      </PageContainer>
    );
  }

  const name = tn(channel?.english_name, channel?.name) ?? "";
  const bannerVideoId = discovery?.recentSingingStreams?.[0]?.video?.id;
  const bannerUrl = bannerVideoId
    ? `https://i.ytimg.com/vi/${bannerVideoId}/sddefault.jpg`
    : "";

  return (
    <PageContainer>
      <Helmet>
        <title>{name} - KMNdex</title>
      </Helmet>
      <BGImgContainer height="60vh">
        <BGImg banner_url={bannerUrl} height="33vh" blur />
      </BGImgContainer>

      <HStack
        mx={isMobile ? 2 : 6}
        my={6}
        flexWrap={isMobile ? "wrap" : "unset"}
        rowGap={4}
      >
        <HStack>
          <ChannelPhoto
            channel={
              channel && {
                ...channel,
                photo:
                  channel.photo ||
                  pinnedDiscoverChannels.find((c) => c.id === channel.id)
                    ?.photo,
              }
            }
            resizePhoto={isMobile ? 100 : 150}
            size={isMobile ? "xl" : "2xl"}
            borderRadius={4}
            mr={isMobile ? 2 : 6}
            shadow="xl"
          ></ChannelPhoto>
          <Link to={"/search"}>
            <PlaylistHeading
              title={name}
              description={
                channel?.org +
                (channel?.suborg?.slice(2)
                  ? " — " + channel?.suborg?.slice(2)
                  : "")
              }
              count={0}
              max={0}
              textShadow="1px 1px 5px var(--chakra-colors-bgAlpha-500);"
            />
          </Link>
        </HStack>
        {!isMobile && <Spacer />}
        <ChannelSocialButtons isMobile={isMobile} channel={channel} />
      </HStack>
      <ContainerInlay>
        <Routes>
          <Route
            index
            element={
              <ChannelContent
                discovery={discovery}
                trending={trending}
                queueSongs={queueSongs}
                name={name}
                channel={channel}
                primaryChannel={primaryChannel}
                pinnedDiscoverChannels={pinnedDiscoverChannels}
              ></ChannelContent>
            }
          ></Route>
          <Route path="songs" element={<ChannelSongs />}></Route>
        </Routes>
      </ContainerInlay>
    </PageContainer>
  );
}

function ChannelSocialButtons({
  isMobile,
  channel,
}: {
  isMobile: boolean | undefined;
  channel: Channel | undefined;
}) {
  const { isLoggedIn } = useClient();
  const { t } = useTranslation();
  const copy = useClipboardWithToast();
  const { data: favorites } = useFavorites();
  const { mutate } = useFavoritesUpdater();

  const isFavorited = favorites
    ?.map((channel) => channel.id)
    .includes(channel?.id ?? "");
  const favoriteBtnText = isFavorited
    ? "Remove from Favorites"
    : "Add to Favorites";

  const style: any = {
    color: "white",
    bgColor: "#fff2",
    border: "2px solid #fff5",
    _hover: {
      bgColor: "var(--chakra-colors-n2-800)",
      boxShadow: "lg",
      transform: "translateY(-3px) scale(1.1);",
    },
  };

  const gridTemplateColumns: string =
    isMobile || isFavorited ? "repeat(4, 1fr)" : "repeat(2, 1fr)";
  const mobilePt: number | undefined = isMobile ? 2 : undefined;
  const mobileMb: number | undefined = isMobile ? -2 : undefined;
  const mobileWidth: string | undefined = isMobile ? "100%" : undefined;
  const mobilePr: string | undefined = isMobile ? "0.5rem" : undefined;

  const gridStyle: any = {
    display: "grid",
    gap: isMobile ? 16 : 8,
    gridTemplateRows: "repeat(2, 1fr)",
    gridTemplateColumns,
    paddingTop: mobilePt ? mobilePt * 4 : undefined,
    marginBottom: mobileMb ? mobileMb * 4 : undefined,
    width: mobileWidth,
    paddingRight: mobilePr,
  };

  return (
    <Grid
      gap={isMobile ? 4 : 2}
      templateRows="repeat(2, 1fr)"
      templateColumns={
        isMobile || isFavorited ? "repeat(4, 1fr)" : "repeat(2, 1fr)"
      }
      {...(isMobile ? { pt: 2, mb: -2, width: "100%", pr: "0.5rem" } : {})}
    >
      {isLoggedIn && (
        <GridItem colStart={1} colEnd={5}>
          <Button
            {...style}
            bgColor={isFavorited ? "n2.700" : style.bgColor}
            w="full"
            leftIcon={<FiHeart />}
            onClick={() => {
              channel &&
                mutate({
                  channelId: channel.id,
                  action: isFavorited ? "remove" : "add",
                });
            }}
            aria-label={favoriteBtnText}
            title={t(favoriteBtnText)}
          >
            {t(favoriteBtnText)}
          </Button>
        </GridItem>
      )}
      <IconButton
        {...style}
        icon={<FiShare2 />}
        onClick={() => {
          copy(window.location.toString());
        }}
        aria-label="Copy URL"
        title={t("Copy link")}
      />
      <IconButton
        {...style}
        icon={<FiYoutube />}
        color="red.100"
        aria-label="YouTube"
        title="YouTube"
        as="a"
        href={"https://youtube.com/channel/" + channel?.id}
        target="_blank"
      />
      {channel?.twitter && (
        <IconButton
          {...style}
          color="twitter.100"
          icon={<FiTwitter />}
          aria-label="Twitter"
          title="Twitter"
          as="a"
          href={"https://twitter.com/" + channel?.twitter}
          target="_blank"
        />
      )}
    </Grid>
  );
}

interface PlaylistButton {
  label: string;
  link: string;
  icon: IconType;
}

function PlaylistButtons({ buttons }: { buttons: PlaylistButton[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      {buttons.map(({ label, icon, link }) => (
        // Avoid Chakra polymorphic `as` typing explosion by rendering icon directly
        <Button
          key={`${label}-${link}`}
          variant="ghost"
          size="md"
          colorScheme="n2"
          onClick={() => navigate(link as any)}
          float="right"
          textTransform="uppercase"
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            {(() => {
              const IconEl: any = icon;
              return <IconEl />;
            })()}
            {t(label)}
          </span>
        </Button>
      ))}
    </>
  );
}

function ChannelContent({
  discovery,
  trending,
  queueSongs,
  name,
  channel,
  primaryChannel,
  pinnedDiscoverChannels,
}: {
  discovery?: ChannelDiscovery;
  trending: Song[] | undefined;
  queueSongs: (_: { songs: Song[]; immediatelyPlay: boolean }) => void;
  name: string;
  channel?: Channel;
  primaryChannel?: Channel;
  pinnedDiscoverChannels?: Array<ChannelStub | Channel>;
}) {
  const { t } = useTranslation();
  const scrollAmount = useBreakpointValue({ base: 2, md: 4 }) ?? 4;

  const discoverMoreChannels = useMemo(() => {
    const discovered = discovery?.channels ?? [];
    const pinned = pinnedDiscoverChannels ?? [];
    const combined = [
      ...pinned,
      ...(primaryChannel ? [primaryChannel] : []),
      ...discovered,
    ];

    const result: Array<ChannelStub | Channel> = [];
    const seenIds: string[] = [];
    for (const c of combined) {
      if (!c?.id) continue;
      if (c.id === channel?.id) continue;

      const canonicalId = rkCanonicalizeChannelId(c.id);
      const normalized =
        canonicalId === RK_PRIMARY_CHANNEL_ID && primaryChannel
          ? primaryChannel
          : c;

      if (!normalized?.id) continue;
      if (normalized.id === channel?.id) continue;
      if (seenIds.indexOf(normalized.id) !== -1) continue;
      seenIds.push(normalized.id);
      result.push(normalized);
    }
    return result;
  }, [
    channel?.id,
    discovery?.channels,
    primaryChannel,
    pinnedDiscoverChannels,
  ]);

  const buttonData = useMemo(
    () => [
      {
        label: "See All Songs",
        link: "/channel/" + channel?.id + "/songs",
        icon: FiList,
      },
      {
        label: "Search Songs",
        link: `/searchV2?mode=fuzzy&ch=["${channel?.name}"]`,
        icon: FiSearch,
      },
    ],
    [channel],
  );

  return (
    <VStack w="100%">
      {trending && (
        <VStack w="100%">
          <HStack w="100%" align="center" justify="space-between">
            <Heading size="md" mt={4} mb={2}>
              {t("Popular")}
            </Heading>
            <Button
              variant="ghost"
              size="sm"
              py={0}
              colorScheme="n2"
              float="right"
              onClick={() => {
                queueSongs({ songs: trending, immediatelyPlay: false });
              }}
            >
              {t("Queue ({{amount}})", { amount: trending.length })}
            </Button>
          </HStack>
          <Box w="100%" flex="1 1 140px" minWidth="300px">
            <SongTable
              songs={trending.slice(0, 10)}
              rowProps={{
                // hideCol: ["og_artist", "menu"],
                flipNames: true,
                showArtwork: true,
              }}
              limit={5}
              appendRight={<PlaylistButtons buttons={buttonData} />}
            />
          </Box>
        </VStack>
      )}
      {discovery?.recentSingingStreams?.filter(
        (stream) => stream.playlist?.content?.length,
      ).length && (
        <VStack w="100%" align="flex-start">
          <Heading size="md" mt={4} mb={2}>
            {t("Latest Streams")}
          </Heading>
          <CardCarousel
            w="100%"
            height={230}
            width={160}
            scrollMultiplier={scrollAmount}
          >
            {discovery?.recentSingingStreams
              .filter((stream) => stream.playlist?.content?.length)
              .map((stream) => (
                <PlaylistCard
                  playlist={stream.playlist!}
                  key={"kpc" + stream.playlist?.id}
                  mx={["2px", null, 1, 2]}
                />
              ))}
          </CardCarousel>
        </VStack>
      )}
      {discovery?.recommended?.playlists?.length && (
        <VStack w="100%" align="flex-start">
          <Heading size="md" mt={4} mb={2}>
            {t("Featuring {{name}}", { name })}
          </Heading>
          <CardCarousel
            w="100%"
            height={230}
            width={160}
            scrollMultiplier={scrollAmount}
          >
            {discovery.recommended.playlists.map((x) => {
              return (
                <PlaylistCard
                  playlist={x}
                  marginX={["2px", null, 1, 2]}
                  key={x.id}
                ></PlaylistCard>
              );
            })}
          </CardCarousel>
        </VStack>
      )}
      <VStack w="100%" align="flex-start">
        <Heading size="md" mt={4} mb={2}>
          {t("Discover more from {{org}}", { org: channel?.org })}
        </Heading>
        {discovery && (
          <CardCarousel
            w="100%"
            height={180}
            width={160}
            scrollMultiplier={scrollAmount}
          >
            {discoverMoreChannels.slice(0, 10).map((c) => (
              <ChannelCard
                channel={c}
                key={c.id}
                marginX={["2px", null, 1, 2]}
              />
            ))}
          </CardCarousel>
        )}
      </VStack>
    </VStack>
  );
}
