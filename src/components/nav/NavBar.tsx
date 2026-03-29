// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  FlexProps,
  useColorModeValue,
  Flex,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useClient } from "../../modules/client";
import { SearchBox } from "./SearchBox";
import { LogoWithText } from "./LogoWithText";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export function NavBar({ onOpen, ...rest }: MobileProps) {
  const { pathname } = useLocation();

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      ml={{ base: 0 }}
      px={{ base: 4, md: 4 }}
      height="16"
      flexGrow={0}
      flexShrink={0}
      alignItems="center"
      paddingTop="env(safe-area-inset-top)"
      boxSizing="content-box"
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent={{ base: "space-between", lg: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", lg: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <LogoWithText display={{ base: "none", lg: "flex" }} />

      {pathname !== "/search" && (
        <SearchBox w={{ base: "100%", lg: "50%" }} paddingX={4} />
      )}

      <HStack spacing={{ base: "0", lg: "6" }}></HStack>
    </Flex>
  );
}
