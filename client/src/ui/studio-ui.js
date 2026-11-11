/**
 * Contourframe Studio — Authentic UI Manager & Interactive Controllers.
 * Direct wiring to production Contourframe DOM IDs and CSS classes:
 * Topbar, left-toolbar, properties-panel, map-viewport, mapCountryAction,
 * placeSearch, country-selector-modal, 3D model library, and export dialog.
 */

export class StudioUI {
  constructor(options = {}) {
    this.app = options.app;

    this.onSave = options.onSave || (() => { });
    this.onExport = options.onExport || (() => { });
    this.onAddCountry = options.onAddCountry || (() => { });
    this.onAddHistorical = options.onAddHistorical || (() => { });
    this.onAddModel3D = options.onAddModel3D || (() => { });
    this.onAddAnnotation = options.onAddAnnotation || (() => { });
    this.onStyleChange = options.onStyleChange || (() => { });
    this.onAspectChange = options.onAspectChange || (() => { });

    this.searchTimer = null;
    this.selectedSearchPlace = null;
    this.historicalManifest = null;
    this.modelsManifest = null;

    this.initElements();
    this.initViewportFitting();
    this.bindTopbar();
    this.bindLeftToolbar();
    this.bindMapControls();
    this.bindPlaceSearch();
    this.bindCountrySelectorModal();
    this.bind3DModelLibrary();
    this.bindExportModal();
  }

  initElements() {
    this.loadingOverlay = document.getElementById('projectLoadingOverlay');
    this.saveStatusEl = document.getElementById('saveStatus');
    this.projectNameEl = document.getElementById('projectNameDisplay');
    this.propsPanel = document.getElementById('properties-panel');
    this.propsWrapper = document.getElementById('propsWrapper');
    this.propsTitle = document.getElementById('propsTitleAd');
    this.panel3dLibrary = document.getElementById('panel3dLibrary');
    this.mapCountryAction = document.getElementById('mapCountryAction');
    this.mapViewport = document.getElementById('mapViewport');
  }

  setSaveStatus(text) {
    if (this.saveStatusEl) {
      this.saveStatusEl.textContent = text;
      if (text === 'Saved' || text === 'All changes saved') {
        this.saveStatusEl.style.color = '#10b981';
      } else if (text === 'Saving...') {
        this.saveStatusEl.style.color = 'var(--accent, #d4a957)';
      } else {
        this.saveStatusEl.style.color = '#ef4444';
      }
    }
  }

