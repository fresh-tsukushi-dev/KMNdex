// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import React from "react";
import { Navigate, RouteObject, useRoutes } from "react-router";
import LikedSongs from "./pages/LikedSongs";
import History from "./pages/History";
import Video from "./pages/Video";
import Song from "./pages/Song";
import Home from "./pages/Home";
import { Queue } from "./pages/Queue";
import Library from "./pages/Library";
import { RequireLogin } from "./components/login/RequireLogin";
import Channels from "./pages/Channels";
import { useStoreState } from "./store";
import SeeMoreCardGrid from "./pages/SeeMoreCardGrid";
import Favorites from "./pages/Favorites";
import { RK_SINGLE_CHANNEL_MODE, RK_SCOPED_ORGS } from "./config/rkmusic";
import RKChannels from "./pages/RKChannels";

const Radio = React.lazy(() => import("./pages/Radio"));
const Channel = React.lazy(() => import("./pages/Channel"));
const Playlist = React.lazy(() => import("./pages/Playlist"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Search = React.lazy(() => import("./pages/Search"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));

const RedirectToOrg = () => {
  const org = useStoreState((store) => store.org.currentOrg);
  return (
    <Navigate
      to={`/org/${org.name || RK_SCOPED_ORGS[0] || "RK Music"}`}
      replace
    />
  );
};

const RedirectToHome = () => {
  return <Navigate to="/" replace />;
};

const routes: RouteObject[] = RK_SINGLE_CHANNEL_MODE
  ? [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/org/:org/*",
        element: <RedirectToHome />,
      },
      {
        path: "/playlists",
        element: <SeeMoreCardGrid type="org" playlistType="sgp" />,
      },
      {
        path: "/channels",
        element: <RKChannels />,
      },
      {
        path: "/playlists/:playlistId",
        element: <Playlist />,
      },
      {
        path: "/radio/:radioId",
        element: <Radio />,
      },
      {
        path: "/song/:songId",
        element: <Song />,
      },
      {
        path: "/liked",
        element: (
          <RequireLogin title={"Liked Songs"}>
            <LikedSongs />
          </RequireLogin>
        ),
      },
      {
        path: "/history",
        element: (
          <RequireLogin title={"Recently Played"}>
            <History />
          </RequireLogin>
        ),
      },
      {
        path: "/favorites",
        element: (
          <RequireLogin title={"Favorites"}>
            <Favorites />
          </RequireLogin>
        ),
      },
      {
        path: "/favorites/channels",
        element: (
          <RequireLogin title={"Favorite Channels"}>
            <Channels type="favorites" />
          </RequireLogin>
        ),
      },
      {
        path: "/favorites/radios",
        element: <SeeMoreCardGrid type="favorites" playlistType="radio" />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/searchV2",
        element: <Search />,
      },
      {
        path: "/video/:id",
        element: <Video />,
      },
      {
        path: "/channel/:id/*",
        element: <Channel />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/queue",
        element: <Queue />,
      },
      {
        path: "/library",
        element: (
          <RequireLogin title={"Library"}>
            <Library />
          </RequireLogin>
        ),
      },
    ]
  : [
      {
        path: "/",
        element: <RedirectToOrg />,
      },
      {
        path: "/org/:org",
        element: <Home />,
      },
      {
        path: "/org/:org/channels",
        element: <Channels type="org" />,
      },
      {
        path: "/org/:org/playlists",
        element: <SeeMoreCardGrid type="org" playlistType="sgp" />,
      },
      {
        path: "/org/:org/radios",
        element: <SeeMoreCardGrid type="org" playlistType="radio" />,
      },
      {
        path: "/org/:org/community",
        element: <SeeMoreCardGrid type="org" playlistType="ugp" />,
      },
      {
        path: "/playlists/:playlistId",
        element: <Playlist />,
      },
      {
        path: "/radio/:radioId",
        element: <Radio />,
      },
      {
        path: "/song/:songId",
        element: <Song />,
      },
      {
        path: "/liked",
        element: (
          <RequireLogin title={"Liked Songs"}>
            <LikedSongs />
          </RequireLogin>
        ),
      },
      {
        path: "/history",
        element: (
          <RequireLogin title={"Recently Played"}>
            <History />
          </RequireLogin>
        ),
      },
      {
        path: "/favorites",
        element: (
          <RequireLogin title={"Favorites"}>
            <Favorites />
          </RequireLogin>
        ),
      },
      {
        path: "/favorites/channels",
        element: (
          <RequireLogin title={"Favorite Channels"}>
            <Channels type="favorites" />
          </RequireLogin>
        ),
      },
      {
        path: "/favorites/radios",
        element: <SeeMoreCardGrid type="favorites" playlistType="radio" />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/searchV2",
        element: <Search />,
      },
      {
        path: "/video/:id",
        element: <Video />,
      },
      {
        path: "/channel/:id/*",
        element: <Channel />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/queue",
        element: <Queue />,
      },
      {
        path: "/library",
        element: (
          <RequireLogin title={"Library"}>
            <Library />
          </RequireLogin>
        ),
      },
    ];

export default function Routes() {
  const elements = useRoutes(routes);
  return elements;
}
