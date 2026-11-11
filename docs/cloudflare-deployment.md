# Run the full studio behind Cloudflare

The full homepage and editor are served by FastAPI. FFmpeg runs on the Fedora
machine or VPS, and a named Podman volume keeps the SQLite database, tile cache
and video exports. Start from the reviewed source folder:

```sh
podman build -t contourframe-studio .
podman volume create contourframe-data
podman run -d --name contourframe-studio --restart=unless-stopped \
  -p 127.0.0.1:8000:8000 \
  -v contourframe-data:/data:Z contourframe-studio
curl --fail http://127.0.0.1:8000/health
```

If the development server already uses port 8000, use `127.0.0.1:8001:8000`
for the Podman port mapping and set the tunnel origin to port 8001.

Create a Cloudflare Access application for the chosen studio hostname and
allow the users who should share the editor. The studio has a single shared
project store. Run the Cloudflare Tunnel connector on the same host and add
the hostname as a published application route with service
`http://127.0.0.1:8000`. Follow Cloudflare's
[Tunnel setup guide](https://developers.cloudflare.com/tunnel/get-started/).

Verify the hostname requires an Access sign-in from a clean browser. After
sign-in, verify the homepage, `/studio`, project save and reopen, and MP4
export. The origin machine must be online while the studio is in use.
