/**
 * Flag Drape Engine for Contourframe Studio.
 * Mathematically projects and clips national SVG flags onto 2D/3D country territories
 * using Web Mercator Path2D offscreen canvases and MapLibre GL raster canvas layers.
 */

const MERCATOR_SCALE = 512 * Math.pow(2, 5);

const BUILTIN_COUNTRY_ISO2 = {
  germany: 'de', turkey: 'tr', france: 'fr', 'united states': 'us', usa: 'us',
  italy: 'it', spain: 'es', russia: 'ru', china: 'cn', india: 'in', brazil: 'br',
  canada: 'ca', australia: 'au', japan: 'jp', 'united kingdom': 'gb', uk: 'gb',
  greece: 'gr', poland: 'pl', ukraine: 'ua', egypt: 'eg', iran: 'ir', iraq: 'iq',
  syria: 'sy', 'saudi arabia': 'sa', netherlands: 'nl', belgium: 'be', switzerland: 'ch',
  austria: 'at', portugal: 'pt', ireland: 'ie', sweden: 'se', norway: 'no', finland: 'fi',
  denmark: 'dk', czechia: 'cz', 'czech republic': 'cz', romania: 'ro', hungary: 'hu',
  bulgaria: 'bg', serbia: 'rs', croatia: 'hr', slovakia: 'sk', mexico: 'mx', argentina: 'ar',
  colombia: 'co', chile: 'cl', peru: 'pe', venezuela: 've', indonesia: 'id', pakistan: 'pk',
  bangladesh: 'bd', vietnam: 'vn', thailand: 'th', philippines: 'ph', malaysia: 'my',
  singapore: 'sg', 'south korea': 'kr', 'north korea': 'kp', 'south africa': 'za',
  nigeria: 'ng', kenya: 'ke', morocco: 'ma', algeria: 'dz', tunisia: 'tn', israel: 'il'
};

function lngToWx(lng) {
  return MERCATOR_SCALE * (lng + 180.0) / 360.0;
}

function latToWy(lat) {
  const rad = Math.max(-85.051129, Math.min(85.051129, lat)) * Math.PI / 180.0;
  const sin = Math.sin(rad);
  return MERCATOR_SCALE * (0.5 - Math.log((1.0 + sin) / (1.0 - sin)) / (4.0 * Math.PI));
}

export class FlagDrapeEngine {
  constructor(map, countryFeatureFinder, onUpdate = null) {
    this.map = map;
    this.findCountryFeature = countryFeatureFinder;
    this.onUpdate = onUpdate;
    this.flagManifest = null;
    this.imageCache = new Map(); // url -> HTMLImageElement
    this.canvasMap = new Map();  // key -> { canvas, ctx, sourceId, layerId, bbox, hash }
    this.activeFlagKeys = new Set();
    this.initManifest();
  }

  async initManifest() {
    try {
      const res = await fetch('/static/flags/manifest.json');
      if (res.ok) {
        this.flagManifest = await res.json();
        if (this.onUpdate) this.onUpdate();
      }
    } catch (e) {
      console.warn('[FlagDrapeEngine] Failed to load flag manifest:', e);
    }
  }

  getFlagIso2(countryName, countryIso) {
    if (countryIso && countryIso.length === 2) {
      return countryIso.toLowerCase();
    }
    const lowName = (countryName || '').toLowerCase().trim();
    if (BUILTIN_COUNTRY_ISO2[lowName]) {
      return BUILTIN_COUNTRY_ISO2[lowName];
    }
    if (this.flagManifest && countryName) {
      const mapped = this.flagManifest[countryName] || this.flagManifest[lowName];
      if (mapped) return mapped.toLowerCase();
    }
    if (countryIso && countryIso.length === 3) {
      const iso3to2 = {
        deu: 'de', tur: 'tr', usa: 'us', gbr: 'gb', fra: 'fr',
        ita: 'it', esp: 'es', rus: 'ru', chn: 'cn', ind: 'in',
        bra: 'br', can: 'ca', aus: 'au', jpn: 'jp', kor: 'kr',
        mex: 'mx', idn: 'id', sau: 'sa', zaf: 'za', egy: 'eg',
        pol: 'pl', ukr: 'ua', grc: 'gr', swe: 'se', nor: 'no',
        fin: 'fi', dnk: 'dk', nld: 'nl', bel: 'be', che: 'ch',
        aut: 'at', prt: 'pt', irl: 'ie', cze: 'cz', rou: 'ro',
        hun: 'hu', bgr: 'bg', srb: 'rs', hrv: 'hr', svk: 'sk'
      };
      const low = countryIso.toLowerCase();
      if (iso3to2[low]) return iso3to2[low];
    }
    return null;
  }

