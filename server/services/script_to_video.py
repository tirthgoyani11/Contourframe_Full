"""
Script to Video Engine for Contourframe Studio.
Provides:
  1. Sentence splitting and speech duration pacing matching Atlas scriptPlan algorithm.
  2. Geographic entity extraction (Modern countries, historical empires, major regions/cities).
  3. Action verb and motion sticker cue detection (fires, battles, arrows, tanks, flags).
  4. Camera choreographies (close-up, wide, orbit, fly, tilt).
  5. Built-in narrative templates and dynamic AI script generation.
"""

import re
import math
from typing import Dict, Any, List, Optional

# Pre-compiled regexes matching Atlas scriptPlan
WORD_REGEX = re.compile(r'[\w]+(?:[\'-][\w]+)*', re.UNICODE)
SENTENCE_END_REGEX = re.compile(r'[.!?…؟۔]')
ABBREVIATIONS = {
    'mr', 'mrs', 'ms', 'dr', 'prof', 'st', 'mt', 'vs', 'etc',
    'e.g', 'i.e', 'approx', 'no', 'gen', 'col', 'capt', 'lt'
}

# Country name dictionary with ISO codes, demonyms, and common aliases
COUNTRY_MAP = {
    "united states": "United States", "usa": "United States", "america": "United States", "us": "United States", "american": "United States",
    "united kingdom": "United Kingdom", "uk": "United Kingdom", "britain": "United Kingdom", "england": "United Kingdom", "british": "United Kingdom", "english": "United Kingdom",
    "scotland": "United Kingdom", "wales": "United Kingdom", "scottish": "United Kingdom", "welsh": "United Kingdom",
    "germany": "Germany", "deutschland": "Germany", "prussia": "Germany", "german": "Germany",
    "france": "France", "republic of france": "France", "french": "France",
    "poland": "Poland", "polska": "Poland", "polish": "Poland",
    "russia": "Russia", "soviet union": "Russia", "ussr": "Russia", "russian federation": "Russia", "russian": "Russia",
    "italy": "Italy", "italia": "Italy", "rome": "Italy", "italian": "Italy",
    "spain": "Spain", "espana": "Spain", "spanish": "Spain",
    "china": "China", "prc": "China", "chinese": "China",
    "japan": "Japan", "nippon": "Japan", "japanese": "Japan",
    "india": "India", "bharat": "India", "indian": "India",
    "greece": "Greece", "hellas": "Greece", "greek": "Greece",
    "turkey": "Turkey", "turkiye": "Turkey", "ottoman": "Turkey", "ottoman empire": "Turkey", "turkish": "Turkey",
    "egypt": "Egypt", "cairo": "Egypt", "egyptian": "Egypt",
    "ukraine": "Ukraine", "ukrainian": "Ukraine",
    "canada": "Canada", "canadian": "Canada",
    "australia": "Australia", "australian": "Australia",
    "brazil": "Brazil", "brazilian": "Brazil",
    "mexico": "Mexico", "mexican": "Mexico",
    "argentina": "Argentina", "argentinian": "Argentina",
    "south africa": "South Africa", "south african": "South Africa",
    "norway": "Norway", "norwegian": "Norway",
    "sweden": "Sweden", "swedish": "Sweden",
    "finland": "Finland", "finnish": "Finland",
    "denmark": "Denmark", "danish": "Denmark",
    "netherlands": "Netherlands", "holland": "Netherlands", "dutch": "Netherlands",
    "belgium": "Belgium", "belgian": "Belgium",
    "switzerland": "Switzerland", "swiss": "Switzerland",
    "austria": "Austria", "austria-hungary": "Austria", "austrian": "Austria",
    "portugal": "Portugal", "portuguese": "Portugal",
    "ireland": "Ireland", "irish": "Ireland",
    "czech republic": "Czech Republic", "czechia": "Czech Republic", "czech": "Czech Republic",
    "romania": "Romania", "romanian": "Romania",
    "hungary": "Hungary", "hungarian": "Hungary",
    "bulgaria": "Bulgaria", "bulgarian": "Bulgaria",
    "serbia": "Serbia", "yugoslavia": "Serbia", "serbian": "Serbia",
    "croatia": "Croatia", "croatian": "Croatia",
    "saudi arabia": "Saudi Arabia", "saudi": "Saudi Arabia",
    "iran": "Iran", "persia": "Iran", "iranian": "Iran",
    "iraq": "Iraq", "mesopotamia": "Iraq", "iraqi": "Iraq",
    "israel": "Israel", "israeli": "Israel",
    "palestine": "Palestine", "palestinian": "Palestine",
    "syria": "Syria", "syrian": "Syria",
    "morocco": "Morocco", "moroccan": "Morocco",
    "algeria": "Algeria", "algerian": "Algeria",
    "tunisia": "Tunisia", "tunisian": "Tunisia",
    "libya": "Libya", "libyan": "Libya",
    "vietnam": "Vietnam", "vietnamese": "Vietnam",
    "korea": "South Korea", "south korea": "South Korea", "north korea": "North Korea", "korean": "South Korea",
    "philippines": "Philippines", "filipino": "Philippines",
    "indonesia": "Indonesia", "indonesian": "Indonesia",
    "cuba": "Cuba", "cuban": "Cuba"
}

