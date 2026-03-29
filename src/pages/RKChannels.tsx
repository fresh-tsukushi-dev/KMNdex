// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

import {
  Box,
  Heading,
  HStack,
  IconButton as ChakraIconButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ChannelCard } from "../components/channel/ChannelCard";
import { QueryStatus } from "../components/common/QueryStatus";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import {
  RK_BRAND_NAME,
  RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS,
  RK_SCOPED_CHANNEL_IDS,
} from "../config/rkmusic";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";

const IconButton: any = ChakraIconButton;

export default function RKChannels() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const singleScopedChannelId =
    RK_SCOPED_CHANNEL_IDS.length === 1 ? RK_SCOPED_CHANNEL_IDS[0] : null;

  const pageTitle = useMemo(
    () => t("{{brand}} Channels", { brand: RK_BRAND_NAME }),
    [t],
  );

  const { data: channels, ...queryStatus } = useQuery<Channel[], AxiosError>(
    ["rkScopedChannels", RK_SCOPED_CHANNEL_IDS.join(",")],
    async () => {
      const ids = RK_SCOPED_CHANNEL_IDS;
      const results = await Promise.all(
        ids.map(
          async (id) =>
            (
              await axios.get<Channel>("/api/v2/channels/" + id)
            ).data,
        ),
      );
      return results;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      enabled: RK_SCOPED_CHANNEL_IDS.length > 0,
      cacheTime: 10 * 60 * 1000,
    },
  );

  useEffect(() => {
    if (singleScopedChannelId) {
      navigate(`/channel/${singleScopedChannelId}`, { replace: true });
    }
  }, [navigate, singleScopedChannelId]);

  if (singleScopedChannelId) return null;

  return (
    <PageContainer>
      <Helmet>
        <title>{pageTitle} - KMNdex</title>
      </Helmet>
      <ContainerInlay>
        <HStack mb={3}>
          <IconButton
            icon={<FiArrowLeft />}
            aria-label="Back"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            _hover={{ cursor: "pointer" }}
          />
          <Heading size="lg">{pageTitle}</Heading>
        </HStack>

        <Box>
          <QueryStatus queryStatus={queryStatus} />
          {queryStatus.isError && <Box>{t("Failed to load channels")}</Box>}
          {!queryStatus.isLoading && channels && (
            <Wrap>
              {channels.map((channel) => (
                <WrapItem key={channel.id}>
                  <ChannelCard
                    channel={{
                      ...channel,
                      photo:
                        channel.photo ||
                        RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS.find(
                          (c) => c.id === channel.id,
                        )?.photo ||
                        "",
                    }}
                    margin={1}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Box>
      </ContainerInlay>
    </PageContainer>
  );
}
