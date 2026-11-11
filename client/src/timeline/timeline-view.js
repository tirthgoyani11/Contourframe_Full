/**
 * Contourframe Studio — Authentic Timeline Component.
 * Renders into `#timeline-track` matching Contourframe production DOM & CSS:
 * Start Camera (.tl-start), Transition (.tl-trans), Scene Groups (.tl-group with canvas thumbnails),
 * and Add Group (.tl-add).
 */

export class TimelineView {
  constructor(options = {}) {
    this.trackEl = document.getElementById('timeline-track');
    this.totalDurEl = document.getElementById('tl-total-dur');
    this.playBtn = document.getElementById('btnPlay');

    this.onSeek = options.onSeek || (() => {});
    this.onPlayPause = options.onPlayPause || (() => {});
    this.onSelectScene = options.onSelectScene || (() => {});
    this.onAddScene = options.onAddScene || (() => {});
    this.onDeleteScene = options.onDeleteScene || (() => {});
    this.onSelectTransition = options.onSelectTransition || (() => {});

    this.timeline = null;
    this.scenes = [];
    this.activeSceneIndex = 0;
    this.currentTime = 0.0;
    this.totalDuration = 0.0;
    this.isPlaying = false;

    this.bindControls();
  }

  bindControls() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        this.togglePlay();
      });
    }

    // Spacebar shortcut
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  setTimelineData(timeline, scenes = []) {
    this.timeline = timeline;
    this.scenes = scenes;
    this.totalDuration = timeline ? timeline.totalDuration : 0.0;
    this.updateTotalDurationBadge();
    this.render();
  }

  updateTotalDurationBadge() {
    if (!this.totalDurEl) return;
    const mins = Math.floor(this.totalDuration / 60);
    const secs = Math.floor(this.totalDuration % 60);
    this.totalDurEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.setPlaying(this.isPlaying);
    this.onPlayPause(this.isPlaying);
  }

  setPlaying(playing) {
    this.isPlaying = playing;
    if (this.playBtn) {
      if (this.isPlaying) {
        this.playBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        `;
        this.playBtn.title = 'Stop';
      } else {
        this.playBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        `;
        this.playBtn.title = 'Play';
      }
    }
  }

  setTime(timeSec) {
    this.currentTime = timeSec;
    // Highlight active scene card according to time
    if (this.timeline && this.timeline.segments) {
      let accum = 0;
      for (let i = 0; i < this.scenes.length; i++) {
        const sc = this.scenes[i];
        const scDur = (sc.transitionDuration || 3.0) + (sc.holdDuration || 2.5);
        if (timeSec >= accum && timeSec <= accum + scDur) {
          if (this.activeSceneIndex !== i) {
            this.activeSceneIndex = i;
            this.updateSelectionHighlights();
          }
          break;
        }
        accum += scDur;
      }
    }
  }

  setActiveScene(idx) {
    this.activeSceneIndex = Math.max(0, Math.min(this.scenes.length - 1, idx));
    this.updateSelectionHighlights();
  }

  updateSelectionHighlights() {
    if (!this.trackEl) return;
    const cards = this.trackEl.querySelectorAll('.tl-group');
    cards.forEach((card, i) => {
      if (i === this.activeSceneIndex) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }

  render() {
    if (!this.trackEl) return;
    let html = '';

    // 1. Start Camera Card
    html += `
      <div class="tl-item tl-start" title="Start View" id="tl-start-cam">
        <div class="tl-start-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
          </svg>
        </div>
        <div class="tl-group-label">Start</div>
      </div>
      <div class="tl-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    `;

    // 2. Render each Scene Group & Transition
    this.scenes.forEach((scene, idx) => {
      const isSelected = idx === this.activeSceneIndex;
      const countries = scene.countries || [];
      const countryNames = countries.map(c => c.name || c.id || 'Country').join(', ') || scene.title || `Scene ${idx + 1}`;
      const shortLabel = countryNames.length > 14 ? countryNames.substring(0, 14) + '…' : countryNames;
      const holdDur = typeof scene.holdDuration === 'number' ? scene.holdDuration : 2.5;
      const transType = scene.transitionType || 'flyToCountry';
      const transDur = typeof scene.transitionDuration === 'number' ? scene.transitionDuration : 3.0;

      // Transition card before group (for scenes > 0)
      if (idx > 0) {
        html += `
          <div class="tl-item tl-trans" data-trans-idx="${idx}" title="${transType} · ${transDur}s">
            <div class="tl-trans-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
            </div>
            <div class="tl-group-label">${transType}</div>
          </div>
          <div class="tl-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        `;
      }

      // Group Card
      html += `
        <div class="tl-item tl-group ${isSelected ? 'selected' : ''}" 
             data-scene-idx="${idx}" 
             data-id="${scene.id || idx}"
             title="${countryNames} · hold ${holdDur}s">
          <div class="tl-group-preview" id="tl-prev-wrap-${idx}">
            <canvas id="tl-preview-${idx}" width="110" height="52"></canvas>
          </div>
          <div class="tl-group-label" title="${countryNames}">${shortLabel}</div>
          ${this.scenes.length > 1 ? `
            <button class="tl-group-remove" data-del-idx="${idx}" title="Remove scene">&times;</button>
          ` : ''}
          <div class="tl-group-dur">${holdDur}s</div>
        </div>
      `;

      if (idx < this.scenes.length - 1) {
        html += `
          <div class="tl-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        `;
      }
    });

    // 3. Add Scene Button
    html += `
      <div class="tl-add" id="tl-add-btn" title="Add country group">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
    `;

    this.trackEl.innerHTML = html;
    this.bindTrackEvents();
    requestAnimationFrame(() => this.drawThumbnails());
  }

  bindTrackEvents() {
    if (!this.trackEl) return;

    // Click scene card
    this.trackEl.querySelectorAll('.tl-group').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.tl-group-remove')) return;
        const idx = parseInt(card.getAttribute('data-scene-idx'), 10);
        this.setActiveScene(idx);
        this.onSelectScene(idx);
      });
    });

    // Remove scene button
    this.trackEl.querySelectorAll('.tl-group-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-del-idx'), 10);
        this.onDeleteScene(idx);
      });
    });

    // Add scene button
    const addBtn = this.trackEl.querySelector('#tl-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.onAddScene();
      });
    }

    // Transition card click
    this.trackEl.querySelectorAll('.tl-trans').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-trans-idx'), 10);
        this.onSelectTransition(idx);
      });
    });
  }

  drawThumbnails() {
    if (!window.turf) return;
    this.scenes.forEach((scene, idx) => {
      const canvas = document.getElementById(`tl-preview-${idx}`);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      // Dark background gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0a1628');
      grad.addColorStop(0.5, '#0d1f2d');
      grad.addColorStop(1, '#081018');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const countries = scene.countries || [];
      if (countries.length === 0) {
        // Draw globe placeholder grid
        ctx.strokeStyle = 'rgba(212, 169, 87, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 18, 0, Math.PI * 2);
        ctx.stroke();
        return;
      }

      // Collect features for bounding box
      const features = [];
      countries.forEach(c => {
        if (c.geometry) {
          features.push({ type: 'Feature', geometry: c.geometry, properties: {} });
        }
      });

      if (features.length === 0) {
        // Draw country name initials
        ctx.fillStyle = 'rgba(212, 169, 87, 0.8)';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const txt = (countries[0].name || 'MAP').substring(0, 4).toUpperCase();
        ctx.fillText(txt, w / 2, h / 2);
        return;
      }

      try {
        const fc = { type: 'FeatureCollection', features };
        const bbox = window.turf.bbox(fc); // [minLng, minLat, maxLng, maxLat]
        const dLng = Math.max(0.01, bbox[2] - bbox[0]);
        const dLat = Math.max(0.01, bbox[3] - bbox[1]);

        const pad = 6;
        const availW = w - pad * 2;
        const availH = h - pad * 2;
        const scale = Math.min(availW / dLng, availH / dLat);

        const projectX = (lng) => pad + (lng - bbox[0]) * scale + (availW - dLng * scale) / 2;
        const projectY = (lat) => pad + (bbox[3] - lat) * scale + (availH - dLat * scale) / 2;

        ctx.fillStyle = countries[0].fillColor || '#d4a957';
        ctx.strokeStyle = countries[0].glowColor || '#ffffff';
        ctx.lineWidth = 1.2;

        features.forEach(feat => {
          const geom = feat.geometry;
          const drawPolygon = (coords) => {
            coords.forEach(ring => {
              ctx.beginPath();
              ring.forEach((pt, i) => {
                const px = projectX(pt[0]);
                const py = projectY(pt[1]);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              });
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            });
          };

          if (geom.type === 'Polygon') {
            drawPolygon(geom.coordinates);
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach(poly => drawPolygon(poly));
          }
        });
      } catch (err) {
        // Silently fallback to clean styled text
      }
    });
  }
}