  getFlagUrl(countryName, countryIso) {
    const iso2 = this.getFlagIso2(countryName, countryIso);
    if (!iso2) return null;
    return `/static/flags/${iso2}.svg`;
  }

  async loadFlagImage(url) {
    if (!url) return null;
    if (this.imageCache.has(url)) {
      const cached = this.imageCache.get(url);
      if (cached.complete && cached.naturalWidth > 0) return cached;
      return cached;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
        if (this.onUpdate) this.onUpdate();
      };
      img.onerror = () => {
        console.warn('[FlagDrapeEngine] Failed to load flag image:', url);
        resolve(null);
      };
      img.src = url;
    });
  }

  extractPolygons(geometry) {
    if (!geometry) return [];
    if (geometry.type === 'Polygon') {
      return [geometry.coordinates];
    }
    if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates;
    }
    return [];
  }

  renderFlags(countries, transitionProgress = 1.0) {
    if (!this.map) return;
    if (!this.map.isStyleLoaded()) {
      this.map.once('style.load', () => this.renderFlags(countries, transitionProgress));
      return;
    }

    const currentKeys = new Set();
    console.log('[FlagDrape] renderFlags called with countries:', countries.map(c => ({ name: c.name, showFlag: c.showFlag })));

    for (const c of (countries || [])) {
      if (c.showFlag === false) {
        console.log('[FlagDrape] Skipping country due to showFlag === false:', c.name);
        continue;
      }

      const feat = this.findCountryFeature(c.id || c.name);
      if (!feat || !feat.geometry) {
        console.warn('[FlagDrape] Feature or geometry not found for:', c.name);
        continue;
      }

      const countryName = c.name || feat.properties?.name || feat.properties?.NAME;
      const countryIso = c.id || feat.properties?.['ISO3166-1-Alpha-3'] || feat.properties?.['ISO3166-1-Alpha-2'];
      const flagUrl = c.flagCustomImageUrl || this.getFlagUrl(countryName, countryIso);
      if (!flagUrl) {
        console.warn('[FlagDrape] No flagUrl resolved for:', countryName);
        continue;
      }

      const key = (c.id || countryName).replace(/[^a-zA-Z0-9_-]/g, '_');
      currentKeys.add(key);

      const flagOpacity = (typeof c.flagOpacity === 'number' ? c.flagOpacity : 0.75) * transitionProgress;
      const flagScale = typeof c.flagScale === 'number' ? c.flagScale : 0;
      const flagOffsetX = typeof c.flagOffsetX === 'number' ? c.flagOffsetX : 0;
      const flagOffsetY = typeof c.flagOffsetY === 'number' ? c.flagOffsetY : 0;

      console.log('[FlagDrape] Draping country flag:', key, flagUrl, 'opacity:', flagOpacity);
      this.drapeCountryFlag(key, feat.geometry, flagUrl, {
        opacity: flagOpacity,
        scale: flagScale,
        offsetX: flagOffsetX,
        offsetY: flagOffsetY
      });
    }

    // Clean up flags that are no longer active in this scene
    for (const activeKey of this.activeFlagKeys) {
      if (!currentKeys.has(activeKey)) {
        this.removeFlag(activeKey);
      }
    }
    this.activeFlagKeys = currentKeys;
  }

  async drapeCountryFlag(key, geometry, flagUrl, options) {
    const { opacity = 0.75, scale = 0, offsetX = 0, offsetY = 0 } = options;
    const sourceId = `flag-src-${key}`;
    const layerId = `flag-lyr-${key}`;

    const flagImg = await this.loadFlagImage(flagUrl);
    if (!flagImg || !flagImg.complete || !flagImg.naturalWidth) {
      console.warn('[FlagDrape] Flag image not ready:', flagUrl, flagImg);
      return;
    }

    // 1. Compute Mercator bbox and Path2D polygon rings
    const polygons = this.extractPolygons(geometry);
    if (!polygons.length) return;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const poly of polygons) {
      for (const ring of poly) {
        for (const [lng, lat] of ring) {
          if (lng < minLng) minLng = lng;
          if (lat < minLat) minLat = lat;
          if (lng > maxLng) maxLng = lng;
          if (lat > maxLat) maxLat = lat;
        }
      }
    }

    if (!Number.isFinite(minLng) || minLng >= maxLng || minLat >= maxLat) return;

    const minWx = lngToWx(minLng);
    const maxWx = lngToWx(maxLng);
    const minWy = latToWy(maxLat); // Note: Mercator Y increases downwards (lat max is wy min)
    const maxWy = latToWy(minLat);

    const bwM = maxWx - minWx;
    const bhM = maxWy - minWy;
    if (bwM <= 1 || bhM <= 1) return;

    // Target offscreen canvas resolution
    const maxDim = 1024;
    const minDim = 256;
    const largestM = Math.max(bwM, bhM);
    const smallestM = Math.min(bwM, bhM);
    let renderScale = Math.min(1.0, maxDim / largestM);
    if (smallestM * renderScale < minDim) {
      renderScale = minDim / smallestM;
    }
    renderScale = Math.min(renderScale, maxDim / largestM);

    const cw = Math.max(1, Math.round(bwM * renderScale));
    const ch = Math.max(1, Math.round(bhM * renderScale));

    let record = this.canvasMap.get(key);
    if (!record) {
      const canvas = document.createElement('canvas');
      canvas.id = `ground-flag-canvas-${key}`;
      canvas.style.cssText = 'position:absolute;left:-9999px;top:-9999px;pointer-events:none;';
      document.body.appendChild(canvas);
      record = {
        canvas,
        ctx: canvas.getContext('2d', { willReadFrequently: true }),
        sourceId,
        layerId,
        hash: null,
        bbox: null
      };
      this.canvasMap.set(key, record);
    }

    const hash = `${key}|${cw}x${ch}|${flagUrl}|${scale}|${offsetX}|${offsetY}|${opacity.toFixed(3)}`;
    if (record.hash !== hash || record.canvas.width !== cw || record.canvas.height !== ch) {
      record.canvas.width = cw;
      record.canvas.height = ch;
      const ctx = record.ctx;

      // Construct clipping path
      const path = new Path2D();
      for (const poly of polygons) {
        for (const ring of poly) {
          if (!ring.length) continue;
          const startWx = lngToWx(ring[0][0]);
          const startWy = latToWy(ring[0][1]);
          path.moveTo((startWx - minWx) / bwM * cw, (startWy - minWy) / bhM * ch);
          for (let i = 1; i < ring.length; i++) {
            const wx = lngToWx(ring[i][0]);
            const wy = latToWy(ring[i][1]);
            path.lineTo((wx - minWx) / bwM * cw, (wy - minWy) / bhM * ch);
          }
          path.closePath();
        }
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.clip(path);

      // Scale & position the flag image
      const flagAspect = flagImg.width / flagImg.height;
      const bboxAspect = bwM / bhM;
      const scaleMultiplier = 1.0 + scale / 100.0;

      let dw, dh;
      if (flagAspect > bboxAspect) {
        dh = ch * scaleMultiplier;
        dw = dh * flagAspect;
      } else {
        dw = cw * scaleMultiplier;
        dh = dw / flagAspect;
      }

      const cx = cw / 2.0 + cw * (offsetX / 100.0);
      const cy = ch / 2.0 + ch * (offsetY / 100.0);
      const dx = cx - dw / 2.0;
      const dy = cy - dh / 2.0;

      ctx.globalAlpha = 1.0;
      ctx.drawImage(flagImg, dx, dy, dw, dh);
      ctx.restore();

      record.hash = hash;
      record.bbox = { minLng, minLat, maxLng, maxLat };
    }

    // MapLibre coordinate order: [top-left, top-right, bottom-right, bottom-left]
    const coordinates = [
      [minLng, maxLat],
      [maxLng, maxLat],
      [maxLng, minLat],
      [minLng, minLat]
    ];

    try {
      const source = this.map.getSource(sourceId);
      if (!source) {
        this.map.addSource(sourceId, {
          type: 'canvas',
          canvas: record.canvas,
          coordinates: coordinates,
          animate: false
        });

        // Place layer just beneath borders and annotations
        const beforeLayer = this.map.getLayer('route-border') ? 'route-border' : undefined;

        this.map.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': Math.max(0.0, Math.min(1.0, opacity)),
            'raster-opacity-transition': { duration: 0, delay: 0 },
            'raster-fade-duration': 0,
            'raster-resampling': 'nearest'
          }
        }, beforeLayer);
      } else {
        source.setCoordinates(coordinates);
        this.map.setPaintProperty(layerId, 'raster-opacity', Math.max(0.0, Math.min(1.0, opacity)));
        if (typeof source.play === 'function') {
          source.play();
        }
      }
    } catch (e) {
      console.warn('[FlagDrapeEngine] MapLibre layer sync warning:', e);
    }
  }

  removeFlag(key) {
    const record = this.canvasMap.get(key);
    if (!record) return;

    try {
      if (this.map.getLayer(record.layerId)) {
        this.map.removeLayer(record.layerId);
      }
      if (this.map.getSource(record.sourceId)) {
        this.map.removeSource(record.sourceId);
      }
    } catch (e) {
      // Ignored if map style is reloading
    }

    if (record.canvas && record.canvas.parentElement) {
      try { record.canvas.remove(); } catch (_) {}
    }
    this.canvasMap.delete(key);
  }

  clearAll() {
    for (const key of Array.from(this.canvasMap.keys())) {
      this.removeFlag(key);
    }
    this.activeFlagKeys.clear();
  }
}
