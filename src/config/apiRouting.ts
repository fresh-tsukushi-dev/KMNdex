// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

/**
 * 本番環境 API ルーティング
 *
 * 開発環境: setupProxy.js がリクエストをプロキシ（変更不要）
 * 本番環境: axios インターセプターがカスタムバックエンド向け URL のみ書き換え
 *
 * - カスタムバックエンド (forvirtualmusic.com): songs, channels, lives, goods,
 *   musicdex/playlist, musicdex/discovery, musicdex/elasticsearch
 *   → フロントエンドから直接リクエスト（インターセプターで URL 書き換え）
 *
 * - Holodex API: user auth, likes, favorites, search, star,
 *   radio, history, statics
 *   → nginx プロキシ経由（同一オリジン、CORS 不要）
 */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const RK_API_BASE_URL = process.env.REACT_APP_RK_API_BASE_URL || "";

/**
 * setupProxy.js と同じパス変換ルール
 * 順序が重要: 長いプレフィックスを先にマッチさせる
 */
const RK_PATH_REWRITES: ReadonlyArray<{ prefix: string; rewrite: string }> = [
  { prefix: "/api/v2/musicdex/playlist", rewrite: "/musicdex/playlist" },
  { prefix: "/api/v2/musicdex/discovery", rewrite: "/musicdex/discovery" },
  {
    prefix: "/api/v2/musicdex/elasticsearch",
    rewrite: "/musicdex/elasticsearch",
  },
  { prefix: "/api/v2/songs", rewrite: "/songs" },
  { prefix: "/api/v2/channels", rewrite: "/v2/channels" },
  { prefix: "/api/v2/lives", rewrite: "/lives" },
  { prefix: "/api/v2/goods", rewrite: "/goods" },
];

/**
 * AxiosInstance (useClient) 用のカスタムバックエンドパスプレフィックス
 * AxiosInstance は baseURL + url でリクエストするため、url 部分のみでマッチ
 */
const RK_AXIOS_INSTANCE_PREFIXES = [
  "/songs",
  "/musicdex/playlist",
  "/musicdex/discovery/channel",
  "/musicdex/elasticsearch",
];

/**
 * デフォルト axios 用インターセプター
 * /api/v2/... のフルパスをカスタムバックエンド URL に書き換える
 * マッチしないパスは変更しない（nginx プロキシ経由で Holodex へ）
 */
function rewriteDefaultAxios(config: AxiosRequestConfig): AxiosRequestConfig {
  if (!RK_API_BASE_URL) return config;

  const url = config.url || "";

  // baseURL 付きのリクエスト（AxiosInstance 経由）はスキップ
  // → rewriteAxiosInstance で処理される
  if (config.baseURL) return config;

  // カスタムバックエンドルートのマッチ & 書き換え
  for (const { prefix, rewrite } of RK_PATH_REWRITES) {
    if (url.startsWith(prefix)) {
      config.url = RK_API_BASE_URL + url.replace(prefix, rewrite);
      return config;
    }
  }

  // マッチしないパス (/api/v2/user/*, /statics/* 等) はそのまま
  // → nginx 経由で Holodex API にプロキシ
  return config;
}

/**
 * AxiosInstance (useClient) 用インターセプター
 * カスタムバックエンドルートのみ baseURL を差し替え
 * その他は変更しない（既存の baseURL で nginx プロキシ経由 → Holodex）
 */
function rewriteAxiosInstance(config: AxiosRequestConfig): AxiosRequestConfig {
  if (!RK_API_BASE_URL) return config;
  if (!config.baseURL) return config;

  const url = config.url || "";

  // カスタムバックエンドルートなら baseURL を差し替え
  for (const prefix of RK_AXIOS_INSTANCE_PREFIXES) {
    if (url.startsWith(prefix)) {
      config.baseURL = RK_API_BASE_URL;
      return config;
    }
  }

  // その他 (/user/*, /musicdex/like, /musicdex/star 等) はそのまま
  // → 既存の baseURL (同一オリジン /api/v2) で nginx 経由 Holodex へ
  return config;
}

/**
 * デフォルト axios インスタンスにインターセプターを登録
 */
export function setupDefaultAxiosRouting(): void {
  if (!RK_API_BASE_URL) return;
  axios.interceptors.request.use(rewriteDefaultAxios);
}

/**
 * カスタム axios インスタンス（useClient の axiosInstance）にインターセプターを登録
 */
export function setupAxiosInstanceRouting(instance: AxiosInstance): void {
  if (!RK_API_BASE_URL) return;
  instance.interceptors.request.use(rewriteAxiosInstance);
}
