# Contributing

Set up the project using the [quick start](README.md) and install the development dependencies.

```bash
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

The Python suite uses temporary database and video paths. Install FFmpeg for render tests. Run browser checks from the repository root after installing Node.js and Chrome or Chromium.

```bash
npm install --no-save --no-package-lock puppeteer-core@24
CHROME_BIN=/path/to/chromium node tests/e2e/branding.js
```

Activate the Python environment first, or set `CONTOURFRAME_PYTHON` to its Python executable. The browser checks start a separate server with a fresh database and temporary export directory.

For bug reports, include the browser and OS, reproduction steps, expected behavior and actual behavior. Use a small sample project that you can share publicly. For feature requests, describe the workflow you want to improve.

Keep pull requests focused. Include tests or manual verification steps and screenshots for visible changes. Record the source, license and attribution for any assets you add. Follow the [code of conduct](CODE_OF_CONDUCT.md).

The browser export check opens the sample in an empty database, edits the title,
reloads, renders, downloads the MP4, and checks playback. Its server starts with
an empty tile cache and no AI credentials. Install FFmpeg and run:

```bash
CHROME_BIN=/path/to/chrome node tests/e2e/sample-export.js
```

Once the sample's imagery and boundary sources are cleared for redistribution,
rerun with `CONTOURFRAME_SAMPLE_OUTPUT=static/showcase/alpine-crossing.mp4` to
enable the homepage player. The output directory is ignored by Git pending review.
