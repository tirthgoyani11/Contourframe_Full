/**
 * StudioStickers - Animated Motion Stickers & Overlays
 * Native SVG SMIL vector animations on MapLibre (Fire, Explosions, Arrows, Timers, Confetti, etc.)
 */
const StudioStickers = (() => {
    let _manifest = [];
    let _manifestLoaded = false;
    let _activeMarkers = new Map(); // id -> maplibregl.Marker
    let _map = null;
    let _isOpen = false;
    let _currentCat = null;
    let _searchQuery = '';

    // Category labels and display metadata
    const CATEGORIES = {
        'effects': { name: 'Battle & Effects', icon: '🔥', desc: 'Explosions, fire, smoke, sparks' },
        'military': { name: 'Military & Conflict', icon: '⚔️', desc: 'Tanks, jets, missiles, warships' },
        'markers': { name: 'Arrows & Markers', icon: '📍', desc: 'Hand-drawn arrows, clocks, pings' },
        'graphics': { name: 'Graphics & Callouts', icon: '✨', desc: 'Confetti, starbursts, bubbles' },
        'characters': { name: 'Characters & Emojis', icon: '💪', desc: 'Flexing arms, anger marks, reactions' },
        'weather': { name: 'Weather & Skies', icon: '🌤️', desc: 'Rain, snow, sun, clouds' },
        'transport': { name: 'Vehicles & Travel', icon: '✈️', desc: 'Planes, cars, satellites' },
        'symbols': { name: 'Symbols & Badges', icon: '🚩', desc: 'Alerts, money, badges' }
    };

    async function loadManifest() {
        if (_manifestLoaded) return _manifest;
        try {
            const res = await fetch('/static/animations/manifest.json');
            if (res.ok) {
                _manifest = await res.json();
                _manifestLoaded = true;
            }
        } catch (e) {
            console.warn('[StudioStickers] Failed to load manifest:', e);
        }
        return _manifest;
    }

    function getManifest() {
        return _manifest;
    }

    function init(map) {
        _map = map || (typeof StudioMap !== 'undefined' && StudioMap.getMap ? StudioMap.getMap() : null);
        loadManifest();
        
        // Listen to core scene changes & sequence mutations
        window.addEventListener('studiosequencechange', syncMarkers);
        window.addEventListener('studioselectionchange', syncMarkers);
        window.addEventListener('studioprojectloaded', syncMarkers);
        if (typeof StudioCore !== 'undefined' && StudioCore.on) {
            try {
                StudioCore.on('annotationsChanged', syncMarkers);
                StudioCore.on('sceneChanged', syncMarkers);
                StudioCore.on('sequenceChanged', syncMarkers);
            } catch (_) {}
        }
        if (_map) {
            _map.on('move', updateMarkerPositions);
            _map.on('zoom', updateMarkerPositions);
            _map.on('rotate', updateMarkerPositions);
            _map.on('pitch', updateMarkerPositions);
        }
    }

    function syncMarkers() {
        if (!_map && typeof StudioMap !== 'undefined' && StudioMap.getMap) {
            _map = StudioMap.getMap();
        }
        if (!_map || typeof StudioCore === 'undefined') return;
        
        // Find stickers in current active group
        const sel = StudioCore.getSelectedItem ? StudioCore.getSelectedItem() : null;
        let currentGroup = null;
        if (sel && sel.item && sel.item.type === 'countryGroup') {
            currentGroup = sel.item;
        } else {
            const seq = StudioCore.getSequence ? StudioCore.getSequence() : [];
            currentGroup = seq.find(s => s && s.type === 'countryGroup') || null;
        }

        const stickers = [];
        if (currentGroup && Array.isArray(currentGroup.annotations)) {
            for (const a of currentGroup.annotations) {
                if (a && a.type === 'sticker') {
                    stickers.push(a);
                }
            }
        }

        const currentIds = new Set(stickers.map(s => s.id));

        // Remove old markers that no longer exist
        for (const [id, marker] of _activeMarkers.entries()) {
            if (!currentIds.has(id)) {
                marker.remove();
                _activeMarkers.delete(id);
            }
        }

        // Add or update markers
        for (const st of stickers) {
            let marker = _activeMarkers.get(st.id);
            if (!marker) {
                marker = createMarker(st);
                _activeMarkers.set(st.id, marker);
            } else {
                updateMarkerDOM(marker.getElement(), st);
                if (st.lngLat && Array.isArray(st.lngLat)) {
                    marker.setLngLat(st.lngLat);
                }
            }
        }
    }

    function createMarker(st) {
        const el = document.createElement('div');
        el.className = 'studio-sticker-marker';
        el.dataset.stickerId = st.id;
        el.style.position = 'absolute';
        el.style.cursor = 'move';
        el.style.userSelect = 'none';
        el.style.zIndex = '30';

        const img = document.createElement('img');
        img.className = 'studio-sticker-img';
        img.src = st.animSrc;
        img.alt = st.name || 'Sticker';
        img.draggable = false;
        el.appendChild(img);

        updateMarkerDOM(el, st);

        const marker = new maplibregl.Marker({
            element: el,
            anchor: 'center',
            draggable: true
        });

        if (st.lngLat && Array.isArray(st.lngLat)) {
            marker.setLngLat(st.lngLat);
        }
        marker.addTo(_map);

        // Click to select
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSticker(st.id);
        });

        // Drag updates coordinates in StudioCore
        marker.on('dragend', () => {
            const pos = marker.getLngLat();
            st.lngLat = [pos.lng, pos.lat];
            if (typeof StudioCore !== 'undefined' && StudioCore.updateAnnotation) {
                StudioCore.updateAnnotation(st.id, 'lngLat', [pos.lng, pos.lat]);
            }
            if (typeof StudioProperties !== 'undefined' && StudioProperties.selectAnnotation) {
                StudioProperties.selectAnnotation(st.id);
            }
            if (_map) _map.triggerRepaint();
        });

        return marker;
    }

    function updateMarkerDOM(el, st) {
        if (!el) return;
        const img = el.querySelector('img');
        if (!img) return;

        const size = st.size || 64;
        const rot = st.rotation || 0;
        const flip = st.flipX ? -1 : 1;
        const speed = st.animSpeed || 1;

        el.style.width = size + 'px';
        el.style.height = size + 'px';

        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.display = 'block';

        let transform = `rotate(${rot}deg) scaleX(${flip})`;
        img.style.transform = transform;

        // Visual effects (glow aura, selection outline)
        const isSelected = (typeof StudioProperties !== 'undefined' && StudioProperties.getSelectedAnnotationId && StudioProperties.getSelectedAnnotationId() === st.id);
        let filter = '';
        if (st.animGlow) {
            const glowColor = st.animGlowColor || '#ff4500';
            filter += `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor}) `;
        }
        if (isSelected) {
            filter += `drop-shadow(0 0 6px #d4a957) `;
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
        img.style.filter = filter.trim();
    }

    function updateMarkerPositions() {
        // MapLibre updates marker CSS transforms automatically on move
    }

    function selectSticker(id) {
        if (typeof StudioProperties !== 'undefined' && StudioProperties.selectAnnotation) {
            StudioProperties.selectAnnotation(id);
        }
        renderProperties(id);
        syncMarkers();
    }

    // UI Drawer / Library Methods
    function toggleLibrary(force) {
        const lib = document.getElementById('panelStickersLibrary');
        const props = document.getElementById('properties-panel');
        const btn = document.getElementById('tbStickers');
        if (!lib || !props) return;

        const open = force !== undefined ? force : !_isOpen;
        _isOpen = open;

        lib.style.display = open ? 'flex' : 'none';
        props.style.display = open ? 'none' : '';
        if (btn) btn.classList.toggle('active', open);

        // Close other side panels if opening
        if (open) {
            if (typeof toggle3DLibrary === 'function' && window._lib3dAcikMi && window._lib3dAcikMi()) {
                toggle3DLibrary(false);
            }
            if (typeof toggleImageSheet === 'function') {
                toggleImageSheet(false);
            }
            _currentCat = null;
            _searchQuery = '';
            renderLibrary();
        }
    }

    function openCategory(catName) {
        _currentCat = catName;
        _searchQuery = '';
        const inp = document.getElementById('stickerSearchInput');
        if (inp) inp.value = '';
        renderLibrary();
    }

    function searchStickers(query) {
        _searchQuery = (query || '').toLowerCase().trim();
        renderLibrary();
    }

    function renderLibrary() {
        const lib = document.getElementById('panelStickersLibrary');
        if (!lib) return;

        loadManifest().then(items => {
            let html = `
                <div class="lib-stickers-header">
                    <div class="lib-stickers-title">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span>Animated Stickers</span>
                    </div>
                    <button class="lib-stickers-close" onclick="StudioStickers.toggleLibrary(false)" title="Close">&times;</button>
                </div>
                <div class="lib-stickers-search-wrap">
                    <input type="text" id="stickerSearchInput" class="lib-stickers-search" placeholder="Search fire, arrows, clocks, tanks..." value="${_searchQuery}" oninput="StudioStickers.searchStickers(this.value)">
                </div>
                <div class="lib-stickers-content">
            `;

            if (_searchQuery) {
                // Search filter view
                const filtered = items.filter(it => 
                    it.name.toLowerCase().includes(_searchQuery) || 
                    it.category.toLowerCase().includes(_searchQuery)
                );
                html += `<div class="lib-stickers-grid">`;
                if (filtered.length === 0) {
                    html += `<div class="lib-stickers-empty">No stickers match "${_searchQuery}"</div>`;
                } else {
                    for (const item of filtered) {
                        html += renderCard(item);
                    }
                }
                html += `</div>`;
            } else if (_currentCat === null) {
                // Category cards view
                html += `<div class="lib-stickers-cat-grid">`;
                for (const [catKey, meta] of Object.entries(CATEGORIES)) {
                    const catItems = items.filter(it => it.category === catKey);
                    const sample = catItems.slice(0, 4);
                    html += `
                        <button type="button" class="lib-stickers-cat-card" onclick="StudioStickers.openCategory('${catKey}')">
                            <span class="lib-stickers-cat-mosaic">
                                ${sample.map(s => `<img src="${s.url}" alt="" class="cat-thumb" loading="lazy">`).join('')}
                            </span>
                            <span class="lib-stickers-cat-info">
                                <span class="lib-stickers-cat-name">${meta.icon} ${meta.name}</span>
                                <span class="lib-stickers-cat-count">${catItems.length} stickers</span>
                            </span>
                        </button>
                    `;
                }
                html += `</div>`;
            } else {
                // Specific category items view
                const catMeta = CATEGORIES[_currentCat] || { name: _currentCat, icon: '✨' };
                const catItems = items.filter(it => it.category === _currentCat);
                html += `
                    <div class="lib-stickers-cat-top">
                        <button class="lib-stickers-back" onclick="StudioStickers.openCategory(null)">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                            <span>All categories</span>
                        </button>
                        <span class="lib-stickers-cat-title">${catMeta.icon} ${catMeta.name} (${catItems.length})</span>
                    </div>
                    <div class="lib-stickers-grid">
                        ${catItems.map(it => renderCard(it)).join('')}
                    </div>
                `;
            }

            html += `</div>`;
            lib.innerHTML = html;
        });
    }

    function renderCard(item) {
        return `
            <button type="button" class="lib-stickers-card lib-sticker-item" onclick="StudioStickers.addSticker('${item.id}')" title="Click to add ${item.name} to map">
                <span class="lib-stickers-card-preview lib-sticker-preview">
                    <img src="${item.url}" alt="" loading="lazy">
                </span>
                <span class="lib-stickers-card-name lib-sticker-name">${item.name}</span>
            </button>
        `;
    }

    function addSticker(animId) {
        const item = _manifest.find(m => m.id === animId);
        if (!item || !_map) return;

        // Get group ID
        const sel = StudioCore.getSelectedItem ? StudioCore.getSelectedItem() : null;
        let groupId = (sel && sel.item && sel.item.type === 'countryGroup') ? sel.item.id : null;
        if (!groupId) {
            const seq = StudioCore.getSequence ? StudioCore.getSequence() : [];
            const g = seq.find(s => s && s.type === 'countryGroup');
            if (!g) {
                if (window.showStudioToast) showStudioToast('Add a country scene first');
                return;
            }
            groupId = g.id;
        }

        const center = _map.getCenter();
        const isFx = item.category === 'effects';
        const stickerProps = {
            animId: item.id,
            animSrc: item.url,
            imageUrl: item.url,
            name: item.name,
            category: item.category,
            size: 72,
            scale: 72 / 64,
            rotation: 0,
            flipX: false,
            animSpeed: 1.0,
            animLoop: true,
            animGlow: isFx,
            animGlowColor: isFx ? '#ff4500' : '#ffd700'
        };

        const ann = StudioCore.addAnnotation(groupId, 'sticker', [center.lng, center.lat], stickerProps);
        if (!ann) return;

        toggleLibrary(false);
        selectSticker(ann.id);
        syncMarkers();
        if (_map) _map.triggerRepaint();

        if (window.showStudioToast) {
            showStudioToast(`Added ${item.name}`);
        }
    }

    // Properties Editor for Sticker
    function renderProperties(stickerId, targetEl) {
        const ann = (StudioCore.getAnnotations ? StudioCore.getAnnotations() : []).find(a => a && a.id === stickerId);
        if (!ann || ann.type !== 'sticker') return;

        const wrap = targetEl || document.getElementById('annEditorBody') || document.getElementById('propsContent') || document.getElementById('properties-panel');
        if (!wrap) return;

        const size = ann.size || 64;
        const rot = ann.rotation || 0;
        const speed = ann.animSpeed || 1.0;
        const glow = !!ann.animGlow;
        const glowColor = ann.animGlowColor || '#ff4500';
        const flip = !!ann.flipX;

        const html = `
            <div class="props-panel-section">
                <div class="props-panel-header">
                    <div class="props-panel-header-left">
                        <span style="font-size:16px;margin-right:6px">✨</span>
                        <span class="props-panel-title">Sticker: ${ann.name || 'Animated Motion'}</span>
                    </div>
                    <button class="props-panel-action-btn" onclick="StudioStickers.deleteSticker('${ann.id}')" title="Delete Sticker" style="color:#ef4444">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
                <div class="props-panel-body" style="padding:14px;">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;">
                        <img src="${ann.animSrc}" alt="" style="width:54px;height:54px;object-fit:contain;background:#151515;border-radius:6px;padding:4px;border:1px solid #333;">
                        <div style="flex:1;">
                            <div style="font-weight:600;font-size:13.5px;color:#fff;">${ann.name}</div>
                            <div style="font-size:11.5px;color:#888;text-transform:capitalize;">Category: ${ann.category || 'Effect'}</div>
                            <button type="button" class="smodal-btn-cancel" onclick="StudioStickers.toggleLibrary(true)" style="padding:3px 8px;font-size:11px;margin-top:4px;">Change Sticker</button>
                        </div>
                    </div>

                    <div class="props-row" style="margin-bottom:12px;">
                        <label class="props-label" style="display:flex;justify-content:space-between;font-size:12px;color:#bbb;margin-bottom:4px;">
                            <span>Size</span>
                            <span id="stkSizeVal">${size}px</span>
                        </label>
                        <input type="range" class="props-slider" min="24" max="256" step="2" value="${size}"
                               oninput="StudioStickers.updateProperty('${ann.id}', 'size', parseInt(this.value)); document.getElementById('stkSizeVal').textContent = this.value + 'px';">
                    </div>

                    <div class="props-row" style="margin-bottom:12px;">
                        <label class="props-label" style="display:flex;justify-content:space-between;font-size:12px;color:#bbb;margin-bottom:4px;">
                            <span>Rotation</span>
                            <span id="stkRotVal">${rot}°</span>
                        </label>
                        <input type="range" class="props-slider" min="0" max="360" step="5" value="${rot}"
                               oninput="StudioStickers.updateProperty('${ann.id}', 'rotation', parseInt(this.value)); document.getElementById('stkRotVal').textContent = this.value + '°';">
                    </div>

                    <div class="props-row" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                        <span style="font-size:12.5px;color:#bbb;">Flip Horizontal</span>
                        <button type="button" class="export-opt ${flip ? 'active' : ''}" style="padding:4px 12px;font-size:12px;"
                                onclick="StudioStickers.updateProperty('${ann.id}', 'flipX', !${flip}); StudioStickers.renderProperties('${ann.id}');">
                            ${flip ? 'Flipped' : 'Normal'}
                        </button>
                    </div>

                    <div class="props-row" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                        <span style="font-size:12.5px;color:#bbb;">Glow Aura</span>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <input type="color" value="${glowColor}" style="width:26px;height:26px;border:none;border-radius:4px;cursor:pointer;background:transparent;"
                                   onchange="StudioStickers.updateProperty('${ann.id}', 'animGlowColor', this.value);">
                            <button type="button" class="export-opt ${glow ? 'active' : ''}" style="padding:4px 10px;font-size:12px;"
                                    onclick="StudioStickers.updateProperty('${ann.id}', 'animGlow', !${glow}); StudioStickers.renderProperties('${ann.id}');">
                                ${glow ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                    <div class="props-row" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <span style="font-size:12.5px;color:#bbb;">Speed</span>
                        <div style="display:flex;gap:4px;">
                            ${[0.5, 1.0, 1.5, 2.0].map(s => `
                                <button type="button" class="export-opt ${Math.abs(speed - s) < 0.1 ? 'active' : ''}" style="padding:4px 8px;font-size:11px;"
                                        onclick="StudioStickers.updateProperty('${ann.id}', 'animSpeed', ${s}); StudioStickers.renderProperties('${ann.id}');">
                                    ${s}x
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        wrap.innerHTML = html;
        if (typeof _panelBaslik === 'function') {
            _panelBaslik('Sticker Properties');
        }
    }

    function updateProperty(id, key, val) {
        if (typeof StudioCore !== 'undefined' && StudioCore.updateAnnotation) {
            StudioCore.updateAnnotation(id, key, val);
        }
        syncMarkers();
        if (_map) _map.triggerRepaint();
    }

    function deleteSticker(id) {
        if (typeof StudioCore !== 'undefined') {
            if (StudioCore.removeAnnotation) StudioCore.removeAnnotation(id);
            else if (StudioCore.deleteAnnotation) StudioCore.deleteAnnotation(id);
        }
        if (_markers.has(id)) {
            try { _markers.get(id).remove(); } catch (_) {}
            _markers.delete(id);
        }
        if (typeof StudioProperties !== 'undefined' && StudioProperties.closeAnnotationEditor) {
            StudioProperties.closeAnnotationEditor();
        }
        const panel = document.getElementById('annEditorPanel');
        if (panel) panel.classList.remove('open');
        syncMarkers();
        if (_map) _map.triggerRepaint();
    }

    return {
        init,
        loadManifest,
        getManifest,
        syncMarkers,
        toggleLibrary,
        openCategory,
        searchStickers,
        addSticker,
        selectSticker,
        renderProperties,
        updateProperty,
        deleteSticker,
        isLibraryOpen: () => _isOpen
    };
})();

window.StudioStickers = StudioStickers;
