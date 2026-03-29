# KMNdex

A music player (React/TypeScript SPA) with enhanced scope control for the KMN group.

- Live site: https://kmndex.forvirtualmusic.com

## License and Attribution

This project is a derivative work forked from [Musicdex](https://github.com/HolodexNet/Musicdex) (Copyright 2021 Yasuaki Uechi and contributors).
It is licensed under the Apache License 2.0.

Main changes include:

- Replaced Holodex/Musicdex branding with KMNdex
- Added scope control for RK Music channels (routing, search, and page-level behavior)
- Removed Holodex external links and replaced them with YouTube links
- Removed OAuth integration and GA4 tracking, and added a Privacy Policy page
- Enhanced the Home page and implemented production API routing

For details of the modifications, see [CHANGES](./CHANGES.md).

- Full license text: [LICENSE](./LICENSE)
- Attribution and trademark notice: [NOTICE](./NOTICE)
- Detailed changes: [CHANGES](./CHANGES.md)

## Development

```bash
cp .env.placeholder .env
yarn install --frozen-lockfile
yarn dev
```

## Build

```bash
yarn build
```

## Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
