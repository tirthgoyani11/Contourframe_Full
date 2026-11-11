/**
 * Contourframe Studio — Master Client Application.
 * Clean-room behavioral reproduction with authentic Contourframe DOM bindings,
 * interactive country selection, GeoJSON vector layers, Three.js 0.128.0 tactical actors,
 * asymmetric quintic camera staging, historical empires with era sliders,
 * tactical arrows, and stepped WebGL export.
 */

import { sampleTransitionCamera, sampleHoldCamera } from './camera/camera-sampler.js?v=109';
import { expandTimelineSequence, queryTimelineAtTime, normalizeProjectScenes, scenesToSequenceItems } from './camera/sequence-expander.js?v=109';
import { calculateFitBounds, getGeoJSONBBox } from './camera/fit-bounds.js?v=109';
import { ThreeOverlayManager } from './actors3d/three-layer.js?v=109';
import { AnnotationLayer } from './annotations/annotation-layer.js?v=109';
import { TimelineView } from './timeline/timeline-view.js?v=109';
import { FrameCaptureEngine } from './export/frame-capture.js?v=109';
import { StudioUI } from './ui/studio-ui.js?v=109';
import { FlagDrapeEngine } from './flags/flag-drape-engine.js?v=109';

export const MAP_STYLES = {
  satellite: {
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: ['/api/tiles/satellite/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'bg-layer',
        type: 'background',
        paint: {
          'background-color': '#111622'
        }
      },
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  dark: {
    version: 8,
    sources: {
      'dark-tiles': {
        type: 'raster',
        tiles: ['/api/tiles/dark/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'bg-layer',
        type: 'background',
        paint: {
          'background-color': '#0d1117'
        }
      },
      {
        id: 'dark-layer',
        type: 'raster',
        source: 'dark-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  light: {
    version: 8,
    sources: {
      'light-tiles': {
        type: 'raster',
        tiles: ['/api/tiles/light/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'bg-layer',
        type: 'background',
        paint: {
          'background-color': '#f8f9fa'
        }
      },
      {
        id: 'light-layer',
        type: 'raster',
        source: 'light-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  custom: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['/api/tiles/osm/{z}/{x}/{y}'],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'bg-layer',
        type: 'background',
        paint: {
          'background-color': '#e5e7eb'
        }
      },
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

export class AMMStudioApp {
  constructor() {
    this.projectId = this.getProjectIdFromUrl() || '381569';
    this.projectData = null;
    this.timeline = null;
    this.map = null;
    this.countriesGeoJSON = null;
    this.countryFeatureMap = new Map(); // name / iso -> GeoJSON Feature
    this.threeManager = null;
    this.annotationLayer = null;
    this.timelineView = null;
    this.captureEngine = null;
    this.flagDrapeEngine = null;
    this.ui = null;
    this.tooltip = null;
    this.hoveredCountryId = null;

    this.currentTime = 0.0;
    this.isPlaying = false;
    this.animFrameId = null;
    this.lastFrameTimestamp = null;
    this.historyStack = [];
    this.historyIndex = -1;
    this.currentToolMode = 'select'; // 'select' | 'pen' | 'war' | 'warMorph'
  }

  getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('project');
  }

  async init() {
    console.log('[AMM Studio] Initializing Studio clone for project:', this.projectId);
    try {
      // 1. Initialize UI Elements & Event Listeners
      this.ui = new StudioUI({
        app: this,
        onSave: () => this.saveProject(),
        onExport: (opts) => this.handleExport(opts),
        onAddCountry: (c) => this.handleAddCountry(c),
        onAddHistorical: (h) => this.handleAddHistorical(h),
        onAddModel3D: (m) => this.handleAddModel3D(m),
        onAddAnnotation: (type) => this.handleAddAnnotation(type),
        onStyleChange: (styleKey) => this.setMapStyle(styleKey),
        onAspectChange: (aspect) => this.setAspectRatio(aspect)
      });

      // 2. Load Country GeoJSON database into memory
      await this.loadCountriesDatabase();

      // 3. Load Project Data from Server
      await this.loadProject();

      // 4. Initialize MapLibre GL Map inside authentic `#studio-map`
      this.ui.fitViewportToPanel();
      await this.initMap();
      this.ui.fitViewportToPanel();
      if (this.map) this.map.resize();

      // 5. Initialize Timeline View inside authentic `#timeline-track`
      this.timelineView = new TimelineView({
        onSeek: (t) => this.seekToTime(t),
        onPlayPause: (play) => this.togglePlayback(play),
        onSelectScene: (idx) => this.selectScene(idx),
        onAddScene: () => this.addNewScene(),
        onDeleteScene: (idx) => this.deleteScene(idx),
        onSelectTransition: (idx) => this.selectTransition(idx)
      });

      this.rebuildTimeline();
      this.selectScene(0);
      this.updateActiveSceneMap();
      this.ui.fitViewportToPanel();
      if (this.map) this.map.resize();

      // 6. Start render playback loop
      this.startPlaybackLoop();
      console.log('[AMM Studio] Initialized successfully.');
    } catch (err) {
      console.error('[AMM Studio] Initialization error:', err);
    } finally {
      // Always guarantee the loading veil is dismissed
      if (this.ui) {
        this.ui.hideLoadingOverlay();
      }
      const overlay = document.getElementById('projectLoadingOverlay');
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => {
          overlay.style.display = 'none';
          try { overlay.remove(); } catch (_) {}
        }, 300);
      }
    }
  }

  async loadCountriesDatabase() {
    try {
      const res = await fetch('/static/data/countries.geojson');
      if (res.ok) {
        this.countriesGeoJSON = await res.json();
        for (const feat of this.countriesGeoJSON.features) {
          const props = feat.properties || {};
          if (props.name) this.countryFeatureMap.set(props.name.toLowerCase(), feat);
          if (props.NAME) this.countryFeatureMap.set(props.NAME.toLowerCase(), feat);
          if (props['ISO3166-1-Alpha-3']) this.countryFeatureMap.set(props['ISO3166-1-Alpha-3'].toLowerCase(), feat);
          if (props['ISO3166-1-Alpha-2']) this.countryFeatureMap.set(props['ISO3166-1-Alpha-2'].toLowerCase(), feat);
        }
      }
    } catch (e) {
      console.warn('[AMM Studio] Could not load countries database:', e);
    }
  }

  getAllCountriesSorted() {
    if (!this.countriesGeoJSON || !this.countriesGeoJSON.features) return [];
    const set = new Map();
    for (const feat of this.countriesGeoJSON.features) {
      const p = feat.properties || {};
      const name = p.name || p.NAME;
      const iso = p['ISO3166-1-Alpha-3'] || p['ISO3166-1-Alpha-2'] || name;
      if (name && !set.has(name)) {
        set.set(name, { name, iso, geometry: feat.geometry });
      }
    }
    return Array.from(set.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  findCountryFeature(identifier) {
    if (!identifier) return null;
    const lower = String(identifier).toLowerCase();

    // 1. Check active scene's territories for embedded geometry (e.g. historical empires)
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData && this.projectData.scenes ? this.projectData.scenes[activeIdx] : null;
    if (scene && scene.countries) {
      const match = scene.countries.find(c =>
        (c.id && String(c.id).toLowerCase() === lower) ||
        (c.name && String(c.name).toLowerCase() === lower)
      );
      if (match && match.geometry) {
        return {
          type: 'Feature',
          properties: { name: match.name, id: match.id },
          geometry: match.geometry
        };
      }
    }

    // 2. Sovereign countries database lookup
    return this.countryFeatureMap.get(lower) || null;
  }

  async loadProject() {
    try {
      this.ui.setSaveStatus('Loading...');
      const res = await fetch(`/api/projects/${this.projectId}`);
      if (res.ok) {
        const json = await res.json();
        this.projectData = typeof json.data === 'string' ? JSON.parse(json.data) : json.data;
        this.projectData.scenes = normalizeProjectScenes(this.projectData);
        const title = this.projectData.name || this.projectData.projectName || json.title || 'My Map Animation';
        if (this.ui.projectNameEl) this.ui.projectNameEl.textContent = title;
        this.ui.setSaveStatus('Saved');
        return;
      }
    } catch (e) {
      console.warn('[AMM Studio] Could not fetch project from server, loading defaults:', e);
    }

    // Default project template if brand new
    this.projectData = {
      version: 1,
      projectName: 'New Map Animation',
      aspectRatio: '16:9',
      mapStyle: 'satellite',
      sun3d: { yuk: 63, don: 315 },
      scenes: [
        {
          id: 'scene_0',
          title: 'Opening Shot',
          transitionType: 'flyToCountry',
          transitionDuration: 3.0,
          holdDuration: 2.5,
          camera: { center: [10.45, 51.16], zoom: 4.8, pitch: 45, bearing: 15 },
          countries: [
            { name: 'Germany', fillColor: '#d4a957', fillOpacity: 0.6, glowColor: '#ffffff', lineWidth: 2 }
          ],
          actors3d: [],
          annotations: []
        }
      ]
    };
    if (this.ui.projectNameEl) this.ui.projectNameEl.textContent = this.projectData.projectName;
    this.ui.setSaveStatus('Saved');
  }

  async saveProject() {
    this.ui.setSaveStatus('Saving...');
    try {
      if (this.ui.projectNameEl) {
        this.projectData.name = this.ui.projectNameEl.textContent;
        this.projectData.projectName = this.projectData.name;
      }
      this.projectData.sequenceItems = scenesToSequenceItems(this.projectData.scenes);

      const res = await fetch(`/api/projects/${this.projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: JSON.stringify(this.projectData),
          title: this.projectData.name
        })
      });
      if (res.ok) {
        this.ui.setSaveStatus('Saved');
      } else {
        this.ui.setSaveStatus('Error saving');
      }
    } catch (err) {
      console.error(err);
      this.ui.setSaveStatus('Failed');
    }
  }

  async initMap() {
    const styleKey = this.projectData.mapStyle || 'satellite';
    const styleUrl = MAP_STYLES[styleKey] || MAP_STYLES.satellite;

    this.map = new window.maplibregl.Map({
      container: 'studio-map',
      style: styleUrl,
      center: [10.45, 51.16],
      zoom: 4.5,
      pitch: 0,
      bearing: 0,
      maxPitch: 85,
      preserveDrawingBuffer: true,
      attributionControl: false
    });

    await new Promise((resolve) => {
      if (this.map.loaded()) {
        resolve();
        return;
      }
      const timeout = setTimeout(() => {
        console.warn('[AMM Studio] Map load timeout reached, proceeding with setup');
        resolve();
      }, 1500);

      this.map.once('load', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.map.once('error', (e) => {
        console.warn('[AMM Studio] MapLibre warning/error:', e);
        clearTimeout(timeout);
        resolve();
      });
    });

    // Map Tooltip (#studioCountryTooltip from authentic DOM)
    this.tooltip = document.getElementById('studioCountryTooltip');

    // Setup Vector Sources & Layers
    this.setupMapLayers();
    this.map.on('style.load', () => {
      this.setupMapLayers();
      this.updateActiveSceneMap();
    });

    // Initialize 3D Tactical Overlay Manager
    this.threeManager = new ThreeOverlayManager(this.map, {
      onSelectActor: (actor) => this.select3DActor(actor),
      onUpdateActor: (actor) => this.update3DActor(actor)
    });
    if (this.projectData.sun3d) {
      this.threeManager.updateSun(this.projectData.sun3d);
    }

    // Initialize Tactical Annotations Layer
    const mapWrapper = document.getElementById('mapViewport') || document.getElementById('studio-map');
    this.annotationLayer = new AnnotationLayer(this.map, mapWrapper, {
      onSelectAnnotation: (ann) => this.selectAnnotation(ann),
      onUpdateAnnotation: (ann) => this.updateAnnotation(ann)
    });

    // Init Frame Capture Engine
    this.captureEngine = new FrameCaptureEngine(this.map);

    // Init Flag Drape Engine (3D map terrain national flag drapery)
    this.flagDrapeEngine = new FlagDrapeEngine(
      this.map,
      (idOrName) => this.findCountryFeature(idOrName),
      () => this.updateActiveSceneMap()
    );

    // Bind Interactive Map Events
    this.bindMapInteractions();
  }

  setupMapLayers() {
    if (!this.map) return;
    if (!this.map.isStyleLoaded()) {
      this.map.once('style.load', () => this.setupMapLayers());
      return;
    }

    // 1. World Data Interactive Layer (for hover and click)
    if (this.countriesGeoJSON && !this.map.getSource('world-data')) {
      this.map.addSource('world-data', {
        type: 'geojson',
        data: this.countriesGeoJSON,
        generateId: true
      });

      this.map.addLayer({
        id: 'world-interactive',
        type: 'fill',
        source: 'world-data',
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.001
        }
      });

      this.map.addLayer({
        id: 'world-hover-fill',
        type: 'fill',
        source: 'world-data',
        paint: {
          'fill-color': '#ffaa00',
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.25, 0.0]
        }
      });

      this.map.addLayer({
        id: 'world-hover-line',
        type: 'line',
        source: 'world-data',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffaa00',
          'line-width': 1.5,
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.85, 0.0]
        }
      });
    }

    // 2. Active Scene Route Countries (fills & borders)
    if (!this.map.getSource('route-countries')) {
      this.map.addSource('route-countries', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      this.map.addLayer({
        id: 'route-fill',
        type: 'fill',
        source: 'route-countries',
        paint: {
          'fill-color': ['coalesce', ['get', 'fillColor'], '#ffffff'],
          'fill-opacity': ['coalesce', ['get', 'fillOpacity'], 0.6]
        }
      });

      this.map.addLayer({
        id: 'route-border',
        type: 'line',
        source: 'route-countries',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': ['coalesce', ['get', 'glowColor'], '#ffffff'],
          'line-width': ['coalesce', ['get', 'lineWidth'], 2.0],
          'line-opacity': ['coalesce', ['get', 'lineOpacity'], 1.0]
        }
      });
    }

    // 3. Search Preview Layer
    if (!this.map.getSource('search-preview')) {
      this.map.addSource('search-preview', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      this.map.addLayer({
        id: 'search-preview-fill',
        type: 'fill',
        source: 'search-preview',
        paint: {
          'fill-color': '#38bdf8',
          'fill-opacity': 0.25
        }
      });

      this.map.addLayer({
        id: 'search-preview-line',
        type: 'line',
        source: 'search-preview',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.0,
          'line-dasharray': [2, 2]
        }
      });
    }
  }

  bindMapInteractions() {
    if (!this.map || !this.map.getLayer('world-interactive')) return;

    // Hover tooltip & outline
    this.map.on('mousemove', 'world-interactive', (e) => {
      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const countryName = feat.properties.name || feat.properties.NAME || 'Country';

        if (this.hoveredCountryId !== null && this.hoveredCountryId !== feat.id) {
          this.map.setFeatureState({ source: 'world-data', id: this.hoveredCountryId }, { hover: false });
        }

        this.hoveredCountryId = feat.id;
        this.map.setFeatureState({ source: 'world-data', id: feat.id }, { hover: true });
        this.map.getCanvas().style.cursor = 'pointer';

        if (this.tooltip) {
          this.tooltip.textContent = countryName;
          this.tooltip.style.left = `${e.point.x}px`;
          this.tooltip.style.top = `${e.point.y}px`;
          this.tooltip.style.display = 'block';
          this.tooltip.style.opacity = '1';
        }
      }
    });

    this.map.on('mouseleave', 'world-interactive', () => {
      if (this.hoveredCountryId !== null) {
        this.map.setFeatureState({ source: 'world-data', id: this.hoveredCountryId }, { hover: false });
        this.hoveredCountryId = null;
      }
      this.map.getCanvas().style.cursor = '';
      if (this.tooltip) {
        this.tooltip.style.display = 'none';
        this.tooltip.style.opacity = '0';
      }
    });

    // Country selection on click -> Shows authentic on-map action card
    this.map.on('click', 'world-interactive', (e) => {
      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const props = feat.properties || {};
        const countryName = props.name || props.NAME || 'Country';
        const iso = props['ISO3166-1-Alpha-3'] || props['ISO3166-1-Alpha-2'] || countryName;

        this.ui.showCountryActionCard(
          { name: countryName, iso: iso },
          () => this.handleAddCountry({ name: countryName, iso: iso, asNewScene: false }),
          () => this.handleAddCountry({ name: countryName, iso: iso, asNewScene: true })
        );
      }
    });
  }

  showSearchPreview(geojson) {
    if (!this.map) return;
    const source = this.map.getSource('search-preview');
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: [{ type: 'Feature', geometry: geojson, properties: {} }]
      });
    }
  }

  clearSearchPreview() {
    if (!this.map) return;
    const source = this.map.getSource('search-preview');
    if (source) {
      source.setData({ type: 'FeatureCollection', features: [] });
    }
  }

  fitCurrentScene(forceRecompute = false) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (!scene || !this.map) return;

    if (!forceRecompute && scene.camera) {
      this.map.flyTo({
        center: scene.camera.center,
        zoom: scene.camera.zoom,
        pitch: scene.camera.pitch || 0,
        bearing: scene.camera.bearing || 0,
        duration: 800
      });
      return;
    }

    if (scene.countries && scene.countries.length > 0) {
      const feat = this.findCountryFeature(scene.countries[0].id || scene.countries[0].name);
      if (feat) {
        const bbox = getGeoJSONBBox(feat);
        let cam = null;
        try {
          cam = this.map.cameraForBounds(bbox, {
            padding: 50,
            pitch: 45,
            bearing: 15
          });
        } catch (_) {}

        if (cam) {
          scene.camera = {
            center: [cam.center.lng, cam.center.lat],
            zoom: cam.zoom,
            pitch: cam.pitch !== undefined ? cam.pitch : 45,
            bearing: cam.bearing !== undefined ? cam.bearing : 15
          };
        } else {
          const w = this.map.getCanvas() ? this.map.getCanvas().clientWidth : 1920;
          const h = this.map.getCanvas() ? this.map.getCanvas().clientHeight : 1080;
          const fit = calculateFitBounds(bbox, w, h);
          scene.camera = { center: fit.center, zoom: fit.zoom, pitch: 45, bearing: 15 };
        }
        this.map.flyTo({ ...scene.camera, duration: 800 });
      }
    }
  }

  fitCountryCamera(countryIdOrName) {
    const feat = this.findCountryFeature(countryIdOrName);
    if (!feat || !this.map) return;
    const bbox = getGeoJSONBBox(feat);
    let cam = null;
    try {
      cam = this.map.cameraForBounds(bbox, {
        padding: 50,
        pitch: 45,
        bearing: 15
      });
    } catch (_) {}

    if (cam) {
      this.map.flyTo({
        center: [cam.center.lng, cam.center.lat],
        zoom: cam.zoom,
        pitch: cam.pitch !== undefined ? cam.pitch : 45,
        bearing: cam.bearing !== undefined ? cam.bearing : 15,
        duration: 800
      });
    }
  }

  setMapStyle(styleKey) {
    this.projectData.mapStyle = styleKey;
    const styleUrl = MAP_STYLES[styleKey] || MAP_STYLES.satellite;
    if (this.flagDrapeEngine) {
      this.flagDrapeEngine.clearAll();
    }
    this.map.setStyle(styleUrl);
    this.map.once('style.load', () => {
      this.setupMapLayers();
      if (this.threeManager) this.threeManager.registerCustomLayer();
      this.updateActiveSceneMap();
    });
  }

  setAspectRatio(aspect) {
    if (this.projectData) {
      this.projectData.aspectRatio = aspect;
    }
    if (this.ui) {
      this.ui.setAspectRatio(aspect);
    }
    document.querySelectorAll('.ratio-btn[data-ratio]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-ratio') === aspect);
    });
    if (this.map) {
      this.map.resize();
      setTimeout(() => {
        if (this.map) {
          this.map.resize();
          this.fitCurrentScene(true);
        }
      }, 100);
    }
  }

  setToolMode(mode) {
    this.currentToolMode = mode;
    console.log('[AMM Studio] Active tool mode:', mode);
  }

  undo() {
    console.log('[AMM Studio] Undo requested');
  }

  redo() {
    console.log('[AMM Studio] Redo requested');
  }

  rebuildTimeline() {
    this.timeline = expandTimelineSequence(this.projectData, (idOrName) => this.findCountryFeature(idOrName));
    if (this.timelineView) {
      this.timelineView.setTimelineData(this.timeline, this.projectData.scenes);
    }
  }

  seekToTime(seconds) {
    this.currentTime = seconds;
    this.evaluateAtCurrentTime();
  }

  togglePlayback(play) {
    this.isPlaying = play;
    this.lastFrameTimestamp = null;
    if (this.timelineView) {
      this.timelineView.setPlaying(this.isPlaying);
    }
  }

  startPlaybackLoop() {
    const loop = (timestamp) => {
      if (this.isPlaying) {
        if (!this.lastFrameTimestamp) this.lastFrameTimestamp = timestamp;
        const deltaSec = (timestamp - this.lastFrameTimestamp) / 1000.0;
        this.lastFrameTimestamp = timestamp;

        this.currentTime += deltaSec;
        if (this.currentTime >= this.timeline.totalDuration) {
          this.currentTime = 0.0;
        }

        if (this.timelineView) {
          this.timelineView.setTime(this.currentTime);
        }
        this.evaluateAtCurrentTime();
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  evaluateAtCurrentTime() {
    if (!this.timeline || !this.map) return;
    const query = queryTimelineAtTime(this.timeline, this.currentTime);
    if (!query) return;

    let cam;
    if (query.segment.type === 'transition') {
      cam = sampleTransitionCamera(query.segment, query.localT);
      this.renderTransitionLayers(query.segment, query.localT);
      if (this.annotationLayer) {
        this.annotationLayer.setAnimationProgress(query.localT);
      }
    } else {
      cam = sampleHoldCamera(query.segment, query.localT);
      this.renderHoldLayers(query.segment);
      if (this.annotationLayer) {
        this.annotationLayer.setAnimationProgress(1.0);
      }
    }

    if (cam && Number.isFinite(cam.center[0]) && Number.isFinite(cam.center[1])) {
      this.map.jumpTo({
        center: cam.center,
        zoom: Number.isFinite(cam.zoom) ? cam.zoom : 4.0,
        pitch: Number.isFinite(cam.pitch) ? cam.pitch : 0.0,
        bearing: Number.isFinite(cam.bearing) ? cam.bearing : 0.0
      });
    }
  }

  renderTransitionLayers(transSegment, progress) {
    const scenes = this.projectData.scenes;
    const fromScene = scenes[transSegment.sceneIndex - 1];
    const toScene = scenes[transSegment.sceneIndex];

    const features = [];
    if (fromScene && fromScene.countries) {
      for (const c of fromScene.countries) {
        const feat = this.findCountryFeature(c.id || c.name);
        if (feat) {
          features.push({
            ...feat,
            properties: {
              ...feat.properties,
              fillColor: c.fillColor || '#d4a957',
              fillOpacity: (c.fillOpacity ?? 0.6) * (1.0 - progress),
              glowColor: c.glowColor || '#ffffff',
              lineWidth: c.lineWidth || 2,
              lineOpacity: 1.0 - progress
            }
          });
        }
      }
    }

    if (toScene && toScene.countries) {
      for (const c of toScene.countries) {
        const feat = this.findCountryFeature(c.id || c.name);
        if (feat) {
          features.push({
            ...feat,
            properties: {
              ...feat.properties,
              fillColor: c.fillColor || '#d4a957',
              fillOpacity: (c.fillOpacity ?? 0.6) * progress,
              glowColor: c.glowColor || '#ffffff',
              lineWidth: c.lineWidth || 2,
              lineOpacity: progress
            }
          });
        }
      }
    }

    const source = this.map.getSource('route-countries');
    if (source) {
      source.setData({ type: 'FeatureCollection', features });
    }

    // Render active flags with smooth transition crossfade
    if (this.flagDrapeEngine) {
      if (progress < 0.5 && fromScene && fromScene.countries) {
        this.flagDrapeEngine.renderFlags(fromScene.countries, 1.0 - progress * 2.0);
      } else if (toScene && toScene.countries) {
        this.flagDrapeEngine.renderFlags(toScene.countries, Math.max(0.0, (progress - 0.5) * 2.0));
      }
    }
  }

  renderHoldLayers(holdSegment) {
    const scene = this.projectData.scenes[holdSegment.sceneIndex] || this.projectData.scenes[0];
    if (!scene) return;

    const features = [];
    const centroids = [];

    for (const c of (scene.countries || [])) {
      const feat = this.findCountryFeature(c.id || c.name);
      if (feat) {
        features.push({
          ...feat,
          properties: {
            ...feat.properties,
            fillColor: c.fillColor || '#d4a957',
            fillOpacity: c.fillOpacity ?? 0.6,
            glowColor: c.glowColor || '#ffffff',
            lineWidth: c.lineWidth || 2,
            lineOpacity: 1.0
          }
        });

        const b = getGeoJSONBBox(feat);
        centroids.push({
          name: c.name || c.id,
          iso: c.id,
          centroid: [(b[0] + b[2]) * 0.5, (b[1] + b[3]) * 0.5]
        });
      }
    }

    const source = this.map.getSource('route-countries');
    if (source) {
      source.setData({ type: 'FeatureCollection', features });
    }

    if (this.annotationLayer) {
      this.annotationLayer.setAnnotations(scene.annotations || [], centroids);
    }

    if (this.threeManager) {
      this.threeManager.setActors(scene.actors3d || []);
    }

    // Render full draped flags for current scene
    if (this.flagDrapeEngine) {
      this.flagDrapeEngine.renderFlags(scene.countries || [], 1.0);
    }
  }

  selectScene(index) {
    const scene = this.projectData.scenes[index];
    if (!scene) return;

    if (!scene.camera && scene.countries && scene.countries.length > 0) {
      const primary = scene.countries[0];
      const feat = this.findCountryFeature(primary.id || primary.name);
      if (feat) {
        const bbox = getGeoJSONBBox(feat);
        scene.bbox = bbox;
        const fit = calculateFitBounds(bbox);
        scene.camera = {
          center: fit.center,
          zoom: fit.zoom,
          pitch: 50,
          bearing: 15
        };
      }
    }

    if (this.timelineView) {
      this.timelineView.setActiveScene(index);
    }

    const seg = this.timeline ? this.timeline.segments.find(s => s.sceneIndex === index && s.type === 'hold') : null;
    if (seg) {
      this.seekToTime(seg.startTime);
      if (this.timelineView) this.timelineView.setTime(seg.startTime);
    } else {
      this.updateActiveSceneMap();
    }

    this.renderCurrentProperties();
  }

  selectTransition(index) {
    const scene = this.projectData.scenes[index];
    if (!scene) return;
    this.ui.renderSceneProperties(scene, () => {
      this.rebuildTimeline();
      this.updateActiveSceneMap();
    });
  }

  updateActiveSceneMap() {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (!scene || !this.map) return;

    if (scene.camera) {
      this.map.jumpTo(scene.camera);
    }

    this.renderHoldLayers({ sceneIndex: activeIdx });
  }

  renderCurrentProperties() {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (!scene) return;

    this.ui.renderSceneProperties(scene, () => {
      this.rebuildTimeline();
      this.updateActiveSceneMap();
    });
  }

  addNewScene() {
    const newIdx = this.projectData.scenes.length;
    const prevScene = this.projectData.scenes[newIdx - 1];
    const newScene = {
      id: `scene_${newIdx}`,
      title: `Scene ${newIdx + 1}`,
      transitionType: 'flyToCountry',
      transitionDuration: 3.0,
      holdDuration: 2.5,
      camera: prevScene ? { ...prevScene.camera } : { center: [13.4, 52.5], zoom: 4.5, pitch: 50, bearing: 15 },
      countries: [],
      actors3d: [],
      annotations: []
    };
    this.projectData.scenes.push(newScene);
    this.rebuildTimeline();
    this.selectScene(newIdx);
  }

  deleteScene(index) {
    if (this.projectData.scenes.length <= 1) return;
    this.projectData.scenes.splice(index, 1);
    this.rebuildTimeline();
    this.selectScene(Math.max(0, index - 1));
  }

  async handleAddCountry({ name, iso, geometry = null, asNewScene = false }) {
    const feat = geometry ? { type: 'Feature', geometry, properties: { name } } : (this.findCountryFeature(iso) || this.findCountryFeature(name));
    let bbox = null;
    let fit = null;

    if (feat) {
      bbox = getGeoJSONBBox(feat);
      fit = calculateFitBounds(bbox);
    }

    const countryObj = {
      id: iso,
      name: name,
      fillColor: '#d4a957',
      fillOpacity: 0.65,
      glowColor: '#ffffff',
      lineWidth: 2,
      showFlag: true,
      flagOpacity: 0.75,
      flagScale: 0,
      flagOffsetX: 0,
      flagOffsetY: 0,
      geometry: geometry || (feat ? feat.geometry : null)
    };

    if (asNewScene) {
      const newIdx = this.projectData.scenes.length;
      const newScene = {
        id: `scene_${newIdx}`,
        title: name,
        transitionType: 'flyToCountry',
        transitionDuration: 3.0,
        holdDuration: 2.5,
        camera: fit ? { center: fit.center, zoom: fit.zoom, pitch: 50, bearing: 15 } : { center: [0, 20], zoom: 3, pitch: 0, bearing: 0 },
        bbox: bbox,
        countries: [countryObj],
        actors3d: [],
        annotations: []
      };
      this.projectData.scenes.push(newScene);
      this.rebuildTimeline();
      this.selectScene(newIdx);
    } else {
      const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
      const scene = this.projectData.scenes[activeIdx];
      if (!scene) return;

      if (!scene.countries) scene.countries = [];
      const existing = scene.countries.find(c => c.name === name || c.id === iso);
      if (!existing) {
        scene.countries.push(countryObj);
        scene.title = name;
      }

      if (fit) {
        scene.bbox = bbox;
        scene.camera = { center: fit.center, zoom: fit.zoom, pitch: 50, bearing: 15 };
        this.map.flyTo(scene.camera);
      }

      this.rebuildTimeline();
      this.updateActiveSceneMap();
      this.renderCurrentProperties();
    }
  }

  async handleAddHistorical({ id, name, asNewScene = false }) {
    try {
      const res = await fetch(`/static/data/historical/${id}.geojson`);
      if (res.ok) {
        const geojson = await res.json();
        const features = geojson.features || [];
        if (features.length > 0) {
          const feat = features[0];
          const bbox = getGeoJSONBBox(feat);
          const fit = calculateFitBounds(bbox);

          const snapshots = features.map(f => ({
            year: f.properties ? (f.properties.year || f.properties.start_year || 1453) : 1453,
            geometry: f.geometry
          })).sort((a, b) => a.year - b.year);

          const empireObj = {
            id: id,
            name: name,
            fillColor: '#d4a957',
            fillOpacity: 0.65,
            glowColor: '#ffffff',
            lineWidth: 2,
            geometry: feat.geometry,
            snapshots: snapshots,
            currentYear: snapshots[0].year,
            isHistorical: true
          };

          if (asNewScene) {
            const newIdx = this.projectData.scenes.length;
            const newScene = {
              id: `scene_${newIdx}`,
              title: name,
              transitionType: 'flyToCountry',
              transitionDuration: 3.0,
              holdDuration: 2.5,
              camera: { center: fit.center, zoom: fit.zoom, pitch: 50, bearing: 15 },
              bbox: bbox,
              countries: [empireObj],
              actors3d: [],
              annotations: []
            };
            this.projectData.scenes.push(newScene);
            this.rebuildTimeline();
            this.selectScene(newIdx);
          } else {
            const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
            const scene = this.projectData.scenes[activeIdx];
            if (scene) {
              if (!scene.countries) scene.countries = [];
              scene.countries.push(empireObj);
              scene.title = name;
              scene.bbox = bbox;
              scene.camera = { center: fit.center, zoom: fit.zoom, pitch: 50, bearing: 15 };
              this.map.flyTo(scene.camera);
              this.rebuildTimeline();
              this.updateActiveSceneMap();
              this.ui.renderHistoricalProperties(empireObj, (patch) => {
                if (patch.year) {
                  const snap = snapshots.find(s => s.year === patch.year) || snapshots[0];
                  empireObj.geometry = snap.geometry;
                }
                this.updateActiveSceneMap();
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('[AMM Studio] Historical empire load error:', err);
    }
  }

  async handleAddModel3D(model) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (!scene) return;

    const center = this.map.getCenter();
    const bounds = this.map.getBounds();
    const spanDeg = Math.abs(bounds.getEast() - bounds.getWest());
    const sizeKm = Math.max(10, Math.round(spanDeg / 360 * 40075 * 0.08));

    const actorData = {
      id: `actor_${Date.now()}`,
      modelId: model.id,
      name: model.name || model.id,
      lngLat: [center.lng, center.lat],
      sizeKm: sizeKm,
      altKm: 0.0,
      rotationDeg: 0.0,
      tiltDeg: 0.0,
      rollDeg: 0.0,
      animMode: 'vehicle',
      color: '#5b6650'
    };

    if (!scene.actors3d) scene.actors3d = [];
    scene.actors3d.push(actorData);

    if (this.threeManager) {
      await this.threeManager.setActor(actorData);
      this.threeManager.selectActor(actorData.id);
    }
    this.select3DActor(actorData);
  }

  select3DActor(actor) {
    this.ui.render3DModelProperties(actor, (patch) => {
      Object.assign(actor, patch);
      if (this.threeManager) this.threeManager.setActor(actor);
    });
  }

  remove3DActor(actorId) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (scene && scene.actors3d) {
      scene.actors3d = scene.actors3d.filter(a => a.id !== actorId);
      if (this.threeManager) this.threeManager.removeActor(actorId);
      this.renderCurrentProperties();
    }
  }

  update3DActor(actor) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (scene && scene.actors3d) {
      const match = scene.actors3d.find(a => a.id === actor.id);
      if (match) Object.assign(match, actor);
    }
  }

  handleAddAnnotation(type) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (!scene) return;

    const center = this.map.getCenter();
    if (!scene.annotations) scene.annotations = [];

    if (type === 'text') {
      const ann = {
        id: `text_${Date.now()}`,
        type: 'text',
        lngLat: [center.lng, center.lat],
        text: 'Typography Placard',
        fontSize: 24,
        color: '#ffffff'
      };
      scene.annotations.push(ann);
      this.updateActiveSceneMap();
      this.selectAnnotation(ann);
    } else if (type === 'arrow') {
      const ann = {
        id: `arrow_${Date.now()}`,
        type: 'arrow',
        from: [center.lng - 0.8, center.lat],
        to: [center.lng + 0.8, center.lat],
        curveControl: [center.lng, center.lat + 0.3],
        color: '#d4a957',
        width: 4,
        headSize: 18
      };
      scene.annotations.push(ann);
      this.updateActiveSceneMap();
      this.selectAnnotation(ann);
    }
  }

  selectAnnotation(ann) {
    if (ann.type === 'arrow') {
      this.ui.renderArrowProperties(ann, (patch) => {
        Object.assign(ann, patch);
        this.updateActiveSceneMap();
      });
    }
  }

  removeAnnotation(annId) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (scene && scene.annotations) {
      scene.annotations = scene.annotations.filter(a => a.id !== annId);
      this.updateActiveSceneMap();
      this.renderCurrentProperties();
    }
  }

  updateAnnotation(ann) {
    const activeIdx = this.timelineView ? this.timelineView.activeSceneIndex : 0;
    const scene = this.projectData.scenes[activeIdx];
    if (scene && scene.annotations) {
      const match = scene.annotations.find(a => a.id === ann.id);
      if (match) Object.assign(match, ann);
    }
  }

  async handleExport({ quality, fps, mode, onProgress, onComplete }) {
    if (!this.captureEngine) return;
    this.togglePlayback(false);

    const dims = quality === '2160' ? [3840, 2160] : quality === '1080' ? [1920, 1080] : [1280, 720];

    try {
      await this.captureEngine.exportVideo({
        projectId: this.projectId,
        projectTitle: this.projectData.name || 'Map Animation',
        timeline: this.timeline,
        width: dims[0],
        height: dims[1],
        fps: parseInt(fps, 10) || 30,
        mode: mode || 'normal',
        onProgress: (stage, current, total) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          onProgress(pct, current, total);
        },
        onLayerUpdate: ({ timeSec }) => {
          this.currentTime = timeSec;
          this.evaluateAtCurrentTime();
        },
        onSuccess: (videoUrl) => {
          onComplete(videoUrl);
        }
      });
    } catch (err) {
      console.error('[AMM Studio Export Error]', err);
    }
  }
}

// -------------------------------------------------------------
// Global Window Bridges for authentic Contourframe HTML events
// -------------------------------------------------------------
function setupGlobalBridges(app) {
  window.setAspectRatio = (ratio) => {
    app.setAspectRatio(ratio);
  };

  window.selectMapStyle = (styleKey) => {
    app.setMapStyle(styleKey);
  };

  window.togglePreview = () => {
    app.togglePlayback(!app.isPlaying);
  };

  window.toggleFullscreen = () => {
    if (app.ui) app.ui.toggleFullscreen();
  };

  window.showExportModal = () => {
    if (app.ui) app.ui.openExportModal();
  };

  window.closeExportModal = () => {
    if (app.ui) app.ui.closeExportModal();
  };

  window.startExport = () => {
    if (app.ui) app.ui.startExport();
  };

  window.cancelExport = () => {
    if (app.ui) app.ui.closeExportModal();
  };

  window.selectResolution = (scale) => {
    const lbl = document.getElementById('resBtnLabel');
    if (lbl) {
      lbl.textContent = scale === 1 ? 'Full' : `${scale * 100}%`;
    }
    const menu = document.getElementById('resMenu');
    if (menu) menu.classList.remove('open');
  };

  window.toggleResMenu = () => {
    const menu = document.getElementById('resMenu');
    if (menu) menu.classList.toggle('open');
  };

  window.StudioMap = {
    resetBearing: () => {
      if (app.map) app.map.easeTo({ bearing: 0, pitch: 0, duration: 400 });
    },
    refreshMap: () => {
      if (app.map) app.map.resize();
    },
    getMap: () => app.map
  };

  window.StudioHistory = {
    undo: () => app.undo(),
    redo: () => app.redo()
  };

  window.menuAction = (action) => {
    switch (action) {
      case 'exportVideo': window.showExportModal(); break;
      case 'fitView': app.fitCurrentScene(true); break;
      case 'ratio16': window.setAspectRatio('16:9'); break;
      case 'ratio9': window.setAspectRatio('9:16'); break;
      case 'fullscreen': window.toggleFullscreen(); break;
      case 'undo': app.undo(); break;
      case 'redo': app.redo(); break;
      default: console.log('[menuAction]', action);
    }
  };

  window.studioMenuItem = (item) => window.menuAction(item);

  window.toggleMenu = (menuId) => {
    const menu = document.getElementById(menuId + 'Menu');
    if (menu) menu.classList.toggle('open');
  };
}

// Instantiate master app
window.addEventListener('DOMContentLoaded', () => {
  const app = new AMMStudioApp();
  window.app = app;
  setupGlobalBridges(app);
  app.init();
});
