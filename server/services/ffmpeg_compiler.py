"""
FFmpeg compiler worker service for Contourframe backend.
Stitches uploaded JPEG frames into high-quality MP4 videos.
"""
import subprocess
import os
import glob
import logging
import shutil
import re
from typing import Dict, Any, Optional

VIDEOS_DIR = os.environ.get("CONTOURFRAME_VIDEOS_DIR") or os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "videos")
os.makedirs(VIDEOS_DIR, exist_ok=True)

def compile_video_job(ticket: str, project_id: int, title: str, fps: int = 30, resolution: str = "1280x720") -> Dict[str, Any]:
    ticket_dir = f"/tmp/amm_render_{ticket}"
    if not os.path.exists(ticket_dir):
        raise FileNotFoundError(f"Render directory for ticket {ticket} not found.")

    frame_files = sorted(glob.glob(os.path.join(ticket_dir, "frame_*.jpg")))
    if not frame_files:
        raise ValueError("No frames found for render session.")

    # Sort frame files numerically by index
    def extract_idx(path):
        m = re.search(r"frame_(\d+)\.jpg", path)
        return int(m.group(1)) if m else 0

    frame_files.sort(key=extract_idx)

    # Prepare sequential inputs or concat demuxer if repeat counts exist
    concat_list_path = os.path.join(ticket_dir, "concat.txt")
    repeats_file = os.path.join(ticket_dir, "repeats.json")
    
    repeats = {}
    if os.path.exists(repeats_file):
        import json
        with open(repeats_file, "r") as rf:
            repeats = json.load(rf)

    # Frame duration in seconds
    frame_dur = 1.0 / fps
    total_encoded_frames = 0

    with open(concat_list_path, "w") as cf:
        for fpath in frame_files:
            idx = extract_idx(fpath)
            rep = int(repeats.get(str(idx), repeats.get(idx, 1)))
            if rep < 1:
                rep = 1
            cf.write(f"file '{fpath}'\n")
            cf.write(f"duration {frame_dur * rep:.6f}\n")
            total_encoded_frames += rep
        # FFmpeg concat demuxer requires repeating the last file without duration
        if frame_files:
            cf.write(f"file '{frame_files[-1]}'\n")

    safe_title = re.sub(r"[^a-zA-Z0-9_\-]", "_", title).strip("_") or "render"
    filename = f"{safe_title}_{project_id}_{ticket[:8]}.mp4"
    output_path = os.path.join(VIDEOS_DIR, filename)

    # Parse width and height
    try:
        width, height = resolution.split("x")
        width = int(width)
        height = int(height)
    except Exception:
        width, height = 1280, 720

    # Ensure even dimensions for yuv420p
    if width % 2 != 0:
        width += 1
    if height % 2 != 0:
        height += 1

    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        raise RuntimeError("FFmpeg is missing. Install it and restart Contourframe.")
    check = subprocess.run([ffmpeg, "-encoders"], capture_output=True, text=True)
    encoders = {line.split()[1] for line in check.stdout.splitlines()
                if line.startswith(" V") and len(line.split()) >= 2}
    encoder = next((name for name in ("libx264", "libopenh264", "h264_nvenc")
                    if name in encoders), None)
    if encoder is None:
        raise RuntimeError("This FFmpeg build has no supported H.264 encoder. Install a build with libx264 or libopenh264.")

    cmd = [
        ffmpeg, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-vf", f"scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2",
        "-c:v", encoder,
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-r", str(fps),
    ]
    if encoder == "libx264":
        cmd.extend(["-preset", "medium", "-crf", "18"])
    cmd.append(output_path)

    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        logging.getLogger(__name__).error("FFmpeg exited %s: %s", proc.returncode, proc.stderr)
        if os.path.isfile(output_path):
            os.unlink(output_path)
        raise RuntimeError(
            f"FFmpeg could not encode the video using {encoder}. Check the server log and try a lower resolution."
        )

    file_size = os.path.getsize(output_path)
    download_url = f"/api/download/{filename}"

    # Cleanup ticket temp directory
    try:
        shutil.rmtree(ticket_dir, ignore_errors=True)
    except Exception:
        pass

    return {
        "filename": filename,
        "file_size": file_size,
        "download_url": download_url,
        "frame_count": total_encoded_frames,
        "output_path": output_path
    }
