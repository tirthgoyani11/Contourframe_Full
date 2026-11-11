/**
 * Three.js 0.128.0 Production 3D Overlay Layer for MapLibre GL JS.
 * Reconstructed from Contourframe production code (studio-3d.js).
 * Dedicated WebGL overlay canvas, procedural 3D model factories, Mercator scaling,
 * sun3d lighting, procedural animation modes, and interactive on-map gizmos.
 */

export const METER_EQ = 1.0 / 40075016.686;

export function computeSunVector(elevationDeg = 63.0, azimuthDeg = 315.0) {
  const elevRad = (elevationDeg * Math.PI) / 180.0;
  const azRad = (azimuthDeg * Math.PI) / 180.0;

  const x = Math.cos(elevRad) * Math.sin(azRad);
  const y = Math.cos(elevRad) * Math.cos(azRad);
  const z = Math.sin(elevRad);

  return [x, y, z];
}

export class ThreeOverlayManager {
  constructor(map, options = {}) {
    this.map = map;
    this.id = options.id || 'amm-three-layer';
    this.onSelectActor = options.onSelectActor || (() => {});
    this.onUpdateActor = options.onUpdateActor || (() => {});

    this.overlayCanvas = null;
    this.gizmoContainer = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.dirLight = null;
    this.hemiLight = null;

    this.actors = new Map(); // id -> { mesh, data }
    this.modelCache = new Map(); // modelId -> scriptCode
    this.selectedActorId = null;

    this.initCanvasAndThree();
    this.initGizmoOverlay();
    this.registerCustomLayer();
  }

