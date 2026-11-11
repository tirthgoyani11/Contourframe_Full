# Publication checklist

The original project README described authenticated extraction as a source for parts of this checkout. Ownership and redistribution permissions have yet to be confirmed. Preserve required third-party attribution during the rebrand.

| Scope | Work before publication |
| --- | --- |
| Editor HTML, compiled JavaScript, CSS and backend | Establish authorship and confirm redistribution rights. Replace material that cannot be cleared. |
| Basemaps, cached tiles, boundaries and flag assets | Record provider, version, source, license and attribution. Confirm that cached tiles may be redistributed. |
| 3D models, cover art, fonts, images and demo media | Record provenance per source and remove or replace material without permission. |
| Vendored libraries | Include the upstream license and notices for each shipped version of MapLibre GL JS, Three.js and Turf.js. |
| Local files | Exclude databases, renders, backups, caches and credentials. Review the proposed tree and any Git history before uploading. |
| Repository license | Select a license for the material the project has rights to distribute. Add its full text and required notices. |
| GitHub | Configure Issues and private vulnerability reporting, verify a fresh checkout, and publish the reviewed tree. |

The ignore file covers known local outputs and several media directories. Review the actual candidate tree, including nested assets, before committing it.

## Asset locations to review

| Path | Material |
| --- | --- |
| `client/index.html`, `static/js/dist/`, `static/css/dist/` | Editor markup and browser bundles |
| `static/data/`, `static/flags/`, `static/flagColors.json` | Geographic datasets, flags and derived colors |
| `static/models3d/`, `static/animations/`, `static/img/` | Model scripts and thumbnails, motion stickers and images |
| `static/vendor/` | Bundled MapLibre GL JS 3.6.2, Three.js 0.128.0 and Turf.js 6.5.0 |
| `static/tiles_cache/`, demo directories under `client/` and `static/` | Local tile copies and demo pages/media, excluded by default |

For each distributable set, record its source URL, version or revision, license, attribution text and any changes. For public demos, create a fresh project and render it with assets cleared for publication. The local demo files can include old branding inside the video or artwork.

The homepage showcase uses excerpts from local studio renders under `static/showcase/`. Review the clips and their posters for imagery rights, attribution, and embedded reference-study marks before publishing them. Replace those files and update the showcase captions if using newly cleared examples.

## Fresh-checkout acceptance

- Start the server with an empty database, empty tile cache, and no AI credentials.
- Open the sample from `/projects`, make an edit, reload the editor, and verify the edit persists.
- Render the sample, download the MP4, and verify its duration and playback.
- Cancel during frame capture and immediately start another export.
- Check sticker cards and Script to Video at desktop and narrow widths.
- Record the Fedora and Ubuntu results and include the full test workflow status before release.

## Upstream references and release status

| Files | Candidate upstream | Status |
| --- | --- | --- |
| `static/vendor/maplibre-gl-3.6.2/` | [MapLibre GL JS v3.6.2](https://github.com/maplibre/maplibre-gl-js/tree/v3.6.2) | Compare shipped bytes and retain the exact release notices. |
| `static/vendor/three-0.128.0/` | [Three.js r128](https://github.com/mrdoob/three.js/tree/r128) | Compare shipped bytes and retain the exact release notices. |
| `static/vendor/turf-6.5.0/` | [Turf v6.5.0](https://github.com/Turfjs/turf/tree/v6.5.0) | Compare shipped bytes and retain the exact release notices. |
| `static/data/`, `static/flags/`, `static/models3d/`, `static/animations/`, `static/img/` | Per-file source records unavailable in this checkout | Pending owner-supplied provenance or replacement. |
| `static/showcase/` | Local rendered excerpts | Excluded from Git by default. The homepage only offers playback for the new sample output when present. |
| Editor bundles | See [architecture](architecture.md) | Local runtime only until corresponding source and release rights are established. |

Do not assign a repository-wide license until the owner identifies the files
they can license. Keep permission evidence and attribution with the release
inventory. A successful browser run proves the export workflow, while the
imagery and boundary data used by that run still need a separate rights review.

## Source-only review copy

This copy contains the original homepage, full editor, Python API, and their
bundled source assets. Local databases, exports, cached tiles, test files,
browser captures, credentials, legacy demo pages and local project videos were left
out. Two feature preview videos are included for local review. Verify their redistribution rights and any embedded branding before publishing. Test
commands in the contributing guide refer to the development checkout.

This folder is for review before a public push. The rights status of legacy
editor bundles and third-party assets is still open.
