# Contourframe Studio

<img src="static/favicon.svg" alt="Contourframe logo" width="72" height="72">

Contourframe Studio is a local map animation editor. Build a timeline of camera moves, country highlights, annotations and 3D overlays, then render it to MP4.

## Quick start

Install Python 3.11 or newer and an FFmpeg build with H.264 encoding. Verify FFmpeg is on your PATH with `ffmpeg -version`.

From the project root, on Linux or macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --app-dir server --host 127.0.0.1 --port 8000
```

Open [the homepage](http://127.0.0.1:8000/) or [the studio](http://127.0.0.1:8000/studio). Use the [project picker](http://127.0.0.1:8000/projects) to create or import a project, or open An Alpine Crossing to preview and export a sample. SQLite stores projects and snapshots. FFmpeg writes video exports under `server/data/videos/` by default.

## Documentation

- [Setup, configuration and troubleshooting](docs/setup.md)
- [Architecture and API](docs/architecture.md)
- [Contributing and running tests](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Private security reporting](SECURITY.md)
- [Publication checklist and asset provenance](docs/publication.md)

This checkout is being prepared for public release. See the publication checklist for outstanding rights and distribution work.

### Recreate the sample render

Open [Projects](http://127.0.0.1:8000/projects), select **Open sample**, then use
**Export → Start Render**. Once it finishes, preview the video and select
**Download MP4**. See [Contributing](CONTRIBUTING.md) for the automated browser
check and how to supply a rights-cleared sample video to the homepage.
