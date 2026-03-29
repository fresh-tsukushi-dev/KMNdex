// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

export const RK_API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? "";
export const RK_STATICS_BASE_URL = process.env.REACT_APP_STATICS_BASE_URL ?? "";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith("/") ? value : `/${value}`;
}

export function rkApiUrl(path: string): string {
  const normalizedPath = ensureLeadingSlash(path);
  if (!RK_API_BASE_URL) return normalizedPath;
  return `${stripTrailingSlash(RK_API_BASE_URL)}${normalizedPath}`;
}

export function rkStaticsUrl(path: string): string {
  const normalizedPath = ensureLeadingSlash(path);
  if (!RK_STATICS_BASE_URL) return normalizedPath;
  return `${stripTrailingSlash(RK_STATICS_BASE_URL)}${normalizedPath}`;
}
