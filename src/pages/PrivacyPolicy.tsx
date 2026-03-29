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

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Helmet>
        <title>
          {t("Privacy Policy")} - {KMNDEX_BRAND_NAME}
        </title>
      </Helmet>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          {t("Privacy Policy")}
        </Heading>
        <VStack spacing={8} align="stretch" pb={8}>
          {/* About This Application */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.about.title")}
            </Heading>
            <Text>{t("privacy.about.description")}</Text>
          </Box>

          {/* No Data Collection */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.nocollection.title")}
            </Heading>
            <Text>{t("privacy.nocollection.description")}</Text>
          </Box>

          {/* YouTube Video Playback */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.youtube.title")}
            </Heading>
            <Text mb={2}>{t("privacy.youtube.description")}</Text>
            <Text mb={2}>{t("privacy.youtube.disclaimer")}</Text>
            <Text mb={3}>{t("privacy.youtube.tracking")}</Text>
            <Text mb={2}>{t("privacy.youtube.tos")}</Text>
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

          {/* Local Storage */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.cookies.title")}
            </Heading>
            <Text>{t("privacy.cookies.description")}</Text>
          </Box>

          {/* Third-Party Services */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.thirdparty.title")}
            </Heading>
            <Text>{t("privacy.thirdparty.description")}</Text>
          </Box>

          {/* Changes to This Policy */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.changes.title")}
            </Heading>
            <Text>{t("privacy.changes.description")}</Text>
          </Box>

          {/* Contact */}
          <Box>
            <Heading size="md" mb={3}>
              {t("privacy.contact.title")}
            </Heading>
            <Text mb={2}>{t("privacy.contact.description")}</Text>
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
