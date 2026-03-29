// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { HStack, Heading, StackProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function LogoWithText(props: StackProps) {
  return (
    <HStack as={Link} to="/" {...props}>
      <Heading display="flex" fontSize="2xl">
        KMNdex
      </Heading>
    </HStack>
  );
}
