# CHANGES

## Fork origin
KMNdex is a derivative work based on Musicdex.
Original work: https://github.com/HolodexNet/Musicdex
Copyright 2021 Yasuaki Uechi <y@uechi.io> and contributors

Forked on: 2026-02-16

## Summary of modifications

1. Branding
   - Replaced Holodex/Musicdex branding with KMNdex
   - Replaced logos and icons with text-based brand assets
   - Reduced supported languages from 14 to 2 (en, ja-JP)
   - Removed translator credits from language settings
   - Footer: copyright "© 2020 Holodex" → "© 2026 KMNdex",
     build label "Musicdex (beta)" → KMNDEX_BRAND_NAME,
     social links reduced from 4 (Twitter, Ko-Fi, Discord,
     GitHub/HolodexNet) to 1 (GitHub/fresh-tsukushi-dev)
   - CONTRIBUTING.md: removed Holodex-related Links section

2. Channel scope control
   - Added single-channel mode and multi-channel scoping
     (src/config/rkmusic.ts)
   - Routing layer redirects out-of-scope channels to primary
     (src/routes.tsx, src/pages/Channel.tsx, src/pages/ChannelSongs.tsx,
      src/pages/Song.tsx, src/pages/Playlist.tsx, src/pages/Video.tsx)
   - Channel alias canonicalization to prevent redirect loops

3. Search scope injection
   - Injected channel_id filter into ReactiveSearch ES queries
     (src/pages/Search.tsx)
   - Both JSON and NDJSON (msearch) request bodies are scoped

4. Removal of Holodex external links
   - Removed navigation to holodex.net, Twitter, Ko-Fi, Discord
     (src/components/nav/Sidebar.tsx,
      src/components/common/ErrorFallback.tsx,
      src/components/playlist/VideoPlaylistCard.tsx,
      src/pages/Video.tsx, src/pages/Channel.tsx)
   - Replaced video links with YouTube URLs

5. UI/UX enhancements
   - Enriched Home page with live schedules and new merchandise
     (src/pages/Home.tsx)
   - Improved song click-to-play UX (src/components/song/SongRow.tsx,
     src/components/song/SongCard.tsx)
   - Added channel photo fallback for missing Holodex statics images
     (src/components/channel/ChannelPhoto.tsx)
   - Changed BottomNav items (Settings, Privacy Policy, Terms of Service)

6. Authentication and tracking removal
   - Removed OAuth integration (Google, Discord, Twitter)
   - Removed GA4 analytics and song play tracking

7. Privacy and legal
   - Added Privacy Policy page (src/pages/PrivacyPolicy.tsx)
   - Added Terms of Service page (src/pages/TermsOfService.tsx)

8. Production API routing
   - Added axios interceptors for custom backend routing
     (src/config/apiRouting.ts)

9. New pages
   - RKChannels: multi-channel landing page
     (src/pages/RKChannels.tsx)
   - Privacy Policy page (src/pages/PrivacyPolicy.tsx)
   - Terms of Service page (src/pages/TermsOfService.tsx)

10. Bug fixes and type safety
    - Resolved Chakra UI VStack/polymorphic type explosion
    - Suppressed YouTube IFrame disposal errors
    - Fixed playlist 404 crashes
    - Fixed member channel songs excluded by scope filter

11. Deleted files
    - src/pages/Login.tsx (login page)
    - src/components/login/LoginPanel.tsx
    - src/components/login/LoginButtons.tsx
    - src/components/login/GoogleButton.tsx
    - src/components/icons/GradientLogo.tsx
    - src/components/icons/HolodexLogo.tsx
    - src/components/icons/MTHolodex.tsx
    - src/modules/common/usePageTracking.ts (GA4 analytics)
    - musicdex.code-workspace

12. Configuration and asset changes (no SPDX header — comment syntax N/A)
    - package.json: removed oauth-open, react-ga4, workbox-google-analytics;
      added licenses:generate script
    - public/manifest.json: Musicdex → KMNdex branding
    - public/index.html: OGP/SNS meta, theme-color, brand name changes
    - public/img/*: replaced all favicon/icon assets with KMNdex branding
    - public/locales/**/translation.json (17 locales): brand name,
      VTubers → VSingers, Holodex references removed, privacy policy added
    - .env.placeholder, .env.production: added single-channel mode,
      scoping, and branding environment variables
