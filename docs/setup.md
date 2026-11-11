# Setup and troubleshooting

Follow the [quick start](../README.md) from the repository root. Python dependencies are listed in `requirements.txt`. The frontend is served directly by FastAPI.

| Environment variable | Purpose |
| --- | --- |
| `CONTOURFRAME_DB` | Override the SQLite path. Use an absolute path. |
| `CONTOURFRAME_VIDEOS_DIR` | Override the directory for MP4 exports. |
| `OPENAI_API_KEY` | Optional OpenAI credential for AI features. |
| `GEMINI_API_KEY` | Optional Gemini credential for AI features. |

Set variables in your shell before starting the server. Keep API keys on the server. Map tiles and place lookup may require network access. AI requests may send prompts and project context to the configured provider.

- **Blank map**. Check tile requests in browser DevTools and confirm that WebGL is enabled.
- **Failed export**. Check the server log, free disk space and the output of `ffmpeg -encoders`. Try a short timeline first.
- **Backups**. Stop the server before copying the SQLite database and videos directory. Store the backup privately.
- **Network access**. Run on loopback. The local API has no user authentication or tenant isolation.

## What works without additional services

| Feature | Dependency |
| --- | --- |
| Create, import, reopen and snapshot projects | Local SQLite |
| Browse shipped overlays and styles | Local assets in this checkout |
| Basemap tiles and place search | Network access when tiles or data are unavailable locally |
| Script templates and local parsing | Local server |
| AI assistant provider calls | Optional Gemini or OpenAI credentials |
| MP4 export | Local FFmpeg with an H.264 encoder |

For an initial render, visit `/projects`, choose **Open sample**, and preview **An Alpine Crossing**. Export a short MP4 at a modest resolution. If frame uploads fail, keep the tab open, check the local server and try the export again. FFmpeg starts once frame capture finishes.
