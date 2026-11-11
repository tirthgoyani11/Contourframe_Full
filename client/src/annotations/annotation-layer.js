/**
 * Annotations, Tactical Arrow & Country Placard Layer.
 * Reconstructed from Contourframe production code (studio-core.js & studio-properties.js).
 * Renders Quadratic Bézier Tactical Arrows with stealth arrowheads, interactive drag handles,
 * typography placards, and image billboards synchronized with MapLibre camera.
 */

export class AnnotationLayer {
  constructor(map, containerElement, options = {}) {
    this.map = map;
    this.container = containerElement;
    this.onSelectAnnotation = options.onSelectAnnotation || (() => {});
    this.onUpdateAnnotation = options.onUpdateAnnotation || (() => {});

    this.annotations = [];
    this.countryPlacards = [];
    this.selectedAnnotationId = null;

    this.svgElement = null;
    this.htmlContainer = null;
    this.handleContainer = null;

    this.initDOM();
  }

  initDOM() {
    // SVG overlay for tactical arrows
    this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgElement.id = 'amm-svg-arrows';
    this.svgElement.style.position = 'absolute';
    this.svgElement.style.top = '0';
    this.svgElement.style.left = '0';
    this.svgElement.style.width = '100%';
    this.svgElement.style.height = '100%';
    this.svgElement.style.pointerEvents = 'none';
    this.svgElement.style.zIndex = '10';

    // SVG Defs for shadows and filters
    this.svgElement.innerHTML = `
      <defs>
        <filter id="arrow-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
      </defs>
    `;
    this.container.appendChild(this.svgElement);

    // HTML overlay for text placards, image seals, and country labels
    this.htmlContainer = document.createElement('div');
    this.htmlContainer.id = 'amm-html-placards';
    this.htmlContainer.style.position = 'absolute';
    this.htmlContainer.style.top = '0';
    this.htmlContainer.style.left = '0';
    this.htmlContainer.style.width = '100%';
    this.htmlContainer.style.height = '100%';
    this.htmlContainer.style.pointerEvents = 'none';
    this.htmlContainer.style.zIndex = '11';
    this.container.appendChild(this.htmlContainer);

    // HTML handle layer for interactive dragging of arrow endpoints and control points
    this.handleContainer = document.createElement('div');
    this.handleContainer.id = 'amm-annotation-handles';
    this.handleContainer.style.position = 'absolute';
    this.handleContainer.style.top = '0';
    this.handleContainer.style.left = '0';
    this.handleContainer.style.width = '100%';
    this.handleContainer.style.height = '100%';
    this.handleContainer.style.pointerEvents = 'none';
    this.handleContainer.style.zIndex = '13';
    this.container.appendChild(this.handleContainer);

    if (this.map) {
      this.map.on('render', () => this.updatePositions());
    }
  }

  setAnnotations(annotations = [], countryPlacards = []) {
    this.annotations = annotations || [];
    this.countryPlacards = countryPlacards || [];
    this.render();
  }

  selectAnnotation(annId) {
    this.selectedAnnotationId = annId;
    this.render();
    const ann = this.annotations.find(a => a.id === annId);
    if (ann) {
      this.onSelectAnnotation(ann);
    }
  }

  render() {
    // Clear SVG elements (preserve defs)
    const defs = this.svgElement.querySelector('defs');
    this.svgElement.innerHTML = '';
    if (defs) this.svgElement.appendChild(defs);

    this.htmlContainer.innerHTML = '';
    this.handleContainer.innerHTML = '';

    // 1. Render country centroid placards
    for (const cp of this.countryPlacards) {
      this.renderCountryPlacard(cp);
    }

    // 2. Render annotations
    for (const ann of this.annotations) {
      if (ann.type === 'text') {
        this.renderTextAnnotation(ann);
      } else if (ann.type === 'image') {
        this.renderImageAnnotation(ann);
      } else if (ann.type === 'arrow') {
        this.renderArrowAnnotation(ann);
        this.renderArrowHandles(ann);
      }
    }

    this.updatePositions();
  }

  renderCountryPlacard(cp) {
    const el = document.createElement('div');
    el.className = 'amm-country-centroid-placard';
    el.style.position = 'absolute';
    el.style.pointerEvents = 'none';
    el.style.transformOrigin = 'center center';
    el.style.whiteSpace = 'nowrap';
    el.style.userSelect = 'none';

    const flagHTML = cp.iso ? `<img src="/static/flags/${cp.iso.toLowerCase()}.svg" class="amm-placard-flag" alt="" onerror="this.style.display='none'"/>` : '';

    el.innerHTML = `
      <div class="amm-placard-body">
        ${flagHTML}
        <span class="amm-placard-text">${cp.name.toUpperCase()}</span>
      </div>
    `;

    el._lngLat = cp.centroid;
    this.htmlContainer.appendChild(el);
  }

