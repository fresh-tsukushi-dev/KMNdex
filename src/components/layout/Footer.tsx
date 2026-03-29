// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  Box,
  Container,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";
import { ContainerInlay } from "./ContainerInlay";
import { format } from "date-fns";
import { KMNDEX_BRAND_NAME } from "../../config/rkmusic";

const gi = { commit: { shortHash: "dev", date: new Date().toISOString() } };

const SocialButton = ({ icon, ...rest }: any) => {
  return (
    <IconButton
      bg={useColorModeValue("bg.100", "bg.100")}
      size="sm"
      rounded="full"
      colorScheme="brand"
      icon={icon}
      {...rest}
    ></IconButton>
  );
};

export default function Footer() {
  return (
    <Box color={useColorModeValue("gray.700", "gray.200")} marginTop="auto">
      <ContainerInlay>
        <Container
          as={Stack}
          maxW={"7xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text>
            © 2026 {KMNDEX_BRAND_NAME}.{" "}
            <small style={{ color: "#445" }}>
              {KMNDEX_BRAND_NAME} build {gi.commit.shortHash}/
              {format(new Date(gi.commit.date), "LLL dd HH:mm")}
            </small>
          </Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton
              aria-label="GitHub"
              icon={<FaGithub />}
              title="GitHub"
              as="a"
              href="https://github.com/fresh-tsukushi-dev/KMNdex"
              target="_blank"
            />
          </Stack>
        </Container>
      </ContainerInlay>
    </Box>
  );
}
