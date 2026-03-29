// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useClient } from "../../modules/client";
import { ContainerInlay } from "../layout/ContainerInlay";
import { PageContainer } from "../layout/PageContainer";

export function RequireLogin({
  children,
  // Fallback string for meta, when the actual meta is blocked by login
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { t } = useTranslation();
  const { isLoggedIn } = useClient();
  if (isLoggedIn) return <>{children}</>;

  return (
    <PageContainer>
      <Helmet>
        <title>{title || "Login Required"} - KMNdex</title>
      </Helmet>
      <ContainerInlay>
        <Center flexDirection="column">
          <Text fontSize="xl" mb={8}>
            {t("This feature is currently unavailable.")}
          </Text>
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}