  renderTextAnnotation(ann) {
    const el = document.createElement('div');
    el.id = `ann-text-${ann.id}`;
    el.className = `amm-annotation-text ${ann.id === this.selectedAnnotationId ? 'selected' : ''}`;
    el.textContent = ann.text || 'Text';
    el.style.position = 'absolute';
    el.style.fontSize = `${ann.fontSize || 24}px`;
    el.style.fontFamily = ann.fontFamily || 'Oswald, sans-serif';
    el.style.fontWeight = '700';
    el.style.color = ann.color || '#ffffff';
    el.style.opacity = ann.opacity !== undefined ? ann.opacity : 1.0;
    el.style.transformOrigin = 'center center';
    el.style.whiteSpace = 'nowrap';
    el.style.textShadow = '0 2px 6px rgba(0,0,0,0.9)';
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';

    if (ann.bgEnabled) {
      el.style.backgroundColor = ann.bgColor || 'rgba(26,26,26,0.85)';
      el.style.padding = '4px 10px';
      el.style.borderRadius = '4px';
    }

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectAnnotation(ann.id);
    });

    el._lngLat = ann.lngLat;
    el._rotation = ann.rotation || 0.0;
    this.htmlContainer.appendChild(el);
  }

  renderImageAnnotation(ann) {
    const el = document.createElement('img');
    el.id = `ann-img-${ann.id}`;
    el.className = `amm-annotation-img ${ann.id === this.selectedAnnotationId ? 'selected' : ''}`;
    el.src = ann.imageUrl;
    el.style.position = 'absolute';
    el.style.opacity = ann.opacity !== undefined ? ann.opacity : 1.0;
    el.style.transformOrigin = 'center center';
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectAnnotation(ann.id);
    });

    const scale = ann.scale || 1.0;
    el._scale = scale;
    el._lngLat = ann.lngLat;
    el._rotation = ann.rotation || 0.0;

    this.htmlContainer.appendChild(el);
  }

  renderArrowAnnotation(ann) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.id = `ann-arrow-${ann.id}`;
    group.setAttribute('filter', 'url(#arrow-shadow)');

    // Arrow Shaft Path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', ann.color || '#ffcc00');
    path.setAttribute('stroke-width', ann.thickness || 8);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    if (ann.style === 'dashed') {
      path.setAttribute('stroke-dasharray', `${ann.dashLength || 14},${ann.gapLength || 8}`);
    } else if (ann.style === 'dotted') {
      path.setAttribute('stroke-dasharray', `4,8`);
    }

    // Arrowhead Polygon
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    head.setAttribute('fill', ann.color || '#ffcc00');
    head.setAttribute('stroke', '#000000');
    head.setAttribute('stroke-width', '1.5');
    head.setAttribute('stroke-linejoin', 'round');

    group.appendChild(path);
    group.appendChild(head);

    group._ann = ann;
    group._pathEl = path;
    group._headEl = head;
    this.svgElement.appendChild(group);
  }

  renderArrowHandles(ann) {
    if (!ann.from || !ann.to) return;
    const isSelected = ann.id === this.selectedAnnotationId;

    // Handle 1: From point
    const hFrom = document.createElement('div');
    hFrom.className = `amm-arrow-handle from ${isSelected ? 'active' : ''}`;
    hFrom.title = 'Start Point (drag to move)';
    hFrom.style.position = 'absolute';
    hFrom.style.pointerEvents = 'auto';
    this.bindHandleDrag(hFrom, ann, 'from');
    this.handleContainer.appendChild(hFrom);

    // Handle 2: To point (Arrowhead)
    const hTo = document.createElement('div');
    hTo.className = `amm-arrow-handle to ${isSelected ? 'active' : ''}`;
    hTo.title = 'Target Point (drag to move)';
    hTo.style.position = 'absolute';
    hTo.style.pointerEvents = 'auto';
    this.bindHandleDrag(hTo, ann, 'to');
    this.handleContainer.appendChild(hTo);

    // Handle 3: Control point (Bézier bend)
    const hCtrl = document.createElement('div');
    hCtrl.className = `amm-arrow-handle ctrl ${isSelected ? 'active' : ''}`;
    hCtrl.title = 'Curve Arc Control (drag to bend)';
    hCtrl.style.position = 'absolute';
    hCtrl.style.pointerEvents = 'auto';
    this.bindHandleDrag(hCtrl, ann, 'ctrl');
    this.handleContainer.appendChild(hCtrl);

    ann._handleFrom = hFrom;
    ann._handleTo = hTo;
    ann._handleCtrl = hCtrl;
  }

  bindHandleDrag(handleEl, ann, type) {
    let isDragging = false;

    handleEl.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      this.selectAnnotation(ann.id);

      const onMouseMove = (ev) => {
        if (!isDragging) return;
        const rect = this.map.getContainer().getBoundingClientRect();
        const mouseX = ev.clientX - rect.left;
        const mouseY = ev.clientY - rect.top;
        const lngLat = this.map.unproject([mouseX, mouseY]);

        if (type === 'from') {
          ann.from = [lngLat.lng, lngLat.lat];
        } else if (type === 'to') {
          ann.to = [lngLat.lng, lngLat.lat];
        } else if (type === 'ctrl') {
          ann.curveControl = [lngLat.lng, lngLat.lat];
        }

        this.updatePositions();
        this.onUpdateAnnotation(ann);
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      e.stopPropagation();
    });
  }

  updatePositions() {
    if (!this.map) return;

    // Update HTML billboards & country placards
    const htmlChildren = this.htmlContainer.children;
    for (let i = 0; i < htmlChildren.length; i++) {
      const el = htmlChildren[i];
      if (el._lngLat) {
        const pt = this.map.project(el._lngLat);
        const rot = el._rotation || 0;
        const scale = el._scale || 1.0;
        el.style.left = `${pt.x}px`;
        el.style.top = `${pt.y}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      }
    }

    // Update SVG Tactical Arrows & Handles
    const svgGroups = this.svgElement.querySelectorAll('g');
    for (let i = 0; i < svgGroups.length; i++) {
      const g = svgGroups[i];
      const ann = g._ann;
      if (!ann || !ann.from || !ann.to) continue;

      const p1 = this.map.project(ann.from);
      const p2 = this.map.project(ann.to);

      let ctrlPt;
      if (ann.curveControl) {
        ctrlPt = this.map.project(ann.curveControl);
      } else {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const midX = (p1.x + p2.x) * 0.5;
        const midY = (p1.y + p2.y) * 0.5;
        const len = Math.sqrt(dx * dx + dy * dy);
        const curve = ann.curveAmount !== undefined ? ann.curveAmount : 0.2;
        const normX = len > 0 ? (-dy / len) * (curve * 120.0) : 0;
        const normY = len > 0 ? (dx / len) * (curve * 120.0) : 0;
        ctrlPt = { x: midX + normX, y: midY + normY };
      }

      // Draw quadratic curve
      const d = `M ${p1.x} ${p1.y} Q ${ctrlPt.x} ${ctrlPt.y} ${p2.x} ${p2.y}`;
      g._pathEl.setAttribute('d', d);

      // Compute tangent angle at endpoint p2 for arrowhead
      const tanX = p2.x - ctrlPt.x;
      const tanY = p2.y - ctrlPt.y;
      const tanLen = Math.sqrt(tanX * tanX + tanY * tanY) || 1.0;
      const uX = tanX / tanLen;
      const uY = tanY / tanLen;
      const nX = -uY;
      const nY = uX;

      const headSize = ann.headSize || 28.0;
      const headWidth = headSize * 0.55;

      // Stealth arrowhead geometry points
      const tipX = p2.x;
      const tipY = p2.y;
      const leftX = tipX - headSize * uX + headWidth * nX;
      const leftY = tipY - headSize * uY + headWidth * nY;
      const indentX = tipX - (headSize * 0.72) * uX;
      const indentY = tipY - (headSize * 0.72) * uY;
      const rightX = tipX - headSize * uX - headWidth * nX;
      const rightY = tipY - headSize * uY - headWidth * nY;

      const polyPoints = `${tipX},${tipY} ${leftX},${leftY} ${indentX},${indentY} ${rightX},${rightY}`;
      g._headEl.setAttribute('points', polyPoints);

      // Position handle dots
      if (ann._handleFrom) {
        ann._handleFrom.style.left = `${p1.x}px`;
        ann._handleFrom.style.top = `${p1.y}px`;
      }
      if (ann._handleTo) {
        ann._handleTo.style.left = `${p2.x}px`;
        ann._handleTo.style.top = `${p2.y}px`;
      }
      if (ann._handleCtrl) {
        ann._handleCtrl.style.left = `${ctrlPt.x}px`;
        ann._handleCtrl.style.top = `${ctrlPt.y}px`;
      }
    }
  }

  /**
   * Evaluates draw animation progress in [0, 1] during playback.
   */
  setAnimationProgress(progress = 1.0) {
    const svgGroups = this.svgElement.querySelectorAll('g');
    for (let i = 0; i < svgGroups.length; i++) {
      const g = svgGroups[i];
      const ann = g._ann;
      if (!ann) continue;

      if (ann.animationType === 'draw') {
        const path = g._pathEl;
        const totalLen = path.getTotalLength ? path.getTotalLength() : 500;
        path.style.strokeDasharray = `${totalLen}`;
        path.style.strokeDashoffset = `${totalLen * (1.0 - progress)}`;

        // Arrowhead scales up as flight nears completion
        const headScale = progress > 0.85 ? (progress - 0.85) / 0.15 : 0.0;
        g._headEl.style.transformOrigin = `${ann.to ? this.map.project(ann.to).x : 0}px ${ann.to ? this.map.project(ann.to).y : 0}px`;
        g._headEl.style.transform = `scale(${headScale})`;
      } else {
        g._pathEl.style.strokeDasharray = 'none';
        g._headEl.style.transform = 'scale(1)';
      }
    }
  }

  destroy() {
    if (this.svgElement && this.svgElement.parentNode) {
      this.svgElement.parentNode.removeChild(this.svgElement);
    }
    if (this.htmlContainer && this.htmlContainer.parentNode) {
      this.htmlContainer.parentNode.removeChild(this.htmlContainer);
    }
    if (this.handleContainer && this.handleContainer.parentNode) {
      this.handleContainer.parentNode.removeChild(this.handleContainer);
    }
  }
}