# Historical empires map
HISTORICAL_MAP = {
    "roman empire": "roman-empire",
    "byzantine empire": "byzantine-empire",
    "ottoman empire": "ottoman-empire",
    "british empire": "british-empire",
    "mongol empire": "mongol-empire",
    "soviet union": "soviet-union",
    "french colonial empire": "french-colonial-empire",
    "holy roman empire": "holy-roman-empire",
    "spanish empire": "spanish-empire",
    "kingdom of italy": "italy-kingdom",
    "empire of japan": "japan-empire",
    "ming dynasty": "ming-dynasty"
}

# Action sticker triggers
STICKER_TRIGGERS = [
    {
        "pattern": re.compile(r'\b(invad\w*|attack\w*|bomb\w*|strike\w*|blitzkrieg|conquer\w*|storm\w*|clash\w*|battle|siege|war|fire|explod\w*|explosion|combat)\b', re.I),
        "stickers": ["Animated fire.svg", "Military tank v1.svg", "Explosion.svg"]
    },
    {
        "pattern": re.compile(r'\b(march\w*|travel\w*|advanc\w*|journey\w*|cross\w*|sail\w*|migrat\w*|fle\w*|retreat\w*|mov\w*|push\w*|route)\b', re.I),
        "stickers": ["Drawing arrow.svg", "Arrow 1.svg"]
    },
    {
        "pattern": re.compile(r'\b(treaty|alliance|sign\w*|peace|treaties|declar\w*|agreement|capital|liberat\w*|independen\w*|crown\w*|pact)\b', re.I),
        "stickers": ["Flag marker.svg", "Location pin.svg"]
    },
    {
        "pattern": re.compile(r'\b(navy|fleet|naval|warship\w*|sea|ocean|island|coastal|water)\b', re.I),
        "stickers": ["Warship v1.svg", "Sailboat.svg"]
    },
    {
        "pattern": re.compile(r'\b(air force|bomber\w*|jet\w*|aircraft|fly\w*|air strike|aerial)\b', re.I),
        "stickers": ["Fighter jet v1.svg", "Plane.svg"]
    }
]

