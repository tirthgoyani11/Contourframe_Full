/**
 * Studio Frame Capture & Server Export Pipeline.
 * Coordinates stepped deterministic rendering, WebGL frame capture, batch multipart upload, and compilation polling.
 * Matches live production endpoints: /api/start-render, /api/render/queue, /api/upload-frames-batch, /api/compile-video.
 */

import { sampleTransitionCamera, sampleHoldCamera } from '../camera/camera-sampler.js';
import { queryTimelineAtTime } from '../camera/sequence-expander.js';

export class FrameCaptureEngine {
  constructor(map, options = {}) {
    this.map = map;
    this.options = options;
    this.isAborted = false;
  }

  abort() {
    this.isAborted = true;
  }

  /**
   * Runs the full stepped export process matching live Contourframe contracts.
   */
  async exportVideo({
    projectId,
    projectTitle = 'Map Animation',
    timeline,
    width = 1280,
    height = 720,
    fps = 30,
    onProgress = () => {},
    onLayerUpdate = () => {}
  }) {
    this.isAborted = false;
    const totalDuration = timeline.totalDuration;
    const totalFrames = Math.max(1, Math.round(totalDuration * fps));
    const quality = `${width}x${height}`;

    onProgress({ stage: 'start', percent: 0, text: 'Initiating render session...' });

    // Step 1: Start Render session
    const startRes = await fetch('/api/start-render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: projectId,
        title: projectTitle,
        quality: quality,
        fps: fps,
        totalFrames: totalFrames
      })
    });

    if (!startRes.ok && startRes.status !== 409) {
      const err = await startRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to start render: HTTP ${startRes.status}`);
    }

    // Step 2: Queue render ticket on server
    const queueRes = await fetch('/api/render/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket: null })
    });

    if (!queueRes.ok) {
      const err = await queueRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to queue render: HTTP ${queueRes.status}`);
    }

    const queueData = await queueRes.json();
    const ticket = queueData.ticket;

    const canvas = this.map.getCanvas();
    onProgress({ stage: 'capturing', percent: 0, text: `Rendering ${totalFrames} frames...` });

    const batchSize = 10;
    let currentBatch = [];

    for (let f = 0; f < totalFrames; f++) {
      if (this.isAborted) {
        await fetch('/api/abort-render', { method: 'POST' });
        throw new Error('Render export aborted by user');
      }

      const timeSec = f / fps;
      const query = queryTimelineAtTime(timeline, timeSec);

      if (query) {
        let cam;
        if (query.segment.type === 'transition') {
          cam = sampleTransitionCamera(query.segment, query.localT);
        } else {
          cam = sampleHoldCamera(query.segment, query.localT);
        }

        // Stepped camera update
        this.map.jumpTo({
          center: cam.center,
          zoom: cam.zoom,
          pitch: cam.pitch,
          bearing: cam.bearing
        });

        // Trigger custom layers (shaders, 3D actors, annotations) to advance to this time
        if (onLayerUpdate) {
          onLayerUpdate({ query, timeSec, frame: f, totalFrames });
        }
      }

      // Synchronously redraw MapLibre canvas
      this.map.triggerRepaint();

      // Wait 1 animation frame for GL render to settle
      await new Promise(requestAnimationFrame);

      // Composite MapLibre terrain and 3D overlay canvas if present
      const overlayCanvas = document.getElementById('studio3dOverlay');
      let frameCanvas = canvas;
      if (overlayCanvas) {
        if (!this.compositeCanvas) {
          this.compositeCanvas = document.createElement('canvas');
          this.compositeCtx = this.compositeCanvas.getContext('2d');
        }
        if (this.compositeCanvas.width !== canvas.width || this.compositeCanvas.height !== canvas.height) {
          this.compositeCanvas.width = canvas.width;
          this.compositeCanvas.height = canvas.height;
        }
        this.compositeCtx.drawImage(canvas, 0, 0);
        this.compositeCtx.drawImage(overlayCanvas, 0, 0);
        frameCanvas = this.compositeCanvas;
      }

      // Capture frame blob
      const blob = await new Promise(resolve => frameCanvas.toBlob(resolve, 'image/jpeg', 0.92));
      currentBatch.push({ frameIndex: f, blob });

      // Upload in batches
      if (currentBatch.length >= batchSize || f === totalFrames - 1) {
        await this.uploadBatch(currentBatch);
        currentBatch = [];

        const percent = Math.round(((f + 1) / totalFrames) * 85);
        onProgress({
          stage: 'capturing',
          percent,
          frame: f + 1,
          totalFrames,
          text: `Capturing frames: ${f + 1}/${totalFrames} (${percent}%)`
        });
      }
    }

    // Step 3: Trigger compilation
    onProgress({ stage: 'compiling', percent: 90, text: 'Compiling MP4 with FFmpeg...' });

    const compileRes = await fetch('/api/compile-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket: ticket,
        projectId: projectId,
        title: projectTitle,
        fps: fps,
        quality: quality
      })
    });

    if (!compileRes.ok) {
      const err = await compileRes.json().catch(() => ({}));
      throw new Error(err.message || `Compilation failed: HTTP ${compileRes.status}`);
    }

    const compileData = await compileRes.json();
    const downloadUrl = compileData.download_url || `/api/download-video/${compileData.video_id}`;

    onProgress({
      stage: 'completed',
      percent: 100,
      text: 'Render complete!',
      videoUrl: downloadUrl,
      videoId: compileData.video_id
    });

    return { ticket, videoUrl: downloadUrl, videoId: compileData.video_id };
  }

  async uploadBatch(batch) {
    const formData = new FormData();
    const repeatData = {};

    for (const item of batch) {
      const filename = `frame_${item.frameIndex}.jpg`;
      formData.append(`frame_${item.frameIndex}`, item.blob, filename);
      formData.append(`tekrar_${item.frameIndex}`, '1');
    }

    const res = await fetch('/api/upload-frames-batch', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Frame batch upload failed: HTTP ${res.status}`);
    }
  }
}
