// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

export const RK_SINGLE_CHANNEL_MODE =
  (process.env.REACT_APP_SINGLE_CHANNEL_MODE ?? "true").toLowerCase() !==
  "false";

// KMNZ official YouTube channel ID (resolved from https://www.youtube.com/@KMNZOFFICIAL)
export const RK_PRIMARY_CHANNEL_ID =
  process.env.REACT_APP_PRIMARY_CHANNEL_ID ?? "UCwuS0uY-Z2Gr_5OV2oFybFA";

/**
 * Legacy/alternate channel IDs that should redirect to RK_PRIMARY_CHANNEL_ID.
 * Useful when a membership/secondary channel is linked.
 *
 * Example:
 *   REACT_APP_PRIMARY_CHANNEL_ALIASES=UCaaa,UCbbb
 */
export const RK_PRIMARY_CHANNEL_ALIASES = parseChannelIdList(
  process.env.REACT_APP_PRIMARY_CHANNEL_ALIASES ?? "UC68J5pWEshmwhDH45qnpIsg",
);

export const rkCanonicalizeChannelId = (channelId: string) =>
  RK_PRIMARY_CHANNEL_ALIASES.includes(channelId)
    ? RK_PRIMARY_CHANNEL_ID
    : channelId;

function uniqStrings(items: string[]): string[] {
  return items.filter((v, i) => items.indexOf(v) === i);
}

// For IDs: allow whitespace/comma/semicolon separators.
function parseTokenList(value: string): string[] {
  const items = (value ?? "")
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return uniqStrings(items);
}

// For org names: do NOT split by whitespace (orgs like "RK Music").
// Use comma/semicolon/newline as separators.
function parseOrgList(value: string): string[] {
  const items = (value ?? "")
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return uniqStrings(items);
}

function parseChannelIdList(value: string): string[] {
  return parseTokenList(value);
}

/**
 * Org-based scope for RK mode.
 *
 * If you don't provide explicit channel IDs via REACT_APP_SCOPED_CHANNEL_IDS,
 * the app falls back to scoping by org (default: RK Music).
 */
export const RK_SCOPED_ORGS = parseOrgList(
  process.env.REACT_APP_SCOPED_ORGS ?? "RK Music",
);

const rkNormalizeOrg = (org: string) => org.replace(/\s+/g, "").toLowerCase();
const RK_SCOPED_ORGS_NORMALIZED = RK_SCOPED_ORGS.map(rkNormalizeOrg);

export const rkIsOrgInScope = (org: string | undefined) =>
  !!org && RK_SCOPED_ORGS_NORMALIZED.includes(rkNormalizeOrg(org));

/**
 * Comma/space separated list of channel IDs allowed in RK single-channel mode.
 * If omitted, it falls back to RK_PRIMARY_CHANNEL_ID.
 *
 * Example:
 *   REACT_APP_SCOPED_CHANNEL_IDS=UCxxx,UCyyy,UCzzz
 */
const RK_SCOPED_CHANNEL_IDS_RAW =
  process.env.REACT_APP_SCOPED_CHANNEL_IDS ?? process.env.REACT_APP_CHANNEL_IDS;

export const RK_HAS_EXPLICIT_SCOPED_CHANNEL_IDS =
  typeof RK_SCOPED_CHANNEL_IDS_RAW === "string" &&
  RK_SCOPED_CHANNEL_IDS_RAW.trim().length > 0;

const RK_SCOPED_CHANNEL_IDS_PARSED = parseChannelIdList(
  RK_SCOPED_CHANNEL_IDS_RAW ?? RK_PRIMARY_CHANNEL_ID,
);

const RK_DISCOVER_MORE_PINNED_NAME_BY_ID: Record<string, string> = {
  // UCsT7GTwoXE0tatNnDhcE58Q: "KMNZ_LITAM",
  "UCMxpgHUmLm5m-K-GkcBLQ9A": "KMNZ LITA",
  // "UC3cuxhq3Cv-9h5wNXvWHspg": "KMNZ_NEROM",
  UCh5pc3_3l8ouUgdUAI2TtNg: "KMNZ NERO",
  // UCnwnKd78qy2Txjs1WlfwkxA: "KMNZ_TINAM",
  "UCCPGAOlGQ-SEiThLjS-teQw": "KMNZ TINA",
  "UCQXuGcIoseWY5HmW6-U7teg": "HONKTHEHORN",
};