# Camera movement pattern matching
CAMERA_TRIGGERS = [
    ("close-up", re.compile(r'\b(close[- ]?up|get close|focus\w* on|tight shot)\b', re.I)),
    ("zoom-out", re.compile(r'\b(zoom\w*\s+out|pull\w*\s+(?:back|out)|wider view)\b', re.I)),
    ("zoom-in", re.compile(r'\b(zoom\w*\s+(?:in|into|on)|move\w*\s+in|push\w*\s+in)\b', re.I)),
    ("wide", re.compile(r'\b(wide\w*|far out|continent|overview)\b', re.I)),
    ("orbit", re.compile(r'\b(orbit\w*|circle\w*|spin\w*|rotat\w*|surround\w*)\b', re.I)),
    ("tilt", re.compile(r'\b(tilt\w*|3-?d|angle\w*|oblique|perspective)\b', re.I)),
    ("fly", re.compile(r'\b(fl(?:y|ies|ying)|sweep\w*|glide\w*|travel\w* to)\b', re.I)),
    ("hold", re.compile(r'\b(hold|still|stay still|freeze)\b', re.I))
]

def count_words(text: str) -> int:
    return len(WORD_REGEX.findall(text))

def estimate_duration(words: int, wps: float = 2.5) -> float:
    duration = words / max(0.5, wps)
    return round(max(2.5, min(300.0, duration)), 1)

def split_into_sentences(text: str) -> List[str]:
    """Splits text into sentences matching Atlas punctuation and abbreviation logic."""
    clean = re.sub(r'\s+', ' ', text).strip()
    if not clean:
        return []
    
    # Split by standard sentence terminators with lookaround
    parts = re.split(r'(?<=[.!?…؟۔])\s+', clean)
    merged = []
    
    for p in parts:
        p = p.strip()
        if not p:
            continue
        # Check if previous part ended with an abbreviation
        if merged:
            last_word = re.findall(r'\b\w+\b', merged[-1].rstrip('.!?'))
            if last_word and last_word[-1].lower() in ABBREVIATIONS:
                merged[-1] = merged[-1] + ' ' + p
                continue
        merged.append(p)
        
    return merged

def detect_countries(text: str) -> List[str]:
    """Extracts country names and aliases from text."""
    lower = text.lower()
    found = []
    
    # Check historical matches first
    for empire_key, geo_file in HISTORICAL_MAP.items():
        if re.search(r'\b' + re.escape(empire_key) + r'\b', lower):
            title_case = " ".join(w.capitalize() for w in empire_key.split())
            if title_case not in found:
                found.append(title_case)

    # Check modern matches
    for alias, standard in COUNTRY_MAP.items():
        if re.search(r'\b' + re.escape(alias) + r'\b', lower):
            if standard not in found:
                found.append(standard)
                
    return found

def detect_camera_mode(text: str) -> str:
    for mode, pattern in CAMERA_TRIGGERS:
        if pattern.search(text):
            return mode
    return "close-up"

def detect_stickers(text: str) -> List[str]:
    stickers = []
    for trigger in STICKER_TRIGGERS:
        if trigger["pattern"].search(text):
            for s in trigger["stickers"]:
                if s not in stickers:
                    stickers.append(s)
    return stickers[:2]