  hideLoadingOverlay() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
      this.loadingOverlay.style.opacity = '0';
      this.loadingOverlay.style.pointerEvents = 'none';
      setTimeout(() => {
        if (this.loadingOverlay) {
          this.loadingOverlay.style.display = 'none';
          try { this.loadingOverlay.remove(); } catch (_) { }
        }
      }, 300);
    }
    const fallback = document.getElementById('projectLoadingOverlay');
    if (fallback && fallback !== this.loadingOverlay) {
      fallback.classList.add('hidden');
      fallback.style.opacity = '0';
      fallback.style.pointerEvents = 'none';
      setTimeout(() => {
        fallback.style.display = 'none';
        try { fallback.remove(); } catch (_) { }
      }, 300);
    }
  }

  bindTopbar() {
    // Menu trigger & overlay
    const menuTrigger = document.getElementById('studioMenuTrigger');
    const menuOverlay = document.getElementById('studio-menu-overlay');
    if (menuTrigger && menuOverlay) {
      menuTrigger.addEventListener('click', () => {
        const isOpen = menuOverlay.getAttribute('aria-hidden') === 'false';
        menuOverlay.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      });
      const closeBtn = menuOverlay.querySelector('.studio-menu-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          menuOverlay.setAttribute('aria-hidden', 'true');
        });
      }
      menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) menuOverlay.setAttribute('aria-hidden', 'true');
      });
    }

    // Project name rename
    if (this.projectNameEl) {
      this.projectNameEl.addEventListener('click', () => {
        const currentName = this.projectNameEl.textContent || 'My Project';
        const newName = prompt('Rename project:', currentName);
        if (newName && newName.trim()) {
          this.projectNameEl.textContent = newName.trim();
          this.app.projectData.name = newName.trim();
          this.app.projectData.projectName = newName.trim();
          this.onSave();
        }
      });
    }

    // Topbar Export Button
    const btnExportTop = document.getElementById('btnExportTop');
    if (btnExportTop) {
      btnExportTop.addEventListener('click', () => {
        this.openExportModal();
      });
    }

    // Topbar Menu Dropdowns (File, Edit, View)
    document.querySelectorAll('.topbar-menu-trigger').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = trigger.parentElement;
        const dropdown = menu.querySelector('.topbar-dropdown');
        const wasOpen = dropdown.classList.contains('open');

        document.querySelectorAll('.topbar-dropdown').forEach(d => d.classList.remove('open'));
        if (!wasOpen) dropdown.classList.add('open');
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.topbar-dropdown').forEach(d => d.classList.remove('open'));
    });

    // Wire dropdown actions
    document.querySelectorAll('.topbar-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const txt = item.textContent.trim().toLowerCase();
        if (txt.includes('export')) this.openExportModal();
        else if (txt.includes('fit view')) this.app.fitCurrentScene();
        else if (txt.includes('16:9')) this.setAspectRatio('16:9');
        else if (txt.includes('9:16')) this.setAspectRatio('9:16');
        else if (txt.includes('fullscreen')) this.toggleFullscreen();
        else if (txt.includes('undo')) this.app.undo();
        else if (txt.includes('redo')) this.app.redo();
      });
    });
  }

  bindLeftToolbar() {
    // Select tool
    const tbSelect = document.getElementById('tbSelect');
    if (tbSelect) {
      tbSelect.addEventListener('click', () => {
        this.setActiveToolbarBtn(tbSelect);
        this.app.setToolMode('select');
      });
    }

    // Pen tool
    const tbPen = document.getElementById('tbPen');
    if (tbPen) {
      tbPen.addEventListener('click', () => {
        this.setActiveToolbarBtn(tbPen);
        this.app.setToolMode('pen');
      });
    }

    // Text tool
    const tbText = document.getElementById('tbText');
    if (tbText) {
      tbText.addEventListener('click', () => {
        this.setActiveToolbarBtn(tbText);
        this.app.handleAddAnnotation('text');
      });
    }

    // Arrow tool
    const tbArrow = document.getElementById('tbArrow');
    if (tbArrow) {
      tbArrow.addEventListener('click', () => {
        this.setActiveToolbarBtn(tbArrow);
        this.app.handleAddAnnotation('arrow');
      });
    }

    // War tool
    const tbWar = document.getElementById('tbWar');
    const warSubmode = document.getElementById('warSubmode');
    if (tbWar) {
      tbWar.addEventListener('click', () => {
        this.setActiveToolbarBtn(tbWar);
        if (warSubmode) {
          const isOpen = warSubmode.style.display === 'flex';
          warSubmode.style.display = isOpen ? 'none' : 'flex';
        }
      });
    }

    // War morph beta
    const tbBorderTest = document.getElementById('tbBorderTest');
    const wmModal = document.getElementById('wmModal');
    if (tbBorderTest && wmModal) {
      tbBorderTest.addEventListener('click', () => {
        wmModal.classList.add('open');
      });
      const wmClose = wmModal.querySelector('.wm-btn');
      if (wmClose) {
        wmClose.addEventListener('click', () => wmModal.classList.remove('open'));
      }
      const wmPrimary = document.getElementById('wmPrimary');
      if (wmPrimary) {
        wmPrimary.addEventListener('click', () => {
          wmModal.classList.remove('open');
          this.app.setToolMode('warMorph');
        });
      }
    }

    // 3D Models toolbar button
    const tb3D = document.getElementById('tb3D');
    if (tb3D) {
      tb3D.addEventListener('click', () => {
        this.toggle3DLibrary();
      });
    }

    // Map Style Layer Menu
    const tbLayers = document.getElementById('tbLayers');
    const layerMenu = document.getElementById('layerMenu');
    if (tbLayers && layerMenu) {
      tbLayers.addEventListener('click', (e) => {
        e.stopPropagation();
        layerMenu.classList.toggle('open');
      });

      document.querySelectorAll('.tb-style-card, .tb-layer-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          const style = btn.getAttribute('data-style');
          if (style) {
            this.app.setMapStyle(style);
            document.querySelectorAll('.tb-style-card, .tb-layer-opt').forEach(b => {
              if (b.getAttribute('data-style') === style) b.classList.add('active');
              else b.classList.remove('active');
            });
            layerMenu.classList.remove('open');
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.tb-layer-wrap')) {
          layerMenu.classList.remove('open');
        }
      });
    }
  }

  setActiveToolbarBtn(btn) {
    document.querySelectorAll('.left-toolbar .tb-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  bindMapControls() {
    // Aspect Ratio Buttons (16:9 / 9:16)
    document.querySelectorAll('.map-ratio-sel .ratio-btn[data-ratio]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ratio = btn.getAttribute('data-ratio');
        document.querySelectorAll('.map-ratio-sel .ratio-btn[data-ratio]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setAspectRatio(ratio);
      });
    });

    // Compass reset rotation
    const compassBtn = document.getElementById('compassBtn');
    if (compassBtn) {
      compassBtn.addEventListener('click', () => {
        if (this.app.map) {
          this.app.map.easeTo({ bearing: 0, pitch: 0, duration: 400 });
        }
      });
    }

    // Fit View button
    const fitBtn = document.querySelector('.map-controls button[title="Fit View"]');
    if (fitBtn) {
      fitBtn.addEventListener('click', () => {
        this.app.fitCurrentScene();
      });
    }

    // Fullscreen button
    const fsBtn = document.querySelector('.map-controls button[title="Fullscreen"]');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
  }

  initViewportFitting() {
    const panel = document.querySelector('.map-panel');
    if (panel && window.ResizeObserver) {
      this.panelResizeObserver = new ResizeObserver(() => {
        this.fitViewportToPanel();
      });
      this.panelResizeObserver.observe(panel);
    }
    window.addEventListener('resize', () => this.fitViewportToPanel());
    this.fitViewportToPanel();
    setTimeout(() => this.fitViewportToPanel(), 50);
    setTimeout(() => this.fitViewportToPanel(), 300);
  }

  fitViewportToPanel() {
    const vp = this.mapViewport || document.getElementById('mapViewport');
    const panel = document.querySelector('.map-panel');
    const lbL = document.getElementById('letterboxL');
    const lbR = document.getElementById('letterboxR');
    if (!vp || !panel) return;

    const pw = panel.clientWidth;
    const ph = panel.clientHeight;
    if (pw <= 0 || ph <= 0) return;

    const currentRatio = (this.app?.projectData?.aspectRatio) || '16:9';
    if (currentRatio === 'fill') {
      vp.style.width = `${pw}px`;
      vp.style.height = `${ph}px`;
      if (lbL) lbL.style.display = 'none';
      if (lbR) lbR.style.display = 'none';
      if (this.app?.map) this.app.map.resize();
      return;
    }

    const [rw, rh] = currentRatio === '9:16' ? [9, 16] : [16, 9];
    const panelAspect = pw / ph;
    const targetAspect = rw / rh;

    let w, h;
    if (panelAspect > targetAspect) {
      h = ph;
      w = Math.floor(ph * targetAspect);
    } else {
      w = pw;
      h = Math.floor(pw / targetAspect);
    }

    vp.style.width = `${w}px`;
    vp.style.height = `${h}px`;

    if (lbL && lbR) {
      if (currentRatio === '9:16') {
        lbL.style.display = 'block';
        lbR.style.display = 'block';
        const vpRect = vp.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        lbL.style.width = `${Math.max(0, vpRect.left - panelRect.left)}px`;
        lbR.style.width = `${Math.max(0, panelRect.right - vpRect.right)}px`;
      } else {
        lbL.style.display = 'none';
        lbR.style.display = 'none';
      }
    }

    if (this.app?.map) {
      this.app.map.resize();
    }
  }

  setAspectRatio(ratio) {
    if (!this.mapViewport) return;
    this.mapViewport.classList.remove('ratio-16-9', 'ratio-9-16', 'ratio-fill');
    if (ratio === '9:16') {
      this.mapViewport.classList.add('ratio-9-16');
    } else if (ratio === 'fill') {
      this.mapViewport.classList.add('ratio-fill');
    } else {
      this.mapViewport.classList.add('ratio-16-9');
    }
    if (this.app && this.app.projectData) {
      this.app.projectData.aspectRatio = ratio;
    }
    this.fitViewportToPanel();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  }

  bindPlaceSearch() {
    const input = document.getElementById('placeSearchInput');
    const results = document.getElementById('placeSearchResults');
    const clearBtn = document.getElementById('placeSearchClear');
    const spinner = document.getElementById('placeSearchSpinner');
    const actions = document.getElementById('placeSearchActions');
    const selName = document.getElementById('placeSearchSelName');
    const btnAddNew = document.getElementById('btnAddNewGroup');
    const btnAddToCurr = document.getElementById('btnAddToCurrent');

    if (!input || !results) return;

    input.addEventListener('input', () => {
      clearTimeout(this.searchTimer);
      const q = input.value.trim();
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
      if (actions) actions.style.display = 'none';

      if (q.length < 2) {
        results.classList.remove('open');
        results.innerHTML = '';
        if (spinner) spinner.classList.remove('active');
        return;
      }

      if (spinner) spinner.classList.add('active');
      results.classList.add('open');
      results.innerHTML = '<div class="map-search-loading">Searching…</div>';

      this.searchTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search-places?q=${encodeURIComponent(q)}`);
          if (spinner) spinner.classList.remove('active');
          if (res.ok) {
            const places = await res.json();
            this.renderPlaceSearchResults(places, results);
          } else {
            results.innerHTML = '<div class="map-search-empty">No results found</div>';
          }
        } catch (e) {
          if (spinner) spinner.classList.remove('active');
          results.innerHTML = '<div class="map-search-empty">Search error</div>';
        }
      }, 300);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        results.classList.remove('open');
        results.innerHTML = '';
        if (actions) actions.style.display = 'none';
        this.app.clearSearchPreview();
      });
    }

    // Dismiss search dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#mapSearch')) {
        results.classList.remove('open');
      }
    });

    if (btnAddNew) {
      btnAddNew.addEventListener('click', () => {
        if (!this.selectedSearchPlace) return;
        this.onAddCountry({
          name: this.selectedSearchPlace.name,
          iso: this.selectedSearchPlace.osm_id,
          geometry: this.selectedSearchPlace.geojson,
          asNewScene: true
        });
        if (actions) actions.style.display = 'none';
        results.classList.remove('open');
        input.value = '';
        this.app.clearSearchPreview();
      });
    }

    if (btnAddToCurr) {
      btnAddToCurr.addEventListener('click', () => {
        if (!this.selectedSearchPlace) return;
        this.onAddCountry({
          name: this.selectedSearchPlace.name,
          iso: this.selectedSearchPlace.osm_id,
          geometry: this.selectedSearchPlace.geojson,
          asNewScene: false
        });
        if (actions) actions.style.display = 'none';
        results.classList.remove('open');
        input.value = '';
        this.app.clearSearchPreview();
      });
    }
  }

  renderPlaceSearchResults(places, container) {
    if (!places || places.length === 0) {
      container.innerHTML = '<div class="map-search-empty">No matches found</div>';
      container.classList.add('open');
      return;
    }

    container.innerHTML = places.map((p, idx) => `
      <div class="map-search-item" data-idx="${idx}">
        <span class="map-search-name">${p.name}</span>
        <span class="map-search-type">${p.type || 'place'}</span>
      </div>
    `).join('');
    container.classList.add('open');

    container.querySelectorAll('.map-search-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        const place = places[idx];
        this.selectSearchPlace(place);
      });
    });
  }

  selectSearchPlace(place) {
    this.selectedSearchPlace = place;
    const input = document.getElementById('placeSearchInput');
    const results = document.getElementById('placeSearchResults');
    const actions = document.getElementById('placeSearchActions');
    const selName = document.getElementById('placeSearchSelName');
    const btnAddToCurr = document.getElementById('btnAddToCurrent');

    if (input) input.value = place.name;
    if (results) results.classList.remove('open');

    // Fly camera to bbox
    if (place.bbox && place.bbox.length === 4 && this.app.map) {
      // bbox: [south, north, west, east] -> [[west, south], [east, north]]
      const sw = [place.bbox[2], place.bbox[0]];
      const ne = [place.bbox[3], place.bbox[1]];
      this.app.map.fitBounds([sw, ne], { padding: 80, duration: 800 });
    }

    // Show highlight on map
    if (place.geojson) {
      this.app.showSearchPreview(place.geojson);
    }

    // Show actions bar
    if (actions && selName) {
      selName.textContent = place.name;
      actions.style.display = 'block';
      if (btnAddToCurr) {
        btnAddToCurr.style.display = this.app.projectData.scenes.length > 0 ? 'inline-block' : 'none';
      }
    }
  }

  /**
   * On-map country action card (reproduced from Contourframe).
   */
  showCountryActionCard(countryInfo, onAddCurrent, onAddNew) {
    if (!this.mapCountryAction) return;

    const flagUrl = countryInfo.iso ? `/static/flags/${countryInfo.iso.substring(0, 2).toLowerCase()}.svg` : '';
    this.mapCountryAction.innerHTML = `
      <div class="gz3d-baslik">
        <div style="display:flex;align-items:center;gap:8px;">
          ${flagUrl ? `<img src="${flagUrl}" width="20" height="15" style="border-radius:2px;object-fit:cover;" onerror="this.style.display='none'">` : ''}
          <div class="map-country-action-title">${countryInfo.name}</div>
        </div>
        <button class="map-country-action-x" id="mcActionClose">&times;</button>
      </div>
      <div class="map-country-action-btns" style="margin-top:8px;">
        <button class="map-country-action-btn primary" id="mcAddCurrent">Add to Scene</button>
        <button class="map-country-action-btn secondary" id="mcAddNew">Add as New Scene</button>
      </div>
    `;

    this.mapCountryAction.style.display = 'block';

    const closeBtn = this.mapCountryAction.querySelector('#mcActionClose');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hideCountryActionCard());

    const btnCurr = this.mapCountryAction.querySelector('#mcAddCurrent');
    if (btnCurr) {
      btnCurr.addEventListener('click', () => {
        onAddCurrent();
        this.hideCountryActionCard();
      });
    }

    const btnNew = this.mapCountryAction.querySelector('#mcAddNew');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        onAddNew();
        this.hideCountryActionCard();
      });
    }
  }

  hideCountryActionCard() {
    if (this.mapCountryAction) {
      this.mapCountryAction.style.display = 'none';
    }
  }

  bindCountrySelectorModal() {
    const modal = document.getElementById('country-selector-modal');
    if (!modal) return;

    // Close buttons
    modal.querySelectorAll('.cs-close, .cs-btn-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    });

    // Tab buttons (Modern vs Historical)
    const tabModern = modal.querySelector('.cs-tab[data-tab="modern"]');
    const tabHistorical = modal.querySelector('#cs-tab-historical');
    if (tabHistorical) tabHistorical.style.display = 'inline-block';

    if (tabModern && tabHistorical) {
      tabModern.addEventListener('click', () => {
        tabModern.classList.add('cs-tab--active');
        tabHistorical.classList.remove('cs-tab--active');
        this.renderModernCountriesList();
      });
      tabHistorical.addEventListener('click', () => {
        tabHistorical.classList.add('cs-tab--active');
        tabModern.classList.remove('cs-tab--active');
        this.renderHistoricalEmpiresList();
      });
    }

    // Search input
    const searchInp = document.getElementById('country-search-input');
    if (searchInp) {
      searchInp.addEventListener('input', () => {
        const q = searchInp.value.trim().toLowerCase();
        const activeTab = modal.querySelector('.cs-tab--active');
        if (activeTab && activeTab.getAttribute('data-tab') === 'historical') {
          this.renderHistoricalEmpiresList(q);
        } else {
          this.renderModernCountriesList(q);
        }
      });
    }

    // Confirm button
    const confirmBtn = modal.querySelector('.cs-btn-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        this.confirmSelectedCountries();
        modal.classList.remove('open');
      });
    }
  }

  openCountrySelector(defaultTab = 'modern') {
    const modal = document.getElementById('country-selector-modal');
    if (!modal) return;
    modal.classList.add('open');

    const tabModern = modal.querySelector('.cs-tab[data-tab="modern"]');
    const tabHistorical = modal.querySelector('#cs-tab-historical');

    if (defaultTab === 'historical' && tabHistorical) {
      tabHistorical.classList.add('cs-tab--active');
      if (tabModern) tabModern.classList.remove('cs-tab--active');
      this.renderHistoricalEmpiresList();
    } else {
      if (tabModern) tabModern.classList.add('cs-tab--active');
      if (tabHistorical) tabHistorical.classList.remove('cs-tab--active');
      this.renderModernCountriesList();
    }
  }

  renderModernCountriesList(filter = '') {
    const listEl = document.getElementById('country-search-list');
    if (!listEl) return;

    const countries = this.app.getAllCountriesSorted();
    const filtered = filter ? countries.filter(c => c.name.toLowerCase().includes(filter)) : countries;

    listEl.innerHTML = filtered.map(c => `
      <label class="cs-item" style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-bottom:1px solid #222;">
        <input type="checkbox" class="cs-checkbox" data-iso="${c.iso}" data-name="${c.name}" />
        <span style="font-size:13px;color:#eee;">${c.name}</span>
      </label>
    `).join('');

    this.updateSelectedCountryCount();
    listEl.querySelectorAll('.cs-checkbox').forEach(cb => {
      cb.addEventListener('change', () => this.updateSelectedCountryCount());
    });
  }

  async renderHistoricalEmpiresList(filter = '') {
    const listEl = document.getElementById('country-search-list');
    if (!listEl) return;

    const empires = [
      { id: 'ottoman-empire', name: 'Ottoman Empire', eras: '1299 – 1922', capital: 'Constantinople' },
      { id: 'roman-empire', name: 'Roman Empire', eras: '27 BCE – 476 CE', capital: 'Rome' },
      { id: 'british-empire', name: 'British Empire', eras: '1600 – 1997', capital: 'London' },
      { id: 'byzantine-empire', name: 'Byzantine Empire', eras: '330 – 1453', capital: 'Constantinople' },
      { id: 'mongol-empire', name: 'Mongol Empire', eras: '1206 – 1368', capital: 'Avraga / Karakorum' },
      { id: 'russian-empire', name: 'Russian Empire', eras: '1721 – 1917', capital: 'Saint Petersburg' },
      { id: 'spanish-empire', name: 'Spanish Empire', eras: '1492 – 1976', capital: 'Madrid' },
      { id: 'soviet-union', name: 'Soviet Union', eras: '1922 – 1991', capital: 'Moscow' },
      { id: 'holy-roman-empire', name: 'Holy Roman Empire', eras: '962 – 1806', capital: 'Regensburg' },
      { id: 'french-colonial-empire', name: 'French Colonial Empire', eras: '1534 – 1980', capital: 'Paris' }
    ];

    const filtered = filter ? empires.filter(e => e.name.toLowerCase().includes(filter)) : empires;

    listEl.innerHTML = filtered.map(e => `
      <div class="cs-item cs-item-empire" data-empire-id="${e.id}" data-name="${e.name}" 
           style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;border-bottom:1px solid #222;">
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--accent,#d4a957);">${e.name}</div>
          <div style="font-size:11px;color:#888;">${e.eras} · Capital: ${e.capital}</div>
        </div>
        <button class="cs-btn cs-btn-add" style="padding:4px 10px;font-size:11px;border-radius:4px;background:var(--accent,#d4a957);color:#111;font-weight:600;border:none;">Add</button>
      </div>
    `).join('');

    listEl.querySelectorAll('.cs-item-empire').forEach(item => {
      item.addEventListener('click', async () => {
        const empireId = item.getAttribute('data-empire-id');
        const empireName = item.getAttribute('data-name');
        await this.app.handleAddHistorical({ id: empireId, name: empireName });
        const modal = document.getElementById('country-selector-modal');
        if (modal) modal.classList.remove('open');
      });
    });
  }

  updateSelectedCountryCount() {
    const countEl = document.getElementById('cs-count');
    const checked = document.querySelectorAll('#country-search-list .cs-checkbox:checked');
    if (countEl) {
      countEl.innerHTML = `<span class="num">${checked.length}</span> selected`;
    }
  }

  confirmSelectedCountries() {
    const checked = document.querySelectorAll('#country-search-list .cs-checkbox:checked');
    checked.forEach(cb => {
      const name = cb.getAttribute('data-name');
      const iso = cb.getAttribute('data-iso');
      this.onAddCountry({ name, iso, asNewScene: false });
    });
  }

  bind3DModelLibrary() {
    const m3dModal = document.getElementById('m3dModal');
    if (m3dModal) {
      const closeBtn = m3dModal.querySelector('.wm-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => m3dModal.classList.remove('open'));
      const primaryBtn = document.getElementById('m3dPrimary');
      if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
          m3dModal.classList.remove('open');
          this.open3DLibraryPanel();
        });
      }
    }
  }

  toggle3DLibrary() {
    if (this.panel3dLibrary && this.panel3dLibrary.style.display !== 'none') {
      this.close3DLibraryPanel();
    } else {
      this.open3DLibraryPanel();
    }
  }

  async open3DLibraryPanel() {
    if (!this.panel3dLibrary || !this.propsPanel) return;

    this.propsPanel.style.display = 'none';
    this.panel3dLibrary.style.display = 'block';
    if (this.propsTitle) this.propsTitle.textContent = '3D Models Catalog';

    const backBtn = document.getElementById('props3dGeri');
    if (backBtn) {
      backBtn.hidden = false;
      backBtn.onclick = () => this.close3DLibraryPanel();
    }

    if (!this.modelsManifest) {
      try {
        const res = await fetch('/static/models3d/_manifest.json');
        if (res.ok) this.modelsManifest = await res.json();
      } catch (e) {
        this.modelsManifest = [];
      }
    }

    const models = (this.modelsManifest || []).filter(m => !m.hidden);
    this.panel3dLibrary.innerHTML = `
      <div style="padding:10px 12px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
        ${models.map(m => `
          <div class="lib3d-card" data-model-id="${m.id}" data-name="${m.name}" title="${m.description || m.name}">
            <img class="lib3d-cover" src="/static/models3d/${m.cover || 'covers/tank.png'}" alt="${m.name}" onerror="this.src='/static/models3d/covers/tank.png'" />
            <div class="lib3d-name">${m.name}</div>
          </div>
        `).join('')}
      </div>
    `;

    this.panel3dLibrary.querySelectorAll('.lib3d-card').forEach(card => {
      card.addEventListener('click', () => {
        const modelId = card.getAttribute('data-model-id');
        const name = card.getAttribute('data-name');
        this.onAddModel3D({ id: modelId, name });
        this.close3DLibraryPanel();
      });
    });
  }

  close3DLibraryPanel() {
    if (this.panel3dLibrary) this.panel3dLibrary.style.display = 'none';
    if (this.propsPanel) this.propsPanel.style.display = 'block';
    if (this.propsTitle) this.propsTitle.textContent = 'Properties';
    const backBtn = document.getElementById('props3dGeri');
    if (backBtn) backBtn.hidden = true;
  }

  bindExportModal() {
    const modal = document.getElementById('exportModal');
    if (!modal) return;

    modal.querySelectorAll('.cancel').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.remove('open'));
    });

    const primaryBtn = modal.querySelector('.export-btn.primary');
    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        const quality = document.getElementById('exportQuality')?.value || '1080';
        const fps = document.getElementById('exportFps')?.value || '30';
        const mode = document.getElementById('exportMode')?.value || 'normal';
        this.startExportProcess({ quality, fps, mode });
      });
    }

    // Quality buttons
    const qualityWrap = document.getElementById('exportQualityOpts');
    if (qualityWrap) {
      qualityWrap.innerHTML = `
        <button type="button" class="export-opt active" data-q="720">720p (HD)</button>
        <button type="button" class="export-opt" data-q="1080">1080p (FHD)</button>
        <button type="button" class="export-opt" data-q="2160">4K (UHD)</button>
      `;
      qualityWrap.querySelectorAll('.export-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          qualityWrap.querySelectorAll('.export-opt').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const qInput = document.getElementById('exportQuality');
          if (qInput) qInput.value = btn.getAttribute('data-q');
        });
      });
    }

    // FPS buttons
    const fpsWrap = document.getElementById('exportFpsOpts');
    if (fpsWrap) {
      fpsWrap.innerHTML = `
        <button type="button" class="export-opt active" data-fps="30">30 fps</button>
        <button type="button" class="export-opt" data-fps="60">60 fps</button>
      `;
      fpsWrap.querySelectorAll('.export-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          fpsWrap.querySelectorAll('.export-opt').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const fpsInput = document.getElementById('exportFps');
          if (fpsInput) fpsInput.value = btn.getAttribute('data-fps');
        });
      });
    }
  }

  openExportModal() {
    const modal = document.getElementById('exportModal');
    const settings = document.getElementById('exportSettings');
    const progress = document.getElementById('exportProgress');
    if (modal) {
      modal.classList.add('open');
      if (settings) settings.style.display = 'block';
      if (progress) progress.style.display = 'none';
    }
  }

  async startExportProcess(opts) {
    const settings = document.getElementById('exportSettings');
    const progress = document.getElementById('exportProgress');
    const bar = document.getElementById('exportProgressBar');
    const text = document.getElementById('exportProgressText');
    const frames = document.getElementById('exportProgressFrames');
    const preview = document.getElementById('exportPreview');
    const downloadBtn = document.getElementById('exportDownloadBtn');
    const doneBtn = document.getElementById('exportDoneBtn');

    if (settings) settings.style.display = 'none';
    if (progress) progress.style.display = 'block';
    if (preview) preview.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
    if (doneBtn) doneBtn.style.display = 'none';

    await this.onExport({
      ...opts,
      onProgress: (pct, currentFrame, totalFrames) => {
        if (bar) bar.style.width = `${pct}%`;
        if (text) text.textContent = `${pct}%`;
        if (frames) frames.textContent = `${currentFrame} / ${totalFrames} frames`;
      },
      onComplete: (videoUrl) => {
        if (preview) {
          preview.src = videoUrl;
          preview.style.display = 'block';
        }
        if (downloadBtn) {
          downloadBtn.href = videoUrl;
          downloadBtn.style.display = 'inline-block';
        }
        if (doneBtn) doneBtn.style.display = 'inline-block';
      }
    });
  }

  /**
   * Renders the Properties Panel for the active Scene / Country / 3D Model / Arrow.
   */
  renderSceneProperties(scene, onUpdate) {
    if (!this.propsPanel) return;
    if (this.propsTitle) this.propsTitle.textContent = 'Scene Properties';

    const countries = scene.countries || [];
    const holdDur = typeof scene.holdDuration === 'number' ? scene.holdDuration : 2.5;
    const transDur = typeof scene.transitionDuration === 'number' ? scene.transitionDuration : 3.0;
    const transType = scene.transitionType || 'flyToCountry';

    const getFlagSrc = (c) => {
      const known = {
        germany: 'de', turkey: 'tr', france: 'fr', 'united states': 'us', usa: 'us',
        italy: 'it', spain: 'es', russia: 'ru', china: 'cn', india: 'in', brazil: 'br',
        canada: 'ca', australia: 'au', japan: 'jp', greece: 'gr', poland: 'pl', ukraine: 'ua',
        egypt: 'eg', iran: 'ir', iraq: 'iq', syria: 'sy', saudi_arabia: 'sa'
      };
      const nameKey = (c.name || '').toLowerCase();
      const iso = (c.id || '').toLowerCase();
      const code = iso.length === 2 ? iso : (known[nameKey] || (iso.length === 3 ? iso.substring(0, 2) : 'de'));
      return `/static/flags/${code}.svg`;
    };

    this.propsPanel.innerHTML = `
      <div style="padding:14px;display:flex;flex-direction:column;gap:14px;">
        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Scene Title</label>
          <input type="text" id="prop-scene-title" value="${scene.title || ''}" 
                 style="width:100%;background:#181818;border:1px solid #333;color:#eee;padding:7px 10px;border-radius:6px;font-size:13px;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Transition Style</label>
          <select id="prop-trans-type" style="width:100%;background:#181818;border:1px solid #333;color:#eee;padding:7px 10px;border-radius:6px;font-size:13px;margin-top:4px;">
            <option value="flyToCountry" ${transType === 'flyToCountry' ? 'selected' : ''}>Fly to Country (Asymmetric Quintic)</option>
            <option value="orbitZoom" ${transType === 'orbitZoom' ? 'selected' : ''}>Orbit Zoom</option>
            <option value="spiralZoom" ${transType === 'spiralZoom' ? 'selected' : ''}>Spiral Zoom</option>
            <option value="cinematicSweep" ${transType === 'cinematicSweep' ? 'selected' : ''}>Cinematic Sweep</option>
            <option value="linearPan" ${transType === 'linearPan' ? 'selected' : ''}>Linear Pan</option>
            <option value="instantCut" ${transType === 'instantCut' ? 'selected' : ''}>Instant Cut</option>
          </select>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="props-field">
            <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Transition (s)</label>
            <input type="number" id="prop-trans-dur" value="${transDur}" step="0.5" min="0.5" max="15"
                   style="width:100%;background:#181818;border:1px solid #333;color:#eee;padding:7px 10px;border-radius:6px;font-size:13px;margin-top:4px;" />
          </div>
          <div class="props-field">
            <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Hold View (s)</label>
            <input type="number" id="prop-hold-dur" value="${holdDur}" step="0.5" min="0.5" max="30"
                   style="width:100%;background:#181818;border:1px solid #333;color:#eee;padding:7px 10px;border-radius:6px;font-size:13px;margin-top:4px;" />
          </div>
        </div>

        <!-- Add Elements Shortcuts -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
          <button id="prop-btn-add-c" style="flex:1;padding:8px 10px;font-size:12px;border-radius:6px;background:#252525;color:#eee;border:1px solid #333;cursor:pointer;">+ Country</button>
          <button id="prop-btn-add-h" style="flex:1;padding:8px 10px;font-size:12px;border-radius:6px;background:#252525;color:#eee;border:1px solid #333;cursor:pointer;">+ Empire</button>
          <button id="prop-btn-add-3d" style="flex:1;padding:8px 10px;font-size:12px;border-radius:6px;background:#252525;color:#eee;border:1px solid #333;cursor:pointer;">+ 3D Model</button>
          <button id="prop-btn-add-sticker" style="flex:1;padding:8px 10px;font-size:12px;border-radius:6px;background:#252525;color:#eee;border:1px solid #333;cursor:pointer;">+ Sticker</button>
          <button id="prop-btn-add-arrow" style="flex:1;padding:8px 10px;font-size:12px;border-radius:6px;background:#252525;color:#eee;border:1px solid #333;cursor:pointer;">+ Arrow</button>
        </div>

        <!-- Active Countries Section with Rich Controls -->
        <div style="margin-top:10px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Active Countries (${countries.length})</label>
            <button id="prop-btn-fit-scene" style="background:#222;border:1px solid #333;color:var(--accent,#d4a957);border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer;">Fit View</button>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;">
            ${countries.map((c, i) => `
              <div class="prop-c-card" data-idx="${i}" style="background:#1b1b1b;border:1px solid #2a2a2a;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:10px;">
                <!-- Card Header -->
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <img src="${getFlagSrc(c)}" style="width:20px;height:14px;border-radius:2px;object-fit:cover;background:#333;" onerror="this.style.display='none'">
                    <span style="font-size:13px;font-weight:600;color:#fff;">${c.name}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <button class="prop-focus-c" data-idx="${i}" title="Focus camera on this country" style="background:#282828;border:1px solid #3a3a3a;color:#aaa;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer;">Focus</button>
                    <button class="prop-del-c" data-idx="${i}" title="Remove country" style="background:none;border:none;color:#777;font-size:16px;cursor:pointer;line-height:1;">&times;</button>
                  </div>
                </div>

                <!-- Fill Color & Opacity -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <div>
                    <label style="font-size:10px;color:#888;text-transform:uppercase;font-weight:600;">Fill Color</label>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                      <input type="color" class="prop-c-fill-color" data-idx="${i}" value="${c.fillColor || '#d4a957'}" style="width:28px;height:24px;border:none;background:none;cursor:pointer;padding:0;border-radius:3px;">
                      <span class="prop-c-fill-hex" style="font-size:11px;color:#bbb;font-family:monospace;">${c.fillColor || '#d4a957'}</span>
                    </div>
                  </div>
                  <div>
                    <label style="font-size:10px;color:#888;text-transform:uppercase;font-weight:600;">Fill Opacity (${Math.round((c.fillOpacity ?? 0.6) * 100)}%)</label>
                    <input type="range" class="prop-c-fill-opacity" data-idx="${i}" min="0" max="1" step="0.05" value="${c.fillOpacity ?? 0.6}" style="width:100%;margin-top:6px;">
                  </div>
                </div>

                <!-- Drape Flag on Territory -->
                <div style="background:#141414;border:1px solid #252525;border-radius:6px;padding:8px 10px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <label style="display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:#eee;cursor:pointer;">
                      <input type="checkbox" class="prop-c-flag-show" data-idx="${i}" ${c.showFlag !== false ? 'checked' : ''} style="cursor:pointer;accent-color:var(--accent,#d4a957);">
                      Drape Flag on Territory
                    </label>
                    <span style="font-size:9.5px;color:var(--accent,#d4a957);letter-spacing:0.5px;text-transform:uppercase;font-weight:700;">3D Drape</span>
                  </div>

                  <div class="prop-c-flag-opts-${i}" style="display:${c.showFlag !== false ? 'block' : 'none'};margin-top:8px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                      <div>
                        <label style="font-size:10px;color:#888;">Flag Opacity (${Math.round((c.flagOpacity ?? 0.75) * 100)}%)</label>
                        <input type="range" class="prop-c-flag-opacity" data-idx="${i}" min="0" max="1" step="0.05" value="${c.flagOpacity ?? 0.75}" style="width:100%;margin-top:4px;">
                      </div>
                      <div>
                        <label style="font-size:10px;color:#888;">Flag Scale (${c.flagScale ?? 0}%)</label>
                        <input type="range" class="prop-c-flag-scale" data-idx="${i}" min="-50" max="100" step="5" value="${c.flagScale ?? 0}" style="width:100%;margin-top:4px;">
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Border & Glow -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <div>
                    <label style="font-size:10px;color:#888;text-transform:uppercase;font-weight:600;">Border Glow</label>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                      <input type="color" class="prop-c-glow-color" data-idx="${i}" value="${c.glowColor || '#ffffff'}" style="width:28px;height:24px;border:none;background:none;cursor:pointer;padding:0;border-radius:3px;">
                      <span class="prop-c-glow-hex" style="font-size:11px;color:#bbb;font-family:monospace;">${c.glowColor || '#ffffff'}</span>
                    </div>
                  </div>
                  <div>
                    <label style="font-size:10px;color:#888;text-transform:uppercase;font-weight:600;">Border Width (${c.lineWidth ?? 2}px)</label>
                    <input type="range" class="prop-c-line-width" data-idx="${i}" min="0" max="8" step="0.5" value="${c.lineWidth ?? 2}" style="width:100%;margin-top:6px;">
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Input handlers
    const titleInp = document.getElementById('prop-scene-title');
    if (titleInp) {
      titleInp.addEventListener('change', () => {
        scene.title = titleInp.value;
        onUpdate();
      });
    }

    const transSel = document.getElementById('prop-trans-type');
    if (transSel) {
      transSel.addEventListener('change', () => {
        scene.transitionType = transSel.value;
        onUpdate();
      });
    }

    const transDurInp = document.getElementById('prop-trans-dur');
    if (transDurInp) {
      transDurInp.addEventListener('change', () => {
        scene.transitionDuration = parseFloat(transDurInp.value) || 3.0;
        onUpdate();
      });
    }

    const holdDurInp = document.getElementById('prop-hold-dur');
    if (holdDurInp) {
      holdDurInp.addEventListener('change', () => {
        scene.holdDuration = parseFloat(holdDurInp.value) || 2.5;
        onUpdate();
      });
    }

    // Top-level action buttons
    const btnFit = document.getElementById('prop-btn-fit-scene');
    if (btnFit) {
      btnFit.addEventListener('click', () => {
        if (this.app) this.app.fitCurrentScene(true);
      });
    }

    const btnAddC = document.getElementById('prop-btn-add-c');
    if (btnAddC) btnAddC.addEventListener('click', () => this.openCountrySelector('modern'));

    const btnAddH = document.getElementById('prop-btn-add-h');
    if (btnAddH) btnAddH.addEventListener('click', () => this.openCountrySelector('historical'));

    const btnAdd3D = document.getElementById('prop-btn-add-3d');
    if (btnAdd3D) btnAdd3D.addEventListener('click', () => this.open3DLibraryPanel());

    const btnAddSticker = document.getElementById('prop-btn-add-sticker');
    if (btnAddSticker) btnAddSticker.addEventListener('click', () => {
      if (window.StudioStickers) window.StudioStickers.toggleLibrary(true);
    });

    const btnAddArrow = document.getElementById('prop-btn-add-arrow');
    if (btnAddArrow) btnAddArrow.addEventListener('click', () => this.app.handleAddAnnotation('arrow'));

    // Country Card Interactive Events
    this.propsPanel.querySelectorAll('.prop-del-c').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        scene.countries.splice(idx, 1);
        onUpdate();
        this.renderSceneProperties(scene, onUpdate);
      });
    });

    this.propsPanel.querySelectorAll('.prop-focus-c').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const c = scene.countries[idx];
        if (c && this.app) {
          this.app.fitCountryCamera(c.id || c.name);
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-fill-color').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].fillColor = inp.value;
          const hexEl = inp.parentElement?.querySelector('.prop-c-fill-hex');
          if (hexEl) hexEl.textContent = inp.value;
          onUpdate();
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-fill-opacity').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].fillOpacity = parseFloat(inp.value);
          onUpdate();
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-flag-show').forEach(chk => {
      chk.addEventListener('change', () => {
        const idx = parseInt(chk.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].showFlag = chk.checked;
          const opts = this.propsPanel.querySelector(`.prop-c-flag-opts-${idx}`);
          if (opts) opts.style.display = chk.checked ? 'block' : 'none';
          onUpdate();
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-flag-opacity').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].flagOpacity = parseFloat(inp.value);
          onUpdate();
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-flag-scale').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].flagScale = parseFloat(inp.value);
          onUpdate();
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-glow-color').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].glowColor = inp.value;
          const hexEl = inp.parentElement?.querySelector('.prop-c-glow-hex');
          if (hexEl) hexEl.textContent = inp.value;
          onUpdate();
        }
      });
    });

    this.propsPanel.querySelectorAll('.prop-c-line-width').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.getAttribute('data-idx'), 10);
        if (scene.countries[idx]) {
          scene.countries[idx].lineWidth = parseFloat(inp.value);
          onUpdate();
        }
      });
    });
  }

  /**
   * Renders Properties Panel when a 3D Actor is selected on map.
   */
  render3DModelProperties(actor, onUpdate) {
    if (!this.propsPanel) return;
    if (this.propsTitle) this.propsTitle.textContent = '3D Model Properties';

    this.propsPanel.innerHTML = `
      <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
        <div style="font-size:14px;font-weight:700;color:var(--accent,#d4a957);">${actor.name || actor.modelId}</div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Size (km): <span id="val-size">${actor.sizeKm || 60}</span> km</label>
          <input type="range" id="prop-3d-size" min="10" max="400" value="${actor.sizeKm || 60}" style="width:100%;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Altitude (km): <span id="val-alt">${actor.altKm || 0}</span> km</label>
          <input type="range" id="prop-3d-alt" min="0" max="60" value="${actor.altKm || 0}" style="width:100%;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Heading: <span id="val-rot">${actor.rotationDeg || 0}</span>°</label>
          <input type="range" id="prop-3d-rot" min="0" max="360" value="${actor.rotationDeg || 0}" style="width:100%;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Tilt / Pitch: <span id="val-tilt">${actor.tiltDeg || 0}</span>°</label>
          <input type="range" id="prop-3d-tilt" min="-45" max="45" value="${actor.tiltDeg || 0}" style="width:100%;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Color Tint</label>
          <input type="color" id="prop-3d-color" value="${actor.color || '#5b6650'}" style="width:100%;height:34px;border:none;border-radius:6px;cursor:pointer;background:none;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Movement Mode</label>
          <select id="prop-3d-mode" style="width:100%;background:#181818;border:1px solid #333;color:#eee;padding:7px 10px;border-radius:6px;font-size:13px;margin-top:4px;">
            <option value="vehicle" ${actor.animMode === 'vehicle' ? 'selected' : ''}>Ground Vehicle (Road/Terrain)</option>
            <option value="aircraft" ${actor.animMode === 'aircraft' ? 'selected' : ''}>Aircraft (Takeoff/Bank)</option>
            <option value="ship" ${actor.animMode === 'ship' ? 'selected' : ''}>Naval Vessel (Water Path)</option>
            <option value="stationary" ${actor.animMode === 'stationary' ? 'selected' : ''}>Stationary Prop</option>
          </select>
        </div>

        <button id="prop-del-actor" style="margin-top:10px;padding:8px 12px;background:#ef4444;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Remove 3D Model</button>
      </div>
    `;

    const sizeInp = document.getElementById('prop-3d-size');
    const altInp = document.getElementById('prop-3d-alt');
    const rotInp = document.getElementById('prop-3d-rot');
    const tiltInp = document.getElementById('prop-3d-tilt');
    const colInp = document.getElementById('prop-3d-color');
    const modeSel = document.getElementById('prop-3d-mode');
    const delBtn = document.getElementById('prop-del-actor');

    if (sizeInp) {
      sizeInp.addEventListener('input', () => {
        actor.sizeKm = parseFloat(sizeInp.value);
        document.getElementById('val-size').textContent = actor.sizeKm;
        onUpdate({ sizeKm: actor.sizeKm });
      });
    }

    if (altInp) {
      altInp.addEventListener('input', () => {
        actor.altKm = parseFloat(altInp.value);
        document.getElementById('val-alt').textContent = actor.altKm;
        onUpdate({ altKm: actor.altKm });
      });
    }

    if (rotInp) {
      rotInp.addEventListener('input', () => {
        actor.rotationDeg = parseFloat(rotInp.value);
        document.getElementById('val-rot').textContent = actor.rotationDeg;
        onUpdate({ rotationDeg: actor.rotationDeg });
      });
    }

    if (tiltInp) {
      tiltInp.addEventListener('input', () => {
        actor.tiltDeg = parseFloat(tiltInp.value);
        document.getElementById('val-tilt').textContent = actor.tiltDeg;
        onUpdate({ tiltDeg: actor.tiltDeg });
      });
    }

    if (colInp) {
      colInp.addEventListener('input', () => {
        actor.color = colInp.value;
        onUpdate({ color: actor.color });
      });
    }

    if (modeSel) {
      modeSel.addEventListener('change', () => {
        actor.animMode = modeSel.value;
        onUpdate({ animMode: actor.animMode });
      });
    }

    if (delBtn) {
      delBtn.addEventListener('click', () => {
        this.app.remove3DActor(actor.id);
      });
    }
  }

  /**
   * Renders Historical Empire Era Slider properties.
   */
  renderHistoricalProperties(country, onUpdate) {
    if (!this.propsPanel) return;
    if (this.propsTitle) this.propsTitle.textContent = 'Historical Empire';

    const snapshots = country.snapshots || [];
    const minYear = snapshots.length > 0 ? snapshots[0].year : 1299;
    const maxYear = snapshots.length > 0 ? snapshots[snapshots.length - 1].year : 1922;
    const currentYear = country.currentYear || minYear;

    this.propsPanel.innerHTML = `
      <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
        <div style="font-size:15px;font-weight:700;color:var(--accent,#d4a957);">${country.name}</div>
        <div style="font-size:12px;color:#888;">Historical Era Expansion Timeline</div>

        <div class="props-field" style="margin-top:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Active Era Year</label>
            <span id="val-era-year" style="font-size:14px;font-weight:700;color:var(--accent,#d4a957);">${currentYear} CE</span>
          </div>
          <input type="range" id="prop-era-slider" min="${minYear}" max="${maxYear}" value="${currentYear}" 
                 style="width:100%;margin-top:8px;" />
          <div style="display:flex;justify-content:space-between;font-size:10px;color:#666;margin-top:4px;">
            <span>${minYear} CE</span>
            <span>${maxYear} CE</span>
          </div>
        </div>

        <div style="margin-top:10px;">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Color & Opacity</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px;">
            <input type="color" id="prop-hist-color" value="${country.fillColor || '#d4a957'}" style="width:100%;height:32px;border:none;border-radius:6px;cursor:pointer;background:none;" />
            <input type="range" id="prop-hist-opacity" min="0.1" max="1.0" step="0.05" value="${country.fillOpacity || 0.6}" style="width:100%;" />
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('prop-era-slider');
    const yearVal = document.getElementById('val-era-year');
    if (slider) {
      slider.addEventListener('input', () => {
        const y = parseInt(slider.value, 10);
        if (yearVal) yearVal.textContent = `${y} CE`;
        country.currentYear = y;
        onUpdate({ year: y });
      });
    }

    const colInp = document.getElementById('prop-hist-color');
    if (colInp) {
      colInp.addEventListener('input', () => {
        country.fillColor = colInp.value;
        onUpdate({ fillColor: country.fillColor });
      });
    }

    const opInp = document.getElementById('prop-hist-opacity');
    if (opInp) {
      opInp.addEventListener('input', () => {
        country.fillOpacity = parseFloat(opInp.value);
        onUpdate({ fillOpacity: country.fillOpacity });
      });
    }
  }

  /**
   * Renders Tactical Arrow Properties.
   */
  renderArrowProperties(arrow, onUpdate) {
    if (!this.propsPanel) return;
    if (this.propsTitle) this.propsTitle.textContent = 'Tactical Arrow';

    this.propsPanel.innerHTML = `
      <div style="padding:14px;display:flex;flex-direction:column;gap:12px;">
        <div style="font-size:14px;font-weight:700;color:var(--accent,#d4a957);">Tactical Movement Arrow</div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Arrow Color</label>
          <input type="color" id="prop-arr-color" value="${arrow.color || '#d4a957'}" 
                 style="width:100%;height:34px;border:none;border-radius:6px;cursor:pointer;background:none;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Thickness: <span id="val-arr-width">${arrow.width || 4}</span>px</label>
          <input type="range" id="prop-arr-width" min="1" max="14" value="${arrow.width || 4}" style="width:100%;margin-top:4px;" />
        </div>

        <div class="props-field">
          <label style="font-size:11px;color:#888;text-transform:uppercase;font-weight:600;">Head Size: <span id="val-arr-head">${arrow.headSize || 18}</span>px</label>
          <input type="range" id="prop-arr-head" min="8" max="40" value="${arrow.headSize || 18}" style="width:100%;margin-top:4px;" />
        </div>

        <button id="prop-del-arrow" style="margin-top:14px;padding:8px 12px;background:#ef4444;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Remove Arrow</button>
      </div>
    `;

    const colInp = document.getElementById('prop-arr-color');
    if (colInp) {
      colInp.addEventListener('input', () => {
        arrow.color = colInp.value;
        onUpdate({ color: arrow.color });
      });
    }

    const wInp = document.getElementById('prop-arr-width');
    if (wInp) {
      wInp.addEventListener('input', () => {
        arrow.width = parseInt(wInp.value, 10);
        document.getElementById('val-arr-width').textContent = arrow.width;
        onUpdate({ width: arrow.width });
      });
    }

    const hInp = document.getElementById('prop-arr-head');
    if (hInp) {
      hInp.addEventListener('input', () => {
        arrow.headSize = parseInt(hInp.value, 10);
        document.getElementById('val-arr-head').textContent = arrow.headSize;
        onUpdate({ headSize: arrow.headSize });
      });
    }

    const delBtn = document.getElementById('prop-del-arrow');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        this.app.removeAnnotation(arrow.id);
      });
    }
  }
}
