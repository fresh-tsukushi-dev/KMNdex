// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  Box,
  CloseButton,
  Divider,
  BoxProps,
  useToast,
  Flex,
  Collapse,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiHome, FiSettings, FiShield } from "react-icons/fi";
import { useClient } from "../../modules/client";
import {
  useMyPlaylists,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { NavItem } from "./NavItem";
import { OrgSelector, useOrgPath } from "./OrgSelector";
import { useLocation } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store";
import { useMemo, useState } from "react";
import { LogoWithText } from "./LogoWithText";
import { useTranslation } from "react-i18next";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  closeOnNav?: boolean;
}
export interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
  disabled?: boolean;
}

export function SidebarContent({
  closeOnNav = false,
  onClose,
  ...rest
}: SidebarProps) {
  const { t } = useTranslation();
  const pages: LinkItemProps[] = useMemo(
    () => [
      { name: t("Settings"), icon: FiSettings, path: "/settings" },
      { name: t("Privacy Policy"), icon: FiShield, path: "/privacy" },
    ],
    [t],
  );
  const { pathname } = useLocation();
  const orgPath = useOrgPath();

  return (
    <Box
      display="flex"
      flexDirection="column"
      transition="3s ease"
      bg={useColorModeValue("bg.100", "bg.900")}
      paddingTop="env(safe-area-inset-top)"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", lg: 60 }}
      flexShrink={0}
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="4"
        justifyContent="space-between"
        display={{ base: "flex", lg: "none" }}
      >
        <LogoWithText />
        <CloseButton onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} key={"Home"} mb={1} path={orgPath}>
        {t("Home")}
      </NavItem>
      <Collapse in={pathname.startsWith("/org/")}>
        <OrgSelector />
      </Collapse>
      {pages.map((page) => (
        <NavItem {...page} key={page.name} mb={1}>
          {page.name}
        </NavItem>
      ))}
      <Divider mb={2} />
    </Box>
  );
}
