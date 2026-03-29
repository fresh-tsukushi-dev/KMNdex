// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { CardCarousel } from "../common/CardCarousel";
import { useUpcomingLives } from "../../modules/services/rkdex.service";
import { RK_OFFICIAL_SITE_URL } from "../../config/rkmusic";
import { HomeHeading } from "../../pages/Home";

export function LiveSection() {
  const { t } = useTranslation();
  const { data: lives } = useUpcomingLives();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!Array.isArray(lives) || !lives.length) return null;

  return (
    <Box mb={3} mt={2}>
      <HomeHeading
        seeMoreTo={RK_OFFICIAL_SITE_URL}
        seeMoreText={t("See on Official Site")}
      >
        {t("Upcoming Lives")}
      </HomeHeading>
      <CardCarousel
        height={220}
        width={200}
        scrollMultiplier={isMobile ? 2 : 4}
      >
        {lives.map((live) => (
          <LiveCard key={live.id} live={live} />
        ))}
      </CardCarousel>
    </Box>
  );
}

function LiveCard({ live }: { live: Live }) {
  const { t } = useTranslation();
  const eventDate = new Date(live.event_date);

  return (
    <VStack
      w="190px"
      mx={["2px", null, 1, 2]}
      bg="bgAlpha.100"
      borderRadius="md"
      overflow="hidden"
      spacing={0}
      align="stretch"
      flexShrink={0}
    >
      {live.image_url ? (
        <Image
          src={live.image_url}
          alt={live.title}
          h="100px"
          w="100%"
          objectFit="cover"
        />
      ) : (
        <Box h="100px" bg="bgAlpha.200" />
      )}
      <VStack p={2} spacing={1} align="stretch" flex={1}>
        <Heading size="xs" noOfLines={2}>
          {live.title}
        </Heading>
        <HStack spacing={1} opacity={0.8} fontSize="xs">
          <FiCalendar />
          <Text>
            {eventDate.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </HStack>
        {live.venue && (
          <HStack spacing={1} opacity={0.8} fontSize="xs">
            <FiMapPin />
            <Text noOfLines={1}>{live.venue}</Text>
          </HStack>
        )}
        {live.ticket_url && (
          <Button
            as="a"
            href={live.ticket_url}
            target="_blank"
            rel="noreferrer"
            size="xs"
            colorScheme="brand"
            mt="auto"
          >
            {t("Get Tickets")}
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