def parse_tagged_script(script_text: str, wps: float = 2.5) -> List[Dict[str, Any]]:
    """
    Parses tagged shot script:
    [Scene 1: Germany & Poland | 0:00 - 0:05 | close-up]
    German forces invaded Poland, initiating World War II.
    """
    shots = []
    current_shot = None
    
    lines = script_text.splitlines()
    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
            
        # Check for shot tag e.g. [Scene 1: ...] or [Shot 1 | ...]
        tag_match = re.match(r'^\[(?:Scene|Shot|Part)?\s*#?(\d+)?:?\s*(.*?)(?:\|\s*(.*?))?\]', line, re.I)
        if not tag_match:
            # Also check parenthesis style (Scene 1: ...)
            tag_match = re.match(r'^\((?:Scene|Shot|Part)?\s*#?(\d+)?:?\s*(.*?)(?:\|\s*(.*?))?\)', line, re.I)
            
        if tag_match:
            if current_shot and current_shot["spoken"]:
                shots.append(current_shot)
                
            shot_idx = int(tag_match.group(1)) if tag_match.group(1) else len(shots) + 1
            body = tag_match.group(2).strip()
            extra = (tag_match.group(3) or "").strip()
            
            combined_tag = f"{body} {extra}"
            countries = detect_countries(combined_tag)
            camera = detect_camera_mode(combined_tag)
            
            # Check for time window e.g. 0:00 - 0:05
            time_match = re.search(r'(\d+:\d+|\d+)\s*[-–—]\s*(\d+:\d+|\d+)', combined_tag)
            duration_override = None
            if time_match:
                t1 = time_match.group(1)
                t2 = time_match.group(2)
                s1 = float(t1.split(":")[0])*60 + float(t1.split(":")[1]) if ":" in t1 else float(t1)
                s2 = float(t2.split(":")[0])*60 + float(t2.split(":")[1]) if ":" in t2 else float(t2)
                if s2 > s1:
                    duration_override = round(s2 - s1, 1)

            current_shot = {
                "index": len(shots),
                "shotNumber": shot_idx,
                "title": f"Scene {shot_idx}: {body.split('|')[0].strip()}",
                "tag": body,
                "countries": countries,
                "camera": camera,
                "durationOverride": duration_override,
                "spoken": "",
                "stickers": detect_stickers(combined_tag)
            }
        else:
            if current_shot is None:
                current_shot = {
                    "index": 0,
                    "shotNumber": 1,
                    "title": "Scene 1",
                    "tag": "",
                    "countries": [],
                    "camera": "close-up",
                    "durationOverride": None,
                    "spoken": "",
                    "stickers": []
                }
            if current_shot["spoken"]:
                current_shot["spoken"] += " " + line
            else:
                current_shot["spoken"] = line

    if current_shot and current_shot["spoken"]:
        shots.append(current_shot)
        
    # Post-process shots: compute durations, refine countries and stickers
    for shot in shots:
        spoken_text = shot["spoken"]
        # Detect any additional countries mentioned in speech
        speech_countries = detect_countries(spoken_text)
        for c in speech_countries:
            if c not in shot["countries"]:
                shot["countries"].append(c)
                
        # Detect stickers from speech
        speech_stickers = detect_stickers(spoken_text)
        for s in speech_stickers:
            if s not in shot["stickers"]:
                shot["stickers"].append(s)
                
        # Words & duration
        w_count = count_words(spoken_text)
        shot["wordCount"] = w_count
        shot["durationSec"] = shot["durationOverride"] or estimate_duration(w_count, wps)
        
        # Camera defaults
        if not shot["camera"] or shot["camera"] == "close-up":
            shot["camera"] = detect_camera_mode(spoken_text)
            
        # 3D Tilt and bearing
        if shot["camera"] in ("close-up", "tilt", "fly"):
            shot["pitch"] = 48
            shot["bearing"] = 12
        elif shot["camera"] == "orbit":
            shot["pitch"] = 52
            shot["bearing"] = 35
        else:
            shot["pitch"] = 25
            shot["bearing"] = 0

    return shots

def parse_raw_text(text: str, wps: float = 2.5) -> List[Dict[str, Any]]:
    """Parses raw narrative text into structured shots."""
    sentences = split_into_sentences(text)
    if not sentences:
        return []
        
    shots = []
    for idx, s in enumerate(sentences):
        countries = detect_countries(s)
        stickers = detect_stickers(s)
        camera = detect_camera_mode(s)
        w_count = count_words(s)
        duration = estimate_duration(w_count, wps)
        
        scene_name = countries[0] if countries else f"Shot {idx + 1}"
        shots.append({
            "index": idx,
            "shotNumber": idx + 1,
            "title": f"Scene {idx + 1}: {scene_name}",
            "tag": scene_name,
            "countries": countries,
            "camera": camera,
            "spoken": s,
            "durationSec": duration,
            "wordCount": w_count,
            "stickers": stickers,
            "pitch": 45 if camera in ("close-up", "tilt", "fly") else 25,
            "bearing": 15 if camera in ("orbit", "fly") else 0
        })
        
    return shots

