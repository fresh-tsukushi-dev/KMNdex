// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { VStack, Flex, Text, Spinner, StackProps } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { ErrorFallback } from "./ErrorFallback";

interface QueryStatusProps extends StackProps {
  queryStatus: {
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
  };
}

export function QueryStatus({ queryStatus, ...rest }: QueryStatusProps) {
  const { t } = useTranslation();

  return (
    <VStack
      textAlign="center"
      h={queryStatus.isLoading ? "100%" : ""}
      w="100%"
      {...rest}
    >
      {queryStatus.isLoading && (
        <Flex
          h="100%"
          w="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={4}
        >
          <Spinner size="xl" />
          <Text fontSize="2xl">{t("Loading...")}</Text>
        </Flex>
      )}

      {queryStatus.isError && (
        <ErrorFallback
          error={queryStatus.error as AxiosError}
          resetErrorBoundary={() => window.location.reload()}
        ></ErrorFallback>
      )}
    </VStack>
  );
}
