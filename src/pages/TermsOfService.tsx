// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { Helmet } from "react-helmet-async";
import { KMNDEX_BRAND_NAME } from "../config/rkmusic";

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Helmet>
        <title>
          {t("Terms of Service")} - {KMNDEX_BRAND_NAME}
        </title>
      </Helmet>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          {t("Terms of Service")}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          {t("tos.lastUpdated")}
        </Text>
        <VStack spacing={8} align="stretch" pb={8}>
          {/* 1. Acceptance of Terms */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.acceptance.title")}
            </Heading>
            <Text mb={2}>{t("tos.acceptance.description")}</Text>
            <Text mb={2}>{t("tos.acceptance.thirdparty")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>
                <Link
                  href="https://www.youtube.com/t/terms"
                  isExternal
                  color="brand.300"
                >
                  {t("YouTube Terms of Service")}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://policies.google.com/privacy"
                  isExternal
                  color="brand.300"
                >
                  {t("Google Privacy Policy")}
                </Link>
              </ListItem>
            </UnorderedList>
          </Box>

          {/* 2. Description of the Service */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.description.title")}
            </Heading>
            <Text mb={2}>{t("tos.description.text")}</Text>
            <Text>{t("tos.description.fork")}</Text>
          </Box>

          {/* 3. YouTube API Services */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.youtube.title")}
            </Heading>
            <Text mb={2}>{t("tos.youtube.description")}</Text>
            <Text mb={2}>{t("tos.youtube.acknowledge")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>{t("tos.youtube.item1")}</ListItem>
              <ListItem>{t("tos.youtube.item2")}</ListItem>
              <ListItem>{t("tos.youtube.item3")}</ListItem>
              <ListItem>{t("tos.youtube.item4")}</ListItem>
            </UnorderedList>
          </Box>

          {/* 4. Permitted Use */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.permitted.title")}
            </Heading>
            <Text mb={2}>{t("tos.permitted.description")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>{t("tos.permitted.item1")}</ListItem>
              <ListItem>{t("tos.permitted.item2")}</ListItem>
              <ListItem>{t("tos.permitted.item3")}</ListItem>
            </UnorderedList>
          </Box>

          {/* 5. Prohibited Use */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.prohibited.title")}
            </Heading>
            <Text mb={2}>{t("tos.prohibited.description")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>{t("tos.prohibited.item1")}</ListItem>
              <ListItem>{t("tos.prohibited.item2")}</ListItem>
              <ListItem>{t("tos.prohibited.item3")}</ListItem>
              <ListItem>{t("tos.prohibited.item4")}</ListItem>
              <ListItem>{t("tos.prohibited.item5")}</ListItem>
              <ListItem>{t("tos.prohibited.item6")}</ListItem>
            </UnorderedList>
          </Box>

          {/* 6. Intellectual Property */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.ip.title")}
            </Heading>
            <Text mb={2}>{t("tos.ip.description")}</Text>
            <Text>{t("tos.ip.trademarks")}</Text>
          </Box>

          {/* 7. API Usage */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.api.title")}
            </Heading>
            <Text mb={2}>{t("tos.api.description")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>{t("tos.api.item1")}</ListItem>
              <ListItem>{t("tos.api.item2")}</ListItem>
              <ListItem>{t("tos.api.item3")}</ListItem>
              <ListItem>{t("tos.api.item4")}</ListItem>
            </UnorderedList>
          </Box>

          {/* 8. Disclaimer of Warranties */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.disclaimer.title")}
            </Heading>
            <Text mb={2}>{t("tos.disclaimer.description")}</Text>
            <Text mb={2}>{t("tos.disclaimer.noguarantee")}</Text>
            <UnorderedList spacing={1} pl={4} mb={3}>
              <ListItem>{t("tos.disclaimer.item1")}</ListItem>
              <ListItem>{t("tos.disclaimer.item2")}</ListItem>
              <ListItem>{t("tos.disclaimer.item3")}</ListItem>
            </UnorderedList>
            <Text>{t("tos.disclaimer.note")}</Text>
          </Box>

          {/* 9. Limitation of Liability */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.liability.title")}
            </Heading>
            <Text mb={2}>{t("tos.liability.description")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>{t("tos.liability.item1")}</ListItem>
              <ListItem>{t("tos.liability.item2")}</ListItem>
              <ListItem>{t("tos.liability.item3")}</ListItem>
            </UnorderedList>
          </Box>

          {/* 10. Changes to These Terms */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.changes.title")}
            </Heading>
            <Text>{t("tos.changes.description")}</Text>
          </Box>

          {/* 11. Governing Law */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.governing.title")}
            </Heading>
            <Text>{t("tos.governing.description")}</Text>
          </Box>

          {/* 12. Contact */}
          <Box>
            <Heading size="md" mb={3}>
              {t("tos.contact.title")}
            </Heading>
            <Text mb={2}>{t("tos.contact.description")}</Text>
            <UnorderedList spacing={1} pl={4}>
              <ListItem>
                <Link
                  href="mailto:contact@forvirtualmusic.com"
                  color="brand.300"
                >
                  contact@forvirtualmusic.com
                </Link>
              </ListItem>
            </UnorderedList>
          </Box>
        </VStack>
      </ContainerInlay>
    </PageContainer>
  );
}