# =====================================================================
# Built-in High Quality Narrative Templates
# =====================================================================
NARRATIVE_TEMPLATES = {
    "ww2_europe": {
        "title": "World War II in Europe",
        "category": "History",
        "description": "The dramatic escalation of the conflict from the invasion of Poland to the Eastern Front.",
        "script": """[Scene 1: Europe | 0:00 - 0:04 | wide]
In September 1939, crisis gripped the European continent.

[Scene 2: Germany & Poland | 0:04 - 0:09 | close-up]
German forces launched a sudden invasion of Poland, triggering World War II.

[Scene 3: United Kingdom & France | 0:09 - 0:14 | orbit]
The United Kingdom and France honored their mutual treaties and declared war.

[Scene 4: Russia | 0:14 - 0:19 | fly]
Two years later, German armor pushed deep into the Soviet Union in Operation Barbarossa.
"""
    },
    "roman_empire": {
        "title": "Rise of the Roman Empire",
        "category": "Ancient History",
        "description": "Rome's transformation from an Italian city-state into master of the Mediterranean.",
        "script": """[Scene 1: Italy | 0:00 - 0:04 | wide]
From the hills of central Italy, the Roman Republic steadily consolidated power.

[Scene 2: Greece & Egypt | 0:04 - 0:09 | close-up]
Roman legions expanded across Greece and annexed Egypt under Emperor Augustus.

[Scene 3: France & Spain | 0:09 - 0:14 | fly]
Julius Caesar conquered Gaul, securing western Europe for generations.

[Scene 4: United Kingdom | 0:14 - 0:19 | orbit]
At its peak, the Empire reached north to Britannia, encircling the Mediterranean Sea.
"""
    },
    "cold_war": {
        "title": "The Cold War Divide",
        "category": "Geopolitics",
        "description": "The global standoff between the Western Allies and the Soviet bloc.",
        "script": """[Scene 1: United States & Russia | 0:00 - 0:05 | wide]
Following World War II, two nuclear superpowers stood face-to-face.

[Scene 2: Germany | 0:05 - 0:10 | close-up]
Divided Germany and the Berlin Wall became the frontline of the Cold War.

[Scene 3: Cuba | 0:10 - 0:15 | orbit]
In 1962, the Cuban Missile Crisis brought humanity to the brink of nuclear war.

[Scene 4: Vietnam | 0:15 - 0:20 | fly]
Tensions ignited into proxy conflicts across the globe, from Korea to Vietnam.
"""
    },
    "silk_road": {
        "title": "The Ancient Silk Road",
        "category": "Trade & Exploration",
        "description": "The overland artery connecting China, Central Asia, and the Mediterranean.",
        "script": """[Scene 1: China | 0:00 - 0:04 | wide]
Caravans carrying precious silk and jade departed ancient Chang'an in China.

[Scene 2: Iran & Turkey | 0:04 - 0:09 | fly]
Merchants traversed rugged mountain passes and trading oases across Persia.

[Scene 3: Italy | 0:09 - 0:14 | orbit]
Goods arrived in Constantinople and Venetian ports, transforming European commerce.
"""
    },
    "alexander": {
        "title": "Campaigns of Alexander the Great",
        "category": "Ancient History",
        "description": "Alexander's lightning march from Greece to the borders of India.",
        "script": """[Scene 1: Greece | 0:00 - 0:04 | wide]
Young King Alexander assembled the Macedonian phalanx to confront the Persian Empire.

[Scene 2: Egypt | 0:04 - 0:08 | close-up]
He marched south to Egypt, being hailed as pharaoh and founding Alexandria.

[Scene 3: Iran & Iraq | 0:08 - 0:13 | fly]
Alexander shattered Persian forces at Gaugamela and captured the grand capital of Persepolis.

[Scene 4: India | 0:13 - 0:18 | orbit]
His battle-hardened troops advanced east across the Indus River before turning back.
"""
    }
}

