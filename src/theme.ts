// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

// Check scripts/generateTheme.js to get these values
const localColors = {
  brand: {
    "50": "#F6EEFF",
    "100": "#E9D6FF",
    "200": "#D5B3FF",
    "300": "#BE8BFF",
    "400": "#A45CFF",
    "500": "#8A2BFF",
    "600": "#6F1ED6",
    "700": "#5417A3",
    "800": "#39106F",
    "900": "#230A46",
  },
  n2: {
    "50": "#F2EDFF",
    "100": "#E2DAFF",
    "200": "#C7B8FF",
    "300": "#AA93FF",
    "400": "#8A6BFF",
    "500": "#6A3DFF",
    "600": "#522BE0",
    "700": "#3D20AD",
    "800": "#2A1677",
    "900": "#190E49",
  },
  bg: {
    "50": "#FFFFFF",
    "100": "#F7F5FF",
    "200": "#EDE9FF",
    "300": "#D9D2F0",
    "400": "#BDB4D4",
    "500": "#8E84A8",
    "600": "#322B3F",
    "700": "#1C1626",
    "800": "#120D19",
    "900": "#0B0711",
  },
  bgAlpha: {
    "50": "#FFFFFFB3",
    "100": "#F7F5FFB3",
    "200": "#EDE9FFB3",
    "300": "#D9D2F0B3",
    "400": "#BDB4D4B3",
    "500": "#8E84A8B3",
    "600": "#322B3FB3",
    "700": "#1C1626B3",
    "800": "#120D19B3",
    "900": "#0B0711B3",
  },
};

export const theme = extendTheme(
  {
    breakpoints: {
      base: "0px",
      sm: "480px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
      "2xl": "1536px",
      "3xl": "1930px",
    },
    config: { initialColorMode: "dark", useSystemColorMode: false },
    colors: localColors,
    fonts: {
      heading:
        'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto","Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans","Helvetica Neue", Sans-Serif',
      body: 'Assistant, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto","Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans","Helvetica Neue", Sans-Serif',
    },
    styles: {
      global: {
        body: {
          bg: "bg.900",
          color: "whiteAlpha.900",
          overflow: "hidden",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "#root": {
          h: "100vh",
          overflow: "hidden",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" }),
);
