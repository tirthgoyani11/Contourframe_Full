# Architecture and API

| Path | Responsibility |
| --- | --- |
| `client/index.html` | Studio entry point and editor UI |
| `client/src/` | Camera sampling, timelines, annotations, overlays and frame capture |
| `static/js/dist/` | Browser bundles loaded by the editor |
| `static/` | Map assets, model scripts and browser dependencies |
| `server/main.py` | FastAPI routes, static serving and render coordination |
| `server/services/` | SQLite persistence, FFmpeg compilation and AI services |
| `tests/` | Python tests and legacy browser harnesses |

The browser edits a versioned project state and saves it through `/api/projects`. The render client steps the timeline at the chosen frame rate and uploads batches of captured frames. FastAPI coordinates the session and FFmpeg encodes the frames as an MP4. SQLite holds the project, snapshot and video records.

| Endpoint | Use |
| --- | --- |
| `GET /health` | Health check |
| `GET /docs` | Interactive OpenAPI reference |
| `/api/projects` | List, create and update projects and manage snapshots |
| `POST /api/start-render` | Start a render session |
| `POST /api/upload-frames-batch` | Upload frames |
| `POST /api/compile-video` | Compile the render |
| `GET /api/videos` | List rendered videos |
| `/api/script-to-video` | Script generation and parsing |

When changing frontend behavior, check which script the editor loads and verify the change through `/studio`.

## Frontend entry points and builds

| Surface | Files to edit |
| --- | --- |
| Homepage and project picker | `client/home.html`, `client/projects.html` and the corresponding files under `static/css/` and `static/js/` |
| Studio shell, menus and dialogs | `client/index.html` and `static/css/contourframe-studio.css` |
| Studio runtime | The `static/js/dist/` scripts loaded by `client/index.html` |
| Modular implementations | `client/src/`. Check callers before editing because these modules do not reproduce the browser bundles. |

The current checkout has no reproducible build for the legacy editor bundles. Some are readable JavaScript and others are generated or obfuscated. The landing page and project picker are ordinary static files and need no bundler. Establish a traceable source and build for the legacy runtime before treating those bundles as maintained open-source code.

| Browser script under `static/js/dist/` | Source available in this checkout |
| --- | --- |
| `studio-atlas.js`, `studio-script-video.js`, `studio-stickers.js` | Edit the readable script directly. The HTML loads these files as-is. |
| `studio-core.js`, `studio-map.js`, `studio-timeline.js`, `studio-properties.js` | Legacy runtime. The camera, timeline, UI and shader modules under `client/src/` cover parts of the behavior. No corresponding build has been established. |
| `studio-3d.js`, `studio-deniz.js` | Legacy runtime. `client/src/actors3d/` and `client/src/maritime/` are related implementations. No corresponding build has been established. |
| `studio-colorpicker.js`, `studio-history.js` | No separate corresponding source or build command has been established. |