export const RK_DISCOVER_MORE_PINNED_PHOTO_BY_ID: Record<string, string> = {
  "UCMxpgHUmLm5m-K-GkcBLQ9A":
    "https://yt3.googleusercontent.com/ZwihLlFLthFiA8lwX7QK80sahU1KEBtxlNcRB2wuE70-Ys46BQSGFDPo30vhBoMY0qpZCF_-4Q=s176-c-k-c0x00ffffff-no-rj",
  UCh5pc3_3l8ouUgdUAI2TtNg:
    "https://yt3.googleusercontent.com/v07tw6XUCsSTrxTIa5lB6abhcA2ux_SpdshbaiUj4cW2uZKExgZeaYj533CvZcBDU8Q47W6q=s176-c-k-c0x00ffffff-no-rj",
  "UCCPGAOlGQ-SEiThLjS-teQw":
    "https://yt3.googleusercontent.com/ooP1DAACcKo24z6VQkzUGUOqmlxWftrs8ak8tzYW2_abJ0kAHbB0y3H5hg1R-nlNlKAuw_fjcA=s176-c-k-c0x00ffffff-no-rj",
};

/**
 * Member channel IDs belonging to the same group as the primary channel.
 * Derived from RK_DISCOVER_MORE_PINNED_NAME_BY_ID so a single update
 * keeps both the "Discover more" carousel and scope filter in sync.
 */
export const RK_MEMBER_CHANNEL_IDS: string[] = Object.keys(
  RK_DISCOVER_MORE_PINNED_NAME_BY_ID,
);

// Canonicalize aliases -> primary, and always include primary and member channels.
export const RK_SCOPED_CHANNEL_IDS = uniqStrings([
  ...RK_SCOPED_CHANNEL_IDS_PARSED.map(rkCanonicalizeChannelId),
  RK_PRIMARY_CHANNEL_ID,
  ...RK_MEMBER_CHANNEL_IDS,
]);

export const rkIsChannelInScope = (channelId: string) => {
  const canonical = rkCanonicalizeChannelId(channelId);
  return RK_SCOPED_CHANNEL_IDS.includes(canonical);
};

export const KMNDEX_BRAND_NAME = "KMNdex";
export const RK_BRAND_NAME = process.env.REACT_APP_BRAND_NAME ?? "RKMusic";
export const RK_ARTIST_NAME = process.env.REACT_APP_ARTIST_NAME ?? "KMNZ";

export const RK_OFFICIAL_SITE_URL =
  process.env.REACT_APP_OFFICIAL_SITE_URL ?? "https://rkmusic.jp/";

export const RK_YOUTUBE_URL =
  process.env.REACT_APP_YOUTUBE_URL ?? "https://www.youtube.com/@KMNZOFFICIAL";

/**
 * Channels to always include in the "Discover more" carousel in RK mode.
 *
 * Note: This expects YouTube channel IDs (UCxxxx...). YouTube handles (/@name)
 * are not supported here.
 *
 * Falls back to RK_DISCOVER_MORE_PINNED_NAME_BY_ID keys when env is not set.
 *
 * Example:
 *   REACT_APP_DISCOVER_MORE_PINNED_CHANNEL_IDS=UCxxx,UCyyy
 */
const discoverEnv = process.env.REACT_APP_DISCOVER_MORE_PINNED_CHANNEL_IDS;
export const RK_DISCOVER_MORE_PINNED_CHANNEL_IDS = discoverEnv
  ? parseChannelIdList(discoverEnv)
  : Object.keys(RK_DISCOVER_MORE_PINNED_NAME_BY_ID);

/**
 * Pinned channels as ChannelStub to avoid relying on the upstream channel detail API.
 *
 * If you override IDs via env and the ID is unknown, it will use the ID as name.
 */
export const RK_DISCOVER_MORE_PINNED_CHANNEL_STUBS: ChannelStub[] =
  RK_DISCOVER_MORE_PINNED_CHANNEL_IDS.map((id) => {
    const name = RK_DISCOVER_MORE_PINNED_NAME_BY_ID[id] ?? id;
    const photo = RK_DISCOVER_MORE_PINNED_PHOTO_BY_ID[id];
    return {
      id,
      name,
      english_name: name,
      song_count: 0,
      ...(photo && { photo }),
    };
  });

export const rkIsPinnedDiscoverChannelId = (channelId: string) =>
  RK_DISCOVER_MORE_PINNED_CHANNEL_IDS.includes(channelId);

export const rkGetPinnedDiscoverChannelName = (channelId: string) =>
  RK_DISCOVER_MORE_PINNED_NAME_BY_ID[channelId];
