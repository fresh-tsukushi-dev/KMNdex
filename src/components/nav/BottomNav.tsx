// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FiHome, FiSettings, FiShield } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useOrgPath } from "./OrgSelector";
import { LinkItemProps } from "./Sidebar";

export function BottomNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const orgPath = useOrgPath();

  const pages: LinkItemProps[] = useMemo(
    () => [
      { name: t("Home"), icon: FiHome, path: orgPath },
      { name: t("Settings"), icon: FiSettings, path: "/settings" },
      { name: t("Privacy Policy"), icon: FiShield, path: "/privacy" },
    ],
    [t, orgPath],
  );
  return (
    <Flex
      minHeight="56px"
      justify="space-evenly"
      bgColor="bg.900"
      paddingBottom="calc(env(safe-area-inset-bottom)*0.5)"
      boxSizing="content-box"
    >
      {pages.map(({ name, icon, path }) => (
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          spacing={1}
          as={Link}
          to={path}
          key={path}
          color={path === pathname ? "brand.100" : "white"}
        >
          <Icon as={icon} aria-label={name} w={5} h={5} />
          <Text fontSize="xs" noOfLines={1}>
            {name}
          </Text>
        </Stack>
      ))}
    </Flex>
  );
}
