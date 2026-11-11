/**
 * StudioAtlas - Icons, Travel Routes and Historical Borders
 *
 * Adds three authoring tools to the studio, modelled on the AtlasAnimation editor:
 *   - Icons    : a procedurally drawn icon library (plain / badge / pin looks, any colour)
 *   - Routes   : click-to-draw travel routes (or import a GPX track) with animated draw-on
 *                and stop markers that pop in as the line reaches them
 *   - History  : world borders at 12 different years (1500 -> 2000), previewed on the map and
 *                addable to the timeline as regions
 *
 * Everything is stored as ordinary studio annotations / regions, so it saves, undoes,
 * previews and exports through the existing pipeline with no extra render hooks:
 *   icon   -> 'image' annotation (SVG data URL)
 *   route  -> 'arrow' annotation with Bezier `anchors` + 'draw' animation (+ image stop markers)
 *   region -> custom polygon region (StudioCore.addCustomPolygonGroup)
 */
const StudioAtlas = (() => {
    'use strict';

    const HISTORY_YEARS = [1500, 1650, 1815, 1880, 1914, 1938, 1942, 1945, 1960, 1975, 1991, 2000];
    const HISTORY_URL = (y) => `/static/data/atlas_history/${y}.json`;
    const ACCENT = '#d4a957';

    // ------------------------------------------------------------------ helpers
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const toast = (m) => { try { if (window.showStudioToast) return window.showStudioToast(m); } catch (_) {} console.log('[StudioAtlas]', m); };
    const getMap = () => (typeof StudioMap !== 'undefined' && StudioMap.getMap ? StudioMap.getMap() : null);

    function targetGroupId() {
        if (typeof StudioCore === 'undefined') return null;
        const sel = StudioCore.getSelectedItem ? StudioCore.getSelectedItem() : null;
        if (sel && sel.item && sel.item.type === 'countryGroup') return sel.item.id;
        const seq = StudioCore.getSequence ? StudioCore.getSequence() : [];
        const g = seq.find((s) => s && s.type === 'countryGroup');
        return g ? g.id : null;
    }

    function selectedAnnotationId() {
        try {
            return (StudioProperties.getSelectedAnnotationId && StudioProperties.getSelectedAnnotationId()) || null;
        } catch (_) { return null; }
    }

    function findAnnotation(id) {
        const all = (StudioCore.getAnnotations && StudioCore.getAnnotations()) || [];
        return all.find((a) => a && a.id === id) || null;
    }

    // ------------------------------------------------------------------ icon library
    // Glyphs are authored on a 24x24 grid. Placeholders: C = main colour, W = detail
    // colour (white on plain icons), D = dark detail.
    const star = (n, ro, ri, cx = 12, cy = 12) => {
        let d = '';
        for (let i = 0; i < n * 2; i++) {
            const r = i % 2 === 0 ? ro : ri;
            const a = (Math.PI * i) / n - Math.PI / 2;
            d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2);
        }
        return d + 'Z';
    };

    const GLYPHS = {
        // Places
        pin: { cat: 'Places', name: 'Location pin', svg: '<path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.6 7.5 12.5 7.5 12.5s7.5-6.9 7.5-12.5A7.5 7.5 0 0 0 12 2z" fill="C"/><circle cx="12" cy="9.5" r="3" fill="W"/>' },
        flag: { cat: 'Places', name: 'Flag', svg: '<rect x="4.6" y="2.5" width="2.2" height="19" rx="1.1" fill="C"/><path d="M6.8 4h13l-3.2 4.6 3.2 4.6h-13z" fill="C"/>' },
        star: { cat: 'Places', name: 'Star', svg: `<path d="${star(5, 10, 4.3)}" fill="C"/>` },
        target: { cat: 'Places', name: 'Target', svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="C" stroke-width="2.4"/><circle cx="12" cy="12" r="4.8" fill="none" stroke="C" stroke-width="2.4"/><circle cx="12" cy="12" r="1.9" fill="C"/>' },
        pulse: { cat: 'Places', name: 'Pulse ring', svg: '<circle cx="12" cy="12" r="10.4" fill="none" stroke="C" stroke-width="1.2" opacity=".35"/><circle cx="12" cy="12" r="7" fill="none" stroke="C" stroke-width="1.6" opacity=".65"/><circle cx="12" cy="12" r="3.4" fill="C"/>' },
        home: { cat: 'Places', name: 'Home', svg: '<path d="M12 2.8L2.4 11.4h3.1V20.5h5v-5.6h3v5.6h5v-9.1h3.1z" fill="C"/>' },
        building: { cat: 'Places', name: 'Building', svg: '<rect x="4.5" y="3" width="10.5" height="18" rx="1.2" fill="C"/><rect x="15" y="9" width="4.8" height="12" rx="1.2" fill="C"/><g fill="W"><rect x="7" y="6" width="2" height="2"/><rect x="11" y="6" width="2" height="2"/><rect x="7" y="10.5" width="2" height="2"/><rect x="11" y="10.5" width="2" height="2"/><rect x="7" y="15" width="2" height="2"/><rect x="11" y="15" width="2" height="2"/></g>' },
        castle: { cat: 'Places', name: 'Castle', svg: '<path d="M3 21V7h3.2v2.6h2.1V7h2.6v2.6h2.2V7h2.6v2.6h2.1V7H21v14z" fill="C"/><path d="M10 21v-4.8a2 2 0 0 1 4 0V21z" fill="W"/>' },
        mountain: { cat: 'Places', name: 'Mountain', svg: '<path d="M1.8 20.2L9.4 5.8l4.2 7.3 2.2-3.2 6.4 10.3z" fill="C"/><path d="M9.4 5.8l-2 3.9 2 1.4 1.6-1.4z" fill="W" opacity=".8"/>' },
        anchor: { cat: 'Places', name: 'Port', svg: '<circle cx="12" cy="5" r="2.4" fill="none" stroke="C" stroke-width="2"/><path d="M12 7.4V20M6.5 11h11M4 14c.4 3.6 3.6 6 8 6s7.6-2.4 8-6" fill="none" stroke="C" stroke-width="2.2" stroke-linecap="round"/>' },
        // Travel & transport
        plane: { cat: 'Transport', name: 'Airplane', svg: '<path d="M21 14.6v-1.9L13.6 8V3.8a1.6 1.6 0 0 0-3.2 0V8L3 12.7v1.9l7.4-2.2v4.6l-2 1.6v1.5l3.6-1 3.6 1v-1.5l-2-1.6v-4.6z" fill="C"/>' },
        ship: { cat: 'Transport', name: 'Ship', svg: '<path d="M2.6 15.2h18.8l-2.6 5H5.2z" fill="C"/><path d="M11 3.5v8.7H5.2z" fill="C"/><path d="M13 6.5v5.7h5.4z" fill="C"/>' },
        car: { cat: 'Transport', name: 'Car', svg: '<path d="M2.6 15.5V12l2.2-4.6A2 2 0 0 1 6.6 6.3h10.8a2 2 0 0 1 1.8 1.1L21.4 12v3.5z" fill="C"/><path d="M6.4 8.2l-1.3 3h13.8l-1.3-3z" fill="W" opacity=".85"/><circle cx="7" cy="16.4" r="2.4" fill="D"/><circle cx="17" cy="16.4" r="2.4" fill="D"/>' },
        bus: { cat: 'Transport', name: 'Bus', svg: '<rect x="3" y="4.5" width="18" height="13" rx="2.2" fill="C"/><rect x="5" y="7" width="14" height="4.6" rx="1" fill="W" opacity=".85"/><circle cx="7.6" cy="18" r="2" fill="D"/><circle cx="16.4" cy="18" r="2" fill="D"/>' },
        train: { cat: 'Transport', name: 'Train', svg: '<rect x="5" y="3" width="14" height="15" rx="4" fill="C"/><rect x="7.2" y="6" width="9.6" height="5" rx="1.2" fill="W" opacity=".85"/><circle cx="9" cy="14.6" r="1.2" fill="W"/><circle cx="15" cy="14.6" r="1.2" fill="W"/><path d="M7 21l2-3M17 21l-2-3" stroke="C" stroke-width="2" stroke-linecap="round"/>' },
        rocket: { cat: 'Transport', name: 'Rocket', svg: '<path d="M12 2c3 2.4 4.6 6 4.6 10l2 3v3.2l-3.6-1.6H9L5.4 18.2V15l2-3c0-4 1.6-7.6 4.6-10z" fill="C"/><circle cx="12" cy="10" r="2.1" fill="W"/><path d="M10 19.5c.4 1.4 1 2.2 2 2.6 1-.4 1.6-1.2 2-2.6z" fill="D" opacity=".7"/>' },
        arrow: { cat: 'Transport', name: 'Arrow', svg: '<path d="M3 9.8h11V4.8l8 7.2-8 7.2v-5H3z" fill="C"/>' },
        // Military & events
        tank: { cat: 'Conflict', name: 'Tank', svg: '<rect x="2.6" y="14" width="18.8" height="5.2" rx="2.6" fill="C"/><rect x="7" y="8.8" width="9.4" height="5.4" rx="1.6" fill="C"/><rect x="15.2" y="10.2" width="7.4" height="2" rx=".8" fill="C"/>' },
        shield: { cat: 'Conflict', name: 'Shield', svg: '<path d="M12 2.4l8 3v6.2c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V5.4z" fill="C"/><path d="M12 5.2v14.2c2.8-1.2 5-3.8 5.4-7.4V7.2z" fill="W" opacity=".28"/>' },
        burst: { cat: 'Conflict', name: 'Explosion', svg: `<path d="${star(10, 10.6, 5.2)}" fill="C"/><path d="${star(10, 6, 3)}" fill="W" opacity=".85"/>` },
        fire: { cat: 'Conflict', name: 'Fire', svg: '<path d="M12 2c.6 3.6 4.7 5.6 4.7 10.3A4.7 4.7 0 0 1 12 17.2c-3.1 0-5.2-2.3-5.2-5.2 0-2.1 1-3.1 1.9-4.2.3 1.6 1.2 2.3 2.3 2.5C10.9 8.1 10.6 5 12 2z" fill="C"/><path d="M12 11.5c.3 1.6 1.9 2.2 1.9 4a1.9 1.9 0 0 1-3.8 0c0-1 .5-1.6 1-2.2.3.5.6.7.9.7-.1-.8-.1-1.7 0-2.5z" fill="W" opacity=".9"/>' },
        bomb: { cat: 'Conflict', name: 'Bomb', svg: '<circle cx="10.6" cy="14" r="7" fill="C"/><path d="M15.4 8.8l2.6-2.6M18 3.4l.5 1.7 1.7.5-1.4 1.1-.2 1.8-1.4-1.1-1.7.4.8-1.6z" fill="none" stroke="D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="11.6" r="1.7" fill="W" opacity=".55"/>' },
        skull: { cat: 'Conflict', name: 'Danger', svg: '<path d="M12 2.4C7.2 2.4 4 5.8 4 10.2c0 2.6 1.2 4.4 3 5.5V19a1.6 1.6 0 0 0 1.6 1.6h6.8A1.6 1.6 0 0 0 17 19v-3.3c1.8-1.1 3-2.9 3-5.5 0-4.4-3.2-7.8-8-7.8z" fill="C"/><circle cx="8.8" cy="10.6" r="2.2" fill="W"/><circle cx="15.2" cy="10.6" r="2.2" fill="W"/><path d="M12 12.8l-1.2 2.4h2.4z" fill="W"/>' },
        warning: { cat: 'Conflict', name: 'Warning', svg: '<path d="M12 2.6L22.2 20.4H1.8z" fill="C" stroke="C" stroke-width="1.2" stroke-linejoin="round"/><rect x="11" y="8.6" width="2" height="6" rx="1" fill="W"/><circle cx="12" cy="17.4" r="1.2" fill="W"/>' },
        // Info
        info: { cat: 'Info', name: 'Info', svg: '<circle cx="12" cy="12" r="10" fill="C"/><circle cx="12" cy="7.6" r="1.4" fill="W"/><rect x="10.9" y="10.4" width="2.2" height="7" rx="1.1" fill="W"/>' },
        question: { cat: 'Info', name: 'Question', svg: '<circle cx="12" cy="12" r="10" fill="C"/><path d="M9.2 9.4a2.9 2.9 0 1 1 4.3 2.5c-.9.5-1.5 1.1-1.5 2.1" fill="none" stroke="W" stroke-width="2.1" stroke-linecap="round"/><circle cx="12" cy="17.3" r="1.25" fill="W"/>' },
        check: { cat: 'Info', name: 'Check', svg: '<circle cx="12" cy="12" r="10" fill="C"/><path d="M7 12.4l3.3 3.3L17 8.8" fill="none" stroke="W" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' },
        cross: { cat: 'Info', name: 'Cross', svg: '<circle cx="12" cy="12" r="10" fill="C"/><path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="W" stroke-width="2.4" stroke-linecap="round"/>' },
        heart: { cat: 'Info', name: 'Heart', svg: '<path d="M12 21.2S2.6 15.2 2.6 8.9A5.2 5.2 0 0 1 12 6.2a5.2 5.2 0 0 1 9.4 2.7c0 6.3-9.4 12.3-9.4 12.3z" fill="C"/>' },
        clock: { cat: 'Info', name: 'Clock', svg: '<circle cx="12" cy="12" r="10" fill="C"/><path d="M12 6.4V12l3.8 2.2" fill="none" stroke="W" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' },
        camera: { cat: 'Info', name: 'Camera', svg: '<path d="M8.4 5l1.2-1.8h4.8L15.6 5H19a2.4 2.4 0 0 1 2.4 2.4v10.2A2.4 2.4 0 0 1 19 20H5a2.4 2.4 0 0 1-2.4-2.4V7.4A2.4 2.4 0 0 1 5 5z" fill="C"/><circle cx="12" cy="12.4" r="3.9" fill="W"/><circle cx="12" cy="12.4" r="2" fill="C"/>' },
        crown: { cat: 'Info', name: 'Crown', svg: '<path d="M2.8 18.6L2.2 7.2l5.2 4.6L12 3.8l4.6 8 5.2-4.6-.6 11.4z" fill="C"/>' },
        person: { cat: 'Info', name: 'Person', svg: '<circle cx="12" cy="7" r="4" fill="C"/><path d="M4.4 21c0-4.5 3.4-7.6 7.6-7.6s7.6 3.1 7.6 7.6z" fill="C"/>' },
        // Nature & weather
        tree: { cat: 'Nature', name: 'Tree', svg: '<circle cx="12" cy="9.2" r="6.8" fill="C"/><rect x="10.7" y="13.5" width="2.6" height="8" rx="1" fill="D"/>' },
        sun: { cat: 'Nature', name: 'Sun', svg: '<circle cx="12" cy="12" r="4.6" fill="C"/><path d="M12 2.4v3M12 18.6v3M2.4 12h3M18.6 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" stroke="C" stroke-width="2" stroke-linecap="round"/>' },
        cloud: { cat: 'Nature', name: 'Cloud', svg: '<path d="M7 19.4a4.6 4.6 0 0 1-.5-9.2A6.1 6.1 0 0 1 18.2 9.7 4.9 4.9 0 0 1 17.6 19.4z" fill="C"/>' },
        drop: { cat: 'Nature', name: 'Water drop', svg: '<path d="M12 2.4C9 7 6 10.2 6 14.2a6 6 0 0 0 12 0c0-4-3-7.2-6-11.8z" fill="C"/>' },
        wave: { cat: 'Nature', name: 'Waves', svg: '<path d="M2 9c2.5-2.4 4.5-2.4 7 0s4.5 2.4 7 0 3.5-2 6 0M2 14.5c2.5-2.4 4.5-2.4 7 0s4.5 2.4 7 0 3.5-2 6 0M2 20c2.5-2.4 4.5-2.4 7 0s4.5 2.4 7 0 3.5-2 6 0" fill="none" stroke="C" stroke-width="2.2" stroke-linecap="round"/>' },
    };

    const ICON_STYLES = [
        { id: 'plain', label: 'Plain' },
        { id: 'badge', label: 'Badge' },
        { id: 'pin', label: 'Pin' },
    ];

    const ICON_COLORS = ['#ff4d4d', '#ff9f45', '#ffd23f', '#2fd8a5', '#38bdf8', '#4d8dff', '#9b7bff', '#ff6fd8', '#ffffff', '#16181d'];

    function applyColors(markup, main, detail, dark) {
        // Placeholder attributes are exactly fill="C" / stroke="C" etc.
        return markup
            .replace(/(fill|stroke)="C"/g, `$1="${main}"`)
            .replace(/(fill|stroke)="W"/g, `$1="${detail}"`)
            .replace(/(fill|stroke)="D"/g, `$1="${dark}"`);
    }

    /** Build a standalone SVG string for an icon. */
    function iconSvg(glyphId, style, color) {
        const g = GLYPHS[glyphId] || GLYPHS.pin;
        const size = 128;
        const shadow = '<filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0.9" stdDeviation="0.9" flood-color="#000" flood-opacity=".45"/></filter>';
        let body;
        if (style === 'badge') {
            // white glyph on a coloured disc
            const glyph = applyColors(g.svg, '#ffffff', color, color);
            body = `<circle cx="12" cy="12" r="11" fill="${color}" stroke="#fff" stroke-width="1.3"/><g transform="translate(12 12) scale(.62) translate(-12 -12)">${glyph}</g>`;
        } else if (style === 'pin') {
            const glyph = applyColors(g.svg, '#ffffff', color, color);
            body = `<path d="M12 .9a8.7 8.7 0 0 0-8.7 8.7c0 6.4 8.7 14.1 8.7 14.1s8.7-7.7 8.7-14.1A8.7 8.7 0 0 0 12 .9z" fill="${color}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/><g transform="translate(12 9.5) scale(.5) translate(-12 -12)">${glyph}</g>`;
        } else {
            body = applyColors(g.svg, color, '#ffffff', '#1f2937');
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><defs>${shadow}</defs><g filter="url(#s)">${body}</g></svg>`;
    }

    const svgToDataUrl = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    const iconDataUrl = (glyphId, style, color) => svgToDataUrl(iconSvg(glyphId, style, color));

    // ------------------------------------------------------------------ panel state
    const state = {
        open: false,
        tab: 'icons',
        iconStyle: 'badge',
        iconColor: '#ff4d4d',
        iconSize: 0.45,
        iconSearch: '',
        // route
        routeColor: '#4d8dff',
        routeThickness: 8,
        routeStyle: 'solid',
        routeSmooth: true,
        routeHead: true,
        routeDuration: 3.5,
        routeMarkers: true,
        routeMarkerIcon: 'pulse',
        drawing: false,
        points: [],
        // history
        year: null,
        historyOpacity: 0.55,
        historyFilter: '',
        historyCache: new Map(),
        historyData: null,
        historyBusy: false,
    };

    // ------------------------------------------------------------------ annotation creation
    function addIcon(glyphId) {
        const map = getMap();
        const gid = targetGroupId();
        if (!map || !gid) { toast('Add a country scene first'); return null; }
        const url = iconDataUrl(glyphId, state.iconStyle, state.iconColor);
        const c = map.getCenter();
        const ann = StudioCore.addAnnotation(gid, 'image', [c.lng, c.lat]);
        if (!ann) return null;
        StudioCore.updateAnnotation(ann.id, 'imageUrl', url);
        StudioCore.updateAnnotation(ann.id, 'scale', state.iconSize);
        StudioCore.updateAnnotation(ann.id, 'name', GLYPHS[glyphId].name);
        StudioCore.updateAnnotation(ann.id, 'atlasIcon', { glyph: glyphId, style: state.iconStyle, color: state.iconColor });
        if (StudioMap.loadAnnotationImage) StudioMap.loadAnnotationImage(ann.id, url);
        try { StudioProperties.selectAnnotation(ann.id); } catch (_) {}
        map.triggerRepaint();
        toast(`Added ${GLYPHS[glyphId].name} icon`);
        renderPanel();
        return ann;
    }

    function restyleSelectedIcon(patch) {
        const id = selectedAnnotationId();
        const ann = id && findAnnotation(id);
        if (!ann || !ann.atlasIcon) return;
        const meta = Object.assign({}, ann.atlasIcon, patch);
        const url = iconDataUrl(meta.glyph, meta.style, meta.color);
        StudioCore.updateAnnotation(ann.id, 'atlasIcon', meta);
        StudioCore.updateAnnotation(ann.id, 'imageUrl', url);
        if (StudioMap.loadAnnotationImage) StudioMap.loadAnnotationImage(ann.id, url);
        const map = getMap();
        if (map) map.triggerRepaint();
        renderPanel();
    }

    // ------------------------------------------------------------------ route maths
    function smoothAnchors(points, smooth) {
        const n = points.length;
        return points.map((p, i) => {
            const prev = points[Math.max(0, i - 1)];
            const next = points[Math.min(n - 1, i + 1)];
            let ix = p[0], iy = p[1], ox = p[0], oy = p[1];
            if (smooth && n > 2 && i > 0 && i < n - 1) {
                const k = 1 / 6;
                const tx = (next[0] - prev[0]) * k;
                const ty = (next[1] - prev[1]) * k;
                ix = p[0] - tx; iy = p[1] - ty;
                ox = p[0] + tx; oy = p[1] + ty;
            } else if (smooth && n > 2) {
                // end points lean gently toward their neighbour so the curve starts/ends cleanly
                const q = i === 0 ? points[1] : points[n - 2];
                const dx = (q[0] - p[0]) / 6, dy = (q[1] - p[1]) / 6;
                if (i === 0) { ox = p[0] + dx; oy = p[1] + dy; } else { ix = p[0] + dx; iy = p[1] + dy; }
            }
            return { lng: p[0], lat: p[1], inLng: ix, inLat: iy, outLng: ox, outLat: oy };
        });
    }

    function segLen(a, b) {
        // equirectangular is plenty to weight marker timing along a route
        const k = Math.cos(((a[1] + b[1]) / 2) * Math.PI / 180);
        return Math.hypot((b[0] - a[0]) * k, b[1] - a[1]);
    }

    function cumulativeFractions(points) {
        const lens = [0];
        for (let i = 1; i < points.length; i++) lens.push(lens[i - 1] + segLen(points[i - 1], points[i]));
        const total = lens[lens.length - 1] || 1;
        return lens.map((l) => l / total);
    }

    function routeKm(points) {
        try {
            return turf.length({ type: 'Feature', geometry: { type: 'LineString', coordinates: points }, properties: {} }, { units: 'kilometers' });
        } catch (_) { return 0; }
    }

    function simplifyPoints(points, maxPoints) {
        if (points.length <= maxPoints) return points;
        try {
            const line = turf.lineString(points);
            let tol = 0.0005;
            let out = points;
            for (let i = 0; i < 18 && out.length > maxPoints; i++) {
                out = turf.simplify(line, { tolerance: tol, highQuality: false }).geometry.coordinates;
                tol *= 1.7;
            }
            return out;
        } catch (_) {
            const step = Math.ceil(points.length / maxPoints);
            return points.filter((_, i) => i % step === 0 || i === points.length - 1);
        }
    }

    function commitRoute(points, opts = {}) {
        const map = getMap();
        const gid = targetGroupId();
        if (!map || !gid) { toast('Add a country scene first'); return null; }
        if (!points || points.length < 2) { toast('A route needs at least two points'); return null; }

        const smooth = opts.smooth !== undefined ? opts.smooth : state.routeSmooth;
        const duration = opts.duration || state.routeDuration;
        const anchors = smoothAnchors(points, smooth);
        const first = points[0];
        const last = points[points.length - 1];

        const ann = StudioCore.addAnnotation(gid, 'arrow', first, {
            from: first.slice(),
            to: last.slice(),
            anchors,
            curveAmount: 0,
            color: state.routeColor,
            thickness: state.routeThickness,
            style: state.routeStyle,
            startHead: 'none',
            endHead: state.routeHead ? 'triangle' : 'none',
            headSize: Math.round(state.routeThickness * 3.4),
            animationType: 'draw',
            animationDuration: duration,
            animationDelay: 0,
            animationEasing: 'easeInOut',
            name: opts.name || 'Route',
            atlasRoute: true,
        });
        if (!ann) return null;

        if (state.routeMarkers) {
            const fr = cumulativeFractions(points);
            const url = iconDataUrl(state.routeMarkerIcon, 'plain', state.routeColor);
            points.forEach((p, i) => {
                // only mark the stops the user clicked, not every vertex of an imported GPX
                if (opts.markEnds ? !(i === 0 || i === points.length - 1) : false) return;
                const m = StudioCore.addAnnotation(gid, 'image', p);
                if (!m) return;
                StudioCore.updateAnnotation(m.id, 'imageUrl', url);
                StudioCore.updateAnnotation(m.id, 'scale', 0.28);
                StudioCore.updateAnnotation(m.id, 'name', `Stop ${i + 1}`);
                StudioCore.updateAnnotation(m.id, 'animationType', 'fadeIn');
                StudioCore.updateAnnotation(m.id, 'animationDuration', 0.5);
                StudioCore.updateAnnotation(m.id, 'animationDelay', +(fr[i] * duration).toFixed(2));
                StudioCore.updateAnnotation(m.id, 'atlasRouteStop', ann.id);
                if (StudioMap.loadAnnotationImage) StudioMap.loadAnnotationImage(m.id, url);
            });
        }

        try { StudioProperties.selectAnnotation(ann.id); } catch (_) {}
        map.triggerRepaint();
        toast(`Route added (${Math.round(routeKm(points)).toLocaleString()} km)`);
        return ann;
    }

    // ------------------------------------------------------------------ route drawing
    const PREVIEW_SRC = 'atlas-route-preview';
    let drawCleanup = null;

    function previewData(extra) {
        const pts = extra ? state.points.concat([extra]) : state.points;
        const feats = [];
        if (pts.length >= 2) feats.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: pts } });
        state.points.forEach((p, i) => feats.push({ type: 'Feature', properties: { n: i + 1 }, geometry: { type: 'Point', coordinates: p } }));
        return { type: 'FeatureCollection', features: feats };
    }

    function ensurePreviewLayers(map) {
        if (map.getSource(PREVIEW_SRC)) return;
        map.addSource(PREVIEW_SRC, { type: 'geojson', data: previewData() });
        map.addLayer({ id: PREVIEW_SRC + '-line', type: 'line', source: PREVIEW_SRC, filter: ['==', '$type', 'LineString'], paint: { 'line-color': state.routeColor, 'line-width': 4, 'line-dasharray': [2, 1.5] }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
        map.addLayer({ id: PREVIEW_SRC + '-pts', type: 'circle', source: PREVIEW_SRC, filter: ['==', '$type', 'Point'], paint: { 'circle-radius': 6, 'circle-color': '#ffffff', 'circle-stroke-color': state.routeColor, 'circle-stroke-width': 3 } });
    }

    function refreshPreview(extra) {
        const map = getMap();
        if (!map) return;
        ensurePreviewLayers(map);
        const src = map.getSource(PREVIEW_SRC);
        if (src) src.setData(previewData(extra));
        if (map.getLayer(PREVIEW_SRC + '-line')) map.setPaintProperty(PREVIEW_SRC + '-line', 'line-color', state.routeColor);
        if (map.getLayer(PREVIEW_SRC + '-pts')) map.setPaintProperty(PREVIEW_SRC + '-pts', 'circle-stroke-color', state.routeColor);
    }

    function removePreview() {
        const map = getMap();
        if (!map) return;
        [PREVIEW_SRC + '-line', PREVIEW_SRC + '-pts'].forEach((l) => { if (map.getLayer(l)) map.removeLayer(l); });
        if (map.getSource(PREVIEW_SRC)) map.removeSource(PREVIEW_SRC);
    }

    function startDrawing() {
        const map = getMap();
        if (!map) return;
        if (!targetGroupId()) { toast('Add a country scene first'); return; }
        if (state.drawing) return;
        state.drawing = true;
        state.points = [];
        const container = map.getContainer();
        const canvas = map.getCanvas();
        container.classList.add('atlas-drawing');
        map.doubleClickZoom.disable();

        let down = null;
        const toLngLat = (e) => {
            const r = canvas.getBoundingClientRect();
            const ll = map.unproject([e.clientX - r.left, e.clientY - r.top]);
            return [+ll.lng.toFixed(5), +ll.lat.toFixed(5)];
        };
        const onDown = (e) => { down = { x: e.clientX, y: e.clientY }; };
        const onClickCapture = (e) => {
            // Swallow the click so the studio's own select/pen tools never see it.
            e.stopPropagation();
            e.preventDefault();
            if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) return; // it was a pan
            const p = toLngLat(e);
            const lastPt = state.points[state.points.length - 1];
            if (lastPt && Math.abs(lastPt[0] - p[0]) < 1e-5 && Math.abs(lastPt[1] - p[1]) < 1e-5) return;
            state.points.push(p);
            refreshPreview();
            renderPanel();
        };
        const onDblCapture = (e) => { e.stopPropagation(); e.preventDefault(); finishDrawing(); };
        const onMove = (e) => { if (state.points.length) refreshPreview(toLngLat(e)); };
        const onKey = (e) => {
            if (!state.drawing) return;
            const tag = (e.target && e.target.tagName) || '';
            if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
            if (e.key === 'Enter') { e.preventDefault(); finishDrawing(); }
            else if (e.key === 'Escape') { e.preventDefault(); cancelDrawing(); }
            else if (e.key === 'Backspace') { e.preventDefault(); state.points.pop(); refreshPreview(); renderPanel(); }
        };

        container.addEventListener('mousedown', onDown, true);
        container.addEventListener('click', onClickCapture, true);
        container.addEventListener('dblclick', onDblCapture, true);
        container.addEventListener('mousemove', onMove, true);
        document.addEventListener('keydown', onKey, true);

        drawCleanup = () => {
            container.removeEventListener('mousedown', onDown, true);
            container.removeEventListener('click', onClickCapture, true);
            container.removeEventListener('dblclick', onDblCapture, true);
            container.removeEventListener('mousemove', onMove, true);
            document.removeEventListener('keydown', onKey, true);
            container.classList.remove('atlas-drawing');
            map.doubleClickZoom.enable();
        };
        ensurePreviewLayers(map);
        renderPanel();
        toast('Click the map to add stops · Enter or double-click to finish');
    }

    function stopDrawing() {
        if (drawCleanup) { drawCleanup(); drawCleanup = null; }
        state.drawing = false;
        state.points = [];
        removePreview();
    }

    function finishDrawing() {
        if (!state.drawing) return;
        // a double-click also fires two clicks, which can leave a duplicate trailing point
        const pts = state.points.slice();
        stopDrawing();
        if (pts.length < 2) { toast('Route cancelled - it needs at least two points'); renderPanel(); return; }
        commitRoute(pts);
        renderPanel();
    }

    function cancelDrawing() {
        stopDrawing();
        renderPanel();
    }

    // ------------------------------------------------------------------ GPX import
    function parseGpx(text) {
        const doc = new DOMParser().parseFromString(text, 'application/xml');
        if (doc.querySelector('parsererror')) throw new Error('Not a valid GPX file');
        const grab = (sel, attr) => [...doc.querySelectorAll(sel)]
            .map((n) => [parseFloat(n.getAttribute('lon')), parseFloat(n.getAttribute('lat'))])
            .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]) && Math.abs(p[1]) <= 90 && Math.abs(p[0]) <= 180);
        let pts = grab('trkpt');
        if (pts.length < 2) pts = grab('rtept');
        if (pts.length < 2) throw new Error('No track or route points found in this file');
        const nameNode = doc.querySelector('trk > name, rte > name, metadata > name');
        return { points: pts, name: nameNode ? nameNode.textContent.trim().slice(0, 60) : 'GPX route' };
    }

    function importGpx() {
        if (!targetGroupId()) { toast('Add a country scene first'); return; }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.gpx,application/gpx+xml,text/xml';
        input.onchange = async () => {
            const file = input.files && input.files[0];
            if (!file) return;
            try {
                if (file.size > 15 * 1024 * 1024) throw new Error('File is larger than 15 MB');
                const { points, name } = parseGpx(await file.text());
                const simple = simplifyPoints(points, 80);
                const map = getMap();
                const ann = commitRoute(simple, { smooth: false, name, markEnds: true });
                if (ann && map) {
                    const b = new maplibregl.LngLatBounds();
                    simple.forEach((p) => b.extend(p));
                    map.fitBounds(b, { padding: 80, duration: 600 });
                }
            } catch (err) {
                toast(err.message || 'Could not read that GPX file');
            }
        };
        input.click();
    }

    // ------------------------------------------------------------------ history
    const HISTORY_SRC = 'atlas-history';

    function nameColor(name) {
        let h = 0;
        for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
        return `hsl(${Math.round(((h * 0.61803398875) % 1) * 360)}, 55%, 55%)`;
    }

    const closeRing = (ring) => {
        if (!ring.length) return ring;
        const a = ring[0], b = ring[ring.length - 1];
        return a[0] === b[0] && a[1] === b[1] ? ring : ring.concat([a]);
    };

    function normalizeHistory(raw) {
        if (!raw || !Array.isArray(raw.features)) return null;
        const feats = [];
        for (const f of raw.features) {
            if (!f || typeof f.name !== 'string' || !Array.isArray(f.rings) || !f.rings.length) continue;
            feats.push({ name: f.name, rings: f.rings.map(closeRing), label: Array.isArray(f.label) ? f.label : null, color: nameColor(f.name) });
        }
        return { year: Number(raw.year), source: raw.source || '', features: feats };
    }

    async function loadYear(year) {
        if (state.historyCache.has(year)) return state.historyCache.get(year);
        const res = await fetch(HISTORY_URL(year));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = normalizeHistory(await res.json());
        if (!data) throw new Error('Unreadable history file');
        state.historyCache.set(year, data);
        return data;
    }

    function historyGeoJSON(data) {
        return {
            type: 'FeatureCollection',
            features: data.features.map((f) => ({
                type: 'Feature',
                properties: { name: f.name, color: f.color },
                geometry: { type: 'MultiPolygon', coordinates: f.rings.map((r) => [r]) },
            })),
        };
    }


    // Labels are HTML markers rather than a symbol layer: the studio draws all of its own text on
    // canvas and ships no glyph server, so a symbol layer would depend on a remote font host.
    let historyMarkers = [];
    let historyMoveHandler = null;

    function clearHistoryMarkers() {
        historyMarkers.forEach((m) => m.remove());
        historyMarkers = [];
    }

    function refreshHistoryMarkers() {
        const map = getMap();
        clearHistoryMarkers();
        if (!map || !state.historyData) return;
        const b = map.getBounds();
        const zoom = map.getZoom();
        const MAX = 70;
        for (const f of state.historyData.features) {
            if (!f.label || historyMarkers.length >= MAX) continue;
            const [lng, lat] = f.label;
            if (lng < b.getWest() || lng > b.getEast() || lat < b.getSouth() || lat > b.getNorth()) continue;
            // skip tiny states when zoomed far out so labels do not pile up
            const [w, s, e, n] = ringsBounds(f.rings);
            if (Math.max(e - w, n - s) * Math.pow(2, zoom) < 40) continue;
            const el = document.createElement('div');
            el.textContent = f.name;
            el.style.cssText = 'color:#fff;font:600 11px Inter,system-ui,sans-serif;text-shadow:0 0 3px #000,0 0 3px #000,0 1px 2px #000;white-space:nowrap;pointer-events:none;max-width:140px;overflow:hidden;text-overflow:ellipsis';
            historyMarkers.push(new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(map));
        }
    }

    function drawHistoryLayers() {
        const map = getMap();
        if (!map || !state.historyData) return;
        const fills = historyGeoJSON(state.historyData);
        if (map.getSource(HISTORY_SRC)) {
            map.getSource(HISTORY_SRC).setData(fills);
        } else {
            map.addSource(HISTORY_SRC, { type: 'geojson', data: fills });
            map.addLayer({ id: HISTORY_SRC + '-fill', type: 'fill', source: HISTORY_SRC, paint: { 'fill-color': ['get', 'color'], 'fill-opacity': state.historyOpacity } });
            map.addLayer({ id: HISTORY_SRC + '-line', type: 'line', source: HISTORY_SRC, paint: { 'line-color': '#ffffff', 'line-width': 1.2, 'line-opacity': 0.85 } });
        }
        map.setPaintProperty(HISTORY_SRC + '-fill', 'fill-opacity', state.historyOpacity);
        if (!historyMoveHandler) {
            historyMoveHandler = () => refreshHistoryMarkers();
            map.on('moveend', historyMoveHandler);
        }
        refreshHistoryMarkers();
    }

    function removeHistoryLayers() {
        const map = getMap();
        clearHistoryMarkers();
        if (!map) return;
        if (historyMoveHandler) { map.off('moveend', historyMoveHandler); historyMoveHandler = null; }
        ['-line', '-fill'].forEach((s) => { if (map.getLayer(HISTORY_SRC + s)) map.removeLayer(HISTORY_SRC + s); });
        if (map.getSource(HISTORY_SRC)) map.removeSource(HISTORY_SRC);
    }

    async function selectYear(year) {
        state.historyBusy = true;
        state.year = year;
        renderPanel();
        try {
            state.historyData = await loadYear(year);
            drawHistoryLayers();
        } catch (err) {
            state.historyData = null;
            toast(`Could not load ${year}: ${err.message}`);
        }
        state.historyBusy = false;
        renderPanel();
    }

    function ringsBounds(rings) {
        let w = 180, s = 90, e = -180, n = -90;
        for (const r of rings) for (const [x, y] of r) { if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y; }
        return [w, s, e, n];
    }

    function focusEntity(name) {
        const f = state.historyData && state.historyData.features.find((x) => x.name === name);
        const map = getMap();
        if (!f || !map) return;
        const [w, s, e, n] = ringsBounds(f.rings);
        map.fitBounds([[w, s], [e, n]], { padding: 90, duration: 700, maxZoom: 8 });
    }

    function entityGeometry(f) {
        return { type: 'MultiPolygon', coordinates: f.rings.map((r) => [r]) };
    }

    function addEntityAsScene(name) {
        const f = state.historyData && state.historyData.features.find((x) => x.name === name);
        if (!f) return;
        const label = `${f.name} (${state.year})`;
        const g = StudioCore.addCustomPolygonGroup(label, entityGeometry(f), null);
        if (!g) { toast('Could not create a region from that border'); return; }
        recolorGroupRegions(g.id, f.color);
        toast(`Added ${label}`);
    }

    function recolorGroupRegions(groupId, hsl) {
        try {
            const hex = hslToHex(hsl);
            const seq = StudioCore.getSequence();
            const group = seq.find((s) => s && s.id === groupId);
            if (!group) return;
            group.countries.forEach((c, idx) => StudioCore.updateCountryProperty(groupId, idx, 'fillColor', hex));
        } catch (_) { /* colour is cosmetic */ }
    }

    function hslToHex(hsl) {
        const m = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(hsl);
        if (!m) return '#e30a17';
        const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
        const f = (n) => {
            const k = (n + h * 12) % 12;
            const a = s * Math.min(l, 1 - l);
            const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
            return Math.round(c * 255).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function inView(f) {
        const map = getMap();
        if (!map) return true;
        const b = map.getBounds();
        const [w, s, e, n] = ringsBounds(f.rings);
        return !(e < b.getWest() || w > b.getEast() || n < b.getSouth() || s > b.getNorth());
    }

    function addVisibleAsScene() {
        const data = state.historyData;
        if (!data) return;
        const MAX = 40;
        const vis = data.features.filter(inView).filter((f) => !state.historyFilter || f.name.toLowerCase().includes(state.historyFilter));
        if (!vis.length) { toast('No borders in the current view'); return; }
        const picked = vis.slice(0, MAX);
        const first = picked[0];
        const g = StudioCore.addCustomPolygonGroup(`${first.name} (${state.year})`, entityGeometry(first), null);
        if (!g) { toast('Could not create the scene'); return; }
        for (let i = 1; i < picked.length; i++) {
            try { StudioCore.addCustomPolygonToGroup(g.id, `${picked[i].name} (${state.year})`, entityGeometry(picked[i]), null); } catch (_) {}
        }
        const seq = StudioCore.getSequence();
        const group = seq.find((s) => s && s.id === g.id);
        if (group) group.countries.forEach((c, idx) => {
            const src = picked[idx];
            if (src) StudioCore.updateCountryProperty(g.id, idx, 'fillColor', hslToHex(src.color));
        });
        toast(`Added ${picked.length} borders from ${state.year}${vis.length > MAX ? ` (first ${MAX} of ${vis.length} in view)` : ''}`);
    }

    // ------------------------------------------------------------------ panel UI
    function injectStyles() {
        if ($('atlasStyles')) return;
        const css = `
        #panelAtlas{display:none;flex-direction:column;width:100%;height:100%;overflow:hidden;background:#16181d;color:#fff;font-size:13px}
        .atl-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #262a31}
        .atl-title{font-weight:600;font-size:14px}
        .atl-x{background:none;border:0;color:#9aa0aa;font-size:20px;cursor:pointer;line-height:1}
        .atl-x:hover{color:#fff}
        .atl-tabs{display:flex;gap:4px;padding:8px 10px;border-bottom:1px solid #262a31}
        .atl-tab{flex:1;padding:7px 4px;border-radius:8px;border:1px solid transparent;background:#1e2128;color:#b6bcc6;cursor:pointer;font-size:12.5px}
        .atl-tab.on{background:rgba(212,169,87,.14);border-color:${ACCENT};color:#fff}
        .atl-body{flex:1;overflow-y:auto;padding:12px 14px 18px}
        .atl-sec{margin-bottom:14px}
        .atl-lbl{display:flex;justify-content:space-between;font-size:11.5px;color:#9aa0aa;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
        .atl-row{display:flex;gap:6px;flex-wrap:wrap}
        .atl-chip{padding:5px 10px;border-radius:999px;background:#1e2128;border:1px solid #2c313a;color:#cfd4dc;cursor:pointer;font-size:12px}
        .atl-chip.on{border-color:${ACCENT};background:rgba(212,169,87,.16);color:#fff}
        .atl-swatch{width:22px;height:22px;border-radius:50%;border:2px solid #2c313a;cursor:pointer;padding:0}
        .atl-swatch.on{border-color:#fff;box-shadow:0 0 0 2px ${ACCENT}}
        .atl-input{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid #2c313a;background:#1e2128;color:#fff;font-size:13px}
        .atl-input:focus{outline:none;border-color:${ACCENT}}
        .atl-range{width:100%;accent-color:${ACCENT}}
        .atl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
        .atl-icon{aspect-ratio:1;border-radius:10px;background:#1e2128;border:1px solid #2c313a;cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center}
        .atl-icon:hover{border-color:${ACCENT};background:#232730}
        .atl-icon img{width:100%;height:100%;object-fit:contain;pointer-events:none}
        .atl-cat{font-size:11px;color:#7d848f;text-transform:uppercase;letter-spacing:.06em;margin:14px 0 8px}
        .atl-btn{width:100%;padding:10px;border-radius:9px;border:0;background:${ACCENT};color:#16181d;font-weight:700;cursor:pointer;font-size:13px}
        .atl-btn:hover{filter:brightness(1.08)}
        .atl-btn.ghost{background:#1e2128;color:#e5e8ee;border:1px solid #2c313a;font-weight:500}
        .atl-btn.danger{background:#3a1d22;color:#ff9aa5;border:1px solid #5a2a31}
        .atl-btn:disabled{opacity:.45;cursor:default}
        .atl-btns{display:flex;flex-direction:column;gap:8px}
        .atl-note{font-size:12px;color:#8f96a1;line-height:1.5}
        .atl-card{background:#1b1e25;border:1px solid #2a2f38;border-radius:10px;padding:10px 12px;margin-bottom:12px}
        .atl-ent{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;cursor:pointer}
        .atl-ent:hover{background:#1e2128}
        .atl-dot{width:11px;height:11px;border-radius:3px;flex:none}
        .atl-ent-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .atl-ent button{opacity:0;background:${ACCENT};color:#16181d;border:0;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer}
        .atl-ent:hover button{opacity:1}
        .atl-years{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
        .atl-year{padding:8px 0;text-align:center;border-radius:8px;background:#1e2128;border:1px solid #2c313a;cursor:pointer;font-size:12.5px;color:#cfd4dc}
        .atl-year.on{border-color:${ACCENT};background:rgba(212,169,87,.16);color:#fff}
        .atl-drawing .maplibregl-canvas{cursor:crosshair!important}
        #tbIcons.active,#tbRoute.active,#tbHistory.active{background:rgba(212,169,87,.18);color:${ACCENT}}`;
        const el = document.createElement('style');
        el.id = 'atlasStyles';
        el.textContent = css;
        document.head.appendChild(el);
    }

    function swatches(current, action) {
        return ICON_COLORS.map((c) => `<button type="button" class="atl-swatch ${c.toLowerCase() === String(current).toLowerCase() ? 'on' : ''}" style="background:${c}" onclick="${action}('${c}')" title="${c}"></button>`).join('')
            + `<input type="color" value="${esc(current)}" style="width:26px;height:26px;border:0;background:none;padding:0;cursor:pointer" oninput="${action}(this.value)" title="Custom colour">`;
    }

    function tabIcons() {
        const q = state.iconSearch.toLowerCase();
        const ids = Object.keys(GLYPHS).filter((id) => !q || GLYPHS[id].name.toLowerCase().includes(q) || GLYPHS[id].cat.toLowerCase().includes(q));
        const cats = [...new Set(ids.map((id) => GLYPHS[id].cat))];
        const selId = selectedAnnotationId();
        const sel = selId && findAnnotation(selId);
        const editing = sel && sel.atlasIcon ? sel.atlasIcon : null;

        const editBox = editing ? `
            <div class="atl-card">
                <div class="atl-lbl"><span>Selected icon · ${esc(GLYPHS[editing.glyph] ? GLYPHS[editing.glyph].name : editing.glyph)}</span></div>
                <div class="atl-row" style="margin-bottom:8px">${ICON_STYLES.map((s) => `<button type="button" class="atl-chip ${editing.style === s.id ? 'on' : ''}" onclick="StudioAtlas.restyleSelected({style:'${s.id}'})">${s.label}</button>`).join('')}</div>
                <div class="atl-row" style="align-items:center">${swatches(editing.color, 'StudioAtlas.recolorSelected')}</div>
            </div>` : '';

        let html = `
            ${editBox}
            <div class="atl-sec"><input class="atl-input" id="atlIconSearch" placeholder="Search icons..." value="${esc(state.iconSearch)}" oninput="StudioAtlas.setIconSearch(this.value)"></div>
            <div class="atl-sec">
                <div class="atl-lbl"><span>Look</span></div>
                <div class="atl-row">${ICON_STYLES.map((s) => `<button type="button" class="atl-chip ${state.iconStyle === s.id ? 'on' : ''}" onclick="StudioAtlas.setIconStyle('${s.id}')">${s.label}</button>`).join('')}</div>
            </div>
            <div class="atl-sec">
                <div class="atl-lbl"><span>Colour</span></div>
                <div class="atl-row" style="align-items:center">${swatches(state.iconColor, 'StudioAtlas.setIconColor')}</div>
            </div>
            <div class="atl-sec">
                <div class="atl-lbl"><span>Size</span><span class="atl-val">${Math.round(state.iconSize * 100)}%</span></div>
                <input class="atl-range" type="range" min="0.15" max="1.2" step="0.05" value="${state.iconSize}" oninput="StudioAtlas.setIconSize(this.value);StudioAtlas.val(this,Math.round(this.value*100)+'%')">
            </div>`;
        for (const cat of cats) {
            html += `<div class="atl-cat">${esc(cat)}</div><div class="atl-grid">` +
                ids.filter((id) => GLYPHS[id].cat === cat).map((id) =>
                    `<button type="button" class="atl-icon" title="${esc(GLYPHS[id].name)}" onclick="StudioAtlas.addIcon('${id}')"><img alt="${esc(GLYPHS[id].name)}" src="${iconDataUrl(id, state.iconStyle, state.iconColor)}"></button>`
                ).join('') + '</div>';
        }
        if (!ids.length) html += '<div class="atl-note" style="margin-top:12px">No icons match your search.</div>';
        html += '<p class="atl-note" style="margin-top:14px">Click an icon to drop it in the middle of the map, then drag it into place. Resize, rotate and animate it from the image properties.</p>';
        return html;
    }

    function tabRoute() {
        const pts = state.points.length;
        const km = pts >= 2 ? Math.round(routeKm(state.points)).toLocaleString() : '0';
        const drawBox = state.drawing
            ? `<div class="atl-card"><div style="font-weight:600;margin-bottom:6px">Drawing route · ${pts} stop${pts === 1 ? '' : 's'} · ${km} km</div>
               <div class="atl-note" style="margin-bottom:10px">Click the map to add stops. Backspace removes the last one, Esc cancels.</div>
               <div class="atl-btns"><button class="atl-btn" ${pts < 2 ? 'disabled' : ''} onclick="StudioAtlas.finishRoute()">Finish route</button>
               <button class="atl-btn ghost" onclick="StudioAtlas.cancelRoute()">Cancel</button></div></div>`
            : `<div class="atl-btns" style="margin-bottom:14px"><button class="atl-btn" onclick="StudioAtlas.startRoute()">Draw a route on the map</button>
               <button class="atl-btn ghost" onclick="StudioAtlas.importGpx()">Import a GPX track</button></div>`;
        const opt = (key, val, label) => `<button type="button" class="atl-chip ${state[key] === val ? 'on' : ''}" onclick="StudioAtlas.setRoute('${key}', ${typeof val === 'string' ? `'${val}'` : val})">${label}</button>`;
        return `
            ${drawBox}
            <div class="atl-sec"><div class="atl-lbl"><span>Line colour</span></div><div class="atl-row" style="align-items:center">${swatches(state.routeColor, 'StudioAtlas.setRouteColor')}</div></div>
            <div class="atl-sec"><div class="atl-lbl"><span>Line style</span></div><div class="atl-row">${opt('routeStyle', 'solid', 'Solid')}${opt('routeStyle', 'dashed', 'Dashed')}${opt('routeStyle', 'dotted', 'Dotted')}</div></div>
            <div class="atl-sec"><div class="atl-lbl"><span>Thickness</span><span class="atl-val">${state.routeThickness}px</span></div><input class="atl-range" type="range" min="2" max="24" step="1" value="${state.routeThickness}" oninput="StudioAtlas.setRoute('routeThickness', +this.value, true);StudioAtlas.val(this,this.value+'px')"></div>
            <div class="atl-sec"><div class="atl-lbl"><span>Draw-on time</span><span class="atl-val">${state.routeDuration}s</span></div><input class="atl-range" type="range" min="1" max="12" step="0.5" value="${state.routeDuration}" oninput="StudioAtlas.setRoute('routeDuration', +this.value, true);StudioAtlas.val(this,this.value+'s')"></div>
            <div class="atl-sec"><div class="atl-row">
                ${opt('routeSmooth', true, 'Curved')}${opt('routeSmooth', false, 'Straight')}
                ${opt('routeHead', true, 'Arrow head')}${opt('routeHead', false, 'No head')}
            </div></div>
            <div class="atl-sec"><div class="atl-lbl"><span>Stop markers</span></div><div class="atl-row">
                ${opt('routeMarkers', true, 'On')}${opt('routeMarkers', false, 'Off')}
            </div></div>
            <div class="atl-sec"><div class="atl-lbl"><span>Marker icon</span></div><div class="atl-row">${['pulse', 'pin', 'target', 'star', 'flag', 'anchor'].map((id) => `<button type="button" class="atl-icon" style="width:44px;${state.routeMarkerIcon === id ? `border-color:${ACCENT}` : ''}" onclick="StudioAtlas.setRoute('routeMarkerIcon','${id}')"><img src="${iconDataUrl(id, 'plain', state.routeColor)}" alt="${id}"></button>`).join('')}</div></div>
            <p class="atl-note">Routes are normal arrows underneath, so you can fine-tune the path with the pen editor, change the animation, copy or delete them like any other annotation. Stop markers appear as the line reaches them.</p>`;
    }

    function tabHistory() {
        const years = `<div class="atl-years">${HISTORY_YEARS.map((y) => `<button type="button" class="atl-year ${state.year === y ? 'on' : ''}" onclick="StudioAtlas.selectYear(${y})">${y}</button>`).join('')}</div>`;
        let body = '';
        if (state.historyBusy) {
            body = '<div class="atl-note" style="margin-top:14px">Loading borders...</div>';
        } else if (state.historyData) {
            const q = state.historyFilter;
            const list = state.historyData.features.filter((f) => !q || f.name.toLowerCase().includes(q));
            body = `
                <div class="atl-sec" style="margin-top:14px"><div class="atl-lbl"><span>Map overlay opacity</span><span class="atl-val">${Math.round(state.historyOpacity * 100)}%</span></div>
                    <input class="atl-range" type="range" min="0.1" max="1" step="0.05" value="${state.historyOpacity}" oninput="StudioAtlas.setHistoryOpacity(this.value);StudioAtlas.val(this,Math.round(this.value*100)+'%')"></div>
                <div class="atl-btns" style="margin-bottom:12px">
                    <button class="atl-btn" onclick="StudioAtlas.addVisible()">Add borders in view as a scene</button>
                    <button class="atl-btn ghost" onclick="StudioAtlas.clearHistory()">Hide overlay</button>
                </div>
                <input class="atl-input" placeholder="Search ${state.historyData.features.length} states and empires..." value="${esc(state.historyFilter)}" oninput="StudioAtlas.setHistoryFilter(this.value)" style="margin-bottom:8px">
                <div>${list.slice(0, 200).map((f) => `
                    <div class="atl-ent" onclick="StudioAtlas.focusEntity(${JSON.stringify(f.name).replace(/"/g, '&quot;')})">
                        <span class="atl-dot" style="background:${f.color}"></span>
                        <span class="atl-ent-name" title="${esc(f.name)}">${esc(f.name)}</span>
                        <button type="button" onclick="event.stopPropagation();StudioAtlas.addEntity(${JSON.stringify(f.name).replace(/"/g, '&quot;')})">Add</button>
                    </div>`).join('')}${list.length > 200 ? `<div class="atl-note" style="padding:8px">Showing 200 of ${list.length} - refine the search.</div>` : ''}${!list.length ? '<div class="atl-note" style="padding:8px">No matches.</div>' : ''}</div>
                <p class="atl-note" style="margin-top:12px">${esc(state.historyData.source)}</p>`;
        } else {
            body = '<p class="atl-note" style="margin-top:14px">Pick a year to see how the world\'s borders looked then. Click a state to zoom to it, or add it to your timeline as a region.</p>';
        }
        return `<div class="atl-sec"><div class="atl-lbl"><span>Year</span></div>${years}</div>${body}`;
    }

    function renderPanel() {
        const panel = $('panelAtlas');
        if (!panel || !state.open) return;
        // keep focus/caret in the search boxes across re-renders
        const active = document.activeElement;
        const focusId = active && active.id;
        const caret = active && active.selectionStart;
        const tabs = [['icons', 'Icons'], ['route', 'Routes'], ['history', 'History']];
        const body = state.tab === 'icons' ? tabIcons() : state.tab === 'route' ? tabRoute() : tabHistory();
        const scroll = panel.querySelector('.atl-body');
        const top = scroll ? scroll.scrollTop : 0;
        panel.innerHTML = `
            <div class="atl-head"><span class="atl-title">Atlas tools</span><button class="atl-x" onclick="StudioAtlas.close()" title="Close">&times;</button></div>
            <div class="atl-tabs">${tabs.map(([id, label]) => `<button type="button" class="atl-tab ${state.tab === id ? 'on' : ''}" onclick="StudioAtlas.setTab('${id}')">${label}</button>`).join('')}</div>
            <div class="atl-body">${body}</div>`;
        const nb = panel.querySelector('.atl-body');
        if (nb) nb.scrollTop = top;
        if (focusId) {
            const el = document.getElementById(focusId);
            if (el && el.focus) { el.focus(); try { el.setSelectionRange(caret, caret); } catch (_) {} }
        }
        ['tbIcons', 'tbRoute', 'tbHistory'].forEach((id) => {
            const b = $(id);
            if (b) b.classList.toggle('active', state.open && id === { icons: 'tbIcons', route: 'tbRoute', history: 'tbHistory' }[state.tab]);
        });
    }

    function hideOtherPanels() {
        const props = $('properties-panel');
        if (props) props.style.display = 'none';
        const lib3d = $('panel3dLibrary');
        if (lib3d) lib3d.style.display = 'none';
        try { if (window.StudioStickers && StudioStickers.isLibraryOpen && StudioStickers.isLibraryOpen()) StudioStickers.toggleLibrary(false); } catch (_) {}
        try { if (window._lib3dAcikMi && window._lib3dAcikMi() && window.toggle3DLibrary) window.toggle3DLibrary(false); } catch (_) {}
        const sticks = $('panelStickersLibrary');
        if (sticks) sticks.style.display = 'none';
        const props2 = $('properties-panel');
        if (props2) props2.style.display = 'none';
    }

    function open(tab) {
        const panel = $('panelAtlas');
        if (!panel) return;
        if (tab) state.tab = tab;
        wrapOtherToggles(); // later inline scripts define toggle3DLibrary after init() runs
        if (state.open && state.tab !== 'route' && state.drawing) stopDrawing();
        hideOtherPanels();
        state.open = true;
        panel.style.display = 'flex';
        if (typeof window._panelBaslik === 'function') window._panelBaslik('Atlas tools');
        if (state.tab === 'history' && state.historyData) drawHistoryLayers();
        renderPanel();
    }

    function close() {
        const panel = $('panelAtlas');
        if (state.drawing) stopDrawing();
        removeHistoryLayers();
        state.open = false;
        if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
        const props = $('properties-panel');
        if (props) props.style.display = '';
        if (typeof window._panelBaslik === 'function') window._panelBaslik(null);
        ['tbIcons', 'tbRoute', 'tbHistory'].forEach((id) => { const b = $(id); if (b) b.classList.remove('active'); });
    }

    function toggle(tab) {
        if (state.open && state.tab === tab) close();
        else open(tab);
    }

    function setTab(tab) {
        if (state.drawing && tab !== 'route') stopDrawing();
        if (tab !== 'history') removeHistoryLayers();
        state.tab = tab;
        if (tab === 'history' && state.historyData) drawHistoryLayers();
        renderPanel();
    }

    // ------------------------------------------------------------------ toolbar + init
    const BTN_SVG = {
        icons: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.6"/></svg>',
        route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><path d="M8 18.5h5.5a3.5 3.5 0 0 0 0-7h-3a3.5 3.5 0 0 1 0-7H16" stroke-dasharray="0.1 0"/></svg>',
        history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>',
    };

    function injectToolbar() {
        if ($('tbIcons')) return;
        const anchorBtn = $('tbStickers');
        if (!anchorBtn || !anchorBtn.parentNode) return;
        const defs = [
            ['tbIcons', 'icons', 'Icons - map icon library'],
            ['tbRoute', 'route', 'Travel route - draw or import GPX'],
            ['tbHistory', 'history', 'History - borders from another year'],
        ];
        for (const [id, tab, title] of defs) {
            const b = document.createElement('button');
            b.className = 'tb-btn';
            b.id = id;
            b.title = title;
            b.type = 'button';
            b.setAttribute('aria-label', title);
            b.innerHTML = BTN_SVG[tab];
            b.addEventListener('click', () => toggle(tab));
            anchorBtn.parentNode.insertBefore(b, anchorBtn);
        }
    }

    function injectPanel() {
        if ($('panelAtlas')) return;
        const wrap = $('propsWrapper');
        if (!wrap) return;
        const p = document.createElement('div');
        p.className = 'props-content';
        p.id = 'panelAtlas';
        const resize = $('propsResizeHandle');
        wrap.insertBefore(p, resize || null);
    }

    function wrapOtherToggles() {
        // Opening stickers / the 3D library must close this panel so the two never overlap.
        try {
            if (window.StudioStickers && !StudioStickers.__atlasWrapped) {
                const orig = StudioStickers.toggleLibrary;
                StudioStickers.toggleLibrary = function (force) {
                    const willOpen = force !== undefined ? force : !StudioStickers.isLibraryOpen();
                    if (willOpen && state.open) close();
                    return orig.apply(this, arguments);
                };
                StudioStickers.__atlasWrapped = true;
            }
            if (typeof window.toggle3DLibrary === 'function' && !window.toggle3DLibrary.__atlasWrapped) {
                const orig3d = window.toggle3DLibrary;
                const wrapped = function (force) {
                    const willOpen = force === undefined ? !(window._lib3dAcikMi && window._lib3dAcikMi()) : !!force;
                    if (willOpen && state.open) close();
                    return orig3d.apply(this, arguments);
                };
                wrapped.__atlasWrapped = true;
                window.toggle3DLibrary = wrapped;
            }
        } catch (e) { console.warn('[StudioAtlas] could not wrap panel toggles', e); }
    }

    function init() {
        injectStyles();
        injectToolbar();
        injectPanel();
        wrapOtherToggles();
        const map = getMap();
        if (map) {
            // style switches wipe custom sources; restore the history overlay if it was showing
            map.on('style.load', () => { if (state.open && state.tab === 'history' && state.historyData) drawHistoryLayers(); });
        }
        try {
            if (StudioCore.on) {
                StudioCore.on('selectionChanged', () => { if (state.open && state.tab === 'icons') renderPanel(); });
                StudioCore.on('annotationsChanged', () => { if (state.open && state.tab === 'icons') renderPanel(); });
            }
        } catch (_) {}
    }

    // ------------------------------------------------------------------ public API
    return {
        init,
        open,
        close,
        toggle,
        setTab,
        // icons
        addIcon,
        iconSvg,
        iconDataUrl,
        glyphs: () => Object.keys(GLYPHS),
        setIconStyle: (s) => { state.iconStyle = s; renderPanel(); },
        setIconColor: (c) => { state.iconColor = c; renderPanel(); },
        setIconSize: (v) => { state.iconSize = +v; },
        val: (input, text) => { const s = input.parentNode.querySelector('.atl-val'); if (s) s.textContent = text; },
        setIconSearch: (v) => { state.iconSearch = v || ''; renderPanel(); },
        restyleSelected: restyleSelectedIcon,
        recolorSelected: (c) => restyleSelectedIcon({ color: c }),
        // routes
        startRoute: startDrawing,
        finishRoute: finishDrawing,
        cancelRoute: cancelDrawing,
        importGpx,
        parseGpx,
        commitRoute,
        setRoute: (k, v, noRender) => { state[k] = v; if (!noRender) renderPanel(); },
        setRouteColor: (c) => { state.routeColor = c; if (state.drawing) refreshPreview(); renderPanel(); },
        // history
        selectYear,
        loadYear,
        focusEntity,
        addEntity: addEntityAsScene,
        addVisible: addVisibleAsScene,
        clearHistory: () => { removeHistoryLayers(); state.historyData = null; state.year = null; renderPanel(); },
        setHistoryOpacity: (v) => { state.historyOpacity = +v; const m = getMap(); if (m && m.getLayer(HISTORY_SRC + '-fill')) m.setPaintProperty(HISTORY_SRC + '-fill', 'fill-opacity', state.historyOpacity); },
        setHistoryFilter: (v) => { state.historyFilter = (v || '').toLowerCase().trim(); renderPanel(); },
        _state: state,
    };
})();

window.StudioAtlas = StudioAtlas;