def generate_script_from_topic(prompt: str, pace: str = "normal", scene_count: int = 4) -> Dict[str, Any]:
    """
    Intelligently generates a formatted multi-shot video script from a topic prompt.
    """
    lower = prompt.lower()
    wps = 2.0 if pace == "slow" else 3.2 if pace == "fast" else 3.5 if pace == "combat" else 2.5
    
    # 1. Check for close template matches
    for key, tmpl in NARRATIVE_TEMPLATES.items():
        if any(term in lower for term in key.split("_")):
            shots = parse_tagged_script(tmpl["script"], wps)
            return {
                "ok": True,
                "title": tmpl["title"],
                "script": tmpl["script"],
                "shots": shots,
                "totalDurationSec": sum(s["durationSec"] for s in shots),
                "wordCount": sum(s["wordCount"] for s in shots)
            }

    # 2. Extract mentioned countries
    countries = detect_countries(prompt)
    if not countries:
        if "asia" in lower or "east" in lower:
            countries = ["China", "Japan", "India", "Vietnam"]
        elif "middle east" in lower or "arab" in lower:
            countries = ["Saudi Arabia", "Iran", "Iraq", "Egypt"]
        elif "america" in lower:
            countries = ["United States", "Canada", "Mexico", "Brazil"]
        else:
            countries = ["Germany", "France", "United Kingdom", "Russia"]

    # Target number of scenes
    target_count = scene_count if scene_count > 0 else max(3, min(6, len(countries)))
    while len(countries) < target_count:
        countries.append("United States" if "United States" not in countries else "France")

    generated_lines = []
    generated_shots = []
    
    title = f"Story of {prompt.strip().title()[:45]}"
    time_cursor = 0.0
    
    for i in range(target_count):
        country = countries[i % len(countries)]
        shot_num = i + 1
        
        if shot_num == 1:
            camera = "wide"
            spoken = f"The historical journey begins across {country}, establishing the strategic center."
        elif shot_num == target_count:
            camera = "orbit"
            spoken = f"Finally, the strategic focus consolidates over {country}, shaping the modern geopolitical landscape."
        else:
            camera = "close-up" if shot_num % 2 == 0 else "fly"
            spoken = f"Action shifted rapidly into {country}, marking a decisive turning point in the campaign."
            
        w_count = count_words(spoken)
        duration = estimate_duration(w_count, wps)
        t_start = round(time_cursor, 1)
        t_end = round(time_cursor + duration, 1)
        time_cursor = t_end
        
        tag_line = f"[Scene {shot_num}: {country} | 0:{int(t_start):02d} - 0:{int(t_end):02d} | {camera}]"
        generated_lines.append(tag_line)
        generated_lines.append(spoken)
        generated_lines.append("")
        
        generated_shots.append({
            "index": i,
            "shotNumber": shot_num,
            "title": f"Scene {shot_num}: {country}",
            "tag": country,
            "countries": [country],
            "camera": camera,
            "spoken": spoken,
            "durationSec": duration,
            "wordCount": w_count,
            "stickers": detect_stickers(spoken) or (["Animated fire.svg"] if shot_num == 2 else []),
            "pitch": 45 if camera in ("close-up", "fly") else 25,
            "bearing": 15 if camera in ("orbit", "fly") else 0
        })

    full_script = "\n".join(generated_lines).strip()
    return {
        "ok": True,
        "title": title,
        "script": full_script,
        "shots": generated_shots,
        "totalDurationSec": round(time_cursor, 1),
        "wordCount": sum(s["wordCount"] for s in generated_shots)
    }
