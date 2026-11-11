/**
 * Studio Script to Video Engine (Atlas / AMM Studio Dito Style)
 * Automatically parses scripts, detects scenes, camera choreographies,
 * maps geographic entities, places animated motion stickers, and syncs
 * live karaoke subtitles and voiceover narration.
 */

window.StudioScriptVideo = (() => {
    // State
    let _isOpen = false;
    let _activeTab = 'editor'; // 'editor' | 'ai'
    let _parsedShots = [];
    let _currentRawScript = '';
    let _activeTemplateKey = null;
    let _isWorking = false;
    
    // Voiceover & Captions settings
    let _includeVoiceover = false;
    let _selectedVoice = null;
    let _speechRate = 1.0;
    let _enableKaraokeCaptions = true;
    let _autoActionStickers = true;
    let _dynamic3DCamera = true;
    
    // Playback state
    let _activeUtterance = null;
    let _activePreviewGroupId = null;
    
    // Punctuation & Abbreviations matching Atlas scriptPlan
    const ABBREVIATIONS = new Set([
        'mr', 'mrs', 'ms', 'dr', 'prof', 'st', 'mt', 'vs', 'etc',
        'e.g', 'i.e', 'approx', 'no', 'gen', 'col', 'capt', 'lt'
    ]);

    // Built-in country aliases
    const COUNTRY_ALIASES = {
        "usa": "United States", "america": "United States", "us": "United States",
        "uk": "United Kingdom", "britain": "United Kingdom", "england": "United Kingdom",
        "scotland": "United Kingdom", "wales": "United Kingdom",
        "russia": "Russia", "ussr": "Russia", "soviet union": "Russia",
        "prussia": "Germany", "deutschland": "Germany",
        "rome": "Italy", "italia": "Italy",
        "persia": "Iran",
        "cairo": "Egypt",
        "holland": "Netherlands",
        "ottoman": "Turkey", "turkiye": "Turkey"
    };

    // Action sticker mapping
    const ACTION_STICKERS = [
        {
            regex: /\b(invad\w*|attack\w*|bomb\w*|strike\w*|blitzkrieg|conquer\w*|storm\w*|clash\w*|battle|siege|war|fire|explod\w*|explosion|combat)\b/i,
            file: "Animated fire.svg",
            name: "Animated Fire",
            glowColor: "#ff4400"
        },
        {
            regex: /\b(tank\w*|armor\w*|panzer\w*|division\w*|artillery)\b/i,
            file: "Military tank v1.svg",
            name: "Military Tank",
            glowColor: "#ffaa00"
        },
        {
            regex: /\b(march\w*|travel\w*|advanc\w*|journey\w*|cross\w*|sail\w*|migrat\w*|fle\w*|retreat\w*|mov\w*|push\w*|route)\b/i,
            file: "Drawing arrow.svg",
            name: "Drawing Arrow",
            glowColor: "#e8b33b"
        },
        {
            regex: /\b(treaty|alliance|sign\w*|peace|treaties|declar\w*|agreement|capital|liberat\w*|independen\w*|crown\w*|pact)\b/i,
            file: "Flag marker.svg",
            name: "Flag Marker",
            glowColor: "#00d4ff"
        },
        {
            regex: /\b(navy|fleet|naval|warship\w*|sea|ocean|island|coastal|water)\b/i,
            file: "Warship v1.svg",
            name: "Warship",
            glowColor: "#0088ff"
        },
        {
            regex: /\b(air force|bomber\w*|jet\w*|aircraft|fly\w*|air strike|aerial)\b/i,
            file: "Fighter jet v1.svg",
            name: "Fighter Jet",
            glowColor: "#ff0055"
        }
    ];

    // Default template scripts
    const TEMPLATES = {
        "ww2_europe": {
            title: "World War II in Europe",
            script: `[Scene 1: Europe | 0:00 - 0:04 | wide]
In September 1939, crisis gripped the European continent.

[Scene 2: Germany & Poland | 0:04 - 0:09 | close-up]
German forces launched a sudden invasion of Poland, triggering World War II.

[Scene 3: United Kingdom & France | 0:09 - 0:14 | orbit]
The United Kingdom and France honored their mutual treaties and declared war.

[Scene 4: Russia | 0:14 - 0:19 | fly]
Two years later, German armor pushed deep into the Soviet Union in Operation Barbarossa.`
        },
        "roman_empire": {
            title: "Rise of the Roman Empire",
            script: `[Scene 1: Italy | 0:00 - 0:04 | wide]
From the hills of central Italy, the Roman Republic steadily consolidated power.

[Scene 2: Greece & Egypt | 0:04 - 0:09 | close-up]
Roman legions expanded across Greece and annexed Egypt under Emperor Augustus.

[Scene 3: France & Spain | 0:09 - 0:14 | fly]
Julius Caesar conquered Gaul, securing western Europe for generations.

[Scene 4: United Kingdom | 0:14 - 0:19 | orbit]
At its peak, the Empire reached north to Britannia, master of the Mediterranean Sea.`
        },
        "cold_war": {
            title: "The Cold War Divide",
            script: `[Scene 1: United States & Russia | 0:00 - 0:05 | wide]
Following World War II, two nuclear superpowers stood face-to-face.

[Scene 2: Germany | 0:05 - 0:10 | close-up]
Divided Germany and the Berlin Wall became the frontline of the Cold War.

[Scene 3: Cuba | 0:10 - 0:15 | orbit]
In 1962, the Cuban Missile Crisis brought humanity to the brink of nuclear war.

[Scene 4: Vietnam | 0:15 - 0:20 | fly]
Tensions ignited into proxy conflicts across the globe, from Korea to Vietnam.`
        },
        "silk_road": {
            title: "The Ancient Silk Road",
            script: `[Scene 1: China | 0:00 - 0:04 | wide]
Caravans carrying precious silk and jade departed ancient Chang'an in China.

[Scene 2: Iran & Turkey | 0:04 - 0:09 | fly]
Merchants traversed rugged mountain passes and trading oases across Persia.

[Scene 3: Italy | 0:09 - 0:14 | orbit]
Goods arrived in Constantinople and Venetian ports, transforming European commerce.`
        },
        "alexander": {
            title: "Campaigns of Alexander the Great",
            script: `[Scene 1: Greece | 0:00 - 0:04 | wide]
Young King Alexander assembled the Macedonian phalanx to confront the Persian Empire.

[Scene 2: Egypt | 0:04 - 0:08 | close-up]
He marched south to Egypt, being hailed as pharaoh and founding Alexandria.

[Scene 3: Iran & Iraq | 0:08 - 0:13 | fly]
Alexander shattered Persian forces at Gaugamela and captured the grand capital of Persepolis.

[Scene 4: India | 0:13 - 0:18 | orbit]
His battle-hardened troops advanced east across the Indus River before turning back.`
        }
    };

    /**
     * Splits text into individual sentences with abbreviation protection
     */
    function splitSentences(text) {
        const clean = (text || '').replace(/\s+/g, ' ').trim();
        if (!clean) return [];

        const parts = clean.split(/(?<=[.!?…؟۔])\s+/);
        const merged = [];

        for (const p of parts) {
            const trimmed = p.trim();
            if (!trimmed) continue;

            if (merged.length > 0) {
                const words = merged[merged.length - 1].replace(/[.!?…]+$/, '').split(/\s+/);
                const last = words[words.length - 1].toLowerCase();
                if (ABBREVIATIONS.has(last)) {
                    merged[merged.length - 1] += ' ' + trimmed;
                    continue;
                }
            }
            merged.push(trimmed);
        }
        return merged;
    }

    /**
     * Extracts word count
     */
    function countWords(text) {
        const matches = (text || '').match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’-]*/gu);
        return matches ? matches.length : 0;
    }

    /**
     * Estimates duration at 2.5 words/sec, bounded [2.5, 300]
     */
    function estimateDuration(words, wps = 2.5) {
        const dur = words / Math.max(0.5, wps);
        return Math.round(Math.max(2.5, Math.min(300, dur)) * 10) / 10;
    }

    /**
     * Extracts country entities from text
     */
    function extractCountries(text) {
        if (!text) return [];
        const lower = text.toLowerCase();
        const found = [];

        // Check aliases
        for (const [alias, standard] of Object.entries(COUNTRY_ALIASES)) {
            const re = new RegExp(`\\b${alias}\\b`, 'i');
            if (re.test(lower) && !found.includes(standard)) {
                found.push(standard);
            }
        }

        // Check StudioCore country list if loaded
        if (typeof StudioCore !== 'undefined' && StudioCore.getCountryList) {
            const allCountries = StudioCore.getCountryList();
            for (const c of allCountries) {
                const re = new RegExp(`\\b${c}\\b`, 'i');
                if (re.test(text) && !found.includes(c)) {
                    found.push(c);
                }
            }
        }

        return found;
    }

    /**
     * Detects action stickers based on verbs
     */
    function detectStickers(text) {
        if (!_autoActionStickers || !text) return [];
        const result = [];
        for (const s of ACTION_STICKERS) {
            if (s.regex.test(text)) {
                result.push({
                    file: s.file,
                    name: s.name,
                    glowColor: s.glowColor
                });
            }
        }
        return result.slice(0, 2);
    }

    /**
     * Detects camera intent
     */
    function detectCamera(text) {
        const lower = (text || '').toLowerCase();
        if (/\b(wide|far out|continent|overview)\b/.test(lower)) return 'wide';
        if (/\b(orbit|circle|spin|rotate)\b/.test(lower)) return 'orbit';
        if (/\b(fly|flies|glide|travel to)\b/.test(lower)) return 'fly';
        if (/\b(tilt|3d|angle|perspective)\b/.test(lower)) return 'tilt';
        return 'close-up';
    }

    /**
     * Parses tagged script or raw prose into shot breakdown
     */
    function parseScriptText(scriptText) {
        const raw = (scriptText || '').trim();
        if (!raw) return [];

        const hasTags = /\[(?:Scene|Shot|Part)?\s*#?\d*:?.*?\]|\((?:Scene|Shot|Part)?\s*#?\d*:?.*?\)/i.test(raw);
        if (hasTags) {
            return parseTagged(raw);
        } else {
            return parseProse(raw);
        }
    }

    function parseTagged(raw) {
        const shots = [];
        let current = null;

        const lines = raw.split(/\r?\n/);
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            const tagMatch = /^\[(?:Scene|Shot|Part)?\s*#?(\d+)?:?\s*(.*?)(?:\|\s*(.*?))?\]/i.exec(trimmed) ||
                             /^\((?:Scene|Shot|Part)?\s*#?(\d+)?:?\s*(.*?)(?:\|\s*(.*?))?\)/i.exec(trimmed);

            if (tagMatch) {
                if (current && current.spoken) shots.push(current);

                const shotIdx = tagMatch[1] ? parseInt(tagMatch[1], 10) : shots.length + 1;
                const body = (tagMatch[2] || '').trim();
                const extra = (tagMatch[3] || '').trim();
                const combined = `${body} ${extra}`;

                const countries = extractCountries(combined);
                const camera = detectCamera(combined);

                // Timing match 0:00 - 0:05
                const timeMatch = /(\d+:\d+|\d+)\s*[-–—]\s*(\d+:\d+|\d+)/.exec(combined);
                let durationOverride = null;
                if (timeMatch) {
                    const toSec = (str) => str.includes(':') ? parseInt(str.split(':')[0], 10)*60 + parseFloat(str.split(':')[1]) : parseFloat(str);
                    const s1 = toSec(timeMatch[1]);
                    const s2 = toSec(timeMatch[2]);
                    if (s2 > s1) durationOverride = Math.round((s2 - s1) * 10) / 10;
                }

                current = {
                    index: shots.length,
                    shotNumber: shotIdx,
                    title: `Scene ${shotIdx}: ${body.split('|')[0].trim() || 'Shot'}`,
                    tag: body,
                    countries: countries,
                    camera: camera,
                    durationOverride: durationOverride,
                    spoken: '',
                    stickers: detectStickers(combined)
                };
            } else {
                if (!current) {
                    current = {
                        index: 0,
                        shotNumber: 1,
                        title: 'Scene 1',
                        tag: '',
                        countries: [],
                        camera: 'close-up',
                        durationOverride: null,
                        spoken: '',
                        stickers: []
                    };
                }
                current.spoken = current.spoken ? `${current.spoken} ${trimmed}` : trimmed;
            }
        }
        if (current && current.spoken) shots.push(current);

        // Refine shots
        for (const shot of shots) {
            const speechCountries = extractCountries(shot.spoken);
            for (const sc of speechCountries) {
                if (!shot.countries.includes(sc)) shot.countries.push(sc);
            }
            const speechStickers = detectStickers(shot.spoken);
            for (const ss of speechStickers) {
                if (!shot.stickers.some(existing => existing.file === ss.file)) {
                    shot.stickers.push(ss);
                }
            }
            const wCount = countWords(shot.spoken);
            shot.wordCount = wCount;
            shot.durationSec = shot.durationOverride || estimateDuration(wCount, _speechRate * 2.5);
            if (!shot.camera || shot.camera === 'close-up') shot.camera = detectCamera(shot.spoken);
        }
        return shots;
    }

    function parseProse(raw) {
        const sentences = splitSentences(raw);
        const shots = [];

        for (let i = 0; i < sentences.length; i++) {
            const s = sentences[i];
            const countries = extractCountries(s);
            const stickers = detectStickers(s);
            const camera = detectCamera(s);
            const wCount = countWords(s);
            const dur = estimateDuration(wCount, _speechRate * 2.5);

            shots.push({
                index: i,
                shotNumber: i + 1,
                title: `Scene ${i + 1}: ${countries[0] || 'Shot ' + (i + 1)}`,
                tag: countries[0] || '',
                countries: countries,
                camera: camera,
                spoken: s,
                durationSec: dur,
                wordCount: wCount,
                stickers: stickers
            });
        }
        return shots;
    }

    /**
     * Calculates center coordinate for country
     */
    function getCountryCenter(countryName) {
        if (typeof turf === 'undefined' || typeof StudioCore === 'undefined') return [10, 50];
        const geojson = StudioCore.countriesGeoJSON;
        if (!geojson || !geojson.features) return [10, 50];

        const lower = countryName.toLowerCase();
        const feat = geojson.features.find(f => {
            const props = f.properties || {};
            const name = (props.NAME || props.ADMIN || props.name || '').toLowerCase();
            return name === lower;
        });

        if (!feat) return [10, 50];
        try {
            const pt = turf.pointOnFeature(feat);
            return pt.geometry.coordinates;
        } catch (e) {
            try {
                const center = turf.center(feat);
                return center.geometry.coordinates;
            } catch (e2) {
                return [10, 50];
            }
        }
    }

    /**
     * Mounts and builds the DOM modal
     */
    function ensureModal() {
        if (document.getElementById('modalScriptToVideo')) return;

        const overlay = document.createElement('div');
        overlay.id = 'modalScriptToVideo';
        overlay.className = 'stv-modal-overlay';
        overlay.innerHTML = `
            <div class="stv-modal" role="dialog" aria-modal="true" aria-labelledby="stvTitle">
                <!-- Header -->
                <div class="stv-header">
                    <div class="stv-icon-badge">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                    </div>
                    <div class="stv-header-text">
                        <h2 class="stv-header-title" id="stvTitle">
                            Script → video
                        </h2>
                        <p class="stv-header-subtitle">Write it, add your voice, press Create — the map video builds itself</p>
                    </div>
                    <button class="stv-close-btn" onclick="StudioScriptVideo.closeModal()" aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <!-- Tabs -->
                <div class="stv-tabs">
                    <button class="stv-tab-btn active" id="stvTabEditor" onclick="StudioScriptVideo.setTab('editor')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Write / Paste Script
                    </button>
                    <button class="stv-tab-btn" id="stvTabAI" onclick="StudioScriptVideo.setTab('ai')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"/></svg>
                        AI Script Director
                    </button>
                </div>

                <!-- Body -->
                <div class="stv-body">
                    <!-- Editor Tab Pane -->
                    <div id="stvPaneEditor" style="display:flex;flex-direction:column;gap:14px;">
                        <!-- Templates row -->
                        <div class="stv-templates-row">
                            <span class="stv-templates-label">Quick Templates:</span>
                            <button class="stv-template-chip" onclick="StudioScriptVideo.loadTemplate('ww2_europe')">WWII Europe</button>
                            <button class="stv-template-chip" onclick="StudioScriptVideo.loadTemplate('roman_empire')">Roman Empire</button>
                            <button class="stv-template-chip" onclick="StudioScriptVideo.loadTemplate('cold_war')">Cold War</button>
                            <button class="stv-template-chip" onclick="StudioScriptVideo.loadTemplate('silk_road')">Silk Road</button>
                            <button class="stv-template-chip" onclick="StudioScriptVideo.loadTemplate('alexander')">Alexander the Great</button>
                        </div>

                        <!-- Textarea -->
                        <div class="stv-textarea-wrap">
                            <textarea id="stvScriptInput" class="stv-textarea" placeholder="Paste your script here, or write shots with [Scene: Place | time | camera]...&#10;&#10;e.g.&#10;In 1939, Germany invaded Poland with rapid armored divisions.&#10;Britain and France declared war in response.&#10;Later, the Eastern Front ignited across the Soviet Union." oninput="StudioScriptVideo.onScriptChange()"></textarea>
                        </div>

                        <!-- Live Stats Bar -->
                        <div class="stv-stats-bar">
                            <span class="stv-stat-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                <span id="stvWordCount">0</span> words
                            </span>
                            <span class="stv-stat-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                ~<span id="stvDuration">0.0</span>s
                            </span>
                            <span class="stv-stat-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                                <span id="stvShotCount">0</span> scenes
                            </span>
                            <div class="stv-entity-pills" id="stvDetectedPills"></div>
                        </div>
                    </div>

                    <!-- AI Tab Pane -->
                    <div id="stvPaneAI" style="display:none;" class="stv-ai-section">
                        <input type="text" id="stvAiPrompt" class="stv-ai-prompt-input" placeholder="e.g. The Expansion of the Mongol Empire across Eurasia">
                        
                        <div class="stv-ai-options-grid">
                            <div class="stv-ai-field">
                                <label for="stvPaceSelect">Narrative Pace</label>
                                <select id="stvPaceSelect" class="stv-select" onchange="StudioScriptVideo.onScriptChange()">
                                    <option value="normal" selected>Normal (2.5 words/s)</option>
                                    <option value="slow">Slow & Cinematic (2.0 words/s)</option>
                                    <option value="fast">Fast & Dynamic (3.2 words/s)</option>
                                    <option value="combat">War / Combat (3.5 words/s)</option>
                                </select>
                            </div>
                            <div class="stv-ai-field">
                                <label for="stvSceneCountSelect">Scene Count</label>
                                <select id="stvSceneCountSelect" class="stv-select">
                                    <option value="0" selected>Auto (Based on story)</option>
                                    <option value="3">3 Scenes (~15s)</option>
                                    <option value="4">4 Scenes (~20s)</option>
                                    <option value="6">6 Scenes (~30s)</option>
                                    <option value="8">8 Scenes (~45s)</option>
                                </select>
                            </div>
                        </div>

                        <button type="button" class="stv-ai-generate-btn" id="stvBtnAiGenerate" onclick="StudioScriptVideo.generateFromAI()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"/></svg>
                            Generate Script with AI Director
                        </button>
                    </div>

                    <!-- Options Bar -->
                    <div class="stv-options-bar">
                        <label class="stv-toggle-item">
                            <input type="checkbox" id="stvCheckSubtitles" checked onchange="StudioScriptVideo.onToggleOption('captions', this.checked)">
                            Animated Karaoke Subtitles
                        </label>
                        <label class="stv-toggle-item">
                            <input type="checkbox" id="stvCheckStickers" checked onchange="StudioScriptVideo.onToggleOption('stickers', this.checked)">
                            Auto-insert Motion Stickers
                        </label>
                        <label class="stv-toggle-item">
                            <input type="checkbox" id="stvCheck3D" checked onchange="StudioScriptVideo.onToggleOption('3d', this.checked)">
                            Dynamic 3D Camera Angles
                        </label>
                        <label class="stv-toggle-item">
                            <input type="checkbox" id="stvCheckVoiceover" onchange="StudioScriptVideo.onToggleOption('voiceover', this.checked)">
                            Voiceover Speech Narration
                        </label>
                    </div>

                    <!-- Scene Review Cards -->
                    <div class="stv-scenes-section">
                        <div class="stv-scenes-head">
                            <span class="stv-scenes-title">SCENE BREAKDOWN PREVIEW</span>
                            <span style="font-size:11px;color:#8f8a7c;" id="stvReviewSummary">0 scenes</span>
                        </div>
                        <div class="stv-cards-list" id="stvCardsList">
                            <div style="color:#5f5b51;font-size:12px;text-align:center;padding:16px;">Type or paste a script above to see scene previews.</div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="stv-footer">
                    <div class="stv-footer-info" id="stvFooterInfo">
                        Ready to build map video from script.
                    </div>
                    <div class="stv-footer-actions">
                        <button class="stv-btn-cancel" onclick="StudioScriptVideo.closeModal()">Cancel</button>
                        <button class="stv-btn-create" id="stvBtnCreate" onclick="StudioScriptVideo.applyToProject()">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            <span id="stvBtnCreateText">Create Video</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Subtitle Overlay inside Map Viewport
        if (!document.getElementById('studioSubtitleOverlay')) {
            const vp = document.getElementById('mapViewport');
            if (vp) {
                const sub = document.createElement('div');
                sub.id = 'studioSubtitleOverlay';
                sub.className = 'studio-subtitle-overlay';
                sub.style.display = 'none';
                sub.innerHTML = `
                    <div class="studio-subtitle-box">
                        <span id="studioSubtitleText" class="studio-subtitle-text"></span>
                    </div>
                `;
                vp.appendChild(sub);
            }
        }
    }

    /**
     * UI event handlers
     */
    function openModal() {
        ensureModal();
        const overlay = document.getElementById('modalScriptToVideo');
        if (overlay) {
            overlay.classList.add('active');
            _isOpen = true;
            // Load initial template if empty
            const input = document.getElementById('stvScriptInput');
            if (input && !input.value.trim()) {
                loadTemplate('ww2_europe');
            } else {
                onScriptChange();
            }
        }
    }

    function closeModal() {
        const overlay = document.getElementById('modalScriptToVideo');
        if (overlay) overlay.classList.remove('active');
        _isOpen = false;
    }

    function setTab(tabName) {
        _activeTab = tabName;
        const btnEditor = document.getElementById('stvTabEditor');
        const btnAI = document.getElementById('stvTabAI');
        const paneEditor = document.getElementById('stvPaneEditor');
        const paneAI = document.getElementById('stvPaneAI');

        if (tabName === 'editor') {
            btnEditor.classList.add('active');
            btnAI.classList.remove('active');
            paneEditor.style.display = 'flex';
            paneAI.style.display = 'none';
        } else {
            btnAI.classList.add('active');
            btnEditor.classList.remove('active');
            paneAI.style.display = 'flex';
            paneEditor.style.display = 'none';
        }
    }

    function loadTemplate(key) {
        const tmpl = TEMPLATES[key];
        if (!tmpl) return;
        _activeTemplateKey = key;
        const input = document.getElementById('stvScriptInput');
        if (input) {
            input.value = tmpl.script;
            onScriptChange();
        }
        setTab('editor');
    }

    function onScriptChange() {
        const input = document.getElementById('stvScriptInput');
        if (!input) return;
        const text = input.value;
        _currentRawScript = text;

        const paceSel = document.getElementById('stvPaceSelect');
        const pace = paceSel ? paceSel.value : 'normal';
        _speechRate = pace === 'slow' ? 0.8 : pace === 'fast' ? 1.3 : pace === 'combat' ? 1.4 : 1.0;

        _parsedShots = parseScriptText(text);

        // Update stats
        const totalWords = _parsedShots.reduce((acc, s) => acc + s.wordCount, 0);
        const totalDur = _parsedShots.reduce((acc, s) => acc + s.durationSec, 0);

        const elWords = document.getElementById('stvWordCount');
        const elDur = document.getElementById('stvDuration');
        const elShots = document.getElementById('stvShotCount');
        const elPills = document.getElementById('stvDetectedPills');

        if (elWords) elWords.textContent = totalWords;
        if (elDur) elDur.textContent = totalDur.toFixed(1);
        if (elShots) elShots.textContent = _parsedShots.length;

        // Render detected pills
        if (elPills) {
            const allCountries = Array.from(new Set(_parsedShots.flatMap(s => s.countries)));
            const allStickers = Array.from(new Set(_parsedShots.flatMap(s => s.stickers.map(st => st.name))));
            
            let pillsHtml = allCountries.map(c => `<span class="stv-entity-pill">🗺️ ${c}</span>`).join('');
            pillsHtml += allStickers.map(st => `<span class="stv-sticker-pill">🔥 ${st}</span>`).join('');
            elPills.innerHTML = pillsHtml;
        }

        renderReviewCards();
    }

    function renderReviewCards() {
        const list = document.getElementById('stvCardsList');
        const summary = document.getElementById('stvReviewSummary');
        if (!list) return;

        if (!_parsedShots.length) {
            list.innerHTML = `<div style="color:#5f5b51;font-size:12px;text-align:center;padding:16px;">Type or paste a script above to see scene previews.</div>`;
            if (summary) summary.textContent = '0 scenes';
            return;
        }

        if (summary) summary.textContent = `${_parsedShots.length} scenes • ${_parsedShots.reduce((a, s) => a + s.durationSec, 0).toFixed(1)}s total`;

        let timeOffset = 0;
        list.innerHTML = _parsedShots.map((shot, idx) => {
            const startSec = timeOffset;
            const endSec = timeOffset + shot.durationSec;
            timeOffset = endSec;

            const countryTags = shot.countries.map(c => `<span class="stv-entity-pill">${c}</span>`).join(' ') || '<span style="color:#666;font-size:11px;">(Overview)</span>';
            const stickerTags = shot.stickers.map(st => `<span class="stv-sticker-pill">✨ ${st.name}</span>`).join(' ');

            return `
                <div class="stv-scene-card">
                    <div class="stv-card-header">
                        <div class="stv-card-badge">
                            <span>Scene ${idx + 1}</span>
                            <span class="stv-card-timing">${startSec.toFixed(1)}s - ${endSec.toFixed(1)}s (${shot.durationSec}s)</span>
                        </div>
                        <div class="stv-card-tags">
                            <span style="font-size:11px;color:#8f8a7c;text-transform:uppercase;">📹 ${shot.camera}</span>
                            ${stickerTags}
                        </div>
                    </div>
                    <div style="font-size:11.5px;color:#d4a957;font-weight:600;">Targets: ${countryTags}</div>
                    <p class="stv-card-text">"${shot.spoken}"</p>
                </div>
            `;
        }).join('');
    }

    function onToggleOption(opt, checked) {
        if (opt === 'captions') _enableKaraokeCaptions = checked;
        if (opt === 'stickers') {
            _autoActionStickers = checked;
            onScriptChange();
        }
        if (opt === '3d') _dynamic3DCamera = checked;
        if (opt === 'voiceover') _includeVoiceover = checked;
    }

    /**
     * AI generation from prompt
     */
    async function generateFromAI() {
        const promptInput = document.getElementById('stvAiPrompt');
        const prompt = (promptInput ? promptInput.value : '').trim();
        if (!prompt) return;

        const btn = document.getElementById('stvBtnAiGenerate');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<span class="stv-spinner"></span> Generating scene plan...`;
        }

        const paceSel = document.getElementById('stvPaceSelect');
        const pace = paceSel ? paceSel.value : 'normal';
        const sceneCountSel = document.getElementById('stvSceneCountSelect');
        const sceneCount = sceneCountSel ? parseInt(sceneCountSel.value, 10) : 0;

        try {
            const resp = await fetch('/api/ai/script-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, pace, scene_count: sceneCount })
            });
            const data = await resp.json();
            if (data.ok && data.script) {
                const input = document.getElementById('stvScriptInput');
                if (input) input.value = data.script;
                onScriptChange();
                setTab('editor');
            }
        } catch (e) {
            console.error('AI script generation failed, falling back to local generator', e);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"/></svg>
                    Generate Script with AI Director
                `;
            }
        }
    }

    /**
     * Applies parsed scenes to Studio sequence
     */
    async function applyToProject() {
        if (!_parsedShots.length) return;
        if (typeof StudioCore === 'undefined') {
            alert('Studio Core is not loaded.');
            return;
        }

        const btn = document.getElementById('stvBtnCreate');
        const btnText = document.getElementById('stvBtnCreateText');
        if (btn) {
            btn.disabled = true;
            if (btnText) btnText.textContent = 'Building Map Video...';
        }

        try {
            // Confirm replace if timeline already has items
            const currentSeq = StudioCore.getSequence ? StudioCore.getSequence() : [];
            if (currentSeq.length > 0) {
                if (StudioCore.clearAll) StudioCore.clearAll();
            }

            // Set project title
            const titleInput = document.getElementById('projectNameInput');
            const newTitle = (_activeTemplateKey && TEMPLATES[_activeTemplateKey]) ? TEMPLATES[_activeTemplateKey].title : 'Script Video Project';
            if (titleInput) titleInput.value = newTitle;
            if (StudioCore.setProjectName) StudioCore.setProjectName(newTitle);

            // Add each shot
            for (let i = 0; i < _parsedShots.length; i++) {
                const shot = _parsedShots[i];
                const countries = shot.countries.length ? shot.countries : ['Germany'];

                // 1. Add country group
                const group = StudioCore.addCountryGroup(countries);
                if (group) {
                    group.holdDurationSec = shot.durationSec;
                    group.label = shot.title;
                    group.narration = shot.spoken;

                    // 2. Camera settings
                    if (_dynamic3DCamera) {
                        const pitch = shot.camera === 'wide' ? 25 : shot.camera === 'orbit' ? 52 : 48;
                        const bearing = shot.camera === 'orbit' ? 30 : shot.camera === 'fly' ? 15 : 0;
                        group.cameraOverride = {
                            pitch: pitch,
                            bearing: bearing
                        };
                    }

                    // 3. Action stickers
                    if (_autoActionStickers && shot.stickers.length) {
                        const targetCountry = countries[0];
                        const center = getCountryCenter(targetCountry);
                        for (const st of shot.stickers) {
                            StudioCore.addAnnotation('image', {
                                name: st.name,
                                url: `/static/animations/${encodeURIComponent(st.file)}`,
                                isSticker: true,
                                stickerId: st.file.replace('.svg', ''),
                                lngLat: center,
                                scale: 1.1,
                                glow: true,
                                glowColor: st.glowColor,
                                rotation: 0,
                                groupId: group.id
                            });
                        }
                    }
                }
            }

            // Clean & refresh
            if (StudioCore.cleanSequence) StudioCore.cleanSequence();
            if (typeof StudioTimeline !== 'undefined' && StudioTimeline.render) StudioTimeline.render();
            if (typeof StudioMap !== 'undefined' && StudioMap.refreshCurrentView) StudioMap.refreshCurrentView();

            closeModal();
        } catch (e) {
            console.error('[ScriptToVideo] Error creating video:', e);
            alert('Error generating map animation: ' + e.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                if (btnText) btnText.textContent = 'Create Video';
            }
        }
    }

    /**
     * Real-time preview subtitle sync & karaoke
     */
    function onPreviewSceneStep(groupIdx, progress) {
        if (!_enableKaraokeCaptions) return;
        const subOverlay = document.getElementById('studioSubtitleOverlay');
        const subText = document.getElementById('studioSubtitleText');
        if (!subOverlay || !subText) return;

        if (typeof StudioCore === 'undefined') return;
        const seq = StudioCore.getSequence ? StudioCore.getSequence() : [];
        const groups = seq.filter(item => item && item.type === 'countryGroup');
        const currentGroup = groups[groupIdx];

        if (!currentGroup || !currentGroup.narration) {
            subOverlay.style.display = 'none';
            return;
        }

        subOverlay.style.display = 'block';
        const spoken = currentGroup.narration;
        const words = spoken.split(/\s+/).filter(Boolean);

        // Karaoke highlighting based on progress fraction
        const activeWordIndex = Math.min(words.length - 1, Math.floor(words.length * Math.max(0, Math.min(1, progress))));

        subText.innerHTML = words.map((w, idx) => {
            const cls = idx === activeWordIndex ? 'studio-subtitle-word active' : 'studio-subtitle-word';
            return `<span class="${cls}">${w}</span>`;
        }).join(' ');

        // Speak utterance if voiceover enabled and starting scene
        if (_includeVoiceover && 'speechSynthesis' in window && _activePreviewGroupId !== currentGroup.id) {
            _activePreviewGroupId = currentGroup.id;
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(spoken);
                utter.rate = _speechRate;
                window.speechSynthesis.speak(utter);
            } catch (e) {}
        }
    }

    function onPreviewStop() {
        const subOverlay = document.getElementById('studioSubtitleOverlay');
        if (subOverlay) subOverlay.style.display = 'none';
        _activePreviewGroupId = null;
        if ('speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
    }

    /**
     * Renders subtitles to high-dpi canvas during video export
     */
    function renderSubtitlesToCanvas(ctx, canvasWidth, canvasHeight, currentSec) {
        if (!_enableKaraokeCaptions || !ctx) return;
        if (typeof StudioCore === 'undefined') return;

        const seq = StudioCore.getSequence ? StudioCore.getSequence() : [];
        const groups = seq.filter(item => item && item.type === 'countryGroup');
        if (!groups.length) return;

        // Find active group at currentSec
        let accum = 0;
        let activeGroup = null;
        let groupProgress = 0;

        for (const g of groups) {
            const dur = g.holdDurationSec || 2.5;
            if (currentSec >= accum && currentSec < accum + dur) {
                activeGroup = g;
                groupProgress = (currentSec - accum) / dur;
                break;
            }
            accum += dur;
        }

        if (!activeGroup || !activeGroup.narration) return;

        const text = activeGroup.narration;
        const words = text.split(/\s+/).filter(Boolean);
        const activeIdx = Math.min(words.length - 1, Math.floor(words.length * groupProgress));

        ctx.save();
        ctx.font = 'bold 24px Oswald, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Measure text
        const totalTextWidth = ctx.measureText(text).width;
        const pillWidth = totalTextWidth + 48;
        const pillHeight = 44;
        const pillX = (canvasWidth - pillWidth) / 2;
        const pillY = canvasHeight - 70;

        // Draw pill background
        ctx.fillStyle = 'rgba(18, 17, 14, 0.88)';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
        } else {
            ctx.rect(pillX, pillY, pillWidth, pillHeight);
        }
        ctx.fill();

        ctx.strokeStyle = 'rgba(232, 179, 59, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw words with karaoke highlight
        let cursorX = pillX + 24;
        const textY = pillY + pillHeight / 2;
        ctx.textAlign = 'left';

        for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? ' ' : '');
            const wWidth = ctx.measureText(word).width;

            if (i === activeIdx) {
                ctx.fillStyle = '#e8b33b'; // Highlight gold
                ctx.shadowColor = 'rgba(232, 179, 59, 0.8)';
                ctx.shadowBlur = 10;
            } else {
                ctx.fillStyle = '#f7f4ea';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
            }
            ctx.fillText(word, cursorX, textY);
            cursorX += wWidth;
        }

        ctx.restore();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureModal);
    } else {
        ensureModal();
    }

    // Public API
    return {
        openModal,
        closeModal,
        setTab,
        loadTemplate,
        onScriptChange,
        onToggleOption,
        generateFromAI,
        applyToProject,
        onPreviewSceneStep,
        onPreviewStop,
        renderSubtitlesToCanvas,
        isSubtitleEnabled: () => _enableKaraokeCaptions,
        parseScriptText
    };
})();