  initCanvasAndThree() {
    const container = this.map.getContainer();
    const THREE = window.THREE;
    if (!THREE) {
      console.error('[AMM 3D] Three.js is not loaded on window.');
      return;
    }

    // Reuse existing authentic studio canvas if available
    this.overlayCanvas = document.getElementById('studio3dOverlay');
    if (!this.overlayCanvas) {
      this.overlayCanvas = document.createElement('canvas');
      this.overlayCanvas.id = 'studio3dOverlay';
      this.overlayCanvas.style.position = 'absolute';
      this.overlayCanvas.style.top = '0';
      this.overlayCanvas.style.left = '0';
      this.overlayCanvas.style.width = '100%';
      this.overlayCanvas.style.height = '100%';
      this.overlayCanvas.style.pointerEvents = 'none';
      this.overlayCanvas.style.zIndex = '5';
      container.appendChild(this.overlayCanvas);
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();

    // Lighting matching studio-3d.js
    this.hemiLight = new THREE.HemisphereLight('#cfe3ff', '#2a2420', 0.85);
    this.hemiLight.position.set(0.0, 0.0, 1.0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight('#fff3e0', 1.25);
    const sun = computeSunVector(63, 315);
    this.dirLight.position.set(sun[0], sun[1], sun[2]).normalize();
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(this.dirLight);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.overlayCanvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setClearColor(0x000000, 0.0);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Reposition gizmos on map render
    this.map.on('render', () => {
      this.updateGizmoPositions();
    });
  }

  initGizmoOverlay() {
    const container = this.map.getContainer();
    this.gizmoContainer = document.createElement('div');
    this.gizmoContainer.className = 'amm-3d-gizmo-layer';
    this.gizmoContainer.style.position = 'absolute';
    this.gizmoContainer.style.top = '0';
    this.gizmoContainer.style.left = '0';
    this.gizmoContainer.style.width = '100%';
    this.gizmoContainer.style.height = '100%';
    this.gizmoContainer.style.pointerEvents = 'none';
    this.gizmoContainer.style.zIndex = '12';
    container.appendChild(this.gizmoContainer);
  }

  registerCustomLayer() {
    const self = this;
    const customLayer = {
      id: this.id,
      type: 'custom',
      renderingMode: '2d',
      onAdd() {},
      render(gl, matrix) {
        self.renderFrame(matrix);
      }
    };

    if (this.map.isStyleLoaded()) {
      if (!this.map.getLayer(this.id)) this.map.addLayer(customLayer);
    } else {
      this.map.once('style.load', () => {
        if (!this.map.getLayer(this.id)) this.map.addLayer(customLayer);
      });
    }
  }

  renderFrame(matrix) {
    if (!this.renderer || !this.scene || !this.camera || !this.map) return;
    const mapCanvas = this.map.getCanvas();

    if (this.overlayCanvas.width !== mapCanvas.width || this.overlayCanvas.height !== mapCanvas.height) {
      this.renderer.setSize(mapCanvas.width, mapCanvas.height, false);
    }

    // Convert MapLibre projection matrix to Three.js camera
    const THREE = window.THREE;
    const m = new THREE.Matrix4().fromArray(matrix);
    this.camera.projectionMatrix.copy(m);
    this.camera.projectionMatrix.premultiply(new THREE.Matrix4().makeScale(1, -1, 1));

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  updateSun(sun3d) {
    if (!this.dirLight || !sun3d) return;
    const elev = typeof sun3d.yuk === 'number' ? sun3d.yuk : 63;
    const az = typeof sun3d.don === 'number' ? sun3d.don : 315;
    const vec = computeSunVector(elev, az);
    this.dirLight.position.set(vec[0], vec[1], vec[2]).normalize();
    if (this.map) this.map.triggerRepaint();
  }

  /**
   * Loads procedural 3D model script with caching and execution.
   */
  async loadModel(modelId) {
    const THREE = window.THREE;
    if (!THREE) return null;

    let scriptCode = this.modelCache.get(modelId);
    if (!scriptCode) {
      try {
        const res = await fetch(`/static/models3d/${encodeURIComponent(modelId)}.js`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        scriptCode = await res.text();
        this.modelCache.set(modelId, scriptCode);
      } catch (e) {
        console.warn(`[AMM 3D] Failed to load model script: ${modelId}`, e);
        return null;
      }
    }

    const modelGroup = new THREE.Group();
    const meshHelper = function(geo, col, opts = {}) {
      const mat = new THREE.MeshStandardMaterial({
        color: col || '#888888',
        roughness: opts.rough != null ? opts.rough : 0.72,
        metalness: opts.metal != null ? opts.metal : 0.28,
        flatShading: Boolean(opts.flat)
      });
      const m = new THREE.Mesh(geo, mat);
      if (opts.name) m.name = opts.name;
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    const spinners = [];
    function spin(opts = {}) {
      const spinGroup = new THREE.Group();
      const pivot = opts.pivot || [0, 0, 0];
      spinGroup.position.set(pivot[0], pivot[1], pivot[2]);
      spinGroup.userData.spinAxis = opts.axis || 'y';
      spinGroup.userData.spinRpm = opts.rpm != null ? opts.rpm : 60;
      modelGroup.add(spinGroup);
      spinners.push(spinGroup);
      return spinGroup;
    }

    try {
      const fn = new Function('THREE', 'modelGroup', 'mesh', 'Math', 'spin', scriptCode);
      fn(THREE, modelGroup, meshHelper, Math, spin);
    } catch (err) {
      console.error(`[AMM 3D] Execution error in model ${modelId}:`, err);
      return null;
    }

    // Compute bounding box and normalize horizontal span
    modelGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(modelGroup);
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3());
      modelGroup.position.x -= center.x;
      modelGroup.position.z -= center.z;
      modelGroup.position.y -= box.min.y;
      modelGroup.updateMatrixWorld(true);
      const spanX = box.max.x - box.min.x;
      const spanZ = box.max.z - box.min.z;
      modelGroup.userData.maxHoriz = Math.max(spanX, spanZ) || 10.0;
    } else {
      modelGroup.userData.maxHoriz = 10.0;
    }

    modelGroup.userData.spinners = spinners;
    return modelGroup;
  }

  /**
   * Sets the active scene's actors.
   */
  async setActors(actorList = []) {
    const currentIds = new Set(actorList.map(a => a.id));

    // Remove actors not in current scene
    for (const [id, item] of this.actors.entries()) {
      if (!currentIds.has(id)) {
        this.scene.remove(item.mesh);
        this.actors.delete(id);
      }
    }

    // Add or update actors
    for (const data of actorList) {
      await this.setActor(data);
    }

    this.renderGizmos();
    if (this.map) this.map.triggerRepaint();
  }

  async setActor(actorData) {
    if (!this.scene || !window.THREE) return;

    let item = this.actors.get(actorData.id);
    if (!item) {
      const mesh = await this.loadModel(actorData.modelId || 'tank');
      if (!mesh) return;
      this.scene.add(mesh);
      item = { mesh, data: { ...actorData } };
      this.actors.set(actorData.id, item);
    } else {
      item.data = { ...item.data, ...actorData };
      if (item.data.modelId !== actorData.modelId) {
        this.scene.remove(item.mesh);
        const newMesh = await this.loadModel(actorData.modelId || 'tank');
        if (newMesh) {
          this.scene.add(newMesh);
          item.mesh = newMesh;
        }
      }
    }

    this.applyMaterialTint(item.mesh, actorData.color);
    this.updateActorTransform(item, actorData);
    if (this.map) this.map.triggerRepaint();
  }

  applyMaterialTint(mesh, color) {
    if (!color || !window.THREE) return;
    const THREE = window.THREE;
    const targetCol = new THREE.Color(color);

    mesh.traverse(child => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const name = (child.name || '').toLowerCase();
        // Tint body, hull, armor, fuselage, or main components
        if (name.includes('govde') || name.includes('hull') || name.includes('taret') ||
            name.includes('kanat') || name.includes('body') || name.includes('ana')) {
          mat.color.copy(targetCol);
        }
      }
    });
  }

  updateActorTransform(item, data) {
    const mesh = item.mesh;
    const [lng, lat] = data.lngLat || [0, 0];

    if (!window.maplibregl || !window.maplibregl.MercatorCoordinate) return;
    const mc = window.maplibregl.MercatorCoordinate.fromLngLat({ lng, lat }, 0.0);

    const sizeKm = typeof data.sizeKm === 'number' && data.sizeKm > 0 ? data.sizeKm : 60.0;
    const maxHoriz = mesh.userData.maxHoriz || 10.0;
    const scale = METER_EQ * (sizeKm * 1000.0) / maxHoriz;
    const alt = METER_EQ * ((data.altKm || 0.0) * 1000.0);

    const THREE = window.THREE;
    const mat = new THREE.Matrix4();
    const rotX90 = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);
    const rotY = new THREE.Matrix4().makeRotationY(((data.rotationDeg || 0.0) * Math.PI) / 180.0);
    const rotZ = new THREE.Matrix4().makeRotationZ(((data.tiltDeg || 0.0) * Math.PI) / 180.0);
    const rotX = new THREE.Matrix4().makeRotationX(((data.rollDeg || 0.0) * Math.PI) / 180.0);

    mat.makeTranslation(mc.x, mc.y, mc.z + alt)
       .scale(new THREE.Vector3(scale, scale, scale))
       .multiply(rotX90)
       .multiply(rotY)
       .multiply(rotZ)
       .multiply(rotX);

    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(mat);
    mesh.visible = true;
  }

