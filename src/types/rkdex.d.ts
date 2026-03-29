// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 fresh-tsukushi-dev (KMNdex)

interface Live {
  id: number;
  title: string;
  description?: string;
  venue?: string;
  event_date: string;
  ticket_url?: string;
  official_url?: string;
  image_url?: string;
}

interface Goods {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  store_url?: string;
  release_date?: string;
}
