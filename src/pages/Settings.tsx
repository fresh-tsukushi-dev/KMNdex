// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { LanguageSettings } from "../components/settings/LanguageSettings";
import { IoLanguage } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Settings")} - KMNdex</title>
      </Helmet>
      <ContainerInlay>
        <Heading size="lg" py={5}>
          {t("Settings")}
        </Heading>
        <Tabs
          orientation="vertical"
          size="lg"
          align="start"
          flexDir={{ base: "column", md: "row" }}
          isLazy
        >
          <TabList h="fit-content" minW={{ base: "full", md: 72 }}>
            <Tab
              fontSize="lg"
              fontWeight={600}
              justifyContent="flex-start"
              gap={2}
            >
              <Icon as={IoLanguage} mr={1}></Icon>
              {t("Language Preferences")}
            </Tab>
          </TabList>
          <TabPanels
            borderColor="chakra-border-color"
            borderLeftWidth={{ base: 0, md: 1 }}
            pl={{ base: 0, md: 4 }}
          >
            <TabPanel px={0}>
              <LanguageSettings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ContainerInlay>
    </PageContainer>
  );
}