  removeActor(actorId) {
    const item = this.actors.get(actorId);
    if (item && this.scene) {
      this.scene.remove(item.mesh);
      this.actors.delete(actorId);
      this.renderGizmos();
      if (this.map) this.map.triggerRepaint();
    }
  }

  clearActors() {
    for (const [, item] of this.actors.entries()) {
      if (this.scene) this.scene.remove(item.mesh);
    }
    this.actors.clear();
    if (this.gizmoContainer) this.gizmoContainer.innerHTML = '';
    if (this.map) this.map.triggerRepaint();
  }

  selectActor(actorId) {
    this.selectedActorId = actorId;
    this.renderGizmos();
    const item = this.actors.get(actorId);
    if (item) {
      this.onSelectActor(item.data);
    }
  }

  renderGizmos() {
    if (!this.gizmoContainer) return;
    this.gizmoContainer.innerHTML = '';

    for (const [id, item] of this.actors.entries()) {
      const data = item.data;
      const isSelected = id === this.selectedActorId;

      const gizmoEl = document.createElement('div');
      gizmoEl.id = `gizmo-${id}`;
      gizmoEl.className = `amm-3d-actor-pin ${isSelected ? 'selected' : ''}`;
      gizmoEl.style.position = 'absolute';
      gizmoEl.style.pointerEvents = 'auto';
      gizmoEl.style.cursor = 'grab';

      gizmoEl.innerHTML = `
        <div class="amm-pin-card">
          <div class="amm-pin-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M21 16.5l-9 5.25-9-5.25V7.5l9-5.25 9 5.25v9z"/>
            </svg>
            <span>${data.name || data.modelId}</span>
          </div>
          ${isSelected ? `
            <div class="amm-pin-ring">
              <div class="amm-pin-heading" style="transform: rotate(${data.rotationDeg || 0}deg);">
                <div class="amm-heading-arrow">▲</div>
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // Select actor on click
      gizmoEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectActor(id);
      });

      // Drag to move actor position
      let isDragging = false;
      let startX = 0, startY = 0;

      gizmoEl.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        gizmoEl.style.cursor = 'grabbing';
        this.selectActor(id);

        const onMouseMove = (ev) => {
          if (!isDragging) return;
          const rect = this.map.getContainer().getBoundingClientRect();
          const mouseX = ev.clientX - rect.left;
          const mouseY = ev.clientY - rect.top;
          const lngLat = this.map.unproject([mouseX, mouseY]);

          data.lngLat = [lngLat.lng, lngLat.lat];
          this.updateActorTransform(item, data);
          this.updateGizmoPositions();
          this.onUpdateActor(data);
          this.map.triggerRepaint();
        };

        const onMouseUp = () => {
          isDragging = false;
          gizmoEl.style.cursor = 'grab';
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        e.stopPropagation();
      });

      gizmoEl._actorId = id;
      this.gizmoContainer.appendChild(gizmoEl);
    }

    this.updateGizmoPositions();
  }

  updateGizmoPositions() {
    if (!this.map || !this.gizmoContainer) return;
    const children = this.gizmoContainer.children;

    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const item = this.actors.get(el._actorId);
      if (item && item.data && item.data.lngLat) {
        const pt = this.map.project(item.data.lngLat);
        el.style.left = `${pt.x}px`;
        el.style.top = `${pt.y}px`;
        el.style.transform = 'translate(-50%, -50%)';
      }
    }
  }

  getCanvas() {
    return this.overlayCanvas;
  }

  destroy() {
    this.clearActors();
    if (this.overlayCanvas && this.overlayCanvas.parentNode) {
      this.overlayCanvas.parentNode.removeChild(this.overlayCanvas);
    }
    if (this.gizmoContainer && this.gizmoContainer.parentNode) {
      this.gizmoContainer.parentNode.removeChild(this.gizmoContainer);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export function createThreeLayer(map, options = {}) {
  return new ThreeOverlayManager(map, options);
}
