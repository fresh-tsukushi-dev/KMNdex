// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CardCarousel } from "../common/CardCarousel";
import { useLatestGoods } from "../../modules/services/rkdex.service";
import { HomeHeading } from "../../pages/Home";

export function GoodsSection() {
  const { t } = useTranslation();
  const { data: goods } = useLatestGoods();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!Array.isArray(goods) || !goods.length) return null;

  return (
    <Box mb={3} mt={2}>
      <HomeHeading>{t("New Goods")}</HomeHeading>
      <CardCarousel
        height={220}
        width={180}
        scrollMultiplier={isMobile ? 2 : 4}
      >
        {goods.map((item) => (
          <GoodsCard key={item.id} goods={item} />
        ))}
      </CardCarousel>
    </Box>
  );
}

function GoodsCard({ goods }: { goods: Goods }) {
  const { t } = useTranslation();

  return (
    <VStack
      w="170px"
      mx={["2px", null, 1, 2]}
      bg="bgAlpha.100"
      borderRadius="md"
      overflow="hidden"
      spacing={0}
      align="stretch"
      flexShrink={0}
    >
      {goods.image_url ? (
        <Image
          src={goods.image_url}
          alt={goods.title}
          h="110px"
          w="100%"
          objectFit="cover"
        />
      ) : (
        <Box h="110px" bg="bgAlpha.200" />
      )}
      <VStack p={2} spacing={1} align="stretch" flex={1}>
        <Heading size="xs" noOfLines={2}>
          {goods.title}
        </Heading>
        {goods.description && (
          <Text fontSize="xs" opacity={0.8} noOfLines={2}>
            {goods.description}
          </Text>
        )}
        {goods.store_url && (
          <Button
            as="a"
            href={goods.store_url}
            target="_blank"
            rel="noreferrer"
            size="xs"
            colorScheme="brand"
            mt="auto"
          >
            {t("Buy")}
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
